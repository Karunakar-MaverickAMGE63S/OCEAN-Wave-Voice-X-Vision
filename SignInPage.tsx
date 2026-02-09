
import React from 'react';
import HardwareButton from './HardwareButton';

interface SignInPageProps {
  onNext: () => void;
}

const SignInPage: React.FC<SignInPageProps> = ({ onNext }) => {
  return (
    <div className="min-h-screen w-full flex flex-col bg-[#004DA0] blueprint-grid relative overflow-hidden text-white select-none">
      
      {/* Industrial Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_100%)]"></div>

      {/* Header Bar */}
      <div className="w-full bg-black/20 backdrop-blur-sm border-b-[4px] border-white/20 p-4 flex justify-between items-center z-20">
        <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-mono text-xs uppercase tracking-widest text-cyan-300">Net_Link: Active</span>
        </div>
        <div className="font-black text-xl tracking-tighter uppercase">Ocean Wave</div>
      </div>

      <div className="flex-grow flex items-center justify-center p-4 relative z-10">
        {/* Card */}
        <div className="w-full max-w-lg bg-[#003366] border-[6px] border-white/10 p-8 md:p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,0.4)]">
          <div className="flex flex-col items-center text-center">
            
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center border-[4px] border-white/20 mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
            </div>

            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-2">Operator Login</h2>
            <p className="text-cyan-200/60 font-mono text-sm mb-10 border-b border-cyan-200/20 pb-4 w-full">
              AUTHENTICATION REQUIRED // TERMINAL 01
            </p>

            <div className="w-full space-y-4">
              <HardwareButton 
                onClick={onNext}
                variant="white"
                className="w-full py-4 text-xl"
              >
                GUEST ACCESS
              </HardwareButton>

              <div className="flex items-center space-x-4 px-2 py-2">
                <div className="flex-1 h-[2px] bg-white/10"></div>
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/40">OR</span>
                <div className="flex-1 h-[2px] bg-white/10"></div>
              </div>

              <HardwareButton 
                onClick={onNext}
                variant="glass"
                className="w-full py-4 text-xl opacity-50"
              >
                LOAD PROFILE
              </HardwareButton>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 text-center font-mono text-[10px] text-white/30">
        SECURE CONNECTION ESTABLISHED // V2.04
      </div>
      
      <style>{`
        .blueprint-grid {
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>
    </div>
  );
};

export default SignInPage;
