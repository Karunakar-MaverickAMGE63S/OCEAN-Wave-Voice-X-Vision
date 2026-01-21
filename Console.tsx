
import React from 'react';
import HardwareButton from './HardwareButton';
import { RefineTone } from '../types';

interface ConsoleProps {
  message: string;
  onMessageChange: (val: string) => void;
  onClear: () => void;
  onSpeak: () => void;
  onRefine: () => void;
  tone: RefineTone;
  setTone: (tone: RefineTone) => void;
  isSpeaking: boolean;
  onOpenContextCam?: () => void;
  isKeyboardActive?: boolean; // Kept optional to prevent breaking if passed
}

const Console: React.FC<ConsoleProps> = ({ 
  message, 
  onMessageChange,
  onClear, 
  onSpeak, 
  onRefine, 
  tone, 
  setTone,
  isSpeaking,
  onOpenContextCam,
  isKeyboardActive
}) => {
  return (
    <div className="flex flex-col w-full space-y-2 md:space-y-3 max-w-[1600px] mx-auto">
      {/* Intelligence & Tone Bar */}
      <div className="flex flex-row justify-between items-center gap-2 px-1">
        <div className="flex items-center gap-2">
            {/* Context Camera Button - Styled Navy Blue with White Font */}
            {onOpenContextCam && (
                <button 
                    onClick={onOpenContextCam}
                    aria-label="Open Context Camera"
                    className="px-3 py-1.5 md:px-4 md:py-2 border-[3px] md:border-[4px] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center space-x-2 bg-[#001F3F] text-white active:translate-y-1 active:shadow-none transition-all"
                >
                    <span className="text-[10px] sm:text-xs md:text-sm font-black uppercase tracking-widest">CONTEXT CAM</span>
                </button>
            )}
        </div>
        
        <div className="flex items-center space-x-2 md:space-x-3">
            <div className="flex items-center bg-black border-[3px] md:border-[4px] border-white overflow-hidden shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)]">
              <select 
                value={tone}
                onChange={(e) => setTone(e.target.value as RefineTone)}
                className="bg-black text-white px-2 py-1 md:px-4 md:py-2 font-black text-[10px] sm:text-sm md:text-base rounded-none outline-none cursor-pointer hover:bg-white/10 transition-colors uppercase appearance-none text-center min-w-[80px] sm:min-w-[120px] md:min-w-[140px]"
              >
                {Object.values(RefineTone).map(t => (
                  <option key={t} value={t}>{(t as string).toUpperCase()}</option>
                ))}
              </select>
            </div>
            <HardwareButton 
              onClick={onRefine} 
              variant="white" 
              ariaLabel="Refine Sentence"
              className="px-3 py-1 md:px-6 md:py-2 text-[10px] sm:text-sm md:text-base border-[3px] md:border-[4px] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
            >
              REFINE
            </HardwareButton>
        </div>
      </div>

      {/* Primary Action Terminal */}
      <div className="flex flex-col sm:flex-row items-stretch bg-white border-[4px] sm:border-[6px] md:border-[8px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] min-h-[70px] sm:min-h-[100px] md:min-h-[130px] relative overflow-hidden">
        <div className="flex-grow flex items-center px-4 md:px-8 py-3 sm:py-0 relative bg-white">
            <input
              type="text"
              value={message}
              onChange={(e) => onMessageChange(e.target.value)}
              placeholder="READY..."
              className="w-full bg-transparent border-none outline-none text-xl sm:text-3xl md:text-5xl font-black text-black uppercase placeholder:text-black/10 tracking-tighter"
              autoFocus={isKeyboardActive}
            />
        </div>

        <div className="flex items-stretch border-t-[4px] sm:border-t-0 sm:border-l-[6px] md:border-l-[8px] border-black bg-black/5 p-1.5 sm:p-2 gap-1.5 sm:gap-2">
            <HardwareButton 
              onClick={onClear} 
              variant="red" 
              ariaLabel="Clear all text"
              className="flex-1 sm:flex-none sm:px-6 md:px-12 text-3xl sm:text-5xl md:text-8xl border-[2px] sm:border-[3px] md:border-[4px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              X
            </HardwareButton>
            <HardwareButton 
              onClick={onSpeak} 
              variant="blue" 
              ariaLabel="Speak message"
              className={`flex-[2] sm:flex-none sm:px-8 md:px-20 text-lg sm:text-2xl md:text-4xl border-[2px] sm:border-[3px] md:border-[4px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${isSpeaking ? 'talking-active' : ''}`}
            >
              TALK
            </HardwareButton>
        </div>
      </div>
    </div>
  );
};

export default Console;
