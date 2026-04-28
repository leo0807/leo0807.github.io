import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { HtmlLanguageSync } from '@/components/site/html-language-sync';
import { QuickSwitcher } from '@/components/site/quick-switcher';
import { ScrollToTop } from '@/components/site/scroll-to-top';
import { getBlogPosts } from '@/content/blogs';
import { getProjects } from '@/content/projects';
import { siteConfig } from '@/content/site';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} portfolio preview`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  icons: {
    icon: '/icon/J.ico',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const [enProjects, zhProjects, enPosts, zhPosts] = await Promise.all([
    getProjects('en'),
    getProjects('zh'),
    getBlogPosts('en'),
    getBlogPosts('zh'),
  ]);

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <HtmlLanguageSync />
        <ScrollToTop />
        {children}
        <QuickSwitcher
          projectsByLocale={{
            en: enProjects,
            zh: zhProjects,
          }}
          postsByLocale={{
            en: enPosts,
            zh: zhPosts,
          }}
        />
      </body>
    </html>
  );
}
