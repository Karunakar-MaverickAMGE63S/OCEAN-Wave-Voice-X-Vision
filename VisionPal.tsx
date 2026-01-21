
import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import HardwareButton from './HardwareButton';

interface VisionPalProps {
  onClose: () => void;
}

const VisionPal: React.FC<VisionPalProps> = ({ onClose }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMuted, setIsMuted] = useState(false);

  // Audio Contexts & State
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);
  const sessionRef = useRef<Promise<any> | null>(null);
  const videoIntervalRef = useRef<number | null>(null);

  // System Instruction
  const SYSTEM_INSTRUCTION = `You are Vision Pal, an advanced AI assistant for people with low vision.
  Your Persona: Calm, precise, and direct. You act as a "Sighted Guide".
  
  CORE TASKS:
  1. NAVIGATION: Constantly describe the spatial layout. Use clock positions (e.g., "at 2 o'clock") and approximate distances. Warn of obstacles immediately.
  2. MEDICAL SCANNING: If you see medication, identify the Name, Dosage, and read specific warnings (Red Flags).
  3. PILL ID: If you see a loose pill, describe shape, color, and imprint code.
  
  Interacting:
  - Speak clearly.
  - If the user shows you a document or bottle, guide them to move it closer or rotate it if text is blurry.
  - Answer questions instantly based on visual input.`;

  useEffect(() => {
    startCamera();
    return () => {
      stopSession();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: "environment",
          width: { ideal: 640 },
          height: { ideal: 480 }
        }, 
        audio: true 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera/Mic Error:", err);
      setError("Camera or Microphone access denied. Please grant permissions.");
    }
  };

  const stopSession = () => {
    // Stop Video Loop
    if (videoIntervalRef.current) {
      clearInterval(videoIntervalRef.current);
      videoIntervalRef.current = null;
    }

    // Close Gemini Session
    if (sessionRef.current) {
       sessionRef.current.then(session => {
         try {
           session.close();
         } catch(e) {
           console.error("Error closing session", e);
         }
       });
       sessionRef.current = null;
    }

    // Stop Media Stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    // Close Audio Contexts
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
       audioContextRef.current.close();
    }
    if (inputAudioContextRef.current && inputAudioContextRef.current.state !== 'closed') {
       inputAudioContextRef.current.close();
    }

    setIsConnected(false);
  };

  const connectToGemini = async () => {
    if (!streamRef.current) {
        // Try to restart camera if stream is lost
        await startCamera();
        if (!streamRef.current) return;
    }
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
      
      // Initialize Audio Contexts
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      inputAudioContextRef.current = new AudioContextClass({ sampleRate: 16000 });
      audioContextRef.current = new AudioContextClass({ sampleRate: 24000 });
      nextStartTimeRef.current = 0;

      const config = {
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsConnected(true);
            console.log("Vision Pal: Connected");
            
            // --- 1. Start Audio Streaming (Mic -> Gemini) ---
            const source = inputAudioContextRef.current!.createMediaStreamSource(streamRef.current!);
            const processor = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
            
            processor.onaudioprocess = (e) => {
              if (isMuted) return; // Don't send audio if muted
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmData = float32ToInt16(inputData);
              const base64Audio = arrayBufferToBase64(pcmData.buffer);
              
              sessionPromise.then((session) => {
                 session.sendRealtimeInput({
                    media: {
                        mimeType: "audio/pcm;rate=16000",
                        data: base64Audio
                    }
                 });
              });
            };
            
            source.connect(processor);
            processor.connect(inputAudioContextRef.current!.destination);

            // --- 2. Start Video Streaming (Canvas -> Gemini) ---
            // Send frames at ~2fps to balance latency/bandwidth
            videoIntervalRef.current = window.setInterval(() => {
                if (videoRef.current && canvasRef.current) {
                    const ctx = canvasRef.current.getContext('2d');
                    if (ctx) {
                        canvasRef.current.width = videoRef.current.videoWidth * 0.5; // Downscale for performance
                        canvasRef.current.height = videoRef.current.videoHeight * 0.5;
                        ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
                        
                        const base64Image = canvasRef.current.toDataURL('image/jpeg', 0.6).split(',')[1];
                        
                        sessionPromise.then((session) => {
                            session.sendRealtimeInput({
                                media: {
                                    mimeType: 'image/jpeg',
                                    data: base64Image
                                }
                            });
                        });
                    }
                }
            }, 500); 
          },
          onmessage: async (message: LiveServerMessage) => {
            // --- 3. Handle Audio Response (Gemini -> Speaker) ---
            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            
            if (base64Audio && audioContextRef.current) {
               try {
                   const audioData = base64ToArrayBuffer(base64Audio);
                   // Create a buffer directly from the PCM data (1 channel, 24kHz)
                   // The API returns raw PCM. We need to manually convert Int16 to Float32 for Web Audio API
                   const float32Data = int16ToFloat32(new Int16Array(audioData));
                   const buffer = audioContextRef.current.createBuffer(1, float32Data.length, 24000);
                   buffer.getChannelData(0).set(float32Data);

                   const source = audioContextRef.current.createBufferSource();
                   source.buffer = buffer;
                   source.connect(audioContextRef.current.destination);

                   // Schedule playback
                   const currentTime = audioContextRef.current.currentTime;
                   const startTime = Math.max(currentTime, nextStartTimeRef.current);
                   source.start(startTime);
                   nextStartTimeRef.current = startTime + buffer.duration;
               } catch (e) {
                   console.error("Audio Decode Error", e);
               }
            }
          },
          onclose: () => {
            console.log("Vision Pal: Closed");
            setIsConnected(false);
          },
          onerror: (err: any) => {
            console.error("Vision Pal: Error", err);
            setError("Connection Error. Please Restart.");
            setIsConnected(false);
          }
        },
        config: {
            responseModalities: [Modality.AUDIO],
            systemInstruction: SYSTEM_INSTRUCTION,
        }
      };

      const sessionPromise = ai.live.connect(config);
      sessionRef.current = sessionPromise;

    } catch (e) {
      console.error(e);
      setError("Failed to initialize Vision Pal.");
    }
  };

  // --- Helper Functions for Audio Encoding/Decoding ---

  // Convert Float32 (Web Audio) to Int16 (Gemini Input)
  const float32ToInt16 = (float32: Float32Array) => {
    const int16 = new Int16Array(float32.length);
    for (let i = 0; i < float32.length; i++) {
        let s = Math.max(-1, Math.min(1, float32[i]));
        int16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    return int16;
  };

  // Convert Int16 (Gemini Output) to Float32 (Web Audio)
  const int16ToFloat32 = (int16: Int16Array) => {
    const float32 = new Float32Array(int16.length);
    for (let i = 0; i < int16.length; i++) {
        float32[i] = int16[i] / 32768.0;
    }
    return float32;
  };

  const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const base64ToArrayBuffer = (base64: string) => {
      const binaryString = window.atob(base64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes.buffer;
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col font-sans text-white bg-[#003B73]">
        
        {/* Background Ambience - Professional Clinical Blue Theme */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#00519E] via-[#003B73] to-[#002652] -z-10"></div>
        
        {/* Header - Glassmorphism Clinical Navy */}
        <div className="flex items-center justify-between p-4 bg-[#003B73]/80 backdrop-blur-md border-b border-white/10 z-20 shadow-sm">
            <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20 animate-pulse shadow-inner">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                 </div>
                 <div>
                     <h2 className="text-xl font-bold tracking-tight text-white drop-shadow-md">VISION PAL</h2>
                     {isConnected && (
                        <p className="text-[10px] uppercase tracking-widest text-white/80 font-bold opacity-80">
                            LIVE CONNECTION ACTIVE
                        </p>
                     )}
                 </div>
            </div>
            <button 
                onClick={onClose} 
                className="px-4 py-2 bg-[#003B73] hover:bg-[#00519E] rounded border border-white/30 text-white text-xs font-bold uppercase tracking-widest transition-colors shadow-sm"
            >
                EXIT SESSION
            </button>
        </div>

        {/* Viewport - Darkened for Contrast */}
        <div className="flex-grow relative bg-black/40 flex items-center justify-center overflow-hidden z-10">
            <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="absolute inset-0 w-full h-full object-cover opacity-90"
            />
            {/* Hidden canvas for frame processing */}
            <canvas ref={canvasRef} className="hidden" />
            
            {/* Reticle Overlay */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-72 h-72 border-2 border-white/30 rounded-lg relative shadow-[0_0_50px_rgba(255,255,255,0.05)_inset]">
                    {/* Corners */}
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-white/80 drop-shadow-[0_0_4px_rgba(255,255,255,0.5)]"></div>
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-white/80 drop-shadow-[0_0_4px_rgba(255,255,255,0.5)]"></div>
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-white/80 drop-shadow-[0_0_4px_rgba(255,255,255,0.5)]"></div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-white/80 drop-shadow-[0_0_4px_rgba(255,255,255,0.5)]"></div>
                    
                    {/* Center Point */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,1)]"></div>
                </div>
            </div>

            {error && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#002652]/95 p-6 rounded-xl border border-red-500/50 text-center w-3/4 max-w-sm backdrop-blur-xl shadow-2xl">
                    <p className="font-bold text-lg mb-2 text-white">⚠️ SYSTEM ERROR</p>
                    <p className="text-sm mb-4 text-white/70">{error}</p>
                    <HardwareButton onClick={startCamera} variant="white" className="text-sm py-2 w-full">
                        RETRY CONNECTION
                    </HardwareButton>
                </div>
            )}
        </div>

        {/* Controls Footer - Deep Indigo Shadow Base */}
        <div className="bg-[#002652]/90 backdrop-blur-xl p-6 border-t border-white/10 flex items-center justify-center gap-6 pb-8 md:pb-10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-20">
            
            {/* Microphone Toggle */}
             <div className="flex flex-col items-center gap-2">
                 <button 
                    onClick={() => setIsMuted(!isMuted)} 
                    className={`
                        w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center border-[2px] transition-all duration-300 shadow-xl active:scale-95
                        ${isMuted 
                            ? "bg-[#003B73] border-white/30 text-white/50" // Muted: Navy bg, dimmed white icon
                            : "bg-white border-white text-[#003B73] hover:scale-105"} // Active: White bg, Navy icon
                    `}
                    aria-label={isMuted ? "Unmute Microphone" : "Mute Microphone"}
                 >
                    {isMuted ? (
                        <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                    )}
                 </button>
                 <span className={`text-[9px] sm:text-[10px] font-bold tracking-widest uppercase ${isMuted ? 'text-white/50' : 'text-white'}`}>
                    {isMuted ? "Audio Muted" : "Mic Active"}
                 </span>
            </div>

            {/* Main Action Button */}
            <div className="flex-grow max-w-sm sm:max-w-md px-2 sm:px-4">
                {!isConnected ? (
                    <button 
                        onClick={connectToGemini}
                        className="w-full bg-[#003B73] hover:bg-[#00519E] text-white font-bold py-4 sm:py-5 rounded-2xl border-b-[6px] border-[#002652] active:border-b-0 active:translate-y-[6px] transition-all shadow-xl shadow-black/30 flex items-center justify-center gap-3 group"
                    >
                        <div className="w-3 h-3 bg-white rounded-full animate-pulse group-hover:scale-125 transition-transform"></div>
                        <span className="text-lg sm:text-xl tracking-wider">START GUIDANCE</span>
                    </button>
                ) : (
                    <div className="w-full bg-[#001d3d]/60 border border-white/20 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 relative overflow-hidden h-[72px] sm:h-[84px] shadow-inner">
                        {/* Scanning Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent w-full -translate-x-full animate-[spin_3s_linear_infinite]" style={{ animationName: 'shimmer', animationDuration: '2s' }}></div>
                        
                        <div className="flex gap-1 h-6 sm:h-8 items-end">
                             {[...Array(5)].map((_, i) => (
                                <div key={i} className="w-1.5 bg-white/80 rounded-full animate-[bounce_1s_infinite]" style={{ animationDelay: `${i * 0.1}s`, height: '60%' }}></div>
                             ))}
                        </div>
                        <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-white font-bold z-10">AI Analysis Active</p>
                        
                        <style>{`
                            @keyframes shimmer {
                                0% { transform: translateX(-100%); }
                                100% { transform: translateX(100%); }
                            }
                        `}</style>
                    </div>
                )}
            </div>

             {/* Settings Placeholder */}
             <div className="hidden sm:flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
                 <div className="w-16 h-16 rounded-full border-[2px] border-white/10 flex items-center justify-center hover:bg-white/5">
                    <svg className="w-6 h-6 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                 </div>
                 <span className="text-[10px] font-bold tracking-widest uppercase text-white/40">Settings</span>
            </div>

        </div>

    </div>
  );
};

export default VisionPal;
