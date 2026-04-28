import Link from 'next/link';
import { ProjectCard } from '@/components/site/project-card';
import { SectionHeading } from '@/components/site/section-heading';
import type { Project, ProjectDocument } from '@/content/projects';
import type { SiteContent, SiteConfig } from '@/content/site';
import type { Locale } from '@/lib/i18n';
import { localizedPath } from '@/lib/i18n';

type ProjectIndexPageProps = {
  locale: Locale;
  siteConfig: SiteConfig;
  content: SiteContent;
  projects: Project[];
};

type ProjectDetailPageProps = {
  locale: Locale;
  content: SiteContent;
  project: ProjectDocument;
  relatedProjects: Project[];
};

export function ProjectIndexPage({ locale, content, projects }: ProjectIndexPageProps) {
  return (
    <main className="subpage-shell">
      <section className="surface subpage-hero">
        <SectionHeading eyebrow={content.projectsIndex.eyebrow} title={content.projectsIndex.title} />
        <p className="lead compact">{content.projectsIndex.lead}</p>
      </section>
      <section className="project-grid">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} locale={locale} />
        ))}
      </section>
    </main>
  );
}

export function ProjectDetailPage({ locale, content, project, relatedProjects }: ProjectDetailPageProps) {

  return (
    <main className="subpage-shell">
      <section className="project-detail__layout">
        <article className="surface project-detail">
          <div className="project-detail__media">
            <img src={project.image} alt={project.title} loading="eager" decoding="async" />
          </div>
          <div className="project-detail__body">
            <p className="eyebrow">{project.tag}</p>
            <h1>{project.title}</h1>
            <p className="lead compact">{project.summary}</p>
            <div className="button-row">
              <a className="button button-primary" href={project.liveUrl} target="_blank" rel="noreferrer">
                {content.projectDetail.visit}
              </a>
              {project.repoUrl ? (
                <a className="button button-secondary" href={project.repoUrl} target="_blank" rel="noreferrer">
                  {content.projectDetail.source}
                </a>
              ) : null}
              <Link className="button button-secondary" href={localizedPath(locale, '/projects/')}>
                {content.projectDetail.back}
              </Link>
            </div>
            <div className="project-detail__overview">
              <span className="label">{content.projectDetail.overview}</span>
              <div className="meta-grid">
                <div>
                  <span className="label">{content.projectDetail.role}</span>
                  <p>{project.role}</p>
                </div>
                <div>
                  <span className="label">{content.projectDetail.focus}</span>
                  <p>{project.focus}</p>
                </div>
              </div>
            </div>
            {project.metrics?.length ? (
              <div className="metric-grid">
                {project.metrics.map((metric) => (
                  <article key={metric.label} className="surface metric-card">
                    <span className="label">{metric.label}</span>
                    <strong>{metric.value}</strong>
                    <p>{metric.detail}</p>
                  </article>
                ))}
              </div>
            ) : null}
            <div className="pill-grid">
              {project.tech.map((item) => (
                <span key={item} className="pill">
                  {item}
                </span>
              ))}
            </div>
            <div className="project-mdx">{project.content}</div>
          </div>
        </article>

        <aside className="project-detail__rail">
          <section className="surface detail-rail-card">
            <span className="label">{content.projectDetail.overview}</span>
            <p>{project.summary}</p>
            <div className="detail-rail-card__stack">
              <div>
                <span className="label">{content.projectDetail.role}</span>
                <strong>{project.role}</strong>
              </div>
              <div>
                <span className="label">{content.projectDetail.focus}</span>
                <strong>{project.focus}</strong>
              </div>
            </div>
          </section>

          <section className="surface detail-rail-card">
            <span className="label">{content.projectDetail.related}</span>
            <p>{content.projectDetail.relatedLead}</p>
            <div className="related-list">
              {relatedProjects.map((item) => (
                <Link key={item.slug} className="related-card" href={localizedPath(locale, `/projects/${item.slug}/`)}>
                  <img src={item.image} alt={item.title} loading="lazy" decoding="async" />
                  <div>
                    <span className="project-tag">{item.tag}</span>
                    <strong>{item.title}</strong>
                    <p>{item.summary}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </aside>
      </section>
    </main>
  );
}
