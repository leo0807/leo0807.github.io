import type { Metadata } from 'next';
import { BlogIndexPage } from '@/components/site/blog-pages';
import { JsonLd } from '@/components/site/json-ld';
import { getBlogPosts } from '@/content/blogs';
import { getSiteContent, siteConfig } from '@/content/site';
import { defaultLocale } from '@/lib/i18n';

const content = getSiteContent(defaultLocale);

export const metadata: Metadata = {
  title: content.blogIndex.title,
  description: content.blogIndex.lead,
  alternates: {
    canonical: '/blog/',
    languages: {
      en: '/blog/',
      zh: '/zh/blog/',
    },
  },
};

export default async function BlogPage() {
  const posts = await getBlogPosts(defaultLocale);

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Blog',
          name: content.blogIndex.eyebrow,
          url: `${siteConfig.url}/blog/`,
        }}
      />
      <BlogIndexPage locale={defaultLocale} content={content} posts={posts} />
    </>
  );
}
