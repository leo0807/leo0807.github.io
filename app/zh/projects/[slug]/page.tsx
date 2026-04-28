import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/site/json-ld';
import { ProjectDetailPage as ProjectDetailView } from '@/components/site/project-pages';
import { getProjectBySlug, getProjects } from '@/content/projects';
import { getSiteContent, siteConfig } from '@/content/site';

const locale = 'zh' as const;
const content = getSiteContent(locale);

type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const projects = await getProjects(locale);

  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(locale, slug);

  if (!project) {
    return {
      title: '项目不存在',
    };
  }

  return {
    title: project.title,
    description: project.seoDescription,
    alternates: {
      canonical: `/zh/projects/${project.slug}/`,
      languages: {
        en: `/projects/${project.slug}/`,
        zh: `/zh/projects/${project.slug}/`,
      },
    },
    openGraph: {
      title: project.title,
      description: project.seoDescription,
      url: `${siteConfig.url}/zh/projects/${project.slug}/`,
      images: [
        {
          url: project.image,
          alt: project.title,
        },
      ],
    },
  };
}

export default async function ProjectDetailPageRoute({ params }: ProjectPageProps) {
  const { slug } = await params;
  const [project, projects] = await Promise.all([getProjectBySlug(locale, slug), getProjects(locale)]);

  if (!project) {
    notFound();
  }

  const relatedProjects = projects
    .filter((item) => item.slug !== project.slug)
    .sort((left, right) => {
      const leftTagMatch = left.tag === project.tag ? 0 : 1;
      const rightTagMatch = right.tag === project.tag ? 0 : 1;

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
          '@type': 'CreativeWork',
          name: project.title,
          description: project.seoDescription,
          url: `${siteConfig.url}/zh/projects/${project.slug}/`,
          image: `${siteConfig.url}${project.image}`,
          creator: {
            '@type': 'Person',
            name: siteConfig.name,
          },
        }}
      />
      <ProjectDetailView
        locale={locale}
        content={content}
        project={project}
        relatedProjects={relatedProjects}
      />
    </>
  );
}
