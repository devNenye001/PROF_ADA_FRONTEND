import React, { useEffect, useState } from "react";
import { Play, Pause } from "lucide-react";

interface AudioBubbleProps {
  text?: string;
  isLoading?: boolean;
}

export const AudioBubble: React.FC<AudioBubbleProps> = ({
  text,
  isLoading = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Stop speaking when the component is unmounted
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 mt-2 text-slate-500 text-sm">
        <div className="flex gap-1">
          <div className="w-1 h-4 bg-orange-400 rounded-full animate-pulse" />
          <div className="w-1 h-4 bg-orange-400 rounded-full animate-pulse delay-100" />
          <div className="w-1 h-4 bg-orange-400 rounded-full animate-pulse delay-200" />
        </div>
        <span>Generating audio...</span>
      </div>
    );
  }

  if (!text) {
    return null;
  }

  const togglePlayPause = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      // Cancel any ongoing speech first
      window.speechSynthesis.cancel();

      // Clean up markdown formatting to make reading smoother
      const cleanText = text
        .replace(/(\*\*|__)(.*?)\1/g, "$2") // bold
        .replace(/(\*|_)(.*?)\1/g, "$2")   // italic
        .replace(/`([^`]+)`/g, "$1")         // inline code
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // links
        .replace(/#+\s+/g, "")               // headers
        .replace(/-\s+/g, "");               // bullet points

      const utterance = new SpeechSynthesisUtterance(cleanText);

      // Attempt to find a natural English voice
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(
        (voice) =>
          voice.lang.startsWith("en-") &&
          (voice.name.includes("Google") ||
            voice.name.includes("Natural") ||
            voice.name.includes("Samantha") ||
            voice.name.includes("Zira") ||
            voice.name.includes("Premium"))
      ) || voices.find((voice) => voice.lang.startsWith("en"));

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onend = () => {
        setIsPlaying(false);
      };

      utterance.onerror = () => {
        setIsPlaying(false);
      };

      setIsPlaying(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="flex items-center gap-3 mt-3 bg-slate-50 border border-slate-100 p-3 max-w-xs rounded-xl shadow-sm">
      <button
        onClick={togglePlayPause}
        className="flex-shrink-0 p-2 rounded-full hover:bg-white border border-transparent hover:border-slate-200 transition-colors bg-white shadow-sm"
        title={isPlaying ? "Stop" : "Play"}
      >
        {isPlaying ? (
          <Pause size={14} className="text-orange-600" />
        ) : (
          <Play size={14} className="text-orange-600 ml-0.5" />
        )}
      </button>

      {/* Waveform visualization */}
      <div className="flex-1 flex items-center gap-1 h-6">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={`flex-1 bg-gradient-to-t from-orange-500 to-amber-400 rounded-sm transition-all duration-100 ${
              isPlaying ? "animate-pulse" : ""
            }`}
            style={{
              height: `${25 + ((i * 7 + 13) % 60)}%`,
              opacity: isPlaying ? 0.9 : 0.3,
              animationDelay: isPlaying ? `${i * 80}ms` : undefined,
            }}
          />
        ))}
      </div>

      <div className="text-[10px] font-medium text-slate-500 whitespace-nowrap bg-white px-2 py-1 rounded-md border border-slate-200 select-none">
        {isPlaying ? "Speaking" : "Listen"}
      </div>
    </div>
  );
};

export default AudioBubble;
