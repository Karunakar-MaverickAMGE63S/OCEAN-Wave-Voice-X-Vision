
import React from 'react';

interface HardwareButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'blue' | 'red' | 'white' | 'glass';
  className?: string;
  largeText?: boolean;
  ariaLabel?: string;
}

const HardwareButton: React.FC<HardwareButtonProps> = ({ 
  onClick, 
  children, 
  variant = 'blue', 
  className = '',
  largeText = false,
  ariaLabel
}) => {
  const baseStyles = "border-[4px] md:border-[6px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-75 font-black uppercase flex items-center justify-center overflow-hidden touch-manipulation";
  
  const variants = {
    blue: "bg-[#004DA0] text-white",
    red: "bg-[#FF3B30] text-white",
    // Changed "white" variant to actually be black background with white text to satisfy "font should be white"
    white: "bg-black text-white",
    glass: "bg-white/20 backdrop-blur-xl border-white text-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] md:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.2)]",
  };

  // Increased font scale: text-sm -> text-base, text-lg -> text-xl, text-4xl -> text-5xl
  return (
    <button 
      onClick={onClick}
      aria-label={ariaLabel}
      className={`${baseStyles} ${variants[variant]} ${largeText ? 'text-2xl sm:text-3xl md:text-5xl' : 'text-base sm:text-xl md:text-2xl'} ${className}`}
    >
      {children}
    </button>
  );
};

export default HardwareButton;