import { useEffect, useRef, useState } from "react";

type VoiceHandler = (text: string) => void;

export const useVoiceAssistant = (handleVoiceCommand: VoiceHandler) => {
  const recognitionRef = useRef<any>(null);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isAwaitingCommand, setIsAwaitingCommand] = useState(false);

  const [isInitialized, setIsInitialized] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const startListening = async () => {
    const recognition = recognitionRef.current;

    if (!recognition) {
      console.warn("Recognition instance not ready");
      return;
    }

    if (isRunning) {
      console.log("Recognition already running");
      return;
    }

    setIsRunning(true);

    try {
      recognition.start();
      console.log("Speech recognition started");
      setIsInitialized(true);
    } catch (err) {
      console.error("Recognition start failed:", err);
      setIsRunning(false);
    }
  };

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Speech Recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    console.log("Speech recognition initialized");
    recognitionRef.current = recognition;

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      const result = event.results[event.results.length - 1];
      const transcript = result[0].transcript.toLowerCase();

      console.log("Heard:", transcript);

      const wakeWordDetected =
        transcript.includes("hey civic sync") ||
        transcript.includes("civic sync") ||
        transcript.includes("hey civic");

      // Step 1: Wake word detection
      if (wakeWordDetected && !isAwaitingCommand) {
        setIsVoiceActive(true);
        setIsAwaitingCommand(true);

        const reply = new SpeechSynthesisUtterance(
          "Yes, I'm listening. Please describe the issue."
        );
        window.speechSynthesis.speak(reply);

        return;
      }

      // Step 2: Capture the issue description
      if (isAwaitingCommand) {
        const cleanedText = transcript
          .replace("hey civic sync", "")
          .replace("civic sync", "")
          .replace("hey civic", "")
          .trim();

        handleVoiceCommand(cleanedText);

        setIsAwaitingCommand(false);

        setTimeout(() => {
          setIsVoiceActive(false);
        }, 4000);
      }
    };

    recognition.onerror = (event: any) => {
      console.warn("Speech recognition error:", event.error);

      if (event.error === "not-allowed") {
        console.warn("Microphone permission blocked by browser.");
        setIsRunning(false);
        recognition.stop();
        return;
      }

      // Chrome often fires this when silence occurs
      if (event.error === "no-speech") {
        try {
          recognition.stop();
          recognition.start();
        } catch {}
        return;
      }

      // Microphone unavailable
      if (event.error === "audio-capture") {
        console.warn("Microphone not detected or permission denied.");
      }
    };

    recognition.onend = () => {
      console.log("Recognition ended.");
      setIsRunning(false);
    };

    return () => {
      recognition.stop();
    };
  }, []);

  return {
    isVoiceActive,
    isAwaitingCommand,
    startListening,
  };
};