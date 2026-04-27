import fs from 'node:fs/promises';
import path from 'node:path';
import type { ReactNode } from 'react';
import { cache } from 'react';
import { compileMDX } from 'next-mdx-remote/rsc';
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

export type BlogPost = BlogFrontmatter & {
  locale: Locale;
};

export type BlogDocument = BlogPost & {
  content: ReactNode;
};

const blogRoot = path.join(process.cwd(), 'content', 'blogs');

function getLocaleDir(locale: Locale) {
  return path.join(blogRoot, locale);
}

async function readBlogSource(locale: Locale, slug: string) {
  return fs.readFile(path.join(getLocaleDir(locale), `${slug}.mdx`), 'utf8');
}

const loadBlogDocument = cache(async (locale: Locale, slug: string): Promise<BlogDocument | null> => {
  try {
    const source = await readBlogSource(locale, slug);
    const { content, frontmatter } = await compileMDX<BlogFrontmatter>({
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
