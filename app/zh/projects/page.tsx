import type { Metadata } from 'next';
import { JsonLd } from '@/components/site/json-ld';
import { ProjectBrowser } from '@/components/site/project-browser';
import { getProjects } from '@/content/projects';
import { getSiteContent, siteConfig } from '@/content/site';

const locale = 'zh' as const;
const content = getSiteContent(locale);

export const metadata: Metadata = {
  title: content.projectsIndex.title,
  description: content.projectsIndex.lead,
  alternates: {
    canonical: '/zh/projects/',
    languages: {
      en: '/projects/',
      zh: '/zh/projects/',
    },
  },
};

export default async function ProjectsPage() {
  const projects = await getProjects(locale);

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: content.projectsIndex.eyebrow,
          url: `${siteConfig.url}/zh/projects/`,
        }}
      />
      <ProjectBrowser locale={locale} content={content} projects={projects} />
    </>
  );
}
