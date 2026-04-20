import { useEffect, useRef, useState } from "react";

const wakeWords = ["hey civicsync", "hello civicsync", "hi civicsync"];

export default function useVoiceAssistant() {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const startListening = () => {
    console.log("🚀 startListening CALLED");
    const SpeechRecognition =
      (window as any).webkitSpeechRecognition ||
      (window as any).SpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Speech Recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-IN";

    recognition.onstart = () => {
      console.log("🎤 Listening started");
      setListening(true);
    };

    recognition.onaudiostart = () => {
      console.log("🎧 Audio capturing started");
    };

    recognition.onspeechstart = () => {
      console.log("🗣️ Speech detected");
    };

    recognition.onresult = async (event: any) => {
      console.log("✅ RESULT EVENT FIRED");
      const transcript =
        event.results[event.results.length - 1][0].transcript.toLowerCase();

      console.log("Heard:", transcript);

      const isWakeWord = wakeWords.some(word =>
        transcript.includes(word)
      );

      if (isWakeWord) {
        speak("Yes, how can I help?");
        return;
      }

      if (listening) {
        const response = await fetchResponse(transcript);
        speak(response);
      }
    };

    recognition.onerror = (e: any) => {
      console.error("Speech error:", e);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const fetchResponse = async (query: string) => {
    const res = await fetch("https://civicsync-so4u.onrender.com/api/voice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    const data = await res.json();
    return data.reply;
  };

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-IN";
    window.speechSynthesis.speak(utterance);
  };

  return { listening, startListening };
}