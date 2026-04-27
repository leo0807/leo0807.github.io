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
    blog: string;
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
  signals: {
    eyebrow: string;
    title: string;
    lead: string;
    cards: Array<{
      title: string;
      body: string;
    }>;
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
  blogIndex: {
    eyebrow: string;
    title: string;
    lead: string;
    action: string;
  };
  blogDetail: {
    back: string;
    readMore: string;
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
    expand: string;
    collapse: string;
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
  title: 'Junxu Zhang | AI Engineering Portfolio',
  description:
    'A bilingual Next.js and React Three Fiber portfolio for Junxu Zhang, a software engineer at COMAC, featuring immersive 3D presentation, project detail pages, and scalable content architecture.',
  url: 'https://leo0807.github.io',
  ogImage: '/optimized/images/hero.jpg',
  heroImage: '/optimized/images/hero.jpg',
  aboutImage: '/optimized/images/about.jpg',
  updatedAt: '2026-04-28',
  keywords: [
    'Junxu Zhang',
    'AI Engineer',
    'Full-Stack AI Engineer',
    'LLM Applications',
    'React Three Fiber',
    'RAG',
    'Multi-Agent Systems',
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
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/junxu-zhang-38bb04185/', helper: 'Full-stack AI engineer' },
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
    title: 'Junxu Zhang | AI Engineering Portfolio',
    description:
      'A bilingual Next.js and React Three Fiber portfolio for Junxu Zhang, a software engineer at COMAC, with immersive 3D presentation, project detail pages, and an expandable content system.',
    nav: {
      projects: 'Projects',
      blog: 'Blog',
      stack: 'Stack',
      contact: 'Contact',
      language: '中文',
      switchToEnglish: 'English',
      switchToChinese: '中文',
    },
    hero: {
      eyebrow: 'Next.js + R3F Portfolio',
      title: ['AI systems that ship,', 'with product-grade interfaces.'],
      lead:
        'This portfolio is rebuilt on the Next.js App Router so the homepage, project pages, metadata, and future content additions all share one extensible architecture instead of living inside a single static file. The visual language now leans toward AI product engineering rather than a generic frontend showcase.',
      projects: 'View Projects',
      resumeEnglish: 'Latest Resume',
      resumeChinese: '中文简历',
      currentFocusLabel: 'LinkedIn Snapshot',
      currentFocusTitle: 'Full-stack AI engineer focused on LLM applications, RAG, and agent systems.',
      currentFocusBody:
        'Based in Perth, Western Australia, and educated at the University of Melbourne (2018-2020). At COMAC, I work on production LLM systems, model routing, retrieval pipelines, and multi-agent workflows.',
    },
    about: {
      eyebrow: 'About',
      title: 'From a self-taught portfolio to an AI engineering studio.',
      paragraphs: [
        'The previous site expressed experimentation and enthusiasm. This version keeps the same identity and media, but reorganizes everything around a stronger content model, better SEO, project-specific routes, and a more cinematic visual language. It now also reflects the public LinkedIn profile details, including work on LLM systems at COMAC and study at the University of Melbourne.',
        'The result is a portfolio that works as both a polished landing page and a maintainable codebase for future case studies, writing, and AI showcases.',
      ],
    },
    stack: {
      eyebrow: 'Stack',
      title: 'Architecture chosen for growth, inference, and shipping.',
      lead:
        'App Router for structure, static export for easy deployment, React Three Fiber for 3D presentation, MDX for content, and typed content objects for future project additions.',
    },
    signals: {
      eyebrow: 'AI Systems',
      title: 'Recent work now reads like an engineering portfolio, not just a visual gallery.',
      lead:
        'These capabilities echo the latest resume and make the homepage feel closer to a modern AI engineering surface.',
      cards: [
        {
          title: 'RAG Knowledge Systems',
          body: 'Hybrid retrieval, embedding strategy tuning, Chinese technical text handling, and production internal Q&A pipelines.',
        },
        {
          title: 'Multi-Agent Workflows',
          body: 'LangGraph state machines, tool routing, self-healing loops, and streamed reasoning with SSE.',
        },
        {
          title: 'Model Routing & Observability',
          body: 'Task classification, DeepSeek / Qwen dispatch, private deployment options, and Langfuse / OpenTelemetry tracing.',
        },
      ],
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
    blogIndex: {
      eyebrow: 'Blog',
      title: 'A place to write, explain, and keep adding depth to the portfolio.',
      lead:
        'Blog posts use MDX, so you can write long-form notes, technical breakdowns, and bilingual articles without changing the app structure.',
      action: 'Read all posts',
    },
    blogDetail: {
      back: 'Back to Blog',
      readMore: 'Read more',
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
      title: "Let's build something sharp, intelligent, and ambitious.",
      lead: 'The contact channels from the original site are preserved, but now presented inside a cleaner information structure.',
      location: 'Location',
      locationValue: 'Perth, Western Australia',
    },
    music: {
      eyebrow: 'Soundtrack',
      title: 'Audio assets preserved from the original portfolio',
      note: 'This keeps the original playlist as a small personal signature inside the new build.',
      expand: 'Open player',
      collapse: 'Collapse player',
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
    title: 'Junxu Zhang | AI 工程作品集',
    description:
      '一个支持中英双语的 Next.js + React Three Fiber 个人作品集，展示张俊旭在 COMAC 的软件工程工作、沉浸式 3D 首页、项目详情页与可扩展内容体系。',
    nav: {
      projects: '项目',
      blog: '博客',
      stack: '技术栈',
      contact: '联系',
      language: 'EN',
      switchToEnglish: 'English',
      switchToChinese: '中文',
    },
    hero: {
      eyebrow: 'Next.js + R3F 作品集',
      title: ['AI系统稳定交付，', '界面也要像产品。'],
      lead:
        '这个作品集基于 Next.js App Router 重构，首页、项目页、SEO 元数据和后续新增内容都共享同一套可扩展架构，而不再被塞进单一静态文件里。现在的视觉语言更偏向 AI 工程与产品化展示。',
      projects: '查看项目',
      resumeEnglish: '最新简历',
      resumeChinese: '中文简历',
      currentFocusLabel: 'LinkedIn 概览',
      currentFocusTitle: '专注 LLM 应用、RAG 和多智能体系统的全栈 AI 工程师。',
      currentFocusBody:
        '我目前在澳大利亚珀斯生活，毕业于墨尔本大学（2018-2020）。在 COMAC，我主要做生产级 LLM 系统、模型路由、检索管线和多智能体工作流。',
    },
    about: {
      eyebrow: '关于',
      title: '从自学作品集，升级成一个 AI 工程展示台。',
      paragraphs: [
        '旧站更多是在表达尝试与热情；新版本保留了原来的身份与素材，但把它们重新组织到更清晰的内容模型、更完善的 SEO、项目详情路由和更具产品感的视觉语言里，同时也把 LinkedIn 里公开可见的履历信息整合了进来。',
        '现在这个作品集既能作为一个完成度更高的首页，也能作为以后继续扩展案例、写作和 AI 项目展示的稳定代码底座。',
      ],
    },
    stack: {
      eyebrow: '技术栈',
      title: '这套架构追求的是成长性、推理能力和交付效率。',
      lead:
        '用 App Router 做结构组织，用静态导出适配 GitHub Pages，用 React Three Fiber 承载 3D 表现，用 MDX 和类型化内容对象为后续新增项目留好接口。',
    },
    signals: {
      eyebrow: 'AI 系统',
      title: '最新简历里的能力，现在被做成了可视化的首页模块。',
      lead:
        '这些模块会让主页更像技术展示，而不只是一个作品集封面。',
      cards: [
        {
          title: 'RAG 知识系统',
          body: '混合检索、嵌入策略调优、中文技术文档处理，以及生产内网问答链路。',
        },
        {
          title: '多智能体工作流',
          body: 'LangGraph 状态机、工具路由、自愈循环，以及通过 SSE 输出的推理步骤。',
        },
        {
          title: '模型路由与可观测性',
          body: '任务分类、DeepSeek / Qwen 派发、私有化部署方案，以及 Langfuse / OpenTelemetry 追踪。',
        },
      ],
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
    blogIndex: {
      eyebrow: '博客',
      title: '一个可以持续写作、解释和补充深度内容的地方。',
      lead:
        '博客内容采用 MDX 编写，你可以很自然地补技术笔记、实现拆解和双语文章，而不需要改动整体架构。',
      action: '查看全部文章',
    },
    blogDetail: {
      back: '返回博客',
      readMore: '继续阅读',
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
      expand: '展开播放器',
      collapse: '收起播放器',
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
