
import React from 'react';

interface MedicalSignInPageProps {
  onNext: () => void;
}

const MedicalSignInPage: React.FC<MedicalSignInPageProps> = ({ onNext }) => {
  return (
    <div className="min-h-screen w-full flex flex-col bg-[#000c1a] text-white relative overflow-hidden font-sans">
      {/* Dynamic Gradient Background - Magnum Blue mixed with Purple and Violet */}
      <div className="absolute inset-0 bg-[#000c1a]"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-[#002347] via-[#2e004f] to-[#1a0b2e] opacity-90"></div>
      
      {/* Decorative Orbs for depth */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]"></div>
      <div className="absolute -bottom-48 -right-48 w-[32rem] h-[32rem] bg-violet-600/10 rounded-full blur-[150px]"></div>

      {/* Header Bar */}
      <div className="w-full bg-white/5 backdrop-blur-md px-6 py-3 flex justify-between items-center border-b border-white/10 z-20">
        <div className="flex-1 text-center text-[10px] font-bold tracking-[0.3em] uppercase opacity-70">
          Voice and Vision Neural Interface
        </div>
        {/* Cleared top right area as requested */}
        <div className="flex items-center space-x-6">
        </div>
      </div>

      <div className="flex-grow flex items-center justify-center p-4 relative z-10">
        {/* Sign In Card */}
        <div className="w-full max-w-lg bg-black/20 border border-white/5 rounded-[2.5rem] p-10 md:p-14 backdrop-blur-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-700">
          <div className="flex flex-col items-center text-center">
            
            {/* Logo Spacer */}
            <div className="pt-4"></div>

            <h2 className="text-sm font-bold tracking-[0.6em] uppercase text-violet-300/60 mb-3">Gateway Access</h2>
            <h3 className="text-4xl md:text-5xl font-bold leading-tight tracking-tighter mb-10">
              Neural <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-300 to-purple-100">Intelligence</span>
            </h3>

            {/* Feature Highlights */}
            <div className="w-full space-y-3 mb-12">
              <div className="flex items-center space-x-4 p-4 bg-white/[0.03] rounded-3xl border border-white/5 text-left group hover:bg-white/[0.08] transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white uppercase tracking-widest">VISION PAL</h4>
                  <p className="text-[10px] text-white/40 font-medium">Real-time visual assistance & medication ID for low vision support.</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-white/[0.03] rounded-3xl border border-white/5 text-left group hover:bg-white/[0.08] transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white uppercase tracking-widest">OCEAN WAVE AAC</h4>
                  <p className="text-[10px] text-white/40 font-medium">Advanced communication interface optimized for motor accessibility.</p>
                </div>
              </div>
            </div>

            {/* Auth Actions */}
            <div className="w-full space-y-5">
              <button 
                onClick={onNext}
                className="w-full bg-white text-black font-black py-4 rounded-full hover:bg-white/90 transition-all uppercase text-sm md:text-base tracking-[0.2em] shadow-xl active:scale-[0.98] flex items-center justify-center gap-3"
              >
                <span>Enter as Guest Observer</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
            </div>

            <p className="mt-12 text-[8px] uppercase tracking-[0.2em] font-bold opacity-30 leading-relaxed max-w-xs">
              Real-time accessibility processing active. <br />
              Session data is ephemeral.
            </p>
          </div>
        </div>
      </div>

      {/* Subtle Footer Detail */}
      <div className="py-8 text-center relative z-20">
        <div className="w-1.5 h-1.5 bg-violet-400 rounded-full mx-auto animate-ping mb-3"></div>
        <div className="text-[8px] font-bold text-white/20 tracking-[1em] uppercase">Operational Hub</div>
      </div>
    </div>
  );
};

export default MedicalSignInPage;
