
import React, { useEffect, useRef } from 'react';
import { generateSpeech } from '../services/gemini';
import { RefineTone } from '../types';

interface MedicalSignInPageProps {
  onNext: () => void;
  onVisionPal: () => void;
}

const MedicalSignInPage: React.FC<MedicalSignInPageProps> = ({ onNext, onVisionPal }) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const hasSpokenRef = useRef(false);

  // Eden Assistant Voice Logic (High Quality Gemini TTS)
  useEffect(() => {
    const playIntro = async () => {
        if (hasSpokenRef.current) return;
        hasSpokenRef.current = true;

        // Exact script requested by user
        const text = "You're on signin page. Tap anywhere to open Vision Pal. Why wait? Tap anywhere you want. I'm your Eden Assistant. See you on the other side.";
        
        try {
            // RefineTone.EMPATHETIC maps to 'Zephyr' in services/gemini.ts (Beautiful Woman Voice)
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
            // Fallback to native if API fails
            if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.rate = 1.1; 
                window.speechSynthesis.speak(utterance);
            }
        }
    };

    playIntro();

    return () => {
        if (audioContextRef.current) {
            audioContextRef.current.close();
        }
    };
  }, []);

  const handleTap = () => {
      // Provide immediate feedback and stop intro speech
      if (audioContextRef.current && audioContextRef.current.state === 'running') {
           audioContextRef.current.suspend();
      }
      
      // Quick feedback sound or short TTS for confirmation
      if ('speechSynthesis' in window) {
           window.speechSynthesis.cancel();
           const utterance = new SpeechSynthesisUtterance("Opening Vision Pal.");
           utterance.rate = 1.2;
           window.speechSynthesis.speak(utterance);
      }
      
      onVisionPal();
  };

  return (
    <div 
      onClick={handleTap}
      className="min-h-screen w-full flex flex-col bg-[#000c1a] text-white relative overflow-hidden font-sans cursor-pointer"
      aria-label="Welcome to Ocean Wave. Tap anywhere to open Vision Pal assistant."
    >
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
        <div className="flex items-center space-x-6">
           <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
               <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
               <span className="text-[9px] uppercase font-bold tracking-wider text-green-300">Eden Active</span>
           </div>
        </div>
      </div>

      <div className="flex-grow flex items-center justify-center p-4 relative z-10">
        {/* Sign In Card */}
        <div 
            // Prevent clicks on the card from triggering "Tap Anywhere" if the user is trying to read the card content via screen reader
            // But we allow it for now to ensure large hit area, except for buttons
            className="w-full max-w-lg bg-black/20 border border-white/5 rounded-[2.5rem] p-10 md:p-14 backdrop-blur-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-700"
        >
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
                onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering "Tap Anywhere"
                    onNext();
                }}
                className="w-full bg-white text-black font-black py-4 rounded-full hover:bg-white/90 transition-all uppercase text-sm md:text-base tracking-[0.2em] shadow-xl active:scale-[0.98] flex items-center justify-center gap-3"
              >
                <span>Enter as Guest Observer</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
            </div>

            <p className="mt-12 text-[8px] uppercase tracking-[0.2em] font-bold opacity-30 leading-relaxed max-w-xs">
              Eden Assistant Active. <br />
              Tap background for Vision Mode.
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
