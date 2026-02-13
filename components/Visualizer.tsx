
import React, { useState, useEffect, useRef } from 'react';
import { Song, SavedVision } from '../types';
import { generateConceptDescription, generateConceptImage, generateNarrativeAudio } from '../services/gemini';

interface VisualizerProps {
  song: Song;
  onSave: (vision: SavedVision) => void;
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

export const Visualizer: React.FC<VisualizerProps> = ({ song, onSave }) => {
  const [description, setDescription] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isNarrating, setIsNarrating] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  // PERSISTENCE UPGRADE: Report (Lesson) Caching
  useEffect(() => {
    const cacheKey = `report_cache_${song.id}`;
    const cachedData = sessionStorage.getItem(cacheKey);
    if (cachedData) {
      try {
        const { desc, img } = JSON.parse(cachedData);
        setDescription(desc);
        setImageUrl(img);
      } catch (e) {
        console.error("Error parsing report cache", e);
      }
    } else {
      setDescription(null);
      setImageUrl(null);
    }
  }, [song.id]);

  const visualize = async () => {
    setIsLoading(true);
    setDescription(null);
    setImageUrl(null);

    try {
      const [desc, img] = await Promise.all([
        generateConceptDescription(song.title, song.stageDesign, song.visualCues),
        generateConceptImage(song.title, song.stageDesign)
      ]);

      if (desc) {
        // Cache the lesson/report for the current session
        const reportData = { desc, img };
        sessionStorage.setItem(`report_cache_${song.id}`, JSON.stringify(reportData));
        
        setDescription(desc);
        setImageUrl(img);

        // PERSISTENCE UPGRADE: Script & Mnemonic Vaulting (Auto-Archive)
        onSave({
          songId: song.id,
          songTitle: song.title,
          description: desc,
          imageUrl: img,
          timestamp: Date.now()
        });
      }
    } catch (error) {
      console.error("Visualization failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const narrate = async () => {
    if (!description || isNarrating) return;
    setIsNarrating(true);

    // PERSISTENCE UPGRADE: Audio Session Caching
    const contentHash = btoa(description.slice(0, 15));
    const audioCacheKey = `directive_audio_cache_${song.id}_${contentHash}`;
    let base64Audio = sessionStorage.getItem(audioCacheKey);

    if (!base64Audio) {
      base64Audio = await generateNarrativeAudio(description);
      if (base64Audio) {
        try { 
          sessionStorage.setItem(audioCacheKey, base64Audio); 
        } catch (e) {
          console.warn("Session storage limit reached");
        }
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
        source.onended = () => setIsNarrating(false);
        source.start();
      } catch (err) {
        console.error("Narration failed", err);
        setIsNarrating(false);
      }
    } else {
      setIsNarrating(false);
    }
  };

  const handleManualSave = () => {
    if (!description) return;
    onSave({
      songId: song.id,
      songTitle: song.title,
      description,
      imageUrl,
      timestamp: Date.now()
    });
  };

  return (
    <div className="space-y-6">
      {!description && !imageUrl && !isLoading && (
        <button 
          onClick={visualize}
          className="w-full py-5 bg-gradient-to-r from-[#D4AF37] to-[#F9E076] hover:brightness-110 active:scale-[0.98] transition-all rounded-xl font-black text-[10px] tracking-[0.4em] uppercase shadow-2xl flex items-center justify-center gap-4 text-black"
        >
          <span>✨</span> Forge New Vision & Archive
        </button>
      )}

      {isLoading && (
        <div className="glass-card rounded-2xl p-12 flex flex-col items-center justify-center space-y-4 border border-[#D4AF37]/30 bg-black/40">
          <div className="w-8 h-8 border-2 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin"></div>
          <p className="text-[#D4AF37] font-black uppercase tracking-[0.3em] text-[8px]">Crafting Visual Mnemonic...</p>
        </div>
      )}

      {(description || imageUrl) && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="glass-card rounded-2xl overflow-hidden border border-[#D4AF37]/20 shadow-2xl bg-black/40">
            {imageUrl && (
              <div className="aspect-[21/9] w-full bg-black relative overflow-hidden border-b border-[#D4AF37]/10">
                <img src={imageUrl} alt="Concept" className="w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                <div className="absolute bottom-4 left-6 px-3 py-1 bg-[#D4AF37] text-black text-[8px] font-black uppercase tracking-widest rounded shadow-xl">
                   Archived Concept Frame
                </div>
              </div>
            )}
            
            {description && (
              <div className="p-8 space-y-6">
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <div className="flex flex-col">
                    <h4 className="text-[#D4AF37] text-[8px] font-black uppercase tracking-[0.4em]">Director's Vision</h4>
                    <span className="text-[7px] text-white/30 uppercase tracking-widest mt-1">Auto-Archived to Study Vault</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={narrate} 
                      disabled={isNarrating}
                      className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[8px] font-black tracking-widest uppercase text-white transition-all disabled:opacity-50"
                    >
                      {isNarrating ? 'Playing...' : '🎙️ Directing'}
                    </button>
                    <button 
                      onClick={handleManualSave} 
                      className="px-3 py-1.5 bg-[#D4AF37]/10 hover:bg-[#D4AF37] border border-[#D4AF37]/30 rounded-lg text-[8px] font-black tracking-widest uppercase text-[#D4AF37] hover:text-black transition-all"
                    >
                      🔖 Vaulted
                    </button>
                  </div>
                </div>
                <div className="text-white/90 leading-relaxed text-lg font-display italic opacity-95 whitespace-pre-wrap">
                  {description}
                </div>
              </div>
            )}
          </div>
          
          <button 
            onClick={visualize}
            className="w-full py-3 bg-white/5 hover:bg-white/10 text-white/40 hover:text-[#D4AF37] text-[8px] font-black uppercase tracking-[0.4em] transition-all rounded-xl border border-white/5"
          >
            Regenerate Vision & Script
          </button>
        </div>
      )}
    </div>
  );
};
