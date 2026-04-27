'use client';

import { useMemo, useState } from 'react';
import type { Project } from '@/content/projects';
import type { SiteContent } from '@/content/site';
import type { Locale } from '@/lib/i18n';
import { ProjectCard } from '@/components/site/project-card';

type ProjectBrowserProps = {
  locale: Locale;
  content: SiteContent;
  projects: Project[];
};

export function ProjectBrowser({ locale, content, projects }: ProjectBrowserProps) {
  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState(locale === 'zh' ? '全部' : 'All');
  const allLabel = locale === 'zh' ? '全部' : 'All';
  const placeholder = locale === 'zh' ? '搜索项目' : 'Search projects';
  const emptyTitle = locale === 'zh' ? '没有匹配的项目。' : 'No projects match your search.';
  const emptyBody =
    locale === 'zh'
      ? '试试换一个关键词，或者把分类筛选切回“全部”。'
      : 'Try a different keyword or switch the category filter back to All.';

  const tags = useMemo(() => [allLabel, ...Array.from(new Set(projects.map((project) => project.tag)))], [allLabel, projects]);

  const visibleProjects = useMemo(() => {
    const loweredQuery = query.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesTag = activeTag === allLabel || project.tag === activeTag;
      const haystack = [project.title, project.summary, project.tag, project.tech.join(' ')].join(' ').toLowerCase();
      const matchesQuery = !loweredQuery || haystack.includes(loweredQuery);

      return matchesTag && matchesQuery;
    });
  }, [activeTag, projects, query]);

  return (
    <>
      <section className="surface subpage-hero">
        <div className="section-heading section-heading--stacked">
          <div>
            <p className="section-heading__eyebrow">{content.projectsIndex.eyebrow}</p>
            <h2>{content.projectsIndex.title}</h2>
          </div>
        </div>
        <p className="lead compact">{content.projectsIndex.lead}</p>
        <div className="filter-bar">
          <input className="search-input" type="search" placeholder={placeholder} value={query} onChange={(event) => setQuery(event.target.value)} />
          <div className="filter-pills">
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                className={`pill ${activeTag === tag ? 'pill--active' : ''}`}
                onClick={() => setActiveTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>
      <section className="project-grid">
        {visibleProjects.length ? (
          visibleProjects.map((project) => <ProjectCard key={project.slug} project={project} locale={locale} />)
          ) : (
          <div className="surface empty-state">
            <h1>{emptyTitle}</h1>
            <p className="lead compact">{emptyBody}</p>
          </div>
        )}
      </section>
    </>
  );
}
