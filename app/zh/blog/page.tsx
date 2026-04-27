import type { Metadata } from 'next';
import { BlogIndexPage } from '@/components/site/blog-pages';
import { JsonLd } from '@/components/site/json-ld';
import { getBlogPosts } from '@/content/blogs';
import { getSiteContent, siteConfig } from '@/content/site';

const locale = 'zh' as const;
const content = getSiteContent(locale);

export const metadata: Metadata = {
  title: content.blogIndex.title,
  description: content.blogIndex.lead,
  alternates: {
    canonical: '/zh/blog/',
    languages: {
      en: '/blog/',
      zh: '/zh/blog/',
    },
  },
};

export default async function BlogPage() {
  const posts = await getBlogPosts(locale);

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Blog',
          name: content.blogIndex.eyebrow,
          url: `${siteConfig.url}/zh/blog/`,
        }}
      />
      <BlogIndexPage locale={locale} content={content} posts={posts} />
    </>
  );
}
