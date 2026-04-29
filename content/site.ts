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
  timeline: {
    eyebrow: string;
    title: string;
    lead: string;
    items: Array<{
      period: string;
      title: string;
      body: string;
    }>;
  };
  stack: {
    eyebrow: string;
    title: string;
    lead: string;
  };
  services: {
    eyebrow: string;
    title: string;
    lead: string;
    items: Array<{
      title: string;
      body: string;
      note: string;
    }>;
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
  showcase: {
    eyebrow: string;
    title: string;
    lead: string;
    editorial: {
      label: string;
      title: string;
      body: string;
      quote: string;
    };
    viz: {
      label: string;
      title: string;
      body: string;
      stats: Array<{
        label: string;
        value: string;
      }>;
    };
    terminal: {
      label: string;
      title: string;
      lines: string[];
    };
  };
  presentation: {
    eyebrow: string;
    title: string;
    lead: string;
    hint: string;
    modes: Array<{
      id: 'editorial' | 'viz' | 'terminal';
      label: string;
      blurb: string;
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
  projectTaxonomy: {
    eyebrow: string;
    title: string;
    lead: string;
    caseLabel: string;
    pathLabel: string;
    metricsLabel: string;
  };
  blogIndex: {
    eyebrow: string;
    title: string;
    lead: string;
    action: string;
  };
  blogTaxonomy: {
    eyebrow: string;
    title: string;
    lead: string;
    seriesLabel: string;
    readingPathLabel: string;
  };
  blogDetail: {
    overview: string;
    date: string;
    reading: string;
    back: string;
    readMore: string;
    related: string;
    relatedLead: string;
  };
  projectDetail: {
    overview: string;
    visit: string;
    source: string;
    back: string;
    role: string;
    focus: string;
    related: string;
    relatedLead: string;
  };
  contact: {
    eyebrow: string;
    title: string;
    lead: string;
    location: string;
    locationValue: string;
  };
  contactCta: {
    eyebrow: string;
    title: string;
    lead: string;
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel: string;
    secondaryHref: string;
    steps: Array<{
      title: string;
      body: string;
    }>;
    footer: string;
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
    volume: string;
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
      file: '/music/gymnopedies.mp3',
      cover: '/music-img/gymnopedies.jpg',
    },
    {
      title: 'Old Town Road',
      artist: 'Lil Nas X',
      file: '/music/old-town-road.mp3',
      cover: '/music-img/lil-nas-x.png',
    },
    {
      title: 'Daddy',
      artist: 'Coldplay',
      file: '/music/daddy.mp3',
      cover: '/music-img/daddy.png',
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
    timeline: {
      eyebrow: 'Timeline',
      title: 'A compact career story that explains how the work evolved.',
      lead: 'This section turns the portfolio into a clearer narrative instead of only a gallery of outputs.',
      items: [
        {
          period: '2024 - Present',
          title: 'COMAC: production AI systems',
          body: 'Working on LLM application flows, retrieval pipelines, model routing, and agent-oriented workflows with a product mindset.',
        },
        {
          period: '2018 - 2020',
          title: 'University of Melbourne',
          body: 'Formal study that strengthened the engineering foundation behind the current portfolio and AI work.',
        },
        {
          period: 'Ongoing',
          title: 'Portfolio + writing + visual systems',
          body: 'Continuously rebuilding this site, documenting the stack, and turning the portfolio into a live engineering notebook.',
        },
      ],
    },
    stack: {
      eyebrow: 'Stack',
      title: 'Architecture chosen for growth, inference, and shipping.',
      lead:
        'App Router for structure, static export for easy deployment, React Three Fiber for 3D presentation, MDX for content, and typed content objects for future project additions.',
    },
    services: {
      eyebrow: 'Services',
      title: 'What I can help design, prototype, and ship.',
      lead:
        'These are the kinds of systems and surfaces this portfolio is built to signal. If you want an AI product interface, a content-heavy frontend, or a sharper prototype, these are the lanes I work in.',
      items: [
        {
          title: 'AI Product Interfaces',
          body: 'Landing pages, dashboards, and internal tools that make model-powered products feel clear, premium, and usable.',
          note: 'UI systems, interaction design, product storytelling',
        },
        {
          title: 'RAG + Knowledge Systems',
          body: 'Retrieval flows, embeddings, bilingual search, and internal Q&A experiences for team knowledge and support.',
          note: 'Search, embeddings, retrieval quality, observability',
        },
        {
          title: 'Frontend Architecture',
          body: 'Route-driven app structures, reusable content models, and component systems that stay maintainable as content scales.',
          note: 'Next.js, React, TypeScript, MDX',
        },
      ],
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
    showcase: {
      eyebrow: 'Interface Lab',
      title: 'Three visual modes so the homepage reads like a designed product surface.',
      lead: 'Each panel leans into a different strength: editorial composition, data visualization, and a terminal-style engineering readout.',
      editorial: {
        label: 'Editorial',
        title: 'Cinematic layering, large type, and a more magazine-like rhythm.',
        body: 'The page uses oversized typography, atmospheric spacing, and strong contrast to give the work a premium landing-page feel.',
        quote: 'Design the page like a story, not a checklist.',
      },
      viz: {
        label: 'Data viz',
        title: 'Live metrics and progress-style surfaces make the stack feel measurable.',
        body: 'The dashboard-style panel is meant to echo product analytics while still staying within a portfolio context.',
        stats: [
          { label: 'Routes', value: '22' },
          { label: 'Locales', value: '2' },
          { label: 'Modes', value: '3' },
          { label: '3D layers', value: '6+' },
        ],
      },
      terminal: {
        label: 'Terminal',
        title: 'A compact CLI block makes the engineering identity explicit.',
        lines: [
          'pnpm build',
          'route: /projects/[slug]',
          'r3f: pointer-driven scene',
          'mdx: bilingual content pipeline',
          'deploy: GitHub Pages',
        ],
      },
    },
    presentation: {
      eyebrow: 'Presentation Mode',
      title: 'A single switch shifts the page between magazine, dashboard, and console.',
      lead: 'Use the mode chips to steer the page toward a different visual language without leaving the homepage.',
      hint: 'Hover the project cards to retune the scene, or use ← / → and 1 / 2 / 3 to move the avatar between rooms while it also auto-roams.',
      modes: [
        {
          id: 'editorial',
          label: 'Editorial',
          blurb: 'Cinematic framing, softer light, and a more premium landing-page rhythm.',
        },
        {
          id: 'viz',
          label: 'Data viz',
          blurb: 'Sharper metrics, brighter accents, and a more analytic product-surface feel.',
        },
        {
          id: 'terminal',
          label: 'Terminal',
          blurb: 'Higher contrast, compact HUD cues, and a more engineering-forward read.',
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
    projectTaxonomy: {
      eyebrow: 'Project Paths',
      title: 'Use tags to move through the archive like a case library.',
      lead:
        'The project index is organized around tags and featured routes so the archive can grow without becoming a flat wall of cards.',
      caseLabel: 'Case path',
      pathLabel: 'Project path',
      metricsLabel: 'Project scale',
    },
    blogIndex: {
      eyebrow: 'Blog',
      title: 'A place to write, explain, and keep adding depth to the portfolio.',
      lead:
        'Blog posts use MDX, so you can write long-form notes, technical breakdowns, and bilingual articles without changing the app structure.',
      action: 'Read all posts',
    },
    blogTaxonomy: {
      eyebrow: 'Reading Paths',
      title: 'Follow a theme instead of reading posts in isolation.',
      lead: 'The blog is organized around tags and series, so related notes stay easy to discover as the archive grows.',
      seriesLabel: 'Series',
      readingPathLabel: 'Reading path',
    },
    blogDetail: {
      overview: 'A short reading guide that keeps the post compact without stripping away depth.',
      date: 'Published',
      reading: 'Reading time',
      back: 'Back to Blog',
      readMore: 'Read more',
      related: 'Continue reading',
      relatedLead: 'If the topic resonates, these other posts expand the same design and engineering direction.',
    },
    projectDetail: {
      overview: 'A quick look at the role, focus, and metrics behind the build.',
      visit: 'Visit Project',
      source: 'Source',
      back: 'Back to Projects',
      role: 'Role',
      focus: 'Focus',
      related: 'More projects',
      relatedLead: 'Related case studies that show the range of the same frontend skillset.',
    },
    contact: {
      eyebrow: 'Contact',
      title: "Let's build something sharp, intelligent, and ambitious.",
      lead: 'The contact channels from the original site are preserved, but now presented inside a cleaner information structure.',
      location: 'Location',
      locationValue: 'Perth, Western Australia',
    },
    contactCta: {
      eyebrow: 'Collaboration',
      title: 'If the work feels aligned, let’s continue the conversation.',
      lead: 'Use the channels below to reach me quickly. I usually respond fastest through LinkedIn or WeChat.',
      primaryLabel: 'LinkedIn',
      primaryHref: 'https://www.linkedin.com/in/junxu-zhang-38bb04185/',
      secondaryLabel: 'WeChat',
      secondaryHref: 'https://weixin.qq.com/',
      steps: [
        {
          title: 'Share the shape of the problem',
          body: 'A short note about your product, team, and what you want to improve is enough to start.',
        },
        {
          title: 'Pick a channel',
          body: 'LinkedIn works best for structured requests. WeChat is better if you want a quick back-and-forth.',
        },
        {
          title: 'Attach context',
          body: 'If you have screenshots, links, or a brief, send them along so I can respond with less friction.',
        },
      ],
      footer: 'Fastest response: LinkedIn. Best async path: WeChat.',
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
      volume: 'Volume',
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
    timeline: {
      eyebrow: '时间线',
      title: '一条能讲清成长路径的职业脉络。',
      lead: '有了这部分，作品集不只是展示结果，也能讲清楚你的发展过程。',
      items: [
        {
          period: '2024 - 现在',
          title: 'COMAC：生产级 AI 系统',
          body: '主要做 LLM 应用链路、检索管线、模型路由和面向智能体的工作流，强调可交付与可维护。',
        },
        {
          period: '2018 - 2020',
          title: '墨尔本大学',
          body: '系统化的学习为后面的工程实践提供了更稳的基础。',
        },
        {
          period: '持续进行中',
          title: '作品集 + 写作 + 视觉系统',
          body: '持续重构这个站点，记录技术思考，并把作品集做成一个可以持续增长的工程笔记。',
        },
      ],
    },
    stack: {
      eyebrow: '技术栈',
      title: '这套架构追求的是成长性、推理能力和交付效率。',
      lead:
        '用 App Router 做结构组织，用静态导出适配 GitHub Pages，用 React Three Fiber 承载 3D 表现，用 MDX 和类型化内容对象为后续新增项目留好接口。',
    },
    services: {
      eyebrow: '服务',
      title: '我能帮你设计、原型化并交付什么。',
      lead:
        '这些就是这个作品集想传达的能力范围。如果你需要 AI 产品界面、内容型前端，或者更干净的原型，我会更擅长做这些方向。',
      items: [
        {
          title: 'AI 产品界面',
          body: '登陆页、数据看板和内部工具，让模型驱动的产品变得清晰、精致且好用。',
          note: 'UI 系统、交互设计、产品叙事',
        },
        {
          title: 'RAG 和知识系统',
          body: '检索链路、向量策略、双语搜索，以及面向团队知识和支持的问答体验。',
          note: '搜索、向量、检索质量、可观测性',
        },
        {
          title: '前端架构',
          body: '路由驱动的应用结构、可复用内容模型，以及在内容增长时仍然好维护的组件系统。',
          note: 'Next.js、React、TypeScript、MDX',
        },
      ],
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
    showcase: {
      eyebrow: '界面实验室',
      title: '用三种视觉语气，把首页做成一个有设计感的产品界面。',
      lead: '这三个面板分别偏向编辑感、数据可视化和终端感，让作品集的表达更完整。',
      editorial: {
        label: '编辑感',
        title: '更像杂志封面的层次、留白和大标题节奏。',
        body: '通过大字号、强对比和更有呼吸感的排版，把作品集做成一张有主视觉的品牌页。',
        quote: '把页面设计成故事，而不是清单。',
      },
      viz: {
        label: '数据感',
        title: '用指标、进度和条形图，让架构看起来是可度量的。',
        body: '仪表盘式面板借用了产品分析看板的语言，但仍然保持作品集的表达方式。',
        stats: [
          { label: '路由', value: '22' },
          { label: '语言', value: '2' },
          { label: '模式', value: '3' },
          { label: '3D层', value: '6+' },
        ],
      },
      terminal: {
        label: '终端感',
        title: '用一个紧凑的 CLI 块，直接把工程身份亮出来。',
        lines: [
          'pnpm build',
          'route: /projects/[slug]',
          'r3f: pointer-driven scene',
          'mdx: bilingual content pipeline',
          'deploy: GitHub Pages',
        ],
      },
    },
    presentation: {
      eyebrow: '展示模式',
      title: '一个开关，就能把页面切到杂志、看板或控制台语气。',
      lead: '通过模式切换，你可以在首页内直接调整整体视觉语言，而不需要跳出当前页面。',
      hint: '悬停项目卡会重新调校场景，也可以用 ← / → 和 1 / 2 / 3 手动切换房间；人物还会在空闲时自动漫游。',
      modes: [
        {
          id: 'editorial',
          label: '编辑感',
          blurb: '更像封面页的构图、柔和光感和高级节奏。',
        },
        {
          id: 'viz',
          label: '数据感',
          blurb: '更锐利的指标、更亮的点缀，以及更像产品看板的观感。',
        },
        {
          id: 'terminal',
          label: '终端感',
          blurb: '更高对比度、紧凑 HUD 线索，以及更偏工程化的表达。',
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
    projectTaxonomy: {
      eyebrow: '项目路径',
      title: '用标签来浏览项目档案，而不是平铺所有卡片。',
      lead:
        '项目索引现在按标签和精选路线组织，后续即使继续增加案例，也不会变成一面单调的卡片墙。',
      caseLabel: '案例路径',
      pathLabel: '项目路径',
      metricsLabel: '项目规模',
    },
    blogIndex: {
      eyebrow: '博客',
      title: '一个可以持续写作、解释和补充深度内容的地方。',
      lead:
        '博客内容采用 MDX 编写，你可以很自然地补技术笔记、实现拆解和双语文章，而不需要改动整体架构。',
      action: '查看全部文章',
    },
    blogTaxonomy: {
      eyebrow: '阅读路径',
      title: '按主题来读，而不是把文章拆开看。',
      lead: '博客按标签和系列组织，内容增长后也能很容易继续顺着主题阅读。',
      seriesLabel: '系列',
      readingPathLabel: '阅读路径',
    },
    blogDetail: {
      overview: '一段简短的阅读导览，让文章有深度但不拖沓。',
      date: '发布日期',
      reading: '阅读时长',
      back: '返回博客',
      readMore: '继续阅读',
      related: '继续阅读',
      relatedLead: '如果这个主题对你有用，可以继续看下面这些同方向的文章。',
    },
    projectDetail: {
      overview: '先看职责、关注点和关键指标，再进入完整案例。',
      visit: '访问项目',
      source: '源码',
      back: '返回项目列表',
      role: '职责',
      focus: '关注点',
      related: '更多项目',
      relatedLead: '这些相关案例展示了同一套前端能力的不同侧面。',
    },
    contact: {
      eyebrow: '联系',
      title: '一起做点清晰、耐看、并且有野心的东西。',
      lead: '保留了旧站的联系方式，但用更清楚的信息层级重新组织了一遍。',
      location: '所在地',
      locationValue: '澳大利亚珀斯',
    },
    contactCta: {
      eyebrow: '合作',
      title: '如果方向对了，我们可以继续往下聊。',
      lead: '下面这些渠道是最快的联系路径，通常我会优先看 LinkedIn 和微信。',
      primaryLabel: '领英',
      primaryHref: 'https://www.linkedin.com/in/junxu-zhang-38bb04185/',
      secondaryLabel: '微信',
      secondaryHref: 'https://weixin.qq.com/',
      steps: [
        {
          title: '先说清问题形状',
          body: '简单说明你的产品、团队，以及你想改进的地方，就足够开始。',
        },
        {
          title: '选一个沟通渠道',
          body: '如果是结构化需求，领英更合适；如果想快速来回沟通，微信更方便。',
        },
        {
          title: '附上上下文',
          body: '如果你有截图、链接或简短 brief，一起发过来，我能更快给出回应。',
        },
      ],
      footer: '最快回复：领英。最适合异步沟通：微信。',
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
      volume: '音量',
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
