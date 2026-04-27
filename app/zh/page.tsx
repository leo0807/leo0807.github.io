import type { Metadata } from 'next';
import { PortfolioHome } from '@/components/site/portfolio-home';
import { JsonLd } from '@/components/site/json-ld';
import { getFeaturedProjects, getProjects } from '@/content/projects';
import { getSiteContent, siteConfig } from '@/content/site';

const locale = 'zh' as const;
const content = getSiteContent(locale);

export const metadata: Metadata = {
  title: content.title,
  description: content.description,
  alternates: {
    canonical: '/zh/',
    languages: {
      en: '/',
      zh: '/zh/',
    },
  },
};

export default async function HomePage() {
  const [projects, featuredProjects] = await Promise.all([getProjects(locale), getFeaturedProjects(locale)]);

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: siteConfig.name,
          url: `${siteConfig.url}/zh/`,
          jobTitle: '前端开发',
          image: `${siteConfig.url}${siteConfig.heroImage}`,
          sameAs: content.contactLinks.map((link) => link.href).filter((href) => href.startsWith('http')),
        }}
      />
      <PortfolioHome
        locale={locale}
        siteConfig={siteConfig}
        content={content}
        projects={projects}
        featuredProjects={featuredProjects}
      />
    </>
  );
}
