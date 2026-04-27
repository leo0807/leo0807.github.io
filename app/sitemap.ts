import type { MetadataRoute } from 'next';
import { getBlogPosts } from '@/content/blogs';
import { getProjects } from '@/content/projects';
import { siteConfig } from '@/content/site';
import { defaultLocale } from '@/lib/i18n';

export const dynamic = 'force-static';
export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects(defaultLocale);
  const blogPosts = await getBlogPosts(defaultLocale);
  const projectRoutes = projects.flatMap((project) => [
    {
      url: `${siteConfig.url}/projects/${project.slug}/`,
      lastModified: siteConfig.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/zh/projects/${project.slug}/`,
      lastModified: siteConfig.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
  ]);
  const blogRoutes = blogPosts.flatMap((post) => [
    {
      url: `${siteConfig.url}/blog/${post.slug}/`,
      lastModified: siteConfig.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${siteConfig.url}/zh/blog/${post.slug}/`,
      lastModified: siteConfig.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ]);

  return [
    {
      url: siteConfig.url,
      lastModified: siteConfig.updatedAt,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${siteConfig.url}/zh/`,
      lastModified: siteConfig.updatedAt,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${siteConfig.url}/projects/`,
      lastModified: siteConfig.updatedAt,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/zh/projects/`,
      lastModified: siteConfig.updatedAt,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    ...projectRoutes,
    {
      url: `${siteConfig.url}/blog/`,
      lastModified: siteConfig.updatedAt,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${siteConfig.url}/zh/blog/`,
      lastModified: siteConfig.updatedAt,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    ...blogRoutes,
  ];
}
