import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { ProcessFlow } from "@/components/ProcessFlow";
import { CivicResponsibilities } from "@/components/CivicResponsibilities";
import useVoiceAssistant from '../hooks/useVoiceAssistant';
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";

const CivicDashboard = () => {
  const navigate = useNavigate();

  const [heardText, setHeardText] = useState<string>("");
  const [locationText, setLocationText] = useState<string>("");
  const [showVoicePopup, setShowVoicePopup] = useState(false);

  const { listening: isVoiceActive } = useVoiceAssistant();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <button
          className="fixed bottom-8 right-8 z-40 bg-primary text-white p-4 rounded-full shadow-lg hover:scale-105 transition"
          title="Voice Assistant"
          onClick={() => {
            const msg = new SpeechSynthesisUtterance(
              "Voice assistant activated. Say Hey Civic Sync to report an issue."
            );
            window.speechSynthesis.speak(msg);
          }}
        >
          🎤
        </button>
        {isVoiceActive && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-primary text-primary-foreground px-6 py-3 rounded-full shadow-xl flex items-center gap-3 animate-pulse">
            <span className="font-bold">🎤 Listening...</span>
          </div>
        )}

        {showVoicePopup && (
          <div className="fixed bottom-10 right-10 z-50 bg-white text-black w-80 p-5 rounded-xl shadow-2xl border">
            <div className="font-semibold text-lg mb-2">CivicSync Assistant</div>

            <div className="text-sm text-gray-500 mb-1">Heard:</div>
            <div className="bg-gray-100 p-2 rounded mb-3 text-sm">
              {heardText || "Listening..."}
            </div>

            <div className="text-sm text-gray-500 mb-1">Location:</div>
            <div className="bg-gray-100 p-2 rounded text-sm">
              {locationText || "Fetching location..."}
            </div>

            <div className="text-xs text-gray-400 mt-3">
              Preparing your report...
            </div>
          </div>
        )}

        <HeroSection />
        
        <ProcessFlow />
        <CivicResponsibilities />
      </main>
    </div>
  );
};

export default CivicDashboard;