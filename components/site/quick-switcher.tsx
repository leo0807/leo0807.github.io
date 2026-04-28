'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import type { BlogPost } from '@/content/blogs';
import type { Project } from '@/content/projects';
import type { Locale } from '@/lib/i18n';
import { localizedPath } from '@/lib/i18n';

type QuickSwitcherProps = {
  projectsByLocale: Record<Locale, Project[]>;
  postsByLocale: Record<Locale, BlogPost[]>;
};

type QuickAction = {
  label: string;
  helper: string;
  href: string;
  kind: 'page' | 'project' | 'post' | 'section' | 'locale';
};

const labels = {
  en: {
    launcher: 'Launcher',
    title: 'Search pages, projects, and posts',
    trigger: 'Open the global quick switcher',
    close: 'Close',
    placeholder: 'Type to search',
    noResults: 'No results found.',
    noResultsBody: 'Try another keyword or jump straight to a page.',
    home: 'Home',
    projects: 'Projects',
    blog: 'Blog',
    stack: 'Stack',
    contact: 'Contact',
    english: 'English',
    chinese: '中文',
    homeHelper: 'Return to the homepage',
    projectsHelper: 'Open the project index',
    blogHelper: 'Open the blog index',
    stackHelper: 'Jump to the stack section',
    contactHelper: 'Jump to the contact section',
    englishHelper: 'Switch to the English locale',
    chineseHelper: 'Switch to the Chinese locale',
  },
  zh: {
    launcher: '启动器',
    title: '搜索页面、项目和文章',
    trigger: '打开全站快速切换器',
    close: '关闭',
    placeholder: '输入关键词搜索',
    noResults: '没有匹配结果。',
    noResultsBody: '换一个关键词试试，或者直接跳转到页面。',
    home: '首页',
    projects: '项目',
    blog: '博客',
    stack: '技术栈',
    contact: '联系',
    english: 'English',
    chinese: '中文',
    homeHelper: '返回首页',
    projectsHelper: '打开项目索引',
    blogHelper: '打开博客索引',
    stackHelper: '跳到技术栈区块',
    contactHelper: '跳到联系区块',
    englishHelper: '切换到英文界面',
    chineseHelper: '切换到中文界面',
  },
} as const;

const kindLabels: Record<Locale, Record<QuickAction['kind'], string>> = {
  en: {
    page: 'page',
    project: 'project',
    post: 'post',
    section: 'section',
    locale: 'locale',
  },
  zh: {
    page: '页面',
    project: '项目',
    post: '文章',
    section: '区块',
    locale: '语言',
  },
};

export function QuickSwitcher({ projectsByLocale, postsByLocale }: QuickSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const locale: Locale = pathname.startsWith('/zh') ? 'zh' : 'en';
  const t = labels[locale];
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const actions = useMemo<QuickAction[]>(() => {
    const currentProjects = projectsByLocale[locale] ?? [];
    const currentPosts = postsByLocale[locale] ?? [];

    const baseActions: QuickAction[] = [
      { label: t.home, helper: t.homeHelper, href: localizedPath(locale, '/'), kind: 'page' },
      { label: t.projects, helper: t.projectsHelper, href: localizedPath(locale, '/projects/'), kind: 'page' },
      { label: t.blog, helper: t.blogHelper, href: localizedPath(locale, '/blog/'), kind: 'page' },
      { label: t.stack, helper: t.stackHelper, href: '#stack', kind: 'section' },
      { label: t.contact, helper: t.contactHelper, href: '#contact', kind: 'section' },
      { label: t.english, helper: t.englishHelper, href: localizedPath('en', '/'), kind: 'locale' },
      { label: t.chinese, helper: t.chineseHelper, href: localizedPath('zh', '/'), kind: 'locale' },
    ];

    const projectActions = currentProjects.map((project) => ({
      label: project.title,
      helper: project.summary,
      href: localizedPath(locale, `/projects/${project.slug}/`),
      kind: 'project' as const,
    }));

    const blogActions = currentPosts.map((post) => ({
      label: post.title,
      helper: post.summary,
      href: localizedPath(locale, `/blog/${post.slug}/`),
      kind: 'post' as const,
    }));

    return [...baseActions, ...projectActions, ...blogActions];
  }, [locale, postsByLocale, projectsByLocale, t]);

  const visibleActions = useMemo(() => {
    const loweredQuery = query.trim().toLowerCase();
    if (!loweredQuery) return actions;

    return actions.filter((action) => [action.label, action.helper, action.kind].join(' ').toLowerCase().includes(loweredQuery));
  }, [actions, query]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';
      if (isShortcut) {
        event.preventDefault();
        setOpen((value) => !value);
      }

      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (!open) {
      setQuery('');
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="quick-switcher-trigger"
        onClick={() => setOpen(true)}
        aria-label={t.trigger}
      >
        <span>⌘K</span>
        <small>{t.launcher}</small>
      </button>

      {open ? (
        <div className="quick-switcher" role="dialog" aria-modal="true" aria-label="Quick switcher" onClick={() => setOpen(false)}>
          <div className="quick-switcher__panel surface" onClick={(event) => event.stopPropagation()}>
            <div className="quick-switcher__head">
              <div>
                <p className="eyebrow">Quick switcher</p>
                <h3>{t.title}</h3>
              </div>
              <button type="button" className="button button-secondary" onClick={() => setOpen(false)}>
                {t.close}
              </button>
            </div>
            <input
              autoFocus
              className="search-input quick-switcher__input"
              type="search"
              placeholder={t.placeholder}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <div className="quick-switcher__list">
              {visibleActions.length ? (
                visibleActions.map((action) => (
                  <button
                    key={`${action.kind}:${action.href}:${action.label}`}
                    type="button"
                    className="quick-switcher__item"
                    onClick={() => {
                      setOpen(false);
                      if (action.href.startsWith('#')) {
                        const target = document.querySelector(action.href);
                        target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        return;
                      }

                      router.push(action.href);
                    }}
                  >
                    <span className="quick-switcher__kind">{kindLabels[locale][action.kind]}</span>
                    <strong>{action.label}</strong>
                    <small>{action.helper}</small>
                  </button>
                ))
              ) : (
                <div className="quick-switcher__empty">
                  <strong>{t.noResults}</strong>
                  <p>{t.noResultsBody}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
