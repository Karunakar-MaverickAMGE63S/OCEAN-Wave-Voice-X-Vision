
import React, { useRef, useState, useEffect } from 'react';
import HardwareButton from './HardwareButton';
import { getContextEmojis } from '../services/gemini';

interface ContextCamProps {
  onClose: () => void;
  onSelectEmoji: (emojis: string[]) => void;
}

const ContextCam: React.FC<ContextCamProps> = ({ onClose, onSelectEmoji }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [generatedEmojis, setGeneratedEmojis] = useState<string[]>([]);
  const [selectedEmojis, setSelectedEmojis] = useState<string[]>([]);
  const [isLoadingCamera, setIsLoadingCamera] = useState(false);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // Robust Stream Attachment: Automatically attaches stream to video element when available
  useEffect(() => {
    if (permissionGranted && stream && videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play().catch(e => console.error("Auto-play error:", e));
        };
    }
  }, [permissionGranted, stream]);

  const requestPermission = async () => {
    setIsLoadingCamera(true);
    
    // Advanced Camera Initialization Strategy
    try {
      let mediaStream: MediaStream;
      
      try {
        // Attempt 1: Prefer rear environment camera with optimal settings
        mediaStream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                facingMode: 'environment',
                width: { ideal: 1920 },
                height: { ideal: 1080 }
            },
            audio: false 
        });
      } catch (firstError) {
        console.warn("Primary camera request failed, trying fallback...", firstError);
        // Attempt 2: Fallback to any available video source
        mediaStream = await navigator.mediaDevices.getUserMedia({ 
            video: true,
            audio: false 
        });
      }

      setStream(mediaStream);
      setPermissionGranted(true);
      
    } catch (err) {
      console.error("Camera permission completely denied:", err);
      alert("Unable to access camera. Please check your browser permissions settings.");
    } finally {
      setIsLoadingCamera(false);
    }
  };

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsAnalyzing(true);
    setSelectedEmojis([]); // Reset selection on new capture

    // Capture frame
    const context = canvasRef.current.getContext('2d');
    if (context) {
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);
      
      // Get Base64 string (remove data URL prefix)
      const base64Image = canvasRef.current.toDataURL('image/jpeg', 0.7).split(',')[1];
      
      // Call Gemini
      try {
        const emojis = await getContextEmojis(base64Image);
        setGeneratedEmojis(emojis);
      } catch (e) {
        console.error(e);
      } finally {
        setIsAnalyzing(false);
        // Stop stream to save battery while viewing results
        if (stream) {
             stream.getTracks().forEach(track => track.stop());
             setStream(null);
        }
      }
    }
  };

  const handleRetake = () => {
      setGeneratedEmojis([]);
      setSelectedEmojis([]);
      requestPermission();
  };

  const toggleEmoji = (emoji: string) => {
    if (selectedEmojis.includes(emoji)) {
        setSelectedEmojis(prev => prev.filter(e => e !== emoji));
    } else {
        setSelectedEmojis(prev => [...prev, emoji]);
    }
  };

  const handleConfirm = () => {
    if (selectedEmojis.length > 0) {
        onSelectEmoji(selectedEmojis);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col font-sans text-white animate-in fade-in zoom-in duration-75">
      
      {/* Background Ambience (Matches Dashboard) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#00519E] via-[#003B73] to-[#002652] -z-10"></div>
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      {/* Header - Glassmorphic Navy */}
      <div className="flex justify-between items-center p-4 bg-[#002652]/80 backdrop-blur-md border-b border-white/20 text-white shadow-md z-10">
        <div className="flex items-center gap-3">
            {/* Blue & Purple Star */}
            <svg className="w-8 h-8 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3B82F6" /> {/* blue-500 */}
                        <stop offset="100%" stopColor="#A855F7" /> {/* purple-500 */}
                    </linearGradient>
                </defs>
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="url(#starGradient)" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h2 className="font-bold text-base sm:text-lg uppercase tracking-widest text-white">Context-Aware Camera</h2>
        </div>
        <HardwareButton onClick={onClose} variant="red" className="text-sm px-4 py-2 border-white/20">
            CLOSE
        </HardwareButton>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex flex-col items-center justify-center p-4 relative overflow-hidden z-0">
        
        {/* State: Permission Request */}
        {!permissionGranted && generatedEmojis.length === 0 && (
            <div className="text-center space-y-6">
                <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto border border-white/20 shadow-lg backdrop-blur-sm">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <h3 className="text-2xl font-black text-white uppercase">Permission Required</h3>
                <p className="opacity-80 max-w-xs mx-auto text-blue-100 font-medium">Ocean Wave needs camera access to identify objects and generate relevant emojis.</p>
                
                <button 
                    onClick={requestPermission} 
                    className={`px-8 py-4 bg-white text-[#002652] border-[4px] border-[#002652]/50 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.4)] font-black uppercase tracking-widest active:translate-y-1 active:shadow-none transition-all ${isLoadingCamera ? 'opacity-70 cursor-wait' : ''}`}
                    aria-label="Enable Camera Access"
                >
                    {isLoadingCamera ? (
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 border-2 border-[#002652] border-t-transparent rounded-full animate-spin"></div>
                            <span>INITIALIZING...</span>
                        </div>
                    ) : (
                        "ENABLE CAMERA"
                    )}
                </button>
            </div>
        )}

        {/* State: Camera Live View */}
        {permissionGranted && generatedEmojis.length === 0 && (
            <div className="w-full max-w-2xl relative rounded-3xl overflow-hidden border-[6px] border-white/20 shadow-2xl animate-in zoom-in-95 duration-200 bg-black">
                <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    className="w-full h-auto bg-black"
                />
                <canvas ref={canvasRef} className="hidden" />
                
                {/* Overlay UI */}
                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent flex justify-center">
                    {isAnalyzing ? (
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                            <span className="font-bold uppercase tracking-widest text-cyan-300 animate-pulse">Analyzing...</span>
                        </div>
                    ) : (
                        <button onClick={handleCapture} className="rounded-full w-20 h-20 flex items-center justify-center bg-white/10 backdrop-blur-md shadow-[0_0_30px_rgba(255,255,255,0.2)] active:scale-95 transition-transform border border-white/30">
                            <div className="w-16 h-16 bg-white rounded-full border-[4px] border-black/10"></div>
                        </button>
                    )}
                </div>
            </div>
        )}

        {/* State: Results */}
        {generatedEmojis.length > 0 && (
            <div className="w-full max-w-4xl flex flex-col items-center gap-8 animate-in slide-in-from-bottom-10 fade-in duration-300">
                <h3 className="text-center font-black text-blue-200/50 uppercase tracking-widest text-sm">Select Emojis to Add</h3>
                
                <div className="flex flex-wrap justify-center gap-4 w-full">
                    {generatedEmojis.map((emoji, idx) => {
                        const isSelected = selectedEmojis.includes(emoji);
                        return (
                            <button
                                key={idx}
                                onClick={() => toggleEmoji(emoji)}
                                className={`
                                    w-24 h-24 sm:w-32 sm:h-32 border-[4px] rounded-xl flex items-center justify-center text-6xl sm:text-7xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] transition-all active:scale-95 relative
                                    ${isSelected 
                                        ? 'bg-green-600 border-white text-white scale-105 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.4)] z-10' 
                                        : 'bg-white/10 border-white/20 text-white hover:bg-white/20'}
                                `}
                            >
                                {emoji}
                                {isSelected && (
                                    <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center border-2 border-black">
                                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>

                <div className="flex gap-4 mt-8">
                    <button 
                        onClick={handleRetake} 
                        className="px-6 py-3 bg-transparent text-white border-[3px] border-white/50 font-black uppercase tracking-widest shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)] active:translate-y-1 active:shadow-none transition-all hover:bg-white/5"
                    >
                        RETAKE
                    </button>
                    
                    {/* OK Button - shows number of selected items */}
                    <button 
                        onClick={handleConfirm} 
                        className={`px-8 py-3 bg-white text-[#002652] border-[3px] border-transparent font-black uppercase tracking-widest shadow-[3px_3px_0px_0px_rgba(0,0,0,0.4)] active:translate-y-1 active:shadow-none transition-all ${selectedEmojis.length === 0 ? 'opacity-50' : ''}`}
                    >
                        OK {selectedEmojis.length > 0 && `(${selectedEmojis.length})`}
                    </button>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default ContextCam;
