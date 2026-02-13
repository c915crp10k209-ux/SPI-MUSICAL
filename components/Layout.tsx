
import React from 'react';
import { MusicalID } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeMusical: MusicalID;
  setActiveMusical: (id: MusicalID) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeMusical, setActiveMusical }) => {
  return (
    <div className="app-container selection:bg-[#D4AF37]/30">
      {/* Top Console Bar */}
      <header className="h-14 flex items-center justify-between px-6 glass-card border-b border-[#D4AF37]/30 z-50">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-black border border-[#D4AF37]/50 rounded-lg flex items-center justify-center text-lg shadow-[0_0_10px_rgba(212,175,55,0.2)]">
            <span>🎭</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-sm font-outfit font-black tracking-widest leading-none text-white">
              SPI <span className="text-[#D4AF37]">PRO-ENGINE</span>
            </h1>
            <span className="text-[7px] text-[#C0C0C0] uppercase tracking-[0.5em] opacity-60">Production Unit // 2.6.5</span>
          </div>
        </div>

        <div className="flex bg-white/5 rounded-full p-0.5 border border-white/10">
          <button 
            onClick={() => setActiveMusical(MusicalID.FUNDAMENTALS)}
            className={`px-5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest transition-all ${
              activeMusical === MusicalID.FUNDAMENTALS ? 'bg-[#D4AF37] text-black' : 'text-white/40 hover:text-white'
            }`}
          >
            Fundamentals
          </button>
          <button 
            onClick={() => setActiveMusical(MusicalID.ELECTRIC_BOOGALOO)}
            className={`px-5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest transition-all ${
              activeMusical === MusicalID.ELECTRIC_BOOGALOO ? 'bg-[#D4AF37] text-black' : 'text-white/40 hover:text-white'
            }`}
          >
            Advanced
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end mr-4">
            <span className="text-[7px] font-black text-[#D4AF37] tracking-[0.3em] uppercase">Stage Status</span>
            <span className="text-[8px] font-bold text-white uppercase">Ready to Render</span>
          </div>
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
        </div>
      </header>

      <div className="content-area">
        {children}
      </div>
    </div>
  );
};
