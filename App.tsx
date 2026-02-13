
import React, { useState, useEffect, useRef } from 'react';
import { Layout } from './components/Layout';
import { Visualizer } from './components/Visualizer';
import { Stage } from './components/Stage';
import { MUSICALS } from './data/musicalData';
import { MusicalID, Song, UserProgress, DailyInsight, SavedVision } from './types';
import { generateDailyInsight } from './services/gemini';

const STORAGE_KEY = 'spi_musical_progress_v3_final';

const App: React.FC = () => {
  // PERSISTENCE UPGRADE: Form Persistence (Last selected musical/song)
  const [activeMusical, setActiveMusical] = useState<MusicalID>(() => {
    return (localStorage.getItem('last_musical') as MusicalID) || MusicalID.FUNDAMENTALS;
  });
  const [selectedSong, setSelectedSong] = useState<Song>(() => {
    const savedId = localStorage.getItem('last_song_id');
    const musical = MUSICALS[activeMusical];
    if (savedId) {
      for (const act of musical.acts) {
        const song = act.songs.find(s => s.id === savedId);
        if (song) return song;
      }
    }
    return musical.acts[0].songs[0];
  });
  
  const [showVault, setShowVault] = useState(false);
  
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : { vault: [], lastInsight: null };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  // Form persistence effect
  useEffect(() => {
    localStorage.setItem('last_musical', activeMusical);
    localStorage.setItem('last_song_id', selectedSong.id);
  }, [activeMusical, selectedSong]);

  // PERSISTENCE UPGRADE: Insight Persistence (24 Hours)
  useEffect(() => {
    const checkInsight = async () => {
      const now = Date.now();
      const twentyFourHours = 24 * 60 * 60 * 1000;
      
      if (!progress.lastInsight || (now - progress.lastInsight.timestamp > twentyFourHours)) {
        console.log("Harvey generating fresh daily insight...");
        const text = await generateDailyInsight();
        setProgress(prev => ({ 
          ...prev, 
          lastInsight: { text, timestamp: now } 
        }));
      } else {
        console.log("Cached insight remains valid for today.");
      }
    };
    checkInsight();
  }, [progress.lastInsight]);

  const musical = MUSICALS[activeMusical];

  const handleMusicalChange = (id: MusicalID) => {
    setActiveMusical(id);
    const firstSong = MUSICALS[id].acts[0].songs[0];
    setSelectedSong(firstSong);
  };

  const handleSaveVision = (vision: SavedVision) => {
    setProgress(prev => {
      // PERSISTENCE UPGRADE: Script & Mnemonic Vaulting
      const isDuplicate = prev.vault.some(v => 
        v.songId === vision.songId && v.description === vision.description
      );
      if (isDuplicate) return prev;

      return { 
        ...prev, 
        vault: [vision, ...prev.vault].slice(0, 50) 
      };
    });
  };

  return (
    <Layout activeMusical={activeMusical} setActiveMusical={handleMusicalChange}>
      {/* Side Navigation (Left) */}
      <aside className="w-72 h-full glass-card border-r border-[#D4AF37]/20 flex flex-col z-40 bg-black/60">
        <div className="p-6 border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[9px] font-black text-[#D4AF37] uppercase tracking-[0.4em]">Director's Script</span>
            <span className="text-[7px] text-white/30 uppercase font-tech">Daily Persistence</span>
          </div>
          <p className="text-[10px] text-white/70 italic font-display leading-relaxed">
            "{progress.lastInsight?.text || "Synchronizing production cues..."}"
          </p>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
          {musical.acts.map((act, idx) => (
            <div key={idx} className="space-y-2">
              <h3 className="text-[8px] font-black text-white/30 uppercase tracking-[0.3em] px-2">{act.title}</h3>
              <div className="space-y-1">
                {act.songs.map((song) => (
                  <button
                    key={song.id}
                    onClick={() => setSelectedSong(song)}
                    className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-all ${
                      selectedSong.id === song.id 
                        ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 shadow-lg' 
                        : 'text-white/40 hover:text-white/80 hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-md border flex items-center justify-center text-[8px] font-black ${
                      selectedSong.id === song.id ? 'bg-[#D4AF37] text-black border-white' : 'border-white/10'
                    }`}>
                      {song.id.split('-')[1]}
                    </span>
                    <span className="text-[11px] font-bold tracking-tight truncate">{song.title}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Production Stage (Middle) */}
      <main className="flex-1 h-full overflow-y-auto custom-scrollbar relative bg-black/20">
        <div className="max-w-4xl mx-auto px-10 py-16 space-y-12 pb-32">
          {/* Hero Section */}
          <div className="space-y-4 text-center sm:text-left">
            <div className="flex items-center gap-4 opacity-50">
              <span className="text-[9px] font-black text-[#D4AF37] uppercase tracking-widest">{selectedSong.act}</span>
              <span className="w-1 h-1 rounded-full bg-white/20"></span>
              <span className="text-[9px] font-black text-white/60 uppercase tracking-widest italic">{selectedSong.style}</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-display italic text-white tracking-tighter leading-none glow-text">
              {selectedSong.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Directives Panel */}
            <div className="space-y-10">
              <div className="group">
                <h4 className="text-[9px] font-black text-[#D4AF37] uppercase tracking-[0.4em] mb-4 flex items-center gap-3">
                  <span className="w-8 h-px bg-[#D4AF37]/30"></span> Blueprint
                </h4>
                <p className="text-white text-xl font-light italic opacity-90 leading-relaxed font-display">
                  {selectedSong.stageDesign}
                </p>
              </div>

              <div className="group">
                <h4 className="text-[9px] font-black text-[#D4AF37] uppercase tracking-[0.4em] mb-4 flex items-center gap-3">
                  <span className="w-8 h-px bg-[#D4AF37]/30"></span> Visual Cues
                </h4>
                <ul className="space-y-4">
                  {selectedSong.visualCues.map((cue, idx) => (
                    <li key={idx} className="flex items-start gap-4 group/item">
                      <span className="text-[10px] font-black text-[#D4AF37] mt-0.5 opacity-40 group-hover/item:opacity-100 transition-opacity">0{idx+1}</span>
                      <span className="text-[13px] text-white/70 group-hover/item:text-white transition-colors leading-relaxed">{cue}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Stage & Player Block */}
            <div className="space-y-6">
              <Stage song={selectedSong} />
              
              <div className="glass-card rounded-2xl p-6 border border-white/5 bg-black/40">
                <h4 className="text-[8px] font-black text-white/30 uppercase tracking-[0.3em] mb-4">Original Lyrics</h4>
                <div className="space-y-4 font-display text-sm text-white/60 italic leading-snug">
                  {selectedSong.lyrics.map((line, idx) => (
                    <p key={idx} className={line.startsWith('Chorus:') ? 'text-[#D4AF37] font-bold border-l border-[#D4AF37]/30 pl-3' : ''}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Integrated Simulation/Visualizer Block */}
          <div className="space-y-10">
             {/* Persistence upgrades (Audio/Report caching) happen inside Visualizer */}
             <Visualizer song={selectedSong} onSave={handleSaveVision} />
          </div>
        </div>
      </main>

      {/* Archive / Vault (Right) */}
      <aside className={`h-full transition-all duration-500 overflow-hidden glass-card border-l border-[#D4AF37]/20 flex flex-col bg-black/60 ${showVault ? 'w-80' : 'w-12'}`}>
        <button 
          onClick={() => setShowVault(!showVault)}
          className="h-full w-full flex items-center justify-center hover:bg-white/5 transition-colors relative"
        >
          <div className="flex flex-col items-center gap-6">
            <span className="text-lg">{showVault ? '✖' : '🏛️'}</span>
            {!showVault && (
              <span className="text-[8px] font-black uppercase tracking-[0.8em] text-[#D4AF37] whitespace-nowrap [writing-mode:vertical-lr] rotate-180">
                PRODUCTION ARCHIVE
              </span>
            )}
          </div>
        </button>

        {showVault && (
          <div className="absolute inset-0 flex flex-col animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">Mnemonic Vault</span>
                <span className="text-[7px] text-white/30 uppercase tracking-[0.2em] mt-1">Permanent Personal Archive</span>
              </div>
              <button onClick={() => setShowVault(false)} className="text-white/20 hover:text-white transition-colors">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
              {progress.vault.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 opacity-20">
                  <span className="text-4xl mb-4">🗄️</span>
                  <p className="text-[10px] font-black uppercase tracking-widest italic">Vault Empty</p>
                  <p className="text-[8px] text-white/50 mt-2">Generate study visions to auto-archive</p>
                </div>
              ) : (
                progress.vault.map((v, i) => (
                  <div key={i} className="glass-card p-4 rounded-xl border border-white/5 hover:border-[#D4AF37]/30 transition-all group cursor-default">
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-[8px] font-black text-[#D4AF37] uppercase">{v.songTitle}</span>
                       <span className="text-[7px] text-white/30">{new Date(v.timestamp).toLocaleDateString()}</span>
                    </div>
                    <p className="text-[10px] text-white/60 italic line-clamp-3">"{v.description}"</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </aside>
    </Layout>
  );
};

export default App;
