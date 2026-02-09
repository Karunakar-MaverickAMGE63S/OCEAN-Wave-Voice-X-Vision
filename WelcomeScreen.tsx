
import React from 'react';
import HardwareButton from './HardwareButton';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="relative w-screen h-[100dvh] bg-[#004DA0] blueprint-grid flex flex-col items-center justify-center overflow-hidden p-6 select-none">
      
      {/* Decorative Industrial Corners */}
      <div className="absolute top-0 left-0 p-4 sm:p-8 pointer-events-none">
        <div className="w-16 h-16 sm:w-24 sm:h-24 border-l-[6px] border-t-[6px] border-white/20"></div>
      </div>
      <div className="absolute top-0 right-0 p-4 sm:p-8 pointer-events-none">
        <div className="w-16 h-16 sm:w-24 sm:h-24 border-r-[6px] border-t-[6px] border-white/20"></div>
      </div>
      <div className="absolute bottom-0 left-0 p-4 sm:p-8 pointer-events-none">
        <div className="w-16 h-16 sm:w-24 sm:h-24 border-l-[6px] border-bottom-[6px] border-b-[6px] border-white/20"></div>
      </div>
      <div className="absolute bottom-0 right-0 p-4 sm:p-8 pointer-events-none">
        <div className="w-16 h-16 sm:w-24 sm:h-24 border-r-[6px] border-bottom-[6px] border-b-[6px] border-white/20"></div>
      </div>

      <div className="z-10 flex flex-col items-center gap-8 sm:gap-12 max-w-5xl w-full">
        
        {/* Title Block */}
        <div className="text-center space-y-2 sm:space-y-4">
          <h1 className="text-5xl sm:text-7xl md:text-9xl font-black text-white uppercase tracking-tighter drop-shadow-[8px_8px_0_rgba(0,0,0,1)]">
            Ocean Wave
          </h1>
          <div className="bg-black/40 border-[3px] border-cyan-400/50 px-4 py-1 sm:px-8 sm:py-2 inline-block shadow-[4px_4px_0_rgba(0,0,0,0.5)] transform -skew-x-12">
             <h2 className="text-sm sm:text-xl md:text-3xl font-bold text-cyan-300 uppercase tracking-[0.1em] transform skew-x-12 text-center">
              Augmentative & Alternative Communication
             </h2>
          </div>
        </div>

        {/* Action */}
        <div className="mt-8 sm:mt-16">
            <HardwareButton 
                onClick={onStart}
                variant="blue"
                className="px-12 py-6 sm:px-16 sm:py-8 text-2xl sm:text-4xl border-[4px] sm:border-[6px] animate-[pulse_3s_ease-in-out_infinite]"
                ariaLabel="Power On System"
            >
                POWER ON
            </HardwareButton>
        </div>

      </div>
      
      <div className="absolute bottom-4 text-white/20 text-[10px] sm:text-xs font-mono">
        COPYRIGHT © OCEAN WAVE SYSTEMS // ACCESSIBILITY FIRST
      </div>
    </div>
  );
};

export default WelcomeScreen;
