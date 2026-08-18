import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mic, MicOff, Volume2 } from "lucide-react";

const COMMANDS = [
  { keys: ["report", "complaint", "new complaint", "file a complaint"], path: "/citizen/report", say: "Opening the complaint form." },
  { keys: ["track", "status", "my complaints"], path: "/citizen/track", say: "Opening your complaint tracker." },
  { keys: ["faq", "help", "questions"], path: "/faq", say: "Opening frequently asked questions." },
  { keys: ["home", "dashboard"], path: "/citizen", say: "Opening your dashboard." },
  { keys: ["map", "risk map", "flood map"], path: "/citizen/map", say: "Opening the flood risk map." },
];

export default function VoiceAssistant() {
  const navigate = useNavigate();
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-IN";

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript.toLowerCase();
      setTranscript(text);
      handleCommand(text);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognitionRef.current = recognition;
  }, []);

  function speak(text) {
    if (!window.speechSynthesis) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1;
    window.speechSynthesis.speak(utter);
  }

  function handleCommand(text) {
    const match = COMMANDS.find((c) => c.keys.some((k) => text.includes(k)));
    if (match) {
      speak(match.say);
      navigate(match.path);
    } else {
      speak("Sorry, I didn't catch a command. Try saying report, track, F A Q, or map.");
    }
  }

  function toggleListening() {
    if (!supported) {
      speak("Voice recognition is not supported in this browser. Try Chrome on desktop or Android.");
      return;
    }
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      setTranscript("");
      recognitionRef.current.start();
      setListening(true);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2">
      {transcript && (
        <div className="card px-3.5 py-2 text-xs text-subink max-w-[220px] shadow-pop">
          "{transcript}"
        </div>
      )}
      <button
        onClick={toggleListening}
        title="Voice assistant: say 'report', 'track', 'FAQ' or 'map'"
        className={`h-14 w-14 rounded-full shadow-pop flex items-center justify-center transition-all ${
          listening ? "bg-danger-500 text-white pulse-dot" : "bg-teal-500 text-white hover:bg-teal-600"
        }`}
      >
        {listening ? <MicOff size={22} /> : <Mic size={22} />}
      </button>
    </div>
  );
}

export function ReadAloudButton({ text, className = "" }) {
  function speak() {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utter);
  }
  return (
    <button onClick={speak} className={`btn-ghost !px-3 !py-1.5 text-xs ${className}`} type="button">
      <Volume2 size={14} /> Read aloud
    </button>
  );
}
