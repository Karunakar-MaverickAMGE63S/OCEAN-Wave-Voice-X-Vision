
import React, { useState, useRef, useEffect } from 'react';
import Console from './Console';
import HardwareButton from './HardwareButton';
import ContextCam from './ContextCam';
import { Category, PhraseItem, RefineTone } from '../types';
import { VOCABULARY } from '../constants';
import { refineSentence, predictNextWords, generateSpeech } from '../services/gemini';

const AACBoard: React.FC = () => {
  const [message, setMessage] = useState("");
  const [currentCategory, setCurrentCategory] = useState<Category>(Category.ROOT);
  const [history, setHistory] = useState<Category[]>([Category.ROOT]);
  const [tone, setTone] = useState<RefineTone>(RefineTone.CASUAL);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [isKeyboardActive, setIsKeyboardActive] = useState(false);
  const [predictions, setPredictions] = useState<string[]>([]);
  const [showContextCam, setShowContextCam] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const activeSourceRef = useRef<AudioBufferSourceNode | null>(null);

  // Auto-predict when typing
  useEffect(() => {
    const debounceTimer = setTimeout(async () => {
        if (isKeyboardActive && message.trim().length > 0) {
            // Fetch predictions
            try {
                const words = await predictNextWords(message);
                setPredictions(words);
            } catch (e) {
                console.error(e);
            }
        } else {
            setPredictions([]);
        }
    }, 600); // 600ms debounce to prevent API spam while typing

    return () => clearTimeout(debounceTimer);
  }, [message, isKeyboardActive]);

  // Stop speaking when message is cleared/erased
  useEffect(() => {
    if (!message || message.trim() === "") {
        stopSpeech();
    }
  }, [message]);

  // Cleanup on unmount
  useEffect(() => {
      return () => {
          stopSpeech();
          if (audioContextRef.current) {
              audioContextRef.current.close();
          }
      };
  }, []);

  const stopSpeech = () => {
      if (activeSourceRef.current) {
          activeSourceRef.current.stop();
          activeSourceRef.current = null;
      }
      setIsSpeaking(false);
  };

  const handleItemClick = (item: PhraseItem) => {
    if (item.isFolder && item.targetCategory) {
      setHistory([...history, item.targetCategory]);
      setCurrentCategory(item.targetCategory);
    } else {
      setMessage(prev => (prev ? `${prev} ${item.label}` : item.label));
    }
  };

  const handleBack = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop();
      setHistory(newHistory);
      setCurrentCategory(newHistory[newHistory.length - 1]);
    }
  };

  const handleHome = () => {
    setHistory([Category.ROOT]);
    setCurrentCategory(Category.ROOT);
  };

  const handleClear = () => {
      setMessage("");
      stopSpeech();
  };

  const handleSpeak = async () => {
    if (!message) return;
    
    stopSpeech();
    setIsSpeaking(true);

    try {
        // Use Gemini Cloud TTS
        const base64Audio = await generateSpeech(message, tone);
        
        if (base64Audio) {
             if (!audioContextRef.current) {
                // Initialize Audio Context (24kHz is standard for Gemini Flash Audio)
                const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
                audioContextRef.current = new AudioContextClass({ sampleRate: 24000 });
            }
            const ctx = audioContextRef.current;
            
            // Resume context if suspended (browser policy)
            if (ctx.state === 'suspended') {
                await ctx.resume();
            }

            // Decode Base64 to ArrayBuffer
            const binaryString = window.atob(base64Audio);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            
            // Gemini returns raw PCM 16-bit integers
            const int16Data = new Int16Array(bytes.buffer);
            
            // Convert Int16 to Float32 for Web Audio API
            const float32Data = new Float32Array(int16Data.length);
            for (let i = 0; i < int16Data.length; i++) {
                float32Data[i] = int16Data[i] / 32768.0;
            }

            // Create Audio Buffer (1 channel, 24kHz)
            const buffer = ctx.createBuffer(1, float32Data.length, 24000);
            buffer.getChannelData(0).set(float32Data);

            // Create Source Node
            const source = ctx.createBufferSource();
            source.buffer = buffer;
            source.connect(ctx.destination);
            
            source.onended = () => {
                setIsSpeaking(false);
                activeSourceRef.current = null;
            };
            
            activeSourceRef.current = source;
            source.start();

        } else {
            console.warn("No audio data returned from Gemini TTS");
            setIsSpeaking(false);
        }
    } catch (e) {
        console.error("Gemini TTS Error:", e);
        setIsSpeaking(false);
    }
  };

  const handleRefine = async () => {
    if (!message) return;
    setIsRefining(true);
    const refined = await refineSentence(message, tone);
    setMessage(refined);
    setIsRefining(false);
  };

  const handlePredictionClick = (word: string) => {
    setMessage(prev => prev + (prev.endsWith(' ') ? '' : ' ') + word + ' ');
    setPredictions([]); // Clear predictions after use
  };

  const handleContextEmojiSelect = (emojis: string[]) => {
      const emojiString = emojis.join(' ');
      setMessage(prev => (prev ? `${prev} ${emojiString}` : emojiString));
      setShowContextCam(false);
  };

  const currentItems = VOCABULARY[currentCategory] || [];

  const renderKeyboard = () => {
    const keys = [
      'QWERTYUIOP',
      'ASDFGHJKL',
      'ZXCVBNM'
    ];

    return (
      <div className="flex flex-col items-center gap-1 sm:gap-2 p-2 sm:p-4 bg-black/20 rounded-xl border border-white/10 w-full max-w-4xl mx-auto">
        
        {/* Prediction Row (Pink Boxes) */}
        {predictions.length > 0 && (
            <div className="flex w-full gap-2 mb-2 px-1">
                {predictions.map((word, idx) => (
                    <button
                        key={idx}
                        onClick={() => handlePredictionClick(word)}
                        className="flex-1 bg-pink-500 hover:bg-pink-400 text-white font-bold py-2 sm:py-3 rounded-lg shadow-lg border-b-4 border-pink-700 active:border-b-0 active:translate-y-1 transition-all uppercase truncate text-sm sm:text-base animate-in fade-in slide-in-from-bottom-2"
                    >
                        {word}
                    </button>
                ))}
            </div>
        )}

        {/* Keyboard Rows */}
        {keys.map((row, i) => (
          <div key={i} className="flex gap-1 w-full justify-center">
            {row.split('').map(key => (
              <button
                key={key}
                onClick={() => setMessage(prev => prev + key)}
                className="flex-1 min-w-0 h-12 sm:h-16 md:h-20 bg-[#001F3F] border-b-[4px] sm:border-b-[6px] border-[#000d1a] text-white font-black text-lg sm:text-xl md:text-2xl rounded active:border-b-0 active:translate-y-[4px] transition-all"
              >
                {key}
              </button>
            ))}
          </div>
        ))}
        
        {/* Space and Backspace */}
        <div className="flex gap-2 w-full mt-2">
            <button 
                onClick={() => setMessage(prev => prev + ' ')}
                className="flex-[4] h-12 sm:h-16 bg-[#001F3F] border-b-[4px] sm:border-b-[6px] border-[#000d1a] text-white font-black rounded active:border-b-0 active:translate-y-[4px] transition-all text-sm sm:text-base"
            >
                SPACE
            </button>
            <button 
                onClick={() => setMessage(prev => prev.slice(0, -1))}
                className="flex-1 h-12 sm:h-16 bg-red-600 border-b-[4px] sm:border-b-[6px] border-red-900 text-white font-black rounded active:border-b-0 active:translate-y-[4px] transition-all text-sm sm:text-base"
            >
                ⌫
            </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full max-w-[1600px] mx-auto p-2 md:p-4 gap-4">
      {/* Context Aware Camera Overlay */}
      {showContextCam && (
          <ContextCam 
            onClose={() => setShowContextCam(false)} 
            onSelectEmoji={handleContextEmojiSelect} 
          />
      )}

      <Console 
        message={message}
        onMessageChange={setMessage}
        onClear={handleClear}
        onSpeak={handleSpeak}
        onRefine={handleRefine}
        tone={tone}
        setTone={setTone}
        isSpeaking={isSpeaking}
        isKeyboardActive={isKeyboardActive}
        onOpenContextCam={() => setShowContextCam(true)}
      />

      {/* Navigation & Controls Bar */}
      <div className="flex space-x-2 md:space-x-4 h-12 md:h-16">
          {!isKeyboardActive ? (
            <>
              <HardwareButton 
                  onClick={handleHome} 
                  variant="glass" 
                  className="w-16 md:w-24 text-xl md:text-3xl"
              >
                  🏠
              </HardwareButton>
              <HardwareButton 
                  onClick={handleBack} 
                  variant="glass" 
                  className={`w-16 md:w-24 text-xl md:text-3xl ${history.length <= 1 ? 'opacity-30' : ''}`}
              >
                  ⬅️
              </HardwareButton>
              <div className="flex-grow bg-black/20 border-[3px] border-white/20 flex items-center px-4">
                  <span className="font-mono text-cyan-300 uppercase font-bold tracking-widest text-sm md:text-xl truncate">
                    NAV: {currentCategory}
                  </span>
              </div>
            </>
          ) : (
             <div className="flex-grow"></div> 
          )}

          {/* Keys/Grid Toggle Button */}
          <button
            onClick={() => setIsKeyboardActive(!isKeyboardActive)}
            className="px-4 md:px-8 bg-[#001F3F] text-white border-[3px] border-white/20 font-black uppercase tracking-widest text-sm md:text-lg hover:bg-[#003366] active:scale-95 transition-all shadow-[3px_3px_0_rgba(0,0,0,0.5)] flex items-center justify-center min-w-[100px]"
          >
            {isKeyboardActive ? "GRID" : "KEYS"}
          </button>
      </div>

      {/* Content Area */}
      <div className="flex-grow overflow-y-auto pr-2 pb-20">
        {isKeyboardActive ? (
            renderKeyboard()
        ) : (
            <div className="grid grid-cols-4 md:grid-cols-6 gap-2 md:gap-4">
            {currentItems.map((item) => (
                <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`
                    aspect-square rounded-none flex flex-col items-center justify-center p-0.5 md:p-1
                    border-[3px] md:border-[4px] shadow-[3px_3px_0px_0px_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-none transition-all overflow-hidden
                    ${item.isFolder 
                        ? 'bg-[#FFF5D1] border-[#C4B285] text-black' 
                        : 'bg-white border-gray-300 text-black'}
                `}
                >
                <span className="text-5xl sm:text-6xl md:text-7xl mb-1 sm:mb-3 pointer-events-none transform scale-110 leading-none">{item.emoji}</span>
                <span className="text-[10px] md:text-xs lg:text-sm font-black uppercase leading-tight text-center pointer-events-none w-full truncate px-1 mt-1">
                    {item.label}
                </span>
                </button>
            ))}
            </div>
        )}
      </div>
      
      {isRefining && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-black border-[4px] border-white p-8 animate-pulse shadow-[8px_8px_0_rgba(0,0,0,1)]">
                <h2 className="text-2xl font-black text-white uppercase text-center">
                    GEMINI AI<br/>REFINING...
                </h2>
            </div>
        </div>
      )}
    </div>
  );
};

export default AACBoard;
