import Link from 'next/link';
import type { BlogDocument, BlogPost } from '@/content/blogs';
import type { SiteContent } from '@/content/site';
import type { Locale } from '@/lib/i18n';
import { localizedPath } from '@/lib/i18n';
import { SectionHeading } from '@/components/site/section-heading';

type BlogIndexPageProps = {
  locale: Locale;
  content: SiteContent;
  posts: BlogPost[];
};

type BlogDetailPageProps = {
  locale: Locale;
  content: SiteContent;
  post: BlogDocument;
};

export function BlogIndexPage({ locale, content, posts }: BlogIndexPageProps) {
  return (
    <main className="subpage-shell">
      <section className="surface subpage-hero">
        <SectionHeading eyebrow={content.blogIndex.eyebrow} title={content.blogIndex.title} />
        <p className="lead compact">{content.blogIndex.lead}</p>
      </section>
      <section className="blog-grid">
        {posts.map((post) => (
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
        ))}
      </section>
    </main>
  );
}

export function BlogDetailPage({ locale, content, post }: BlogDetailPageProps) {
  return (
    <main className="subpage-shell">
      <article className="surface project-detail blog-detail">
        <div className="project-detail__media">
          <img src={post.cover} alt={post.title} loading="eager" decoding="async" />
        </div>
        <div className="project-detail__body">
          <p className="eyebrow">{post.tag}</p>
          <h1>{post.title}</h1>
          <div className="blog-detail__meta">
            <span>{post.date}</span>
            <span>{post.readingTime}</span>
          </div>
          <p className="lead compact">{post.summary}</p>
          <div className="button-row">
            <Link className="button button-secondary" href={localizedPath(locale, '/blog/')}>
              {content.blogDetail.back}
            </Link>
          </div>
          <div className="project-mdx">{post.content}</div>
        </div>
      </article>
    </main>
  );
}
