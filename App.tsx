
import React, { useState } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import MainWelcomePage from './components/MainWelcomePage';
import MedicalSignInPage from './components/MedicalSignInPage';
import SignInPage from './components/SignInPage';
import DashboardPage from './components/DashboardPage';
import AACBoard from './components/AACBoard';
import { View } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.MEDICAL_WELCOME);
  const [autoLaunchVisionPal, setAutoLaunchVisionPal] = useState(false);

  const renderContent = () => {
    switch (view) {
      case View.MEDICAL_WELCOME:
        return <MainWelcomePage onNext={() => setView(View.MEDICAL_SIGNIN)} />;

      case View.MEDICAL_SIGNIN:
        return (
          <MedicalSignInPage 
            onNext={() => {
              setAutoLaunchVisionPal(false);
              setView(View.DASHBOARD);
            }} 
            onVisionPal={() => {
              setAutoLaunchVisionPal(true);
              setView(View.DASHBOARD);
            }}
          />
        );

      case View.DASHBOARD:
        return (
          <DashboardPage 
            onOpenAAC={() => setView(View.WELCOME)} 
            defaultOpenVisionPal={autoLaunchVisionPal}
          />
        );

      case View.WELCOME:
        return <WelcomeScreen onStart={() => setView(View.SIGNIN)} />;
      
      case View.SIGNIN:
        return <SignInPage onNext={() => setView(View.AAC_BOARD)} />;
      
      case View.AAC_BOARD:
        return (
            <div className="min-h-screen bg-[#004DA0] blueprint-grid text-white overflow-hidden flex flex-col">
                {/* Top Bar */}
                <div className="w-full bg-black/40 p-2 flex justify-between items-center border-b-[4px] border-white/20">
                    <span className="font-black text-white/50 uppercase tracking-widest text-xs pl-2">OCEAN WAVE TERMINAL</span>
                    <button 
                        onClick={() => setView(View.DASHBOARD)}
                        className="px-4 py-1 bg-red-600 text-white text-xs font-bold border-[2px] border-white/50"
                    >
                        EXIT
                    </button>
                </div>
                <div className="flex-grow overflow-hidden">
                    <AACBoard />
                </div>
            </div>
        );

      default:
        return <MainWelcomePage onNext={() => setView(View.MEDICAL_SIGNIN)} />;
    }
  };

  return (
    <>
      {renderContent()}
      <style>{`
        .blueprint-grid {
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .talking-active {
            animation: speaking-pulse 1s infinite;
        }
        @keyframes speaking-pulse {
            0% { background-color: #004DA0; }
            50% { background-color: #00A0FF; }
            100% { background-color: #004DA0; }
        }
      `}</style>
    </>
  );
};

export default App;
