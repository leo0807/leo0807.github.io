'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Locale } from '@/lib/i18n';
import { localizedPath } from '@/lib/i18n';
import type { Project } from '@/content/projects';
import type { BlogPost } from '@/content/blogs';
import type { SiteContent } from '@/content/site';

type QuickSwitcherProps = {
  locale: Locale;
  content: SiteContent;
  projects: Project[];
  posts: BlogPost[];
};

type QuickAction = {
  label: string;
  helper: string;
  href: string;
  kind: 'page' | 'project' | 'post' | 'section';
};

export function QuickSwitcher({ locale, content, projects, posts }: QuickSwitcherProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const actions = useMemo<QuickAction[]>(() => {
    const baseActions: QuickAction[] = [
      { label: content.nav.projects, helper: locale === 'zh' ? '前往项目页' : 'Open the project index', href: localizedPath(locale, '/projects/'), kind: 'page' },
      { label: content.nav.blog, helper: locale === 'zh' ? '前往博客页' : 'Open the blog index', href: localizedPath(locale, '/blog/'), kind: 'page' },
      { label: content.nav.stack, helper: locale === 'zh' ? '跳到技术栈区块' : 'Jump to the stack section', href: '#stack', kind: 'section' },
      { label: content.nav.contact, helper: locale === 'zh' ? '跳到联系区块' : 'Jump to the contact section', href: '#contact', kind: 'section' },
    ];

    const projectActions = projects.map((project) => ({
      label: project.title,
      helper: project.summary,
      href: localizedPath(locale, `/projects/${project.slug}/`),
      kind: 'project' as const,
    }));

    const blogActions = posts.map((post) => ({
      label: post.title,
      helper: post.summary,
      href: localizedPath(locale, `/blog/${post.slug}/`),
      kind: 'post' as const,
    }));

    return [...baseActions, ...projectActions, ...blogActions];
  }, [content.nav.blog, content.nav.contact, content.nav.projects, content.nav.stack, locale, posts, projects]);

  const visibleActions = useMemo(() => {
    const loweredQuery = query.trim().toLowerCase();

    if (!loweredQuery) return actions;

    return actions.filter((action) => {
      const haystack = [action.label, action.helper, action.kind].join(' ').toLowerCase();
      return haystack.includes(loweredQuery);
    });
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
        aria-label={locale === 'zh' ? '打开快速切换器' : 'Open quick switcher'}
      >
        <span>⌘K</span>
      </button>

      {open ? (
        <div className="quick-switcher" role="dialog" aria-modal="true" aria-label="Quick switcher" onClick={() => setOpen(false)}>
          <div className="quick-switcher__panel surface" onClick={(event) => event.stopPropagation()}>
            <div className="quick-switcher__head">
              <div>
                <p className="eyebrow">Quick switcher</p>
                <h3>{locale === 'zh' ? '搜索页面、项目和文章' : 'Search pages, projects, and posts'}</h3>
              </div>
              <button type="button" className="button button-secondary" onClick={() => setOpen(false)}>
                {locale === 'zh' ? '关闭' : 'Close'}
              </button>
            </div>
            <input
              autoFocus
              className="search-input quick-switcher__input"
              type="search"
              placeholder={locale === 'zh' ? '输入关键词搜索' : 'Type to search'}
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
                    <span className="quick-switcher__kind">{action.kind}</span>
                    <strong>{action.label}</strong>
                    <small>{action.helper}</small>
                  </button>
                ))
              ) : (
                <div className="quick-switcher__empty">
                  <strong>{locale === 'zh' ? '没有匹配结果。' : 'No results found.'}</strong>
                  <p>{locale === 'zh' ? '换一个关键词试试，或者直接跳转到页面。' : 'Try another keyword or jump straight to a page.'}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
