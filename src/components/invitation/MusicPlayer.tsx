"use client";

import { useEffect, useRef, useState } from "react";
import { Music, Pause } from "lucide-react";

interface Props {
  url: string | null;
  autoPlay?: boolean;
}

export default function MusicPlayer({ url, autoPlay = false }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!url || !audioRef.current) return;
    if (autoPlay) {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => {
        // browser blocked autoplay – wait for user interaction
      });
    }
  }, [url, autoPlay]);

  if (!url) return null;

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
  };

  return (
    <>
      <audio ref={audioRef} src={url} loop preload="auto" />
      <button
        onClick={toggle}
        className="music-btn"
        aria-label={playing ? "Pause music" : "Play music"}
      >
        {playing ? <Pause size={20} /> : <Music size={20} />}
      </button>
    </>
  );
}
