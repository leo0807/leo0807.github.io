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

  const tagEntries = useMemo(() => {
    const counts = new Map<string, number>();

    for (const project of projects) {
      counts.set(project.tag, (counts.get(project.tag) ?? 0) + 1);
    }

    return [
      { tag: allLabel, count: projects.length, isAll: true },
      ...Array.from(counts.entries())
        .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
        .map(([tag, count]) => ({ tag, count, isAll: false })),
    ];
  }, [allLabel, projects]);

  const visibleProjects = useMemo(() => {
    const loweredQuery = query.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesTag = activeTag === allLabel || project.tag === activeTag;
      const haystack = [project.title, project.summary, project.tag, project.tech.join(' ')].join(' ').toLowerCase();
      const matchesQuery = !loweredQuery || haystack.includes(loweredQuery);

      return matchesTag && matchesQuery;
    });
  }, [activeTag, projects, query]);

  const featuredCount = projects.filter((project) => project.featured).length;

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
        <div className="taxonomy-strip">
          <div>
            <p className="section-heading__eyebrow">{content.projectTaxonomy.eyebrow}</p>
            <strong>{content.projectTaxonomy.title}</strong>
            <p className="muted compact">{content.projectTaxonomy.lead}</p>
          </div>
          <div className="taxonomy-strip__tags" aria-label={content.projectTaxonomy.pathLabel}>
            {tagEntries.map((entry, index) => (
              <button
                key={entry.tag}
                type="button"
                className={`taxonomy-pill ${activeTag === entry.tag ? 'taxonomy-pill--active' : ''}`}
                onClick={() => setActiveTag(entry.tag)}
              >
                <strong>{entry.tag}</strong>
                <small>{entry.count}</small>
                {entry.isAll && index === 0 ? <span className="muted">{locale === 'zh' ? '起点' : 'start'}</span> : null}
              </button>
            ))}
          </div>
        </div>
        <div className="subpage-hero__stats" aria-label="Project stats">
          <span className="subpage-hero__stat">
            <strong>{projects.length}</strong>
            <span>{locale === 'zh' ? '个项目' : 'projects'}</span>
          </span>
          <span className="subpage-hero__stat">
            <strong>{featuredCount}</strong>
            <span>{locale === 'zh' ? '精选' : 'featured'}</span>
          </span>
          <span className="subpage-hero__stat">
            <strong>{visibleProjects.length}</strong>
            <span>{locale === 'zh' ? '当前结果' : 'results'}</span>
          </span>
        </div>
        <div className="filter-bar">
          <input className="search-input" type="search" placeholder={placeholder} value={query} onChange={(event) => setQuery(event.target.value)} />
          <p className="muted compact">{locale === 'zh' ? '使用顶部路径快速筛选，搜索框可继续缩小结果。' : 'Use the taxonomy strip to filter quickly, then refine with search.'}</p>
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
