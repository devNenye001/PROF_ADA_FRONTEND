import React, { useEffect, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";

interface AudioBubbleProps {
  audioUrl?: string;
  isLoading?: boolean;
}

export const AudioBubble: React.FC<AudioBubbleProps> = ({
  audioUrl,
  isLoading = false,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

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

  if (!audioUrl) {
    return null;
  }

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex items-center gap-3 mt-3 bg-slate-50 border border-slate-100 p-3 max-w-xs rounded-xl shadow-sm">
      <button
        onClick={togglePlayPause}
        className="flex-shrink-0 p-2 rounded-full hover:bg-white border border-transparent hover:border-slate-200 transition-colors bg-white shadow-sm"
        title={isPlaying ? "Pause" : "Play"}
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
            className="flex-1 bg-gradient-to-t from-orange-500 to-amber-400 rounded-sm transition-all duration-100"
            style={{
              height: `${Math.random() * 70 + 30}%`,
              opacity: progressPercent > (i / 12) * 100 ? 0.9 : 0.3,
            }}
          />
        ))}
      </div>

      <div className="text-[10px] font-medium text-slate-500 whitespace-nowrap bg-white px-2 py-1 rounded-md border border-slate-200">
        {Math.floor(currentTime)}s / {Math.floor(duration)}s
      </div>

      <audio
        ref={audioRef}
        src={audioUrl}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
    </div>
  );
};

export default AudioBubble;
