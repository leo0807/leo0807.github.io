'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { Track } from '@/content/site';
import type { SiteContent } from '@/content/site';

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return '00:00';
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');
  return `${mins}:${secs}`;
}

export function MusicPlayer({ tracks, copy }: { tracks: Track[]; copy: SiteContent['music'] }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const track = tracks[trackIndex];
  const progressPercent = useMemo(() => {
    if (!duration) return 0;
    return (progress / duration) * 100;
  }, [duration, progress]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.src = track.file;
    audio.load();
    setProgress(0);
    setDuration(0);
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

    const syncTime = () => setProgress(audio.currentTime);
    const syncMeta = () => setDuration(audio.duration || 0);
    const handleEnd = () => {
      setTrackIndex((current) => (current + 1) % tracks.length);
      setProgress(0);
    };

    audio.addEventListener('timeupdate', syncTime);
    audio.addEventListener('loadedmetadata', syncMeta);
    audio.addEventListener('ended', handleEnd);

    return () => {
      audio.removeEventListener('timeupdate', syncTime);
      audio.removeEventListener('loadedmetadata', syncMeta);
      audio.removeEventListener('ended', handleEnd);
    };
  }, [tracks.length]);

  return (
    <section className="surface music-card music-card--sticky" aria-labelledby="soundtrack-title">
      <div className="music-layout music-layout--compact">
        <img className="music-cover" src={track.cover} alt={track.title} loading="eager" decoding="async" />
        <div className="music-copy">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h3 id="soundtrack-title">{copy.title}</h3>
          <p className="muted">
            {track.artist} · {track.title}
          </p>
        </div>
        <div className="music-controls">
          <button
            type="button"
            className="button button-secondary button-chip"
            onClick={() => setTrackIndex((current) => (current - 1 + tracks.length) % tracks.length)}
          >
            {copy.prev}
          </button>
          <button
            type="button"
            className="button button-primary button-chip"
            onClick={() => {
              setIsPlaying((current) => !current);
            }}
          >
            {isPlaying ? copy.pause : copy.play}
          </button>
          <button
            type="button"
            className="button button-secondary button-chip"
            onClick={() => setTrackIndex((current) => (current + 1) % tracks.length)}
          >
            {copy.next}
          </button>
        </div>
      </div>
      <div className="music-footer">
        <label className="progress-stack">
          <span className="muted">
            {formatTime(progress)} / {formatTime(duration)}
          </span>
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={progress}
            onChange={(event) => {
              const nextProgress = Number(event.target.value);
              setProgress(nextProgress);
              if (audioRef.current) {
                audioRef.current.currentTime = nextProgress;
              }
            }}
          />
        </label>
        <div className="progress-bar">
          <span style={{ width: `${progressPercent}%` }} />
        </div>
        <p className="music-note">{copy.note}</p>
      </div>
      <audio ref={audioRef} preload="metadata" />
    </section>
  );
}
