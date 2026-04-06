import { useEffect, useMemo, useRef, useState } from "react";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import track1 from "../assets/audio/track1.mp3";
import track2 from "../assets/audio/track2.mp3";
import track3 from "../assets/audio/track3.mp3";
import cover1 from "../assets/images/cover-1.jpg";
import cover2 from "../assets/images/cover-2.jpg";
import cover3 from "../assets/images/cover-3.jpg";

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function MediaApp() {
  const audioRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const playlist = useMemo(
    () => [
      {
        title: "Track 1",
        artist: "Local Audio",
        src: track1,
        cover: cover1,
      },
      {
        title: "Track 2",
        artist: "Local Audio",
        src: track2,
        cover: cover2,
      },
      {
        title: "Track 3",
        artist: "Local Audio",
        src: track3,
        cover: cover3,
      },
    ],
    []
  );

  const currentTrack = playlist[currentIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    function handleTimeUpdate() {
      setProgress(audio.currentTime);
    }

    function handleLoaded() {
      setDuration(audio.duration || 0);
    }

    function handleEnded() {
      goNext();
    }

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoaded);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoaded);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isPlaying, currentIndex]);

  function togglePlay() {
    setIsPlaying((prev) => !prev);
  }

  function goPrev() {
    setCurrentIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
    setProgress(0);
  }

  function goNext() {
    setCurrentIndex((prev) => (prev + 1) % playlist.length);
    setProgress(0);
  }

  function handleSeek(e) {
    const value = Number(e.target.value);
    setProgress(value);

    if (audioRef.current) {
      audioRef.current.currentTime = value;
    }
  }

  function selectTrack(index) {
    setCurrentIndex(index);
    setProgress(0);
    setIsPlaying(true);
  }

  return (
    <div className="app-shell media-app">
      <div className="app-glitch-overlay" />

      <audio ref={audioRef} src={currentTrack.src} />

      <div className="media-stage">
        <div className={`media-disc-wrap ${isPlaying ? "spinning" : ""}`}>
          <div className="media-disc-shadow" />
          <img className="media-disc" src={currentTrack.cover} alt={currentTrack.title} />
          <div className="media-disc-center" />
        </div>

        <div className="media-track-info">
          <div className="media-title">{currentTrack.title}</div>
          <div className="media-artist">{currentTrack.artist}</div>
        </div>

        <div className="media-controls">
          <button type="button" className="media-control-btn" onClick={goPrev}>
            <SkipBack size={18} />
          </button>

          <button type="button" className="media-play-btn" onClick={togglePlay}>
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>

          <button type="button" className="media-control-btn" onClick={goNext}>
            <SkipForward size={18} />
          </button>
        </div>

        <div className="media-timeline">
          <span>{formatTime(progress)}</span>

          <input
            className="media-range"
            type="range"
            min="0"
            max={duration || 0}
            step="0.01"
            value={progress}
            onChange={handleSeek}
          />

          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="media-playlist">
        {playlist.map((track, index) => (
          <button
            key={track.title}
            type="button"
            className={`media-track ${index === currentIndex ? "active" : ""}`}
            onClick={() => selectTrack(index)}
          >
            <img src={track.cover} alt={track.title} className="media-track-thumb" />
            <div className="media-track-meta">
              <span>{track.title}</span>
              <span>{track.artist}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}