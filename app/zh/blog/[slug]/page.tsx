import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BlogDetailPage } from '@/components/site/blog-pages';
import { JsonLd } from '@/components/site/json-ld';
import { getBlogPostBySlug, getBlogPosts, getBlogSlugs } from '@/content/blogs';
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
  const [post, posts] = await Promise.all([getBlogPostBySlug(locale, slug), getBlogPosts(locale)]);

  if (!post) notFound();

  const seriesPosts = posts
    .filter((item) => item.slug !== post.slug && item.tag === post.tag)
    .sort((left, right) => left.order - right.order)
    .slice(0, 3);

  const relatedPosts = posts
    .filter((item) => item.slug !== post.slug)
    .sort((left, right) => {
      const leftTagMatch = left.tag === post.tag ? 0 : 1;
      const rightTagMatch = right.tag === post.tag ? 0 : 1;

      if (leftTagMatch !== rightTagMatch) {
        return leftTagMatch - rightTagMatch;
      }

      return left.order - right.order;
    })
    .slice(0, 3);

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
      <BlogDetailPage locale={locale} content={content} post={post} seriesPosts={seriesPosts} relatedPosts={relatedPosts} />
    </>
  );
}
