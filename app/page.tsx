import type { Metadata } from 'next';
import { PortfolioHome } from '@/components/site/portfolio-home';
import { JsonLd } from '@/components/site/json-ld';
import { getFeaturedProjects, getProjects } from '@/content/projects';
import { getSiteContent, siteConfig } from '@/content/site';
import { defaultLocale } from '@/lib/i18n';

const content = getSiteContent(defaultLocale);

export const metadata: Metadata = {
  title: content.title,
  description: content.description,
  alternates: {
    canonical: '/',
    languages: {
      en: '/',
      zh: '/zh/',
    },
  },
};

export default async function HomePage() {
  const [projects, featuredProjects] = await Promise.all([
    getProjects(defaultLocale),
    getFeaturedProjects(defaultLocale),
  ]);

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: siteConfig.name,
          url: siteConfig.url,
          jobTitle: 'Frontend Developer',
          image: `${siteConfig.url}${siteConfig.heroImage}`,
          sameAs: content.contactLinks.map((link) => link.href).filter((href) => href.startsWith('http')),
        }}
      />
      <PortfolioHome
        locale={defaultLocale}
        siteConfig={siteConfig}
        content={content}
        projects={projects}
        featuredProjects={featuredProjects}
      />
    </>
  );
}
