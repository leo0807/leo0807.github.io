import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BlogDetailPage } from '@/components/site/blog-pages';
import { JsonLd } from '@/components/site/json-ld';
import { getBlogPostBySlug, getBlogSlugs } from '@/content/blogs';
import { getSiteContent, siteConfig } from '@/content/site';

const locale = 'zh' as const;
const content = getSiteContent(locale);

export async function generateStaticParams() {
  const slugs = await getBlogSlugs(locale);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(locale, slug);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.seoDescription,
    alternates: {
      canonical: `/zh/blog/${post.slug}/`,
      languages: {
        en: `/blog/${post.slug}/`,
        zh: `/zh/blog/${post.slug}/`,
      },
    },
    openGraph: {
      title: post.title,
      description: post.seoDescription,
      url: `${siteConfig.url}/zh/blog/${post.slug}/`,
      images: [
        {
          url: `${siteConfig.url}${post.cover}`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
  };
}

export default async function BlogDetailRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(locale, slug);

  if (!post) notFound();

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.summary,
          url: `${siteConfig.url}/zh/blog/${post.slug}/`,
          image: `${siteConfig.url}${post.cover}`,
          author: {
            '@type': 'Person',
            name: siteConfig.name,
          },
        }}
      />
      <BlogDetailPage locale={locale} content={content} post={post} />
    </>
  );
}
