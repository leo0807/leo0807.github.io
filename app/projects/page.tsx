import type { Metadata } from 'next';
import { JsonLd } from '@/components/site/json-ld';
import { getProjects } from '@/content/projects';
import { ProjectIndexPage } from '@/components/site/project-pages';
import { getSiteContent, siteConfig } from '@/content/site';
import { defaultLocale } from '@/lib/i18n';
const content = getSiteContent(defaultLocale);

export const metadata: Metadata = {
  title: content.projectsIndex.title,
  description: content.projectsIndex.lead,
  alternates: {
    canonical: '/projects/',
    languages: {
      en: '/projects/',
      zh: '/zh/projects/',
    },
  },
};

export default async function ProjectsPage() {
  const projects = await getProjects(defaultLocale);

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: content.projectsIndex.eyebrow,
          url: `${siteConfig.url}/projects/`,
        }}
      />
      <ProjectIndexPage locale={defaultLocale} siteConfig={siteConfig} content={content} projects={projects} />
    </>
  );
}
