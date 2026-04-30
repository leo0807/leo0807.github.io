'use client';

import { useEffect, useState } from 'react';
import type { SiteContent } from '@/content/site';

type VisitorContextProps = {
  copy: SiteContent['blogDetail'];
};

type VisitorSignals = {
  browserLocale: string;
  timeZone: string;
  localTime: string;
  region: string;
};

function deriveRegion(timeZone: string) {
  const prefix = timeZone.split('/')[0] ?? '';

  if (prefix === 'America') return 'Americas';
  if (prefix === 'Europe') return 'Europe';
  if (prefix === 'Asia' || prefix === 'Australia' || prefix === 'Pacific' || prefix === 'Indian') return 'Asia-Pacific';
  if (prefix === 'Africa') return 'Africa';

  return 'Global';
}

export function VisitorContext({ copy }: VisitorContextProps) {
  const [signals, setSignals] = useState<VisitorSignals | null>(null);

  useEffect(() => {
    const browserLocale = navigator.language || navigator.languages?.[0] || 'unknown';
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    const localTime = new Intl.DateTimeFormat(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      second: undefined,
    }).format(new Date());

    setSignals({
      browserLocale,
      timeZone,
      localTime,
      region: deriveRegion(timeZone),
    });
  }, []);

  if (!signals) {
    return null;
  }

  return (
    <section className="surface detail-rail-card">
      <span className="label">{copy.visitor}</span>
      <p>{copy.visitorLead}</p>
      <div className="visitor-grid">
        <div className="visitor-metric">
          <span className="label">{copy.browserLocale}</span>
          <strong>{signals.browserLocale}</strong>
        </div>
        <div className="visitor-metric">
          <span className="label">{copy.timeZone}</span>
          <strong>{signals.timeZone}</strong>
        </div>
        <div className="visitor-metric">
          <span className="label">{copy.localTime}</span>
          <strong>{signals.localTime}</strong>
        </div>
        <div className="visitor-metric">
          <span className="label">{copy.region}</span>
          <strong>{signals.region}</strong>
        </div>
      </div>
      <p className="muted compact">{copy.privacyNote}</p>
    </section>
  );
}
