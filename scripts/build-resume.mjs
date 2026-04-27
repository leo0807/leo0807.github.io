import fs from 'node:fs';
import path from 'node:path';
import PDFDocument from 'pdfkit';

const outDir = path.join(process.cwd(), 'public', 'pdf');
const outFile = path.join(outDir, 'english.PDF');

const doc = new PDFDocument({
  size: 'A4',
  margin: 46,
  bufferPages: true,
  pdfVersion: '1.7',
});

fs.mkdirSync(outDir, { recursive: true });
const stream = fs.createWriteStream(outFile);
doc.pipe(stream);

const colors = {
  text: '#0f172a',
  muted: '#475569',
  accent: '#4f46e5',
  accentSoft: '#06b6d4',
  line: '#dbe4f0',
  panel: '#f8fbff',
};

const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
const lineWidth = 1;

function ensureSpace(height) {
  const bottom = doc.page.height - doc.page.margins.bottom;
  if (doc.y + height > bottom) {
    doc.addPage();
  }
}

function divider() {
  doc
    .moveTo(doc.x, doc.y + 4)
    .lineTo(doc.x + pageWidth, doc.y + 4)
    .lineWidth(lineWidth)
    .strokeColor(colors.line)
    .stroke();
  doc.moveDown(1);
}

function sectionTitle(title, subtitle = '') {
  ensureSpace(54);
  doc
    .font('Helvetica-Bold')
    .fontSize(13)
    .fillColor(colors.accent)
    .text(title.toUpperCase(), { continued: false });
  if (subtitle) {
    doc
      .moveDown(0.3)
      .font('Helvetica')
      .fontSize(9.5)
      .fillColor(colors.muted)
      .text(subtitle, { width: pageWidth });
  }
  doc.moveDown(0.45);
}

function paragraph(text, options = {}) {
  const width = options.width ?? pageWidth;
  const size = options.size ?? 10.5;
  const leading = options.leading ?? 14;
  const height = doc.heightOfString(text, { width, lineGap: 1.4, fontSize: size });
  ensureSpace(height + 10);
  doc.font('Helvetica').fontSize(size).fillColor(options.color ?? colors.text).text(text, {
    width,
    lineGap: 1.4,
    align: options.align ?? 'left',
  });
}

function bullet(text) {
  const available = pageWidth - 14;
  const height = doc.heightOfString(text, { width: available, lineGap: 1.35, fontSize: 9.7 });
  ensureSpace(height + 8);
  doc.font('Helvetica-Bold').fontSize(9.7).fillColor(colors.accent).text('•', { continued: true });
  doc.font('Helvetica').fillColor(colors.text).text(` ${text}`, {
    width: available,
    lineGap: 1.35,
  });
}

function jobBlock({ title, subtitle, date, bullets: items }) {
  ensureSpace(96);
  doc.font('Helvetica-Bold').fontSize(12).fillColor(colors.text).text(title);
  doc.font('Helvetica').fontSize(9.5).fillColor(colors.accent).text(subtitle, { continued: true });
  doc.font('Helvetica').fillColor(colors.muted).text(`  ·  ${date}`);
  doc.moveDown(0.25);
  items.forEach((item) => bullet(item));
  doc.moveDown(0.3);
}

function projectBlock({ title, tech, body, link }) {
  ensureSpace(82);
  doc.font('Helvetica-Bold').fontSize(11.2).fillColor(colors.text).text(title);
  doc.font('Helvetica').fontSize(9).fillColor(colors.accent).text(tech);
  paragraph(body, { size: 9.7 });
  if (link) {
    doc.font('Helvetica').fontSize(8.7).fillColor(colors.muted).text(link);
  }
  doc.moveDown(0.25);
}

// Header
doc
  .roundedRect(46, 42, pageWidth, 92, 18)
  .fillAndStroke(colors.panel, colors.line);
doc.fillColor(colors.text);
doc.font('Helvetica-Bold').fontSize(23).text('Junxu Zhang', 62, 60);
doc.font('Helvetica').fontSize(11.5).fillColor(colors.accent).text('Full-Stack AI Engineer  ·  LLM Applications  ·  RAG & Multi-Agent Systems', 62, 88);
doc.font('Helvetica').fontSize(9.3).fillColor(colors.muted).text('+61 452 350 191  ·  zhangjunxu3@gmail.com  ·  linkedin.com/in/junxu-zhang-38bb04185  ·  github.com/leo0807', 62, 108);
doc.font('Helvetica').fontSize(8.6).fillColor(colors.text).text('485 Visa — Full Work Rights  ·  No Sponsorship Required  ·  Relocating to Australia — Available April 2026', 62, 125);
doc.y = 154;

sectionTitle('Summary', 'Production AI systems, frontend craft, and full-stack delivery.');
paragraph(
  'Full-stack engineer with 4+ years at COMAC. Since 2024 focused on LLM engineering: built RAG knowledge-base pipelines, multi-tool agent workflows, and intelligent model-routing systems using LangChain, FastAPI, DeepSeek, Qwen, and Chroma. Currently building DevMind — a production-grade AI coding assistant with LangGraph state machines, MCP, E2B sandboxed execution, self-healing agent loops, and Langfuse observability.',
);

sectionTitle('Skills');
paragraph(
  'AI / LLM: LangChain, LangGraph.js, RAG pipelines, Chroma, Pinecone, DeepSeek, Qwen, function calling, multi-agent orchestration, intelligent model routing, prompt & context engineering, MCP, OpenRouter, vLLM, Ollama, Dify, Zod, SSE streaming, E2B sandbox, Langfuse, OpenTelemetry.',
  { size: 9.7 },
);
paragraph(
  'Frontend: React, Next.js 14 App Router, TypeScript, Tailwind CSS, shadcn/ui, Monaco Editor, Vue 2/3, Vite, Webpack. Backend: Node.js, FastAPI, Spring Boot, Spring Cloud, Kafka, RESTful APIs, Nginx. Databases: PostgreSQL, MySQL, MongoDB, Redis, Chroma, Pinecone, Neo4j. DevOps: Docker, Jenkins, Git, Vercel, JIRA.',
  { size: 9.7 },
);

sectionTitle('Work Experience');
jobBlock({
  title: 'COMAC — Lead Research and Development Engineer',
  subtitle: 'AI Engineering Centre, Shanghai',
  date: 'Jun 2025 – Present',
  bullets: [
    'Promoted from AI Engineer in May 2025 and now drive architecture decisions around model selection, retrieval strategies, and private deployment approaches.',
    'Built and deployed a RAG system for internal document Q&A covering engineering manuals, compliance documents, and project wikis.',
    'Integrated DeepSeek and Qwen as generation models and tuned prompts / context handling for consistent output quality across internal use cases.',
    'Iterated on hybrid retrieval (BM25 + dense vector search with Chroma) and re-ranker configurations to reduce irrelevant passages in top-k results.',
  ],
});
jobBlock({
  title: 'COMAC — Research and Development Engineer (Full-Stack + AI Prototyping)',
  subtitle: '5G Innovation Centre, Shanghai',
  date: 'Aug 2021 – May 2025',
  bullets: [
    'Prototyped the full RAG pipeline: ingestion, chunking, embedding (BGE), vector storage (Chroma), and hybrid retrieval.',
    'Built a multi-tool agent proof-of-concept with LangChain (ReAct) and a routing layer that dispatches tasks to domestic models based on complexity and compliance requirements.',
    'Evaluated private deployment options (vLLM, Ollama) and low-code platforms (Dify, FastGPT) and produced architecture recommendations for the AI roadmap.',
  ],
});
jobBlock({
  title: 'COMAC BRAIN — Frontend Developer',
  subtitle: '5G Innovation Centre, Shanghai',
  date: 'Aug 2021 – Dec 2023',
  bullets: [
    'Optimised a complex data-visualisation dashboard through pure components, code splitting, debouncing, and throttling.',
    'Improved rendering performance and UX responsiveness for a large internal interface surface.',
  ],
});
jobBlock({
  title: 'COMAC-NET — Full-Stack Developer',
  subtitle: '5G Innovation Centre, Shanghai',
  date: 'Aug 2021 – Dec 2023',
  bullets: [
    'Built a network-topology graph with virtualised lists and lazy loading to handle large datasets.',
    'Implemented MySQL read-write separation, optimised MongoDB queries, and architected RESTful APIs with Swagger, Postman, and JUnit coverage.',
  ],
});
jobBlock({
  title: 'ProbePI Monitoring System — Project Coordinator',
  subtitle: '5G Innovation Centre, Shanghai',
  date: 'Aug 2021 – Dec 2023',
  bullets: [
    'Coordinated end-to-end delivery and owned data-collection module architecture, technology selection, and cross-team code reviews.',
  ],
});

sectionTitle('Portfolio Projects', 'Selected AI work from 2025–2026.');
projectBlock({
  title: 'DevMind — AI Coding Assistant (In Progress)',
  tech: 'Next.js 14 · LangGraph.js · MCP · E2B · Pinecone · Langfuse · OpenRouter · Zod',
  body: 'LangGraph state machine: Planner → Coder → Reviewer with conditional routing; self-healing loop feeds E2B stderr back as a conditional edge for automatic fixes (max 3 retries). Codebase RAG, context budget manager, tool retrieval pattern, Langfuse + OpenTelemetry observability, diff preview + human-in-the-loop via LangGraph interrupt().',
  link: 'github.com/leo0807/devmind',
});
projectBlock({
  title: 'RAG Knowledge-Base Assistant',
  tech: 'Next.js 14 · Pinecone · OpenRouter · all-MiniLM-L6-v2',
  body: 'End-to-end RAG: upload → chunk → embed → Pinecone → semantic search → streamed answers with citations. Sub-2s first-token latency on Vercel.',
  link: 'rag-assistant-mu.vercel.app  ·  github.com/leo0807/rag-assistant',
});
projectBlock({
  title: 'Multi-Agent Task Runner',
  tech: 'Next.js 14 · TypeScript · ReAct Agent · SSE Streaming',
  body: 'ReAct agent with real-time SSE visualisation of thinking / tool_start / tool_end / final events; context window management, max 10 iterations.',
  link: 'agent-assistant-sable.vercel.app  ·  github.com/leo0807/agent-assistant',
});
projectBlock({
  title: 'AI Resume Analyser',
  tech: 'Next.js 14 · Claude Haiku · unpdf · mammoth · Vercel',
  body: 'Parses PDF/DOCX/TXT, matches against JD, returns structured JSON (score, gaps, suggestions) via Claude Haiku in under 3 seconds.',
  link: 'github.com/leo0807/resume-analyzer',
});

sectionTitle('Education & Languages');
paragraph('University of Melbourne · Master of Science in Computer Science · Jul 2018 – Dec 2020 · Melbourne, Australia', { size: 9.9 });
paragraph('Shenyang University of Technology · Bachelor of Engineering in Software Engineering · Aug 2013 – Jul 2017 · Shenyang, China', { size: 9.9 });
paragraph('20+ MOOC certificates in distributed systems, ML, and cloud — Udemy, Coursera, Educative. Languages: Mandarin (Native) · English (Fluent)', { size: 9.9 });

doc.end();

stream.on('finish', () => {
  console.log(`Wrote ${outFile}`);
});
