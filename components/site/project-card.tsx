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
  return (
    <article className={`surface project-card${active ? ' project-card--active' : ''}`}>
      <Link
        href={localizedPath(locale, `/projects/${project.slug}/`)}
        onMouseEnter={onHover}
        onFocus={onFocus}
        onBlur={onBlur}
      >
        <img src={project.image} alt={project.title} loading="lazy" decoding="async" />
        <div className="project-card__copy">
          <span className="project-tag">{project.tag}</span>
          <h3>{project.title}</h3>
          <p>{project.summary}</p>
        </div>
      </Link>
    </article>
  );
}
