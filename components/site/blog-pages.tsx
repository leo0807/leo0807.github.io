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
  relatedPosts: BlogPost[];
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

export function BlogDetailPage({ locale, content, post, relatedPosts }: BlogDetailPageProps) {
  return (
    <main className="subpage-shell">
      <section className="blog-detail__layout">
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
            <div className="blog-detail__overview">
              <span className="label">{content.blogDetail.overview}</span>
              <p>{content.blogIndex.lead}</p>
            </div>
            <div className="project-mdx">{post.content}</div>
          </div>
        </article>

        <aside className="blog-detail__rail">
          <section className="surface detail-rail-card">
            <span className="label">{content.blogDetail.overview}</span>
            <div className="detail-rail-card__stack">
              <div>
                <span className="label">{content.blogDetail.date}</span>
                <strong>{post.date}</strong>
              </div>
              <div>
                <span className="label">{content.blogDetail.reading}</span>
                <strong>{post.readingTime}</strong>
              </div>
            </div>
          </section>

          <section className="surface detail-rail-card">
            <span className="label">{content.blogDetail.related}</span>
            <p>{content.blogDetail.relatedLead}</p>
            <div className="related-list">
              {relatedPosts.map((item) => (
                <Link key={item.slug} className="related-card" href={localizedPath(locale, `/blog/${item.slug}/`)}>
                  <img src={item.cover} alt={item.title} loading="lazy" decoding="async" />
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
