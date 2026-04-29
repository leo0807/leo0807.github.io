'use client';

import { useEffect, useState } from 'react';

type ThemeMode = 'day' | 'night';

const storageKey = 'portfolio-theme';

function applyTheme(mode: ThemeMode) {
  const root = document.documentElement;
  root.dataset.theme = mode;
  root.style.colorScheme = mode === 'day' ? 'light' : 'dark';
}

function readThemeMode(): ThemeMode {
  if (typeof document === 'undefined') {
    return 'night';
  }

  const stored = window.localStorage.getItem(storageKey);
  if (stored === 'day' || stored === 'night') {
    return stored;
  }

  return document.documentElement.dataset.theme === 'day' ? 'day' : 'night';
}

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>('night');

  useEffect(() => {
    const nextMode = readThemeMode();
    setThemeMode(nextMode);
    applyTheme(nextMode);
    setMounted(true);

    const syncFromStorage = (event: StorageEvent) => {
      if (event.key !== storageKey) return;
      if (event.newValue !== 'day' && event.newValue !== 'night') return;
      setThemeMode(event.newValue);
      applyTheme(event.newValue);
    };

    window.addEventListener('storage', syncFromStorage);

    return () => window.removeEventListener('storage', syncFromStorage);
  }, []);

  if (!mounted) {
    return null;
  }

  const nextMode: ThemeMode = themeMode === 'day' ? 'night' : 'day';
  const icon = nextMode === 'day' ? '☼' : '☾';

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label={`Switch to ${nextMode} mode`}
      title={`Switch to ${nextMode} mode`}
      onClick={() => {
        setThemeMode(nextMode);
        applyTheme(nextMode);
        window.localStorage.setItem(storageKey, nextMode);
      }}
    >
      <span aria-hidden="true">{icon}</span>
    </button>
  );
}
