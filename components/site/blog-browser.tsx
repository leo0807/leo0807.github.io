'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { BlogPost } from '@/content/blogs';
import type { SiteContent } from '@/content/site';
import type { Locale } from '@/lib/i18n';
import { localizedPath } from '@/lib/i18n';

type BlogBrowserProps = {
  locale: Locale;
  content: SiteContent;
  posts: BlogPost[];
};

export function BlogBrowser({ locale, content, posts }: BlogBrowserProps) {
  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState(locale === 'zh' ? '全部' : 'All');
  const allLabel = locale === 'zh' ? '全部' : 'All';
  const placeholder = locale === 'zh' ? '搜索文章' : 'Search posts';
  const emptyTitle = locale === 'zh' ? '没有匹配的文章。' : 'No posts match your search.';
  const emptyBody =
    locale === 'zh'
      ? '试试换一个关键词，或者把标签筛选切回“全部”。'
      : 'Try another keyword or switch the tag filter back to All.';

  const tags = useMemo(() => [allLabel, ...Array.from(new Set(posts.map((post) => post.tag)))], [allLabel, posts]);

  const visiblePosts = useMemo(() => {
    const loweredQuery = query.trim().toLowerCase();

    return posts.filter((post) => {
      const matchesTag = activeTag === allLabel || post.tag === activeTag;
      const haystack = [post.title, post.summary, post.tag].join(' ').toLowerCase();
      const matchesQuery = !loweredQuery || haystack.includes(loweredQuery);

      return matchesTag && matchesQuery;
    });
  }, [activeTag, posts, query]);

  return (
    <>
      <section className="surface subpage-hero">
        <div className="section-heading section-heading--stacked">
          <div>
            <p className="section-heading__eyebrow">{content.blogIndex.eyebrow}</p>
            <h2>{content.blogIndex.title}</h2>
          </div>
        </div>
        <p className="lead compact">{content.blogIndex.lead}</p>
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
      <section className="blog-grid">
        {visiblePosts.length ? (
          visiblePosts.map((post) => (
            <article key={post.slug} className="surface blog-card">
              <Link className="blog-card__link" href={localizedPath(locale, `/blog/${post.slug}/`)}>
                <img src={post.cover} alt={post.title} loading="lazy" decoding="async" />
                <div className="blog-card__copy">
                  <span className="project-tag">{post.tag}</span>
                  <h2>{post.title}</h2>
                  <p>{post.summary}</p>
                  <div className="blog-card__meta">
                    <span>{post.date}</span>
                    <span>{post.readingTime}</span>
                  </div>
                </div>
              </Link>
            </article>
          ))
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
