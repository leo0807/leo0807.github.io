import fs from 'node:fs/promises';
import path from 'node:path';
import type { ReactNode } from 'react';
import { cache } from 'react';
import { compileMDX } from 'next-mdx-remote/rsc';
import type { Locale } from '@/lib/i18n';

export type ProjectFrontmatter = {
  order: number;
  slug: string;
  title: string;
  tag: string;
  summary: string;
  seoDescription: string;
  image: string;
  liveUrl: string;
  repoUrl?: string;
  role: string;
  focus: string;
  featured?: boolean;
  tech: string[];
};

export type Project = ProjectFrontmatter & {
  locale: Locale;
};

export type ProjectDocument = Project & {
  content: ReactNode;
};

const projectRoot = path.join(process.cwd(), 'content', 'projects');

function getLocaleDir(locale: Locale) {
  return path.join(projectRoot, locale);
}

async function readProjectSource(locale: Locale, slug: string) {
  return fs.readFile(path.join(getLocaleDir(locale), `${slug}.mdx`), 'utf8');
}

const loadProjectDocument = cache(async (locale: Locale, slug: string): Promise<ProjectDocument | null> => {
  try {
    const source = await readProjectSource(locale, slug);
    const { content, frontmatter } = await compileMDX<ProjectFrontmatter>({
      source,
      options: {
        parseFrontmatter: true,
      },
    });

    return {
      ...frontmatter,
      content,
      locale,
    };
  } catch {
    return null;
  }
});

const loadProjectSummaries = cache(async (locale: Locale): Promise<Project[]> => {
  const directory = getLocaleDir(locale);
  const files = await fs.readdir(directory);
  const slugs = files.filter((file) => file.endsWith('.mdx')).map((file) => file.replace(/\.mdx$/, ''));
  const documents = await Promise.all(slugs.map(async (slug) => loadProjectDocument(locale, slug)));

  return documents
    .filter((document): document is ProjectDocument => document !== null)
    .sort((left, right) => left.order - right.order)
    .map(({ content: _content, ...project }) => project);
});

export const getProjects = loadProjectSummaries;

export const getFeaturedProjects = cache(async (locale: Locale) => {
  return (await getProjects(locale)).filter((project) => project.featured);
});

export const getProjectBySlug = loadProjectDocument;

export const getProjectSlugs = cache(async (locale: Locale) => {
  return (await getProjects(locale)).map((project) => project.slug);
});
