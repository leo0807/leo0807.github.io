'use client';

import { useMemo, useState } from 'react';
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

  const activeProject = useMemo(() => {
    return projects.find((project) => project.slug === activeSlug) ?? null;
  }, [activeSlug, projects]);

  return (
    <main className="page-shell">
      <HeroScene projects={featuredProjects} activeProject={activeProject} />
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
                <a className="button button-secondary" href="/pdf/english.PDF" target="_blank" rel="noreferrer">
                  {content.hero.resumeEnglish}
                </a>
                <a className="button button-secondary" href="/pdf/chinese.pdf" target="_blank" rel="noreferrer">
                  {content.hero.resumeChinese}
                </a>
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
    </main>
  );
}
