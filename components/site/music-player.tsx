'use client';

import { useEffect, useRef, useState } from 'react';
import type { Track } from '@/content/site';
import type { SiteContent } from '@/content/site';

export function MusicPlayer({
  tracks,
  copy,
}: {
  tracks: Track[];
  copy: SiteContent['music'];
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const track = tracks[trackIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.src = track.file;
    audio.load();
  }, [track.file]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      void audio.play();
      return;
    }

    audio.pause();
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnd = () => {
      setTrackIndex((current) => (current + 1) % tracks.length);
    };

    audio.addEventListener('ended', handleEnd);

    return () => {
      audio.removeEventListener('ended', handleEnd);
    };
  }, [tracks.length]);

  return (
    <button
      type="button"
      className={`music-cd ${isPlaying ? 'music-cd--playing' : ''}`}
      aria-label={`${isPlaying ? copy.pause : copy.play} ${track.title}`}
      title={`${track.artist} · ${track.title}`}
      onClick={() => {
        setIsPlaying((current) => !current);
      }}
    >
      <span className="music-cd__disc">
        <img className="music-cd__art" src={track.cover} alt="" aria-hidden="true" loading="eager" decoding="async" />
        <span className="music-cd__label" aria-hidden="true" />
      </span>
      <span className="sr-only">
        {isPlaying ? copy.pause : copy.play} {track.title}
      </span>
      <audio ref={audioRef} preload="metadata" />
    </button>
  );
}
