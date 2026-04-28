'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { HeroScene } from '@/components/scene/hero-scene';
import { MusicPlayer } from '@/components/site/music-player';
import { ProjectCard } from '@/components/site/project-card';
import { SectionHeading } from '@/components/site/section-heading';
import type { BlogPost } from '@/content/blogs';
import type { Project } from '@/content/projects';
import type { Locale } from '@/lib/i18n';
import { localizedPath } from '@/lib/i18n';
import type { SiteContent, SiteConfig } from '@/content/site';

type PortfolioHomeProps = {
  locale: Locale;
  siteConfig: SiteConfig;
  content: SiteContent;
  projects: Project[];
  featuredBlogPosts: BlogPost[];
  featuredProjects: Project[];
};

export function PortfolioHome({
  locale,
  siteConfig,
  content,
  projects,
  featuredBlogPosts,
  featuredProjects,
}: PortfolioHomeProps) {
  const [activeSlug, setActiveSlug] = useState<string>(featuredProjects[0]?.slug ?? projects[0]?.slug ?? '');
  const [resumePreview, setResumePreview] = useState<'english' | 'chinese' | null>(null);
  const [presentationMode, setPresentationMode] = useState<'editorial' | 'viz' | 'terminal'>('editorial');

  const activeProject = useMemo(() => {
    return projects.find((project) => project.slug === activeSlug) ?? null;
  }, [activeSlug, projects]);
  const terminalText = content.showcase.terminal.lines
    .map((line, index) => `${String(index + 1).padStart(2, '0')}  ${line}`)
    .join('\n');

  useEffect(() => {
    if (!resumePreview) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [resumePreview]);

  const resumePreviewSrc = resumePreview === 'english' ? '/pdf/english.PDF' : '/pdf/chinese.pdf';

  return (
    <main className="page-shell">
      <HeroScene projects={featuredProjects} activeProject={activeProject} displayMode={presentationMode} />
      <div className="content-shell">
        <header className="hero-stack">
          <nav className="topbar surface">
            <Link className="brand" href={localizedPath(locale, '/')}>
              {siteConfig.name}
            </Link>
            <div className="topbar-links">
              <Link href={localizedPath(locale, '/projects/')}>{content.nav.projects}</Link>
              <Link href={localizedPath(locale, '/blog/')}>{content.nav.blog}</Link>
              <a href="#stack">{content.nav.stack}</a>
              <a href="#contact">{content.nav.contact}</a>
              <Link className="language-switch" href={localizedPath(locale === 'en' ? 'zh' : 'en', '/')}>
                {locale === 'en' ? content.nav.language : content.nav.language}
              </Link>
              <MusicPlayer tracks={siteConfig.tracks} copy={content.music} />
            </div>
          </nav>

          <section className="surface presentation-bar">
            <div className="presentation-bar__copy">
              <p className="eyebrow">{content.presentation.eyebrow}</p>
              <h2>{content.presentation.title}</h2>
              <p className="muted">{content.presentation.lead}</p>
            </div>
            <div className="presentation-bar__controls" role="tablist" aria-label={content.presentation.eyebrow}>
              {content.presentation.modes.map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  role="tab"
                  aria-selected={presentationMode === mode.id}
                  className={`mode-chip${presentationMode === mode.id ? ' mode-chip--active' : ''}`}
                  onClick={() => setPresentationMode(mode.id)}
                >
                  <span>{mode.label}</span>
                  <small>{mode.blurb}</small>
                </button>
              ))}
            </div>
            <p className="presentation-bar__hint">{content.presentation.hint}</p>
          </section>

          <section className="hero-grid">
            <div className="surface hero-copy">
              <p className="eyebrow">{content.hero.eyebrow}</p>
              <h1>
                {content.hero.title[0]}
                <span>{content.hero.title[1]}</span>
              </h1>
              <p className="lead">{content.hero.lead}</p>
              <div className="button-row">
                <Link className="button button-primary" href={localizedPath(locale, '/projects/')}>
                  {content.hero.projects}
                </Link>
                <button type="button" className="button button-secondary" onClick={() => setResumePreview('english')}>
                  {content.hero.resumeEnglish}
                </button>
                <button type="button" className="button button-secondary" onClick={() => setResumePreview('chinese')}>
                  {content.hero.resumeChinese}
                </button>
              </div>
            </div>

            <aside className="surface hero-profile">
              <img src={siteConfig.heroImage} alt="Junxu Zhang portrait" loading="eager" decoding="async" />
              <div className="hero-profile__copy">
                <span className="label">{content.hero.currentFocusLabel}</span>
                <h2>{content.hero.currentFocusTitle}</h2>
                <p>{content.hero.currentFocusBody}</p>
              </div>
            </aside>
          </section>
        </header>

        <section className="projects-block">
          <SectionHeading eyebrow={content.showcase.eyebrow} title={content.showcase.title} />
          <p className="muted compact">{content.showcase.lead}</p>
          <div className="showcase-grid">
            <article className="surface showcase-card showcase-card--editorial">
              <span className="signal-index">{content.showcase.editorial.label}</span>
              <h3>{content.showcase.editorial.title}</h3>
              <p>{content.showcase.editorial.body}</p>
              <blockquote>{content.showcase.editorial.quote}</blockquote>
            </article>

            <article className="surface showcase-card showcase-card--viz">
              <span className="signal-index">{content.showcase.viz.label}</span>
              <h3>{content.showcase.viz.title}</h3>
              <p>{content.showcase.viz.body}</p>
              <div className="viz-stats">
                {content.showcase.viz.stats.map((stat, index) => (
                  <div key={stat.label} className="viz-stat">
                    <span className="viz-stat__label">{stat.label}</span>
                    <strong>{stat.value}</strong>
                    <span className={`viz-stat__bar viz-stat__bar--${index + 1}`} aria-hidden="true" />
                  </div>
                ))}
              </div>
            </article>

            <article className="surface showcase-card showcase-card--terminal">
              <span className="signal-index">{content.showcase.terminal.label}</span>
              <h3>{content.showcase.terminal.title}</h3>
              <div className="terminal-panel">
                <div className="terminal-panel__bar" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
                <pre>{terminalText}</pre>
              </div>
            </article>
          </div>
        </section>

        <section className="two-column">
          <article className="surface about-card">
            <SectionHeading eyebrow={content.about.eyebrow} title={content.about.title} />
            <div className="about-layout">
              <img src={siteConfig.aboutImage} alt="Original portfolio portrait" loading="lazy" decoding="async" />
              <div>
                <p>{content.about.paragraphs[0]}</p>
                <p>{content.about.paragraphs[1]}</p>
              </div>
            </div>
          </article>

          <article id="stack" className="surface stack-card">
            <SectionHeading eyebrow={content.stack.eyebrow} title={content.stack.title} />
            <div className="pill-grid">
              {content.strengths.map((item) => (
                <span key={item} className="pill">
                  {item}
                </span>
              ))}
            </div>
            <p className="muted">{content.stack.lead}</p>
          </article>
        </section>

        <section className="projects-block">
          <SectionHeading eyebrow={content.timeline.eyebrow} title={content.timeline.title} />
          <p className="muted compact">{content.timeline.lead}</p>
          <div className="timeline-grid">
            {content.timeline.items.map((item) => (
              <article key={item.period + item.title} className="surface timeline-card">
                <span className="signal-index">{item.period}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="projects-block">
          <SectionHeading eyebrow={content.signals.eyebrow} title={content.signals.title} />
          <p className="muted compact">{content.signals.lead}</p>
          <div className="signal-grid">
            {content.signals.cards.map((signal, index) => (
              <article key={signal.title} className={`surface signal-card signal-card--${index + 1}`}>
                <span className="signal-index">{String(index + 1).padStart(2, '0')}</span>
                <h3>{signal.title}</h3>
                <p>{signal.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="projects-block">
          <SectionHeading
            eyebrow={content.blogIndex.eyebrow}
            title={content.blogIndex.title}
            action={
              <Link className="text-link" href={localizedPath(locale, '/blog/')}>
                {content.blogIndex.action}
              </Link>
            }
          />
          <p className="muted compact">{content.blogIndex.lead}</p>
          <div className="blog-strip">
            {featuredBlogPosts.map((post, index) => (
              <article key={post.slug} className="surface blog-strip__card">
                <span className="signal-index">{String(index + 1).padStart(2, '0')}</span>
                <h3>{post.title}</h3>
                <p>{post.summary}</p>
                <Link className="text-link" href={localizedPath(locale, '/blog/')}>
                  {content.blogIndex.action}
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="projects-block">
          <SectionHeading
            eyebrow={content.featured.eyebrow}
            title={content.featured.title}
            action={
              <Link className="text-link" href={localizedPath(locale, '/projects/')}>
                {content.featured.action}
              </Link>
            }
          />
          <div className="project-grid project-grid--interactive">
            {featuredProjects.map((project) => (
              <ProjectCard
                key={project.slug}
                project={project}
                locale={locale}
                active={project.slug === activeSlug}
                onHover={() => setActiveSlug(project.slug)}
                onFocus={() => setActiveSlug(project.slug)}
                onBlur={() => setActiveSlug(featuredProjects[0]?.slug ?? projects[0]?.slug ?? '')}
              />
            ))}
          </div>
        </section>

        <section className="surface contact-card contact-card--cta">
          <SectionHeading eyebrow={content.contactCta.eyebrow} title={content.contactCta.title} />
          <p className="muted">{content.contactCta.lead}</p>
          <div className="button-row">
            <a className="button button-primary" href={content.contactCta.primaryHref} target="_blank" rel="noreferrer">
              {content.contactCta.primaryLabel}
            </a>
            <a className="button button-secondary" href={content.contactCta.secondaryHref} target="_blank" rel="noreferrer">
              {content.contactCta.secondaryLabel}
            </a>
            <Link className="button button-secondary" href={localizedPath(locale, '/blog/')}>
              {content.blogIndex.action}
            </Link>
          </div>
        </section>

        <section id="contact" className="surface contact-card">
          <SectionHeading eyebrow={content.contact.eyebrow} title={content.contact.title} />
          <p className="muted">{content.contact.lead}</p>
          <div className="contact-grid">
            {content.contactLinks.map((link) => (
              <a key={link.label} className="contact-tile" href={link.href} target="_blank" rel="noreferrer">
                <strong>{link.label}</strong>
                <span>{link.helper ?? link.href.replace('https://', '')}</span>
              </a>
            ))}
            <div className="contact-tile">
              <strong>{content.contact.location}</strong>
              <span>{content.contact.locationValue}</span>
            </div>
          </div>
        </section>
      </div>

      {resumePreview ? (
        <div
          className="resume-modal"
          role="dialog"
          aria-modal="true"
          aria-label={resumePreview === 'english' ? content.hero.resumeEnglish : content.hero.resumeChinese}
          onClick={() => setResumePreview(null)}
        >
          <div className="resume-modal__panel" onClick={(event) => event.stopPropagation()}>
            <div className="resume-modal__header">
              <div>
                <p className="eyebrow">{resumePreview === 'english' ? content.hero.resumeEnglish : content.hero.resumeChinese}</p>
                <h2>{resumePreview === 'english' ? content.hero.resumeEnglish : content.hero.resumeChinese}</h2>
              </div>
              <button type="button" className="button button-secondary" onClick={() => setResumePreview(null)}>
                Close
              </button>
            </div>
            <iframe className="resume-modal__frame" src={resumePreviewSrc} title="Resume preview" />
            <div className="resume-modal__actions">
              <a className="button button-primary" href={resumePreviewSrc} target="_blank" rel="noreferrer">
                Open in new tab
              </a>
              <a className="button button-secondary" href={resumePreviewSrc} download>
                Download
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
