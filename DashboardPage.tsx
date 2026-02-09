
import React, { useState, useEffect } from 'react';
import VisionPal from './VisionPal';

interface DashboardPageProps {
  onOpenAAC: () => void;
  defaultOpenVisionPal?: boolean;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ onOpenAAC, defaultOpenVisionPal = false }) => {
  const [showVisionPal, setShowVisionPal] = useState(defaultOpenVisionPal);

  // Ensure state syncs if prop changes (though usually component remounts)
  useEffect(() => {
    setShowVisionPal(defaultOpenVisionPal);
  }, [defaultOpenVisionPal]);

  return (
    <div className="min-h-screen w-full bg-[#003B73] relative overflow-hidden font-sans text-white selection:bg-cyan-500/30">
      
      {showVisionPal && (
        <VisionPal onClose={() => setShowVisionPal(false)} />
      )}

      {/* Background Ambience - Mayo Clinic Blue Theme */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#00519E] via-[#003B73] to-[#002652]"></div>
      
      {/* Grid Pattern - Adjusted for Blue Background */}
      <div className="absolute inset-0 opacity-[0.05]" 
           style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      {/* Header */}
      <header className="relative z-10 w-full px-6 py-4 flex justify-between items-center border-b border-white/10 bg-[#003B73]/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
           {/* Legacy branding removed */}
        </div>
        <div className="flex items-center gap-4">
            {/* Top right circle removed */}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 p-6 sm:p-8 max-w-7xl mx-auto pb-32 flex flex-col items-center justify-center h-[70vh]">
        <div className="text-center space-y-4 animate-in fade-in zoom-in duration-1000">
           {/* Geometric Sans-Serif Title with Glow */}
           <h1 className="text-5xl md:text-8xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-blue-200 drop-shadow-[0_0_30px_rgba(66,153,225,0.5)] font-sans">
             OCEAN WAVE
           </h1>
           
           {/* Subtitle */}
           <p className="text-lg md:text-3xl font-light tracking-[0.5em] uppercase text-blue-100/80 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
             Voice & Vision
           </p>
        </div>
      </main>

      {/* FLOATING COMMAND BAR */}
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-6 px-8 py-5 bg-[#002652]/60 backdrop-blur-xl border border-white/20 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            
            {/* THE OCEAN WAVE LAUNCHER (ICON A) */}
            <button 
                onClick={onOpenAAC}
                className="w-16 h-16 rounded-full flex items-center justify-center bg-white shadow-lg shadow-blue-900/40 hover:scale-110 active:scale-95 transition-all duration-200 group relative border border-white/50"
            >
                {/* A Icon */}
                <span className="text-4xl font-black text-[#003B73]">A</span>
                
                {/* Tooltip */}
                <span className="absolute -top-14 left-1/2 -translate-x-1/2 bg-white text-[#003B73] text-xs font-bold px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl border border-blue-100 pointer-events-none">
                    OCEAN WAVE AAC
                </span>
                
                {/* Ping Animation */}
                <div className="absolute inset-0 rounded-full border-2 border-white opacity-0 group-hover:animate-ping"></div>
            </button>

            {/* VISION PAL LAUNCHER (ICON E) */}
            <button 
                onClick={() => setShowVisionPal(true)}
                className="w-16 h-16 rounded-full flex items-center justify-center bg-[#004DA0] shadow-lg shadow-blue-900/40 hover:scale-110 active:scale-95 transition-all duration-200 group relative border border-white/50"
            >
                {/* E Icon */}
                <span className="text-3xl font-black text-white">E</span>
                
                {/* Tooltip */}
                <span className="absolute -top-14 left-1/2 -translate-x-1/2 bg-white text-[#004DA0] text-xs font-bold px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl border border-blue-100 pointer-events-none">
                    VISION PAL
                </span>
            </button>

        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
