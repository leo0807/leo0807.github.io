import Link from 'next/link';
import type { Project } from '@/content/projects';
import type { Locale } from '@/lib/i18n';
import { localizedPath } from '@/lib/i18n';

type ProjectCardProps = {
  project: Project;
  locale: Locale;
  active?: boolean;
  onHover?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
};

export function ProjectCard({ project, locale, active = false, onHover, onFocus, onBlur }: ProjectCardProps) {
  const tech = project.tech.slice(0, 3);
  const metricCount = project.metrics?.length ?? 0;

  return (
    <article className={`surface project-card${active ? ' project-card--active' : ''}`}>
      <Link
        href={localizedPath(locale, `/projects/${project.slug}/`)}
        onMouseEnter={onHover}
        onFocus={onFocus}
        onBlur={onBlur}
      >
        <div className="project-card__frame">
          <img src={project.image} alt={project.title} loading="lazy" decoding="async" />
          <div className="project-card__copy">
            <span className="project-tag">{project.tag}</span>
            <h3>{project.title}</h3>
            <p>{project.summary}</p>
            <div className="project-card__meta">
              <span className="project-card__meta-item">
                <strong>{tech.length}</strong>
                <small>{locale === 'zh' ? '主技术' : 'core tech'}</small>
              </span>
              <span className="project-card__meta-item">
                <strong>{metricCount}</strong>
                <small>{locale === 'zh' ? '指标' : 'metrics'}</small>
              </span>
            </div>
            <div className="project-card__chips" aria-label={locale === 'zh' ? '技术标签' : 'Technology tags'}>
              {tech.map((item) => (
                <span key={item} className="project-card__chip">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
