import fs from 'node:fs/promises';
import path from 'node:path';
import type { ReactNode } from 'react';
import { cache } from 'react';
import { compileMDX } from 'next-mdx-remote/rsc';
import { MdxH2, MdxH3 } from '@/components/site/mdx-heading';
import type { Locale } from '@/lib/i18n';

export type BlogFrontmatter = {
  order: number;
  slug: string;
  title: string;
  tag: string;
  summary: string;
  seoDescription: string;
  cover: string;
  date: string;
  readingTime: string;
  featured?: boolean;
};

export type BlogHeading = {
  id: string;
  level: 2 | 3;
  title: string;
};

export type BlogPost = BlogFrontmatter & {
  locale: Locale;
};

export type BlogDocument = BlogPost & {
  content: ReactNode;
  headings: BlogHeading[];
};

const blogRoot = path.join(process.cwd(), 'content', 'blogs');

function getLocaleDir(locale: Locale) {
  return path.join(blogRoot, locale);
}

async function readBlogSource(locale: Locale, slug: string) {
  return fs.readFile(path.join(getLocaleDir(locale), `${slug}.mdx`), 'utf8');
}

function slugifyHeading(title: string) {
  return title
    .trim()
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9\u4e00-\u9fff]+/gu, '-')
    .replace(/^-+|-+$/g, '');
}

function extractHeadings(source: string): BlogHeading[] {
  const headings: BlogHeading[] = [];
  const seen = new Map<string, number>();
  const headingPattern = /^(#{2,3})\s+(.+)$/gm;
  let match: RegExpExecArray | null;

  while ((match = headingPattern.exec(source))) {
    const level = match[1].length as 2 | 3;
    const title = match[2].trim();
    const baseId = slugifyHeading(title) || `section-${headings.length + 1}`;
    const count = (seen.get(baseId) ?? 0) + 1;
    seen.set(baseId, count);
    const id = count === 1 ? baseId : `${baseId}-${count}`;

    headings.push({ id, level, title });
  }

  return headings;
}

const loadBlogDocument = cache(async (locale: Locale, slug: string): Promise<BlogDocument | null> => {
  try {
    const source = await readBlogSource(locale, slug);
    const headings = extractHeadings(source);
    const { content, frontmatter } = await compileMDX<BlogFrontmatter>({
      source,
      options: {
        parseFrontmatter: true,
      },
      components: {
        h2: MdxH2,
        h3: MdxH3,
      },
    });

    return {
      ...frontmatter,
      content,
      headings,
      locale,
    };
  } catch {
    return null;
  }
});

const loadBlogSummaries = cache(async (locale: Locale): Promise<BlogPost[]> => {
  const directory = getLocaleDir(locale);
  const files = await fs.readdir(directory);
  const slugs = files.filter((file) => file.endsWith('.mdx')).map((file) => file.replace(/\.mdx$/, ''));
  const documents = await Promise.all(slugs.map(async (slug) => loadBlogDocument(locale, slug)));

  return documents
    .filter((document): document is BlogDocument => document !== null)
    .sort((left, right) => left.order - right.order)
    .map(({ content: _content, ...post }) => post);
});

export const getBlogPosts = loadBlogSummaries;

export const getFeaturedBlogPosts = cache(async (locale: Locale) => {
  return (await getBlogPosts(locale)).filter((post) => post.featured);
});

export const getBlogPostBySlug = loadBlogDocument;

export const getBlogSlugs = cache(async (locale: Locale) => {
  return (await getBlogPosts(locale)).map((post) => post.slug);
});
