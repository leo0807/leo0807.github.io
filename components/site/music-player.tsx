'use client';

import { useEffect, useRef, useState } from 'react';
import type { SiteContent, Track } from '@/content/site';

const DEFAULT_VOLUME = 0.72;

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return '0:00';
  }

  const totalSeconds = Math.floor(seconds);
  const minutes = Math.floor(totalSeconds / 60);
  const remainder = totalSeconds % 60;
  return `${minutes}:${String(remainder).padStart(2, '0')}`;
}

function Icon({
  name,
}: {
  name: 'play' | 'pause' | 'prev' | 'next' | 'volume' | 'close' | 'sound';
}) {
  switch (name) {
    case 'play':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8 5.5v13l10-6.5-10-6.5Z" />
        </svg>
      );
    case 'pause':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7 5.5h3.5v13H7v-13Zm6.5 0H17v13h-3.5v-13Z" />
        </svg>
      );
    case 'prev':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7 6v12H5V6h2Z" />
          <path d="M17.5 18.5 9 12l8.5-6.5v13Z" />
        </svg>
      );
    case 'next':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M17 6v12h2V6h-2Z" />
          <path d="M6.5 18.5 15 12 6.5 5.5v13Z" />
        </svg>
      );
    case 'volume':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 10v4h4l5 4V6L8 10H4Z" />
          <path d="M16.5 8.5a4.5 4.5 0 0 1 0 7" />
          <path d="M18.8 6.2a8 8 0 0 1 0 11.6" />
        </svg>
      );
    case 'close':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6.7 5.3 5.3 6.7 10.6 12l-5.3 5.3 1.4 1.4L12 13.4l5.3 5.3 1.4-1.4L13.4 12l5.3-5.3-1.4-1.4L12 10.6 6.7 5.3Z" />
        </svg>
      );
    case 'sound':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 10v4h3l4 3V7L8 10H5Z" />
        </svg>
      );
  }
}

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
  const [isExpanded, setIsExpanded] = useState(false);
  const [volume, setVolume] = useState(DEFAULT_VOLUME);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const track = tracks[trackIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.src = track.file;
    audio.currentTime = 0;
    audio.volume = volume;
    audio.load();
    setCurrentTime(0);
    setDuration(0);

    if (isPlaying) {
      void audio.play().catch(() => {
        setIsPlaying(false);
      });
    }
  }, [track.file, isPlaying, volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      void audio.play().catch(() => {
        setIsPlaying(false);
      });
      return;
    }

    audio.pause();
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnd = () => {
      setTrackIndex((current) => (current + 1) % tracks.length);
      setIsExpanded(true);
      setIsPlaying(true);
    };

    audio.addEventListener('ended', handleEnd);

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setCurrentTime(audio.currentTime || 0);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime || 0);
      setDuration(audio.duration || 0);
    };

    const handleDurationChange = () => {
      setDuration(audio.duration || 0);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);

    return () => {
      audio.removeEventListener('ended', handleEnd);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
    };
  }, [tracks.length]);

  const goToTrack = (direction: 1 | -1) => {
    setTrackIndex((current) => (current + direction + tracks.length) % tracks.length);
    setIsExpanded(true);
  };

  const progress = duration > 0 ? Math.min(currentTime / duration, 1) : 0;
  const seek = (value: number) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(duration) || duration <= 0) return;

    const clamped = Math.min(Math.max(value, 0), 1);
    audio.currentTime = duration * clamped;
    setCurrentTime(audio.currentTime);
  };

  return (
    <div className={`music-player ${isExpanded ? 'music-player--open' : ''}`}>
      <button
        type="button"
        className={`music-cd ${isPlaying ? 'music-cd--playing' : ''}`}
        aria-label={`${isExpanded ? copy.collapse : copy.expand} ${track.title}`}
        aria-expanded={isExpanded}
        title={`${track.artist} · ${track.title}`}
        onClick={() => {
          setIsExpanded(true);
          setIsPlaying((current) => !current);
        }}
      >
        <span className="music-cd__disc">
          <img className="music-cd__art" src={track.cover} alt="" aria-hidden="true" loading="eager" decoding="async" />
          <span className="music-cd__label" aria-hidden="true" />
        </span>
        <span className="music-cd__status" aria-hidden="true">
          <Icon name={isPlaying ? 'pause' : 'play'} />
        </span>
        <span className="sr-only">{isPlaying ? copy.pause : copy.play} {track.title}</span>
      </button>

      <div className="music-panel surface" hidden={!isExpanded}>
        <div className="music-panel__header">
          <div className="music-panel__glyphs">
            <span className="music-panel__cover">
              <img src={track.cover} alt="" loading="eager" decoding="async" />
            </span>
            <div className="music-panel__meta">
              <span className="music-panel__eyebrow">{copy.eyebrow}</span>
              <strong>{track.title}</strong>
              <span>{track.artist}</span>
            </div>
            <span className={`music-panel__signal ${isPlaying ? 'music-panel__signal--live' : ''}`} aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </span>
          </div>
          <button type="button" className="music-panel__close" aria-label={copy.collapse} onClick={() => setIsExpanded(false)}>
            <Icon name="close" />
          </button>
        </div>

        <p className="music-panel__note">{copy.note}</p>

        <div className="music-panel__timeline">
          <div className="music-panel__time">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <input
            className="music-panel__progress"
            type="range"
            min="0"
            max="1"
            step="0.001"
            value={progress}
            onChange={(event) => seek(Number(event.target.value))}
            aria-label={`${track.title} progress`}
          />
        </div>

        <div className="music-panel__controls" role="group" aria-label={track.title}>
          <button type="button" className="music-panel__control" aria-label={copy.prev} onClick={() => goToTrack(-1)}>
            <Icon name="prev" />
          </button>
          <button
            type="button"
            className="music-panel__control music-panel__control--primary"
            aria-label={isPlaying ? `${copy.pause} ${track.title}` : `${copy.play} ${track.title}`}
            onClick={() => setIsPlaying((current) => !current)}
          >
            <Icon name={isPlaying ? 'pause' : 'play'} />
          </button>
          <button type="button" className="music-panel__control" aria-label={copy.next} onClick={() => goToTrack(1)}>
            <Icon name="next" />
          </button>
        </div>

        <label className="music-panel__volume">
          <span className="music-panel__volume-icon" aria-hidden="true">
            <Icon name="volume" />
          </span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(event) => setVolume(Number(event.target.value))}
            aria-label={copy.volume}
          />
        </label>

        <audio ref={audioRef} preload="metadata" />
      </div>
    </div>
  );
}
