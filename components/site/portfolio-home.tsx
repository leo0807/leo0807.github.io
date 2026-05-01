'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { HeroScene, RoomStudioStage } from '@/components/scene/hero-scene';
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
  const safeFeaturedProjects = featuredProjects ?? [];
  const safeFeaturedBlogPosts = featuredBlogPosts ?? [];
  const presentationModes = content.presentation?.modes ?? [];
  const terminalLines = content.showcase?.terminal?.lines ?? [];
  const showcaseVizStats = content.showcase?.viz?.stats ?? [];
  const safeStrengths = content.strengths ?? [];
  const serviceCards = content.services.items ?? [];
  const safeTimelineItems = content.timeline.items ?? [];
  const safeSignalCards = content.signals.cards ?? [];
  const testimonialCards = content.testimonials.cards ?? [];
  const nowCards = content.now.cards ?? [];
  const skillsRadarGroups = content.skillsRadar.groups ?? [];
  const projectsWithMetrics = projects.filter((project) => (project.metrics?.length ?? 0) > 0).length;
  const totalMetricCount = projects.reduce((sum, project) => sum + (project.metrics?.length ?? 0), 0);
  const roomLabels = locale === 'zh' ? ['代码房间', '笔记房间', '评审房间'] : ['Code Room', 'Notes Room', 'Review Room'];

  const [activeSlug, setActiveSlug] = useState<string>(safeFeaturedProjects[0]?.slug ?? projects[0]?.slug ?? '');
  const [resumePreview, setResumePreview] = useState<'english' | 'chinese' | null>(null);
  const [presentationMode, setPresentationMode] = useState<'editorial' | 'viz' | 'terminal'>('editorial');
  const [roomIndex, setRoomIndex] = useState(1);
  const [activeSection, setActiveSection] = useState('hero-intro');
  const vizProjects = safeFeaturedProjects.slice(0, 3);

  const sectionLinks = useMemo(
    () => [
      { id: 'hero-intro', label: locale === 'zh' ? '首屏' : 'Hero' },
      { id: 'showcase', label: locale === 'zh' ? '展示' : 'Showcase' },
      { id: 'about', label: locale === 'zh' ? '简介' : 'About' },
      { id: 'testimonials', label: locale === 'zh' ? '推荐语' : 'Testimonials' },
      { id: 'metrics', label: locale === 'zh' ? '指标' : 'Metrics' },
      { id: 'timeline', label: locale === 'zh' ? '时间线' : 'Timeline' },
      { id: 'now', label: locale === 'zh' ? 'Now' : 'Now' },
      { id: 'skills', label: locale === 'zh' ? '技能' : 'Skills' },
      { id: 'services', label: locale === 'zh' ? '服务' : 'Services' },
      { id: 'signals', label: locale === 'zh' ? '信号' : 'Signals' },
      { id: 'blog', label: locale === 'zh' ? '博客' : 'Blog' },
      { id: 'featured', label: locale === 'zh' ? '项目' : 'Projects' },
      { id: 'contact', label: locale === 'zh' ? '联系' : 'Contact' },
    ],
    [locale],
  );

  const activeProject = useMemo(() => {
    return projects.find((project) => project.slug === activeSlug) ?? null;
  }, [activeSlug, projects]);

  const terminalText = terminalLines
    .map((line, index) => `${String(index + 1).padStart(2, '0')}  ${line}`)
    .join('\n');

  const editorialTelemetry = {
    label: 'Cover focus',
    title: activeProject?.title ?? siteConfig.name,
    body: activeProject?.summary ?? content.hero.currentFocusBody,
  };

  const vizTelemetry = {
    label: 'Live metrics',
    stats: [
      { label: 'Projects', value: String(safeFeaturedProjects.length) },
      { label: 'Posts', value: String(safeFeaturedBlogPosts.length) },
      { label: 'Tracks', value: String(siteConfig.tracks.length) },
    ],
    note: 'Click a project chip to retune the scene and surface a different case study.',
  };

  const terminalTelemetry = {
    label: 'Session log',
    title: 'portfolio@local',
    lines: ['mode=terminal', `project=${activeProject?.slug ?? 'none'}`, `tracks=${siteConfig.tracks.length}`, `posts=${safeFeaturedBlogPosts.length}`],
  };

  const caseStudyMetricCards = [
    {
      label: locale === 'zh' ? '项目总数' : 'Projects shipped',
      value: String(projects.length),
      detail: locale === 'zh' ? '当前可浏览的项目总数。' : 'All project entries currently available in the archive.',
    },
    {
      label: locale === 'zh' ? '带指标案例' : 'Case studies with metrics',
      value: String(projectsWithMetrics),
      detail: locale === 'zh' ? '有量化指标的项目更像完整案例。' : 'Projects that already carry measurable outcomes.',
    },
    {
      label: locale === 'zh' ? '精选项目' : 'Featured builds',
      value: String(safeFeaturedProjects.length),
      detail: locale === 'zh' ? '首页主推的项目数量。' : 'The project set surfaced on the homepage.',
    },
    {
      label: locale === 'zh' ? '博客文章' : 'Blog posts',
      value: String(safeFeaturedBlogPosts.length),
      detail: locale === 'zh' ? '当前写作入口的数量。' : 'The current writing archive size from the homepage.',
    },
    {
      label: locale === 'zh' ? '指标条目' : 'Metric entries',
      value: String(totalMetricCount),
      detail: locale === 'zh' ? '所有项目的指标项总数。' : 'The total number of labeled metrics across projects.',
    },
  ];

  const radarPoints = skillsRadarGroups.map((group, index) => {
    const angle = (Math.PI * 2 * index) / Math.max(skillsRadarGroups.length, 1) - Math.PI / 2;
    const depth = 46 + (group.items.length * 3) + Math.min(group.focus.length / 16, 12);
    const radius = 62 + index * 4 + Math.min(group.examples.length * 2, 12);
    return { ...group, angle, radius, depth };
  });

  useEffect(() => {
    if (!resumePreview) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [resumePreview]);

  useEffect(() => {
    let frame = 0;

    const handleMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const x = (event.clientX / Math.max(window.innerWidth, 1)) * 100;
        const y = (event.clientY / Math.max(window.innerHeight, 1)) * 100;
        document.documentElement.style.setProperty('--pointer-x', `${x.toFixed(2)}%`);
        document.documentElement.style.setProperty('--pointer-y', `${y.toFixed(2)}%`);
      });
    };

    window.addEventListener('pointermove', handleMove, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handleMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const observedSections = sectionLinks
      .map((section) => document.getElementById(section.id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (!observedSections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];

        if (visibleEntry?.target.id) {
          setActiveSection(visibleEntry.target.id);
        }
      },
      {
        rootMargin: '-18% 0px -58% 0px',
        threshold: [0.15, 0.25, 0.5, 0.75],
      },
    );

    observedSections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [sectionLinks]);

  const resumePreviewSrc = resumePreview === 'english' ? '/pdf/english.PDF' : '/pdf/chinese.pdf';

  return (
    <main className={`page-shell page-shell--${presentationMode}`} data-presentation={presentationMode}>
      <HeroScene
        projects={featuredProjects}
        activeProject={activeProject}
        displayMode={presentationMode}
        roomIndex={roomIndex}
        onRoomIndexChange={setRoomIndex}
      />
      <div className="content-shell">
        <header id="hero" className="hero-stack" data-home-section="hero">
          <nav className="topbar surface topbar--mode">
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

          <section className="surface section-nav">
            <div className="section-nav__copy">
              <p className="eyebrow">{locale === 'zh' ? '页面导航' : 'Page navigator'}</p>
              <h2>{locale === 'zh' ? '快速跳转到关键章节' : 'Jump directly to key sections'}</h2>
              <p className="muted">
                {locale === 'zh'
                  ? '这条导航会跟随你的浏览进度高亮当前章节，也能让整页更像一个被精心编辑过的作品集。'
                  : 'This navigator highlights the current section as you scroll and keeps the page feeling intentionally composed.'}
              </p>
            </div>
            <div className="section-nav__rail" role="navigation" aria-label={locale === 'zh' ? '页面章节导航' : 'Page sections'}>
              {sectionLinks.map((section, index) => {
                const isActive = activeSection === section.id;
                return (
                  <a
                    key={section.id}
                    className={`section-nav__chip${isActive ? ' section-nav__chip--active' : ''}`}
                    href={`#${section.id}`}
                    aria-current={isActive ? 'location' : undefined}
                  >
                    <span className="section-nav__chip-index">{String(index + 1).padStart(2, '0')}</span>
                    <strong>{section.label}</strong>
                  </a>
                );
              })}
            </div>
          </section>

          <section id="hero-intro" className="hero-grid" data-home-section="hero-intro">
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

          <section id="presentation" className="surface presentation-bar" data-home-section="presentation">
            <div className="presentation-bar__copy">
              <p className="eyebrow">{content.presentation.eyebrow}</p>
              <h2>{content.presentation.title}</h2>
              <p className="muted">{content.presentation.lead}</p>
            </div>
            <div className="presentation-bar__controls" role="tablist" aria-label={content.presentation.eyebrow}>
              {presentationModes.map((mode) => (
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
            <div className={`presentation-telemetry presentation-telemetry--${presentationMode}`}>
              {presentationMode === 'editorial' ? (
                <div className="presentation-telemetry__cover">
                  <span className="presentation-telemetry__label">{editorialTelemetry.label}</span>
                  <strong>{editorialTelemetry.title}</strong>
                  <p>{editorialTelemetry.body}</p>
                </div>
              ) : null}

              {presentationMode === 'viz' ? (
                <div className="presentation-telemetry__viz">
                  <span className="presentation-telemetry__label">{vizTelemetry.label}</span>
                  <div className="presentation-telemetry__stats">
                    {(vizTelemetry.stats ?? []).map((stat, index) => (
                      <div key={stat.label} className="presentation-telemetry__stat">
                        <span>{stat.label}</span>
                        <strong>{stat.value}</strong>
                        <i className={`presentation-telemetry__bar presentation-telemetry__bar--${index + 1}`} aria-hidden="true" />
                      </div>
                    ))}
                  </div>
                  <div className="presentation-telemetry__rail" aria-label="Project navigator">
                    {vizProjects.map((project, index) => {
                      const isActive = project.slug === activeSlug;
                      return (
                        <button
                          key={project.slug}
                          type="button"
                          className={`presentation-telemetry__project${isActive ? ' presentation-telemetry__project--active' : ''}`}
                          aria-pressed={isActive}
                          onClick={() => {
                            setActiveSlug(project.slug);
                            setPresentationMode('viz');
                          }}
                        >
                          <span className="presentation-telemetry__project-index">{String(index + 1).padStart(2, '0')}</span>
                          <strong>{project.title}</strong>
                          <small>{project.summary}</small>
                        </button>
                      );
                    })}
                  </div>
                  <div className="presentation-telemetry__focus">
                    <span className="presentation-telemetry__label">Active project</span>
                    <strong>{activeProject?.title ?? siteConfig.name}</strong>
                    <p>{activeProject?.summary ?? content.hero.currentFocusBody}</p>
                  </div>
                  <p>{vizTelemetry.note}</p>
                </div>
              ) : null}

              {presentationMode === 'terminal' ? (
                <div className="presentation-telemetry__terminal">
                  <span className="presentation-telemetry__label">{terminalTelemetry.label}</span>
                  <strong>{terminalTelemetry.title}</strong>
                  <pre>{terminalTelemetry.lines.join('\n')}</pre>
                </div>
              ) : null}
            </div>
            <p className="presentation-bar__hint">{content.presentation.hint}</p>
          </section>

          <section id="studio" className="surface room-stage" data-home-section="studio">
            <div className="room-stage__copy">
              <p className="eyebrow">{locale === 'zh' ? '多房间工作室' : 'Multi-room studio'}</p>
              <h2>{roomLabels[roomIndex] ?? roomLabels[1]}</h2>
              <p className="muted">
                {locale === 'zh'
                  ? '这个 3D 头像现在直接放在首页的可见区域里，而不是背景层。'
                  : 'This 3D avatar now lives in a visible homepage panel instead of the background layer.'}
              </p>
            </div>
            <div className="room-stage__viewer">
              <RoomStudioStage displayMode={presentationMode} roomIndex={roomIndex} onRoomIndexChange={setRoomIndex} />
            </div>
          </section>

          <section className="surface room-dock">
            <div className="room-dock__copy">
              <p className="eyebrow">{locale === 'zh' ? '多房间工作室' : 'Multi-room studio'}</p>
              <h2>{roomLabels[roomIndex] ?? roomLabels[1]}</h2>
              <p className="muted">
                {locale === 'zh'
                  ? '这是 3D 头像的可见控制条。点击下面的按钮，或按 ← / → 和 1 / 2 / 3 在房间之间切换。'
                  : 'A visible control strip for the 3D avatar. Use the buttons below or press ← / → and 1 / 2 / 3 to move through the rooms.'}
              </p>
            </div>
            <div className="room-dock__controls" role="tablist" aria-label="Room switcher">
              {roomLabels.map((label, index) => (
                <button
                  key={label}
                  type="button"
                  role="tab"
                  aria-selected={roomIndex === index}
                  className={`room-chip${roomIndex === index ? ' room-chip--active' : ''}`}
                  onClick={() => setRoomIndex(index)}
                >
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <strong>{label}</strong>
                </button>
              ))}
            </div>
          </section>
        </header>

        <section id="showcase" className="projects-block" data-home-section="showcase">
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
                {showcaseVizStats.map((stat, index) => (
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
          <article id="about" className="surface about-card" data-home-section="about">
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
              {safeStrengths.map((item) => (
                <span key={item} className="pill">
                  {item}
                </span>
              ))}
            </div>
            <p className="muted">{content.stack.lead}</p>
          </article>
        </section>

        <section id="testimonials" className="projects-block" data-home-section="testimonials">
          <SectionHeading eyebrow={content.testimonials.eyebrow} title={content.testimonials.title} />
          <p className="muted compact">{content.testimonials.lead}</p>
          <div className="testimonial-grid">
            {testimonialCards.map((card, index) => (
              <article key={card.name} className="surface testimonial-card testimonial-card--featured">
                <span className="signal-index">{String(index + 1).padStart(2, '0')}</span>
                <blockquote>{card.quote}</blockquote>
                <div className="testimonial-card__meta">
                  <strong>{card.name}</strong>
                  <span>{card.role}</span>
                  <p>{card.context}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="metrics" className="projects-block" data-home-section="metrics">
          <SectionHeading eyebrow={content.caseStudyMetrics.eyebrow} title={content.caseStudyMetrics.title} />
          <p className="muted compact">{content.caseStudyMetrics.lead}</p>
          <div className="metric-grid metric-grid--home">
            {caseStudyMetricCards.map((metric) => (
              <article key={metric.label} className="surface metric-card metric-card--home">
                <span className="label">{metric.label}</span>
                <strong>{metric.value}</strong>
                <p>{metric.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="timeline" className="projects-block" data-home-section="timeline">
          <SectionHeading eyebrow={content.timeline.eyebrow} title={content.timeline.title} />
          <p className="muted compact">{content.timeline.lead}</p>
          <div className="timeline-grid">
            {safeTimelineItems.map((item) => (
              <article key={item.period + item.title} className="surface timeline-card">
                <span className="signal-index">{item.period}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="now" className="projects-block" data-home-section="now">
          <SectionHeading eyebrow={content.now.eyebrow} title={content.now.title} />
          <p className="muted compact">{content.now.lead}</p>
          <div className="now-grid">
            {nowCards.map((card, index) => (
              <article key={card.title} className="surface now-card">
                <span className="signal-index">{String(index + 1).padStart(2, '0')}</span>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
                <span className="now-card__note">{card.note}</span>
              </article>
            ))}
          </div>
        </section>

        <section id="skills" className="projects-block" data-home-section="skills">
          <SectionHeading eyebrow={content.skillsRadar.eyebrow} title={content.skillsRadar.title} />
          <p className="muted compact">{content.skillsRadar.lead}</p>
          <div className="skills-radar-grid">
            <article className="surface skills-radar-card skills-radar-card--diagram">
              <span className="signal-index">01</span>
              <h3>{locale === 'zh' ? '技能分布图' : 'Skill distribution'}</h3>
              <p>{locale === 'zh' ? '从问题类型看你的能力分布，而不是把技术栈简单堆叠。' : 'A visual map of how the stack clusters around real work types instead of a flat list.'}</p>
              <div className="skills-radar-graphic" aria-label={content.skillsRadar.title}>
                <svg viewBox="0 0 200 200" role="img" aria-hidden="true">
                  <defs>
                    <linearGradient id="radar-fill" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.36" />
                      <stop offset="100%" stopColor="var(--accent-soft)" stopOpacity="0.12" />
                    </linearGradient>
                  </defs>
                  <circle cx="100" cy="100" r="66" className="skills-radar-ring" />
                  <circle cx="100" cy="100" r="46" className="skills-radar-ring skills-radar-ring--inner" />
                  <polygon
                    className="skills-radar-polygon"
                    points={radarPoints
                      .map((point) => `${100 + Math.cos(point.angle) * (44 + point.items.length * 6)},${100 + Math.sin(point.angle) * (44 + point.items.length * 6)}`)
                      .join(' ')}
                  />
                  {radarPoints.map((point, index) => (
                    <g key={point.title}>
                      <line x1="100" y1="100" x2={100 + Math.cos(point.angle) * 72} y2={100 + Math.sin(point.angle) * 72} className="skills-radar-spoke" />
                      <circle cx={100 + Math.cos(point.angle) * 72} cy={100 + Math.sin(point.angle) * 72} r="5" className="skills-radar-node" />
                      <text
                        x={100 + Math.cos(point.angle) * 88}
                        y={100 + Math.sin(point.angle) * 88}
                        textAnchor={Math.cos(point.angle) > 0.2 ? 'start' : Math.cos(point.angle) < -0.2 ? 'end' : 'middle'}
                        className={`skills-radar-label skills-radar-label--${index + 1}`}
                      >
                        {point.title}
                      </text>
                    </g>
                  ))}
                  <circle cx="100" cy="100" r="18" className="skills-radar-core" />
                </svg>
                <div className="skills-radar-summary">
                  <span className="label">{locale === 'zh' ? '解读' : 'Reading the radar'}</span>
                  <p>{locale === 'zh' ? '中心图形强调你最近最强的交付方向：前端、后端和 LLM 应用是相互连通的，而不是彼此孤立。' : 'The center geometry shows that frontend delivery, backend services, and LLM work reinforce each other instead of sitting in separate lanes.'}</p>
                </div>
              </div>
            </article>
            {skillsRadarGroups.map((group, index) => (
              <article key={group.title} className="surface skills-radar-card">
                <span className="signal-index">{String(index + 2).padStart(2, '0')}</span>
                <h3>{group.title}</h3>
                <p>{group.summary}</p>
                <div className="skills-radar-card__focus">
                  <span className="label">{locale === 'zh' ? '工作方式' : 'How it shows up'}</span>
                  <p>{group.focus}</p>
                </div>
                <div className="skills-radar-card__list">
                  <span className="label">{locale === 'zh' ? '常见产出' : 'Typical outputs'}</span>
                  <div className="pill-grid pill-grid--compact">
                    {group.examples.map((item) => (
                      <span key={item} className="pill">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="skills-radar-card__list">
                  <span className="label">{locale === 'zh' ? '相关技能' : 'Related skills'}</span>
                  <div className="pill-grid pill-grid--compact">
                    {group.items.map((item) => (
                      <span key={item} className="pill">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="services" className="projects-block" data-home-section="services">
          <SectionHeading
            eyebrow={content.services.eyebrow}
            title={content.services.title}
          />
          <p className="muted compact">{content.services.lead}</p>
          <div className="service-grid">
            {serviceCards.map((service, index) => (
              <article key={service.title} className="surface service-card">
                <span className="signal-index">{String(index + 1).padStart(2, '0')}</span>
                <h3>{service.title}</h3>
                <p>{service.body}</p>
                <span className="service-card__note">{service.note}</span>
              </article>
            ))}
          </div>
        </section>

        <section id="signals" className="projects-block" data-home-section="signals">
          <SectionHeading eyebrow={content.signals.eyebrow} title={content.signals.title} />
          <p className="muted compact">{content.signals.lead}</p>
          <div className="signal-grid">
            {safeSignalCards.map((signal, index) => (
              <article key={signal.title} className={`surface signal-card signal-card--${index + 1}`}>
                <span className="signal-index">{String(index + 1).padStart(2, '0')}</span>
                <h3>{signal.title}</h3>
                <p>{signal.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="blog" className="projects-block" data-home-section="blog">
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
            {safeFeaturedBlogPosts.map((post, index) => (
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

        <section id="featured" className="projects-block" data-home-section="featured">
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
            {safeFeaturedProjects.map((project) => (
              <ProjectCard
                key={project.slug}
                project={project}
                locale={locale}
                active={project.slug === activeSlug}
                onHover={() => setActiveSlug(project.slug)}
                onFocus={() => setActiveSlug(project.slug)}
                onBlur={() => setActiveSlug(safeFeaturedProjects[0]?.slug ?? projects[0]?.slug ?? '')}
              />
            ))}
          </div>
        </section>

        <section id="contact-cta" className="surface contact-card contact-card--cta" data-home-section="contact-cta">
          <SectionHeading eyebrow={content.contactCta.eyebrow} title={content.contactCta.title} />
          <p className="muted">{content.contactCta.lead}</p>
          <div className="contact-steps">
            {content.contactCta.steps.map((step, index) => (
              <article key={step.title} className="contact-step">
                <span className="signal-index">{String(index + 1).padStart(2, '0')}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </article>
            ))}
          </div>
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
          <p className="contact-cta__footer">{content.contactCta.footer}</p>
        </section>

        <section id="contact" className="surface contact-card" data-home-section="contact">
          <SectionHeading eyebrow={content.contact.eyebrow} title={content.contact.title} />
          <p className="muted">{content.contact.lead}</p>
          <div className="contact-grid">
            {(content.contactLinks ?? []).map((link) => (
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
