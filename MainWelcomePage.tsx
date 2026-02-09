
import React, { useEffect, useRef } from 'react';
import { generateSpeech } from '../services/gemini';
import { RefineTone } from '../types';

interface MainWelcomePageProps {
  onNext: () => void;
}

const MainWelcomePage: React.FC<MainWelcomePageProps> = ({ onNext }) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const hasSpokenRef = useRef(false);

  // Eden Assistant Voice Logic (High Quality Gemini TTS)
  useEffect(() => {
    const playIntro = async () => {
        if (hasSpokenRef.current) return;
        hasSpokenRef.current = true;

        const text = "Hi there, you're on welcome page.";
        
        try {
            // RefineTone.EMPATHETIC maps to 'Zephyr' (Beautiful Woman Voice)
            const base64Audio = await generateSpeech(text, RefineTone.EMPATHETIC);
            
            if (base64Audio) {
                const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
                const ctx = new AudioContextClass({ sampleRate: 24000 });
                audioContextRef.current = ctx;

                // Decode raw PCM from Gemini (Int16)
                const binaryString = window.atob(base64Audio);
                const len = binaryString.length;
                const bytes = new Uint8Array(len);
                for (let i = 0; i < len; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }
                const int16Data = new Int16Array(bytes.buffer);
                const float32Data = new Float32Array(int16Data.length);
                for (let i = 0; i < int16Data.length; i++) {
                    float32Data[i] = int16Data[i] / 32768.0;
                }

                const buffer = ctx.createBuffer(1, float32Data.length, 24000);
                buffer.getChannelData(0).set(float32Data);

                const source = ctx.createBufferSource();
                source.buffer = buffer;
                source.connect(ctx.destination);
                source.start();
            }
        } catch (e) {
            console.error("Eden Assistant Audio Failed", e);
        }
    };

    playIntro();

    return () => {
        if (audioContextRef.current) {
            audioContextRef.current.close();
        }
    };
  }, []);

  const handleNext = () => {
    // Stop audio when leaving page
    if (audioContextRef.current && audioContextRef.current.state === 'running') {
        audioContextRef.current.suspend();
    }
    onNext();
  };

  return (
    <div 
      onClick={handleNext}
      className="relative w-screen h-[100dvh] bg-[#000814] overflow-hidden flex flex-col font-sans select-none cursor-pointer"
    >
      {/* Background Gradients - Deep Navy & Magnum Blue */}
      <div className="absolute inset-0 bg-[#000814]"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-[#001d3d] via-[#003566] to-[#000814] opacity-90"></div>
      
      {/* Subtle Vignette for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]"></div>

      {/* Decorative Orbs - Magnum Blue Intensity */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[100px]"></div>

      {/* Internal Frame - Clinical border with Magnum tint */}
      <div className="absolute inset-4 border border-blue-500/10 rounded-[2rem] pointer-events-none z-30 shadow-[0_0_50px_rgba(37,99,235,0.05)_inset]"></div>
      
      {/* Abstract Waves/Data Flow */}
      <div className="absolute bottom-0 left-0 w-full h-[60%] z-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 left-0 w-full h-full opacity-[0.03] translate-y-20">
          <svg viewBox="0 0 1000 300" className="w-full h-full" preserveAspectRatio="none">
             <path d="M0,300 L0,200 C150,250 350,100 500,200 C650,300 850,150 1000,250 L1000,300 Z" fill="#93c5fd" />
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-[80%] opacity-[0.05] translate-y-10">
          <svg viewBox="0 0 1000 300" className="w-full h-full" preserveAspectRatio="none">
             <path d="M0,300 L0,150 C200,250 400,50 600,200 C800,350 900,100 1000,150 L1000,300 Z" fill="#60a5fa" />
          </svg>
        </div>
        {/* Bottom Fade */}
        <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-[#000814] to-transparent"></div>
      </div>

      {/* Header Bar */}
      <div className="w-full bg-white/5 backdrop-blur-md px-6 py-4 flex justify-between items-center border-b border-blue-500/10 relative z-20">
        <div className="flex-1 text-center text-[10px] font-bold tracking-[0.3em] uppercase opacity-80 flex items-center justify-center space-x-3 text-blue-100">
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
          <span>Voice and Vision Neural Interface</span>
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
        </div>
        <div className="flex items-center space-x-6">
          <div className="hidden md:flex items-center space-x-2 opacity-60">
            <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
            <span className="text-[9px] uppercase font-bold tracking-widest text-blue-100">System Ready</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex flex-col items-center justify-center px-4 animate-in fade-in zoom-in duration-1000 text-center relative z-10">
        
        {/* Glow behind Title - Magnum Blue Mix */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-64 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 blur-[80px] -z-10 rounded-full"></div>

        <div className="mb-6 opacity-40 group">
             <div className="w-24 h-[1px] bg-blue-400 mx-auto mb-8 group-hover:w-48 transition-all duration-700"></div>
        </div>

        <h1 className="text-5xl md:text-8xl font-bold mb-8 tracking-tighter leading-tight text-white drop-shadow-2xl">
          Welcome to <br className="hidden md:block" /> 
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-white to-indigo-200 drop-shadow-[0_4px_20px_rgba(37,99,235,0.5)]">OCEAN WAVE</span>
          <span className="block text-2xl md:text-5xl mt-4 tracking-normal text-blue-200 font-medium">Voice & Vision</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-blue-100/60 font-light tracking-wide max-w-2xl mx-auto leading-relaxed px-4">
          Neural. Accurate. Intelligent. <br/>
          <span className="text-blue-300 italic">Redefining Accessibility.</span>
        </p>

        {/* Action Prompt */}
        <div className="mt-24 group flex flex-col items-center">
          <div className="text-[10px] uppercase tracking-[0.8em] font-bold text-blue-200/50 animate-pulse group-hover:text-blue-200 transition-colors">
            Tap to Initialize
          </div>
          <div className="mt-6 w-px h-16 bg-gradient-to-b from-blue-500/50 to-transparent relative overflow-hidden">
            <div className="absolute inset-0 bg-white/50 -translate-y-full animate-[drop_2s_infinite]"></div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="py-10 text-center relative z-10 text-white">
        <div className="text-[9px] uppercase tracking-[0.4em] font-bold opacity-30 mb-2">v4.0.1 Stable</div>
        <div className="flex items-center justify-center space-x-2 text-[10px] opacity-40 font-medium tracking-widest uppercase">
           <span>Secure Gateway</span>
        </div>
      </div>

      <style>{`
        @keyframes drop {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
      `}</style>
    </div>
  );
};

export default MainWelcomePage;
