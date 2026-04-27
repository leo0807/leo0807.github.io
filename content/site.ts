import type { Locale } from '@/lib/i18n';

export type Track = {
  title: string;
  artist: string;
  file: string;
  cover: string;
};

export type SiteContent = {
  name: string;
  title: string;
  description: string;
  nav: {
    projects: string;
    stack: string;
    contact: string;
    language: string;
    switchToEnglish: string;
    switchToChinese: string;
  };
  hero: {
    eyebrow: string;
    title: [string, string];
    lead: string;
    projects: string;
    resumeEnglish: string;
    resumeChinese: string;
    currentFocusLabel: string;
    currentFocusTitle: string;
    currentFocusBody: string;
  };
  about: {
    eyebrow: string;
    title: string;
    paragraphs: [string, string];
  };
  stack: {
    eyebrow: string;
    title: string;
    lead: string;
  };
  featured: {
    eyebrow: string;
    title: string;
    action: string;
  };
  projectsIndex: {
    eyebrow: string;
    title: string;
    lead: string;
  };
  projectDetail: {
    visit: string;
    source: string;
    back: string;
    role: string;
    focus: string;
  };
  contact: {
    eyebrow: string;
    title: string;
    lead: string;
    location: string;
    locationValue: string;
  };
  music: {
    eyebrow: string;
    title: string;
    note: string;
    prev: string;
    play: string;
    pause: string;
    next: string;
  };
  strengths: string[];
  contactLinks: Array<{ label: string; href: string; helper?: string }>;
};

export type SiteConfig = {
  name: string;
  title: string;
  description: string;
  url: string;
  ogImage: string;
  heroImage: string;
  aboutImage: string;
  updatedAt: string;
  keywords: string[];
  tracks: Track[];
};

export const siteConfig: SiteConfig = {
  name: 'Junxu Zhang',
  title: 'Junxu Zhang | 3D Portfolio',
  description:
    'A bilingual Next.js and React Three Fiber portfolio for Junxu Zhang, a software engineer at COMAC, featuring immersive 3D presentation, project detail pages, and scalable content architecture.',
  url: 'https://leo0807.github.io',
  ogImage: '/optimized/images/hero.jpg',
  heroImage: '/optimized/images/hero.jpg',
  aboutImage: '/optimized/images/about.jpg',
  updatedAt: '2026-04-28',
  keywords: [
    'Junxu Zhang',
    'Frontend Developer',
    'Next.js Portfolio',
    'React Three Fiber',
    'Three.js Portfolio',
    'Web Developer',
  ],
  tracks: [
    {
      title: 'Gymnopédies',
      artist: 'Erik Satie',
      file: '/music/Gymnopédies.mp3',
      cover: '/music-img/Gymnopédies.jpg',
    },
    {
      title: 'Old Town Road',
      artist: 'Lil Nas X',
      file: '/music/Old Town Road.mp3',
      cover: '/music-img/Lil Nas X.png',
    },
    {
      title: 'Daddy',
      artist: 'Coldplay',
      file: '/music/Daddy.mp3',
      cover: '/music-img/Daddy.png',
    },
  ],
};

const sharedLinks = [
  { label: 'GitHub', href: 'https://github.com/leo0807' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/junxu-zhang-38bb04185/', helper: 'COMAC software engineer' },
  { label: 'WeChat', href: 'https://weixin.qq.com/', helper: 'CallMeLeo1' },
];

const sharedStrengths = [
  'Next.js App Router',
  'React 19',
  'TypeScript',
  'Three.js / React Three Fiber',
  'R3F Postprocessing',
  'MDX Content Pipeline',
  'Bilingual Routing',
  'Static Export',
  'GitHub Actions Deploy',
  'JSON-LD SEO',
  'Optimized Assets',
  'SEO Metadata',
  'Structured Content',
];

const siteContent: Record<Locale, SiteContent> = {
  en: {
    name: 'Junxu Zhang',
    title: 'Junxu Zhang | 3D Portfolio',
    description:
      'A bilingual Next.js and React Three Fiber portfolio for Junxu Zhang, a software engineer at COMAC, with immersive 3D presentation, project detail pages, and an expandable content system.',
    nav: {
      projects: 'Projects',
      stack: 'Stack',
      contact: 'Contact',
      language: '中文',
      switchToEnglish: 'English',
      switchToChinese: '中文',
    },
    hero: {
      eyebrow: 'Next.js + R3F Portfolio',
      title: ['Spatial storytelling for the web,', 'designed to grow with new work.'],
      lead:
        'This portfolio is rebuilt on the Next.js App Router so the homepage, project pages, metadata, and future content additions all share one extensible architecture instead of living inside a single static file.',
      projects: 'View Projects',
      resumeEnglish: 'Resume EN',
      resumeChinese: '中文简历',
      currentFocusLabel: 'LinkedIn Snapshot',
      currentFocusTitle: 'Software engineer at COMAC with frontend and backend experience.',
      currentFocusBody:
        'Based in Perth, Western Australia, and educated at the University of Melbourne (2018-2020). I enjoy combining modern React architecture with motion, 3D, and content systems that can scale beyond a single landing page.',
    },
    about: {
      eyebrow: 'About',
      title: 'From a self-taught portfolio to a system that can evolve.',
      paragraphs: [
        'The previous site expressed experimentation and enthusiasm. This version keeps the same identity and media, but reorganizes everything around a stronger content model, better SEO, project-specific routes, and a more cinematic visual language. It now also reflects the public LinkedIn profile details, including current work at COMAC and study at the University of Melbourne.',
        'The result is a portfolio that works as both a polished landing page and a maintainable codebase for future case studies, writing, and new showcase work.',
      ],
    },
    stack: {
      eyebrow: 'Stack',
      title: 'Architecture chosen for growth, not just for one screen.',
      lead:
        'App Router for structure, static export for easy deployment, React Three Fiber for 3D presentation, and typed content objects for future project additions.',
    },
    featured: {
      eyebrow: 'Featured Work',
      title: 'Selected builds now linked to dedicated project pages.',
      action: 'See all projects',
    },
    projectsIndex: {
      eyebrow: 'Project Index',
      title: 'A route-driven project library ready for future case studies.',
      lead:
        'Each project is now powered by Markdown content and structured metadata, so expanding into deeper writeups or a content workflow later is straightforward.',
    },
    projectDetail: {
      visit: 'Visit Project',
      source: 'Source',
      back: 'Back to Projects',
      role: 'Role',
      focus: 'Focus',
    },
    contact: {
      eyebrow: 'Contact',
      title: "Let's build something clear, memorable, and ambitious.",
      lead: 'The contact channels from the original site are preserved, but now presented inside a cleaner information structure.',
      location: 'Location',
      locationValue: 'Perth, Western Australia',
    },
    music: {
      eyebrow: 'Soundtrack',
      title: 'Audio assets preserved from the original portfolio',
      note: 'This keeps the original playlist as a small personal signature inside the new build.',
      prev: 'Prev',
      play: 'Play',
      pause: 'Pause',
      next: 'Next',
    },
    strengths: sharedStrengths,
    contactLinks: sharedLinks,
  },
  zh: {
    name: 'Junxu Zhang',
    title: 'Junxu Zhang | 3D 作品集',
    description:
      '一个支持中英双语的 Next.js + React Three Fiber 个人作品集，展示张俊旭在 COMAC 的软件工程工作、沉浸式 3D 首页、项目详情页与可扩展内容体系。',
    nav: {
      projects: '项目',
      stack: '技术栈',
      contact: '联系',
      language: 'EN',
      switchToEnglish: 'English',
      switchToChinese: '中文',
    },
    hero: {
      eyebrow: 'Next.js + R3F 作品集',
      title: ['为网页打造空间化叙事，', '为持续增长的内容预留余地。'],
      lead:
        '这个作品集基于 Next.js App Router 重构，首页、项目页、SEO 元数据和后续新增内容都共享同一套可扩展架构，而不再被塞进单一静态文件里。',
      projects: '查看项目',
      resumeEnglish: '英文简历',
      resumeChinese: '中文简历',
      currentFocusLabel: 'LinkedIn 概览',
      currentFocusTitle: 'COMAC 的软件工程师，同时具备前端和后端经验。',
      currentFocusBody:
        '我目前在澳大利亚珀斯生活，毕业于墨尔本大学（2018-2020）。我喜欢把现代 React 架构、动效、3D 与可扩展内容系统结合起来，让一个作品集可以继续成长，而不是停在单页展示。',
    },
    about: {
      eyebrow: '关于',
      title: '从自学作品集，升级成一个可以继续演化的系统。',
      paragraphs: [
        '旧站更多是在表达尝试与热情；新版本保留了原来的身份与素材，但把它们重新组织到更清晰的内容模型、更完善的 SEO、项目详情路由和更具电影感的视觉语言里，同时也把 LinkedIn 里公开可见的履历信息整合了进来。',
        '现在这个作品集既能作为一个完成度更高的首页，也能作为以后继续扩展案例、写作和新项目展示的稳定代码底座。',
      ],
    },
    stack: {
      eyebrow: '技术栈',
      title: '这套架构追求的是成长性，而不是只服务于一个页面。',
      lead:
        '用 App Router 做结构组织，用静态导出适配 GitHub Pages，用 React Three Fiber 承载 3D 表现，用类型化内容对象为后续新增项目留好接口。',
    },
    featured: {
      eyebrow: '精选项目',
      title: '每个项目现在都拥有自己的详情页。',
      action: '查看全部项目',
    },
    projectsIndex: {
      eyebrow: '项目索引',
      title: '按路由组织的项目库，适合后续继续补案例。',
      lead:
        '每个项目现在都由 Markdown 内容和结构化元数据驱动，后面要继续扩展长文案例、项目说明或内容工作流都会轻松很多。',
    },
    projectDetail: {
      visit: '访问项目',
      source: '源码',
      back: '返回项目列表',
      role: '职责',
      focus: '关注点',
    },
    contact: {
      eyebrow: '联系',
      title: '一起做点清晰、耐看、并且有野心的东西。',
      lead: '保留了旧站的联系方式，但用更清楚的信息层级重新组织了一遍。',
      location: '所在地',
      locationValue: '澳大利亚珀斯',
    },
    music: {
      eyebrow: '背景音乐',
      title: '保留原站里的音乐素材',
      note: '把原来的播放列表留在新站里，作为一个很小但有个人印记的细节。',
      prev: '上一首',
      play: '播放',
      pause: '暂停',
      next: '下一首',
    },
    strengths: [
      'Next.js App Router',
      'React 19',
      'TypeScript',
      'Three.js / React Three Fiber',
      'R3F Postprocessing',
      'MDX 内容管线',
      '双语路由',
      '静态导出',
      'GitHub Actions 部署',
      'JSON-LD SEO',
      '资源优化',
      'SEO 元数据',
      '结构化内容',
    ],
    contactLinks: [
      { label: 'GitHub', href: 'https://github.com/leo0807' },
      { label: '领英', href: 'https://www.linkedin.com/in/junxu-zhang-38bb04185/' },
      { label: '微信', href: 'https://weixin.qq.com/', helper: 'CallMeLeo1' },
    ],
  },
};

export function getSiteContent(locale: Locale) {
  return siteContent[locale];
}

export { sharedLinks as contactLinks, sharedStrengths as strengths };
