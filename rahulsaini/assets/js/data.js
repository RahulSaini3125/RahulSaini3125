/*
 * ─────────────────────────────────────────────────────────────
 *  PROFILE DATA — edit this file only.
 *  Everything on the website is rendered from this object.
 *  Values still wrapped in [square brackets] need your real details.
 *  Numbers in achievements are examples — adjust them to match your actual work.
 *  Delete any item you don't need; empty lists hide their section cards.
 * ─────────────────────────────────────────────────────────────
 */
window.PROFILE = {
  name: 'Rahul Saini',
  initials: 'RS',
  handle: 'rahul.saini',
  role: 'Full Stack AI Engineer',
  location: 'Mohali, Punjab, India · On-site / Hybrid',
  timezone: 'Asia/Kolkata',   // shows your live local time in the footer; empty hides it
  photo: '',            // e.g. 'assets/img/photo.jpg' — leave empty to show initials
  resume: '',           // e.g. 'assets/Rahul-Saini-CV.pdf' — leave empty to hide the button

  available: false,     // true shows the 'Available' badges, the Services section and hire-me CTAs
                        // (also update the 'available' answer in faq below)
  availability: 'Open to new roles & freelance projects',

  // Hero headline: "<headlinePrefix> <rotating role> <headlineSuffix>"
  greeting: "Hi, I'm Rahul Saini",
  headlinePrefix: 'I build',
  roles: ['AI agents', 'RAG chatbots', 'full stack web apps', 'scalable APIs'],
  headlineSuffix: 'that people rely on.',

  // Small floating chips orbiting the profile card (keep 4–6 short words)
  orbit: ['Python', 'FastAPI', 'React', 'LangChain', 'AWS', 'Docker'],

  intro:
    'Full Stack AI Engineer building production-ready web apps and AI-powered products — from React frontends and Python APIs to LLM agents, RAG pipelines and cloud deployments on AWS & Azure.',

  // Experience counter in the hero is calculated live from this date (YYYY-MM).
  careerStart: '2024-03',

  stats: [
    { label: 'Experience', value: 'auto' },           // 'auto' = computed from careerStart
    { label: 'Projects delivered', value: '15+' },
    { label: 'Based in', value: 'Mohali, IN' },
    { label: 'Core focus', value: 'AI · Full Stack' },
  ],

  // Shown as a small code card in the hero
  codeCard: {
    focus: ['LLM Agents', 'RAG', 'Web Apps'],
    stack: ['Python', 'FastAPI', 'Django', 'React', 'Next.js'],
    openTo: 'not looking right now',
  },

  aboutTitle: 'Where solid engineering meets practical AI.',
  // Wrap words in **double stars** to highlight them.
  about: [
    "I'm a developer who loves turning **real business problems into working software**. I build complete products end-to-end — clean React/Next.js interfaces, fast Python and Node.js APIs, and the databases and cloud infrastructure behind them.",
    'My focus is bringing **AI into real products**: LLM-powered assistants, RAG over company data, agent workflows with LangChain & LangGraph, and automation that saves teams hours every week.',
    "At Snakescript LLP I've shipped everything from **AI research platforms on AWS** to automation tools and third-party integrations.",
  ],

  // Quick facts card next to the About text. value 'auto' = experience computed from careerStart.
  facts: [
    { icon: '💼', label: 'Current role', value: 'Web Developer @ Snakescript LLP' },
    { icon: '⏳', label: 'Experience', value: 'auto' },
    { icon: '🎓', label: 'Education', value: 'BCA · Chandigarh University' },
    { icon: '📍', label: 'Location', value: 'Mohali, Punjab, India' },
    { icon: '🏢', label: 'Work mode', value: 'On-site / Hybrid' },
  ],

  highlights: [
    { icon: '⚡', title: 'Production-ready delivery', text: 'Clean, tested and reviewed code that ships on time and keeps running.' },
    { icon: '🧠', title: 'Practical AI', text: 'The right model and architecture for the problem — RAG, agents and automation that add real value.' },
    { icon: '🧩', title: 'End-to-end ownership', text: 'From requirements and UI to APIs, data pipelines and AWS deployment.' },
    { icon: '🤝', title: 'Clear communication', text: 'Proactive updates and business-first thinking with teams and clients.' },
  ],

  // Most recent first. type: 'work' | 'education'
  experience: [
    {
      type: 'work',
      title: 'Web Developer',
      org: 'Snakescript LLP · Mohali · Full-time',
      start: 'Mar 2024',
      end: 'Present',
      points: [
        'Work across the full stack — frontend, backend, AI features and deployment — delivering 15+ client projects end-to-end.',
        'Build full stack features with React/Next.js frontends and Python (Django, FastAPI) & Node.js backends.',
        'Develop LLM-powered features — RAG pipelines, chatbots and agent workflows with LangChain & LangGraph.',
        'Built scalable AWS data pipelines (Lambda, ECS, Step Functions) that collect and process research data from multiple biomedical databases.',
        'Automate business workflows — email data extraction, XML API integrations and automated notifications.',
        'Deploy and run services on AWS & Azure with Docker, Nginx and CI/CD pipelines.',
      ],
      tags: ['Python', 'FastAPI', 'Django', 'React', 'Next.js', 'LangChain', 'AWS', 'Azure'],
    },
    {
      type: 'education',
      title: 'Bachelor of Computer Applications (BCA)',
      org: 'Chandigarh University',
      start: '2021',
      end: '2024',
    },
  ],

  // Client work is confidential (company policy), so projects are described by
  // type of work and the stack used — no client names or details.
  projectsNote: 'Client work at Snakescript LLP is under NDA, so project names and client details are kept confidential. Here is the kind of work I deliver and the stack behind it.',

  // First project is shown as the large featured card. 6 projects fill the grid perfectly.
  // A badge containing 'NDA' shows a lock badge.
  projects: [
    {
      icon: '🧬',
      title: 'AI-Powered Medical Research Platform',
      badge: 'B2B · NDA',
      description:
        'A company-to-company platform that gives life-science customers AI-powered research: it automatically gathers data from leading US biomedical databases, turns it into dashboards and reports, and lets users explore it through a conversational AI interface.',
      points: [
        'Automated data collection from PubMed, PMC, SciBite, Embase and other medical sources',
        'Interactive dashboards and reports built on the collected research data',
        'AI chat interface that answers natural-language research questions',
        'Medical-term aware search across all sources',
        'Scalable serverless architecture on AWS — Lambda, ECS and Step Functions',
        'Configurable per client requirements',
      ],
      tags: ['Python', 'FastAPI', 'LangChain', 'LLMs', 'React', 'AWS Lambda', 'ECS', 'Step Functions'],
      link: '',
    },
    {
      icon: '💬',
      title: 'Knowledge-Based Group Chat',
      badge: 'NDA',
      description:
        'Users create an account, set up groups that each have their own knowledge base, and chat with an AI that answers using only that group’s knowledge.',
      tags: ['Django', 'React', 'LangChain', 'RAG', 'Vector DB', 'WebSockets'],
      link: '',
    },
    {
      icon: '✈️',
      title: 'Flight Details Email Automation',
      badge: 'NDA',
      description:
        'Automation tool that reads booking emails, extracts flight details and sends automated email updates.',
      tags: ['Python', 'IMAP / SMTP', 'LLM parsing', 'Celery'],
      link: '',
    },
    {
      icon: '🔌',
      title: 'XML API Integration',
      badge: 'NDA',
      description:
        'Python services that integrate third-party XML APIs to fetch, transform and process data for multiple business applications.',
      tags: ['Python', 'XML / SOAP', 'REST', 'Django'],
      link: '',
    },
    {
      icon: '🧠',
      title: 'LLM Agent Workflows',
      badge: 'NDA',
      description: 'Multi-step AI agents that call tools and APIs to automate business tasks with human-in-the-loop review.',
      tags: ['LangGraph', 'LangChain', 'Python', 'OpenAI / Claude'],
      link: '',
    },
    {
      icon: '🌐',
      title: 'Full Stack Web Platform',
      badge: 'NDA',
      description: 'Production web application with authentication, role-based dashboards and admin panel.',
      tags: ['Next.js', 'React', 'Node.js', 'PostgreSQL'],
      link: '',
    },
  ],

  // Tech I work with — each group is drawn as an "atom": the symbol is the nucleus and the
  // tools orbit around it. sym/num are real chemical elements (Ag = Agents, Au = Automation…).
  // Logos are added automatically (see SKILL_ICONS in main.js).
  skills: [
    {
      group: 'AI Agents', sym: 'Ag', num: 47,
      desc: 'Agentic AI that reasons, retrieves and acts — RAG chatbots, semantic search and multi-step agents.',
      items: ['LangChain', 'LangGraph', 'RAG', 'Agentic AI', 'Embeddings', 'Vector DBs', 'OpenAI', 'Claude'],
    },
    {
      group: 'Backend & REST APIs', sym: 'Be', num: 4,
      desc: 'Fast, secure Python APIs and data layers that power web and AI products.',
      items: ['Python', 'FastAPI', 'Django', 'REST APIs', 'PostgreSQL', 'Redis'],
    },
    {
      group: 'Frontend', sym: 'Fe', num: 26,
      desc: 'Clean, responsive interfaces, dashboards and chat experiences.',
      items: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
    },
    {
      group: 'Automation & Workflows', sym: 'Au', num: 79,
      desc: 'Scheduled jobs, background tasks and event-driven workflows that run on their own.',
      items: ['Cron Jobs', 'Celery', 'AWS Lambda', 'Step Functions', 'EventBridge'],
    },
    {
      group: 'Cloud & DevOps', sym: 'Cl', num: 17,
      desc: 'Deploy, scale and ship continuously on AWS and Azure.',
      items: ['AWS', 'Azure', 'Docker', 'CI/CD', 'Git'],
    },
  ],

  servicesNote:
    'Pick a starting point — every engagement ships production-ready code, clear docs and a clean handover.',

  // kind picks the animated scene on each card: 'ai' | 'web' | 'cloud'
  services: [
    {
      kind: 'ai',
      title: 'AI Chatbots & Agents',
      text: 'Custom LLM assistants, RAG over your documents and agent workflows — integrated into your product or internal tools.',
      deliverables: ['RAG pipeline', 'Agent workflows', 'Evals & guardrails', 'Chat UI / API'],
      idealFor: 'Support teams, internal knowledge bases, ops automation',
    },
    {
      kind: 'web',
      title: 'Full Stack Web Apps',
      text: 'From idea to launch — dashboards, SaaS products and portals with React/Next.js and Python or Node.js backends.',
      deliverables: ['MVP in weeks', 'Dashboards', 'Auth & payments', 'Responsive UI'],
      idealFor: 'Startups validating an idea, teams replacing spreadsheets',
    },
    {
      kind: 'cloud',
      title: 'APIs, Automation & Cloud',
      text: 'Secure APIs, workflow automation and deployment on AWS or Azure with Docker and CI/CD.',
      deliverables: ['REST APIs', 'Scheduled jobs', 'Serverless', 'CI/CD pipelines'],
      idealFor: 'Manual processes, legacy integrations, scaling backends',
    },
  ],

  process: [
    { step: 'Discover', text: 'A quick call to map goals, users and constraints.' },
    { step: 'Plan', text: 'Scope, architecture and milestones you can sign off on.' },
    { step: 'Build', text: 'Weekly demos so you see progress, not surprises.' },
    { step: 'Launch', text: 'Deploy, monitor and hand over — with support after.' },
  ],

  email: 'rahulsaini3125@gmail.com',
  contactNote:
    "I'm not taking on new roles or projects right now, but I'm always happy to talk AI, web dev or anything I've built. Drop me a note below.",

  // One-tap starters in the contact form — each fills the message box with an opening line
  contactStarters: [
    { label: 'Just saying hi', subject: 'Hello from your portfolio', text: "Hi Rahul, I came across your portfolio and wanted to say hello!" },
    { label: 'Ask about a project', subject: 'Question about your work', text: 'Hi Rahul, I had a question about one of your projects: ' },
    { label: 'Talk AI', subject: "Let's talk AI", text: "Hi Rahul, I'd love to swap notes on LLM agents and RAG. " },
  ],

  // ── Search & AI engines (SEO / GEO / AEO) ──────────────────────────────
  // Used for the canonical URL, structured data (JSON-LD), sitemap.xml and llms.txt.
  siteUrl: 'https://www.officialrahulsaini.in/',
  shareImage: 'assets/img/og-image.png',   // 1200×630 preview for LinkedIn / X / WhatsApp
  company: { name: 'Snakescript LLP', city: 'Mohali' },
  school: 'Chandigarh University',
  address: { locality: 'Mohali', region: 'Punjab', country: 'IN' },

  // Shown as a visible FAQ and published as FAQPage structured data. Search and AI answer
  // engines quote these directly, so keep each answer a complete, factual sentence or two.
  faq: [
    {
      q: 'Who is Rahul Saini?',
      a: 'Rahul Saini is a Full Stack AI Engineer based in Mohali, Punjab, India. Rahul works at Snakescript LLP, building production web apps, LLM agents and RAG systems with Python, FastAPI, Django, React and Next.js, deployed on AWS and Azure.',
    },
    {
      q: 'What does Rahul Saini specialise in?',
      a: 'Bringing AI into real products: RAG chatbots over company data, multi-step agent workflows with LangChain and LangGraph, business automation, and the full stack web apps and APIs around them.',
    },
    {
      q: 'What tech stack does Rahul Saini use?',
      a: 'Python (FastAPI, Django), React, Next.js and TypeScript on the web side; LangChain, LangGraph, embeddings and vector databases for AI; PostgreSQL and Redis for data; and AWS (Lambda, ECS, Step Functions), Azure, Docker and CI/CD for deployment.',
    },
    {
      q: 'What kind of projects has Rahul Saini built?',
      a: 'Projects include an AI-powered medical research platform on AWS that gathers data from PubMed, PMC and Embase and answers research questions through a chat interface, a knowledge-based group chat with per-group RAG, email automation that extracts flight details, XML API integrations and LLM agent workflows. Client work is under NDA.',
    },
    {
      q: 'Is Rahul Saini available for hire or freelance work?',
      a: 'Not right now. Rahul is not taking on new roles or projects at the moment, but is happy to talk about AI, web development or past work by email.',
    },
    {
      q: 'How can I contact Rahul Saini?',
      a: 'Email rahulsaini3125@gmail.com or connect on LinkedIn. Rahul usually replies within 24 hours (India Standard Time).',
    },
  ],

  // Supported icons: github, linkedin, x, email, website. Remove any you don't use.
  socials: [
    { icon: 'github', label: 'GitHub', url: 'https://github.com/RahulSaini3125' },
    { icon: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/in/rahul-saini-709934273/' },
  ],
};
