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
    <details className="surface detail-rail-card detail-rail-card--compact visitor-context">
      <summary className="visitor-summary">
        <span className="label">{copy.visitor}</span>
        <span className="visitor-summary__hint">{copy.visitorLead}</span>
      </summary>

      <div className="visitor-context__body">
        <div className="visitor-list">
          <div className="visitor-metric">
            <span>{copy.browserLocale}</span>
            <strong>{signals.browserLocale}</strong>
          </div>
          <div className="visitor-metric">
            <span>{copy.timeZone}</span>
            <strong>{signals.timeZone}</strong>
          </div>
          <div className="visitor-metric">
            <span>{copy.localTime}</span>
            <strong>{signals.localTime}</strong>
          </div>
          <div className="visitor-metric">
            <span>{copy.region}</span>
            <strong>{signals.region}</strong>
          </div>
        </div>
        <p className="muted compact">{copy.privacyNote}</p>
      </div>
    </details>
  );
}
