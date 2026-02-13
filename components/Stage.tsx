
import React, { useState, useRef, useEffect } from 'react';
import { Song } from '../types';
import { generateNarrativeAudio, analyzeAudioContent } from '../services/gemini';

interface StageProps {
  song: Song;
}

const decode = (base64: string) => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const Stage: React.FC<StageProps> = ({ song }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [critique, setCritique] = useState<string | null>(null);
  const [userAudioUrl, setUserAudioUrl] = useState<string | null>(null);
  const [userAudioBase64, setUserAudioBase64] = useState<string | null>(null);
  const [userAudioMime, setUserAudioMime] = useState<string | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const nativeAudioRef = useRef<HTMLAudioElement | null>(null);
  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    stopPerformance();
    // Reset user audio on song change if desired, or keep it?
    // Let's reset for clarity per song production.
    setUserAudioUrl(null);
    setUserAudioBase64(null);
    setCritique(null);
  }, [song.id]);

  const stopPerformance = () => {
    if (sourceRef.current) {
      sourceRef.current.stop();
      sourceRef.current = null;
    }
    if (nativeAudioRef.current) {
      nativeAudioRef.current.pause();
      nativeAudioRef.current.currentTime = 0;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsPlaying(false);
    setProgress(0);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setUserAudioUrl(url);
    setUserAudioMime(file.type);

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      setUserAudioBase64(base64);
    };
    reader.readAsDataURL(file);
    setCritique(null);
  };

  const getCritique = async () => {
    if (!userAudioBase64 || !userAudioMime || isAnalyzing) return;
    setIsAnalyzing(true);
    const feedback = await analyzeAudioContent(userAudioBase64, userAudioMime, song.title);
    setCritique(feedback);
    setIsAnalyzing(false);
  };

  const performScene = async () => {
    if (isPlaying) {
      stopPerformance();
      return;
    }

    // Handle User Uploaded Audio
    if (userAudioUrl) {
      if (!nativeAudioRef.current) {
        nativeAudioRef.current = new Audio(userAudioUrl);
      } else {
        nativeAudioRef.current.src = userAudioUrl;
      }
      
      const audio = nativeAudioRef.current;
      audio.onended = () => {
        setIsPlaying(false);
        setProgress(100);
        if (timerRef.current) clearInterval(timerRef.current);
      };

      audio.play();
      setIsPlaying(true);
      
      timerRef.current = window.setInterval(() => {
        const p = (audio.currentTime / audio.duration) * 100;
        setProgress(isNaN(p) ? 0 : Math.min(p, 100));
      }, 100);
      return;
    }

    // Handle AI Generated Audio
    setIsLoadingAudio(true);
    const lyricsText = song.lyrics.join(' ');
    const cacheKey = `song_audio_cache_${song.id}`;
    let base64Audio = sessionStorage.getItem(cacheKey);

    if (!base64Audio) {
      base64Audio = await generateNarrativeAudio(lyricsText);
      if (base64Audio) {
        try { sessionStorage.setItem(cacheKey, base64Audio); } catch (e) {}
      }
    }

    if (base64Audio) {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') await ctx.resume();

      try {
        const buffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        
        source.onended = () => {
          setIsPlaying(false);
          setProgress(100);
          if (timerRef.current) clearInterval(timerRef.current);
        };

        const duration = buffer.duration;
        startTimeRef.current = ctx.currentTime;
        source.start(0);
        sourceRef.current = source;
        setIsPlaying(true);
        setIsLoadingAudio(false);

        timerRef.current = window.setInterval(() => {
          const elapsed = ctx.currentTime - startTimeRef.current;
          const p = (elapsed / duration) * 100;
          setProgress(Math.min(p, 100));
        }, 100);

      } catch (err) {
        console.error("Stage audio failed", err);
        setIsLoadingAudio(false);
      }
    } else {
      setIsLoadingAudio(false);
    }
  };

  return (
    <div className="glass-card rounded-[2rem] border border-[#D4AF37]/30 p-8 relative overflow-hidden bg-black/80">
      <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
        <div 
          className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F9E076] transition-all duration-100 shadow-[0_0_10px_#D4AF37]"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 mt-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full border border-[#D4AF37]/40 flex items-center justify-center bg-black/40 shadow-inner">
            <span className="text-xl">{isPlaying ? (userAudioUrl ? '🔊' : '🎭') : '🎬'}</span>
          </div>
          <div>
            <h3 className="text-xs font-black text-[#D4AF37] uppercase tracking-[0.4em]">
              {userAudioUrl ? 'Master Track Active' : 'Live Performance'}
            </h3>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-tech">
              {userAudioUrl ? 'Using Uploaded Reference' : 'AI Synthetic Performance'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
           <input 
            type="file" 
            accept="audio/*" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileUpload}
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[9px] font-black tracking-widest uppercase text-[#C0C0C0] transition-all"
          >
            {userAudioUrl ? 'Change Track' : 'Upload Master'}
          </button>

          <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/10 backdrop-blur-xl">
            <button 
              onClick={performScene}
              disabled={isLoadingAudio}
              className={`w-14 h-14 flex items-center justify-center rounded-xl transition-all ${
                isPlaying 
                  ? 'bg-red-500/20 text-red-500 border border-red-500/30' 
                  : 'bg-[#D4AF37] text-black border border-white/20'
              } hover:scale-105 active:scale-95 disabled:opacity-50 shadow-xl`}
            >
              {isLoadingAudio ? (
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
              ) : isPlaying ? (
                <span className="text-xl">⏹</span>
              ) : (
                <span className="text-xl">▶</span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="relative aspect-video bg-black/90 rounded-2xl border border-[#D4AF37]/20 flex items-center justify-center overflow-hidden shadow-inner group">
        <div className="absolute inset-0 shimmer opacity-5"></div>
        
        {/* Critique Overlay */}
        {critique && (
          <div className="absolute inset-0 z-30 bg-black/90 p-8 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
            <button 
              onClick={() => setCritique(null)}
              className="absolute top-4 right-6 text-white/20 hover:text-white"
            >✕</button>
            <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.4em] mb-4">Harvey's Critique</span>
            <p className="text-white text-lg font-display italic text-center leading-relaxed max-w-lg">
              "{critique}"
            </p>
          </div>
        )}

        {/* Action HUD */}
        <div className="absolute top-4 right-6 flex items-center gap-4 z-20">
           {userAudioUrl && !critique && (
            <button 
              onClick={getCritique}
              disabled={isAnalyzing}
              className="px-3 py-1 bg-[#D4AF37]/10 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black border border-[#D4AF37]/30 rounded text-[8px] font-black uppercase tracking-widest transition-all"
            >
              {isAnalyzing ? 'Analyzing...' : 'Harvey: Listen & Critique'}
            </button>
          )}
          <div className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em]">Live Production Monitoring</div>
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`transition-all duration-1000 ${isPlaying ? 'scale-110 opacity-100 blur-0' : 'scale-100 opacity-20 blur-sm'} relative z-10`}>
             <div className="w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-[#D4AF37]/20 flex items-center justify-center animate-pulse">
                <div className="w-24 h-24 md:w-36 md:h-36 rounded-full border border-[#D4AF37]/40 flex items-center justify-center bg-[#D4AF37]/5">
                   <span className="text-5xl md:text-7xl drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                     {isPlaying ? (userAudioUrl ? '🎶' : '🔊') : '🎹'}
                   </span>
                </div>
             </div>
          </div>
        </div>

        {isPlaying && (
          <div className="absolute inset-x-0 bottom-10 flex flex-col items-center px-10 text-center animate-in slide-in-from-bottom-4 duration-500 z-20">
            <p className="text-white text-lg md:text-2xl font-display italic drop-shadow-2xl max-w-lg leading-snug">
              {song.lyrics[Math.floor((progress / 100) * song.lyrics.length)] || "..."}
            </p>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
      </div>
    </div>
  );
};
