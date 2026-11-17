import {
  BrainCircuit, CircleDot, Cpu, Gem, Github, GraduationCap, HeartPulse, Landmark, LayoutGrid, Linkedin,
  Mail, Network, Palette, Receipt, Satellite, SquareTerminal, Sprout,
} from "lucide-react";
import Favicon from "@/components/Favicon";

/* ---------------- icons: small hints of colour against the monochrome page ---------------- */

const ic = (Icon, color) => <Icon className="h-4 w-4 shrink-0" style={{ color }} />;

export const icons = {
  sparcpay: <Favicon src="/logos/sparcpay.png" fallback="◆" />,
  neuraltechsoft: <Favicon src="/logos/neuraltechsoft.png" fallback="◆" />,
  uoft: ic(GraduationCap, "#4c9aff"),
  rotman: ic(Landmark, "#c084fc"),
  linkedin: ic(Linkedin, "#0A66C2"),
  github: ic(Github, "var(--fg)"),
  mail: ic(Mail, "#EA4335"),
  archmind: ic(BrainCircuit, "#a3e635"),
  marsShield: ic(Satellite, "#e8703a"),
  wellthify: ic(HeartPulse, "#f472b6"),
  prestige: ic(Gem, "#22d3ee"),
  nexus: ic(Network, "#a78bfa"),
  shell: ic(SquareTerminal, "var(--gray)"),
  plant: ic(Sprout, "#4ade80"),
  paint: ic(Palette, "#fbbf24"),
  sokoban: ic(Cpu, "#f87171"),
  othello: ic(CircleDot, "#94a3b8"),
  billing: ic(Receipt, "#fb923c"),
  treemap: ic(LayoutGrid, "#2dd4bf"),
  milk: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--icon-milk)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M8 2h8" /><path d="M9 2v2.789a4 4 0 0 1-.672 2.219l-.656.984A4 4 0 0 0 7 10.212V20a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-9.789a4 4 0 0 0-.672-2.219l-.656-.984A4 4 0 0 1 15 4.788V2" /><path d="M7 15a6.472 6.472 0 0 1 5 0 6.47 6.47 0 0 0 5 0" />
    </svg>
  ),
};

/* ---------------- projects ----------------
   id              → stable slug: page anchor (#project-<id>), /projects?show=<ids>, and the assistant's
                     project ids in chatbot-backend/facts.js — keep the two in step
   featured: true  → also shown on the home page
   links           → labelled links (live / repo / devpost) on the title line;
                     the project name itself is never a link, so every row reads the same.
                     embed: true opens the app in a panel inside the site on wide screens
                     (only for sites that allow being embedded — GitHub and Devpost don't)
   video           → { id: YouTube id, poster: local still frame } — collapsed until asked for
*/

export const projects = [
  {
    year: "2026",
    id: "archmind",
    name: "ArchMind",
    featured: true,
    icon: icons.archmind,
    desc: "Ask why any piece of code exists: it searches GitHub, Jira, Confluence and recorded team decisions at once and answers with linked sources. Built at a MongoDB hackathon.",
    more: "Decisions, workarounds and conventions are saved as memories tied to specific files and tickets, with control over who can see them. My part was the code search, multi-repo groups and architecture map.",
    stack: "python · fastapi · mongodb atlas · voyage ai · gemini · next.js",
    links: [
      { label: "live", href: "https://archmind-web.onrender.com/", embed: true },
      { label: "repo", href: "https://github.com/parthtyagi9/ArchMind" },
    ],
  },
  {
    year: "2026",
    id: "mars-shield",
    name: "Mars Shield",
    featured: true,
    icon: icons.marsShield,
    desc: "Crisis command platform for a product recall, with a supply-chain risk map, financial scenario simulator and an AI advisor.",
    stack: "gemini 2.5 · react",
    links: [{ label: "live", href: "https://mars-shield.vercel.app", embed: true }],
  },
  {
    year: "2025",
    id: "wellthify",
    name: "Wellthify",
    featured: true,
    icon: icons.wellthify,
    desc: "AI health ecosystem that puts a fitness coach with real-time webcam form feedback, a personalised dietitian and a talking 3D therapist in one app.",
    more: "Gemini generates the fitness routines, diet plans and therapy conversations, MediaPipe tracks posture through the webcam, and the 3D avatar speaks with lip-sync. Built at the GenAI Genesis hackathon.",
    stack: "react · three.js · gemini · mediapipe · flask · node.js",
    links: [{ label: "devpost", href: "https://devpost.com/software/wellthify" }],
    video: { id: "FagtUz-Is5s", poster: "/media/wellthify.jpg" },
  },
  {
    year: "2025",
    id: "prestige-circle",
    name: "Prestige Circle",
    featured: true,
    icon: icons.prestige,
    desc: "Loyalty-points platform with role-based interfaces for members, cashiers and managers, plus a Gemini assistant with voice output.",
    stack: "react · express · prisma · jwt · gemini",
    links: [
      { label: "live", href: "https://prestige-circle.vercel.app/login", embed: true },
      { label: "repo", href: "https://github.com/KshitijKaria/prestige-circle" },
    ],
  },
  {
    year: "2025",
    id: "knowledge-nexus",
    name: "Knowledge Nexus",
    icon: icons.nexus,
    desc: "Builds an interactive knowledge graph from course notes, using embeddings and Gemini to infer which concepts are prerequisites or related.",
    stack: "typescript · gemini · embeddings",
    links: [{ label: "repo", href: "https://github.com/KshitijKaria/knowledge-nexus" }],
  },
  {
    year: "2025",
    id: "unix-shell",
    name: "UNIX Shell",
    icon: icons.shell,
    desc: "UNIX-style shell in C with pipelines, I/O redirection, background jobs, signals and a built-in socket chat server. No memory leaks under Valgrind.",
    stack: "c · posix · sockets",
  },
  {
    year: "2025",
    id: "plant-monitor",
    name: "Plant Monitor",
    icon: icons.plant,
    desc: "ESP32 system that tracks soil moisture, temperature and humidity, with a live web dashboard and email alerts.",
    stack: "esp32 · c++ · html/css/js",
    links: [{ label: "devpost", href: "https://devpost.com/software/plant-monitoring-system" }],
    video: { id: "COK1YRcoy2E", poster: "/media/plant-monitor.jpg" },
  },
  {
    year: "2024",
    id: "ai-paint-app",
    name: "AI Paint App",
    icon: icons.paint,
    desc: "JavaFX paint application with shape tools, undo/redo and a custom file format. Generates drawings from text descriptions through a local LLM.",
    stack: "java · javafx · ollama",
  },
  {
    year: "2024",
    id: "sokoban",
    name: "Sokoban",
    icon: icons.sokoban,
    desc: "Sokoban puzzle game written entirely in RISC-V assembly, with configurable grid sizes, a single-player mode and a competitive multiplayer mode ranked by move count.",
    stack: "risc-v assembly",
  },
  {
    year: "2024",
    id: "othello",
    name: "Othello",
    icon: icons.othello,
    desc: "Two-player Othello with human and computer modes, greedy and random AI strategies, and JUnit test coverage.",
    stack: "java · junit · maven",
  },
  {
    year: "2024",
    id: "telecom-billing",
    name: "Telecom Billing System",
    icon: icons.billing,
    desc: "Billing system for a phone company that models customers, contract types and call records, with call activity visualised on a map of Toronto.",
    stack: "python · pygame",
  },
  {
    year: "2024",
    id: "treemap",
    name: "Treemap Visualizer",
    icon: icons.treemap,
    desc: "Interactive treemap that recursively partitions hierarchical data into proportional rectangles.",
    stack: "python · pygame",
  },
];

export const jobs = [
  {
    date: "2026 —",
    org: "SparcPay",
    role: "software developer co-op",
    icon: icons.sparcpay,
    desc: "Full-stack development at a fintech. PEY Co-op, 12 months.",
  },
  {
    date: "2026",
    org: "Rotman Commerce",
    role: "software developer",
    icon: icons.rotman,
    desc: "Built a real-time corporate finance simulator in Node.js for 50+ students, with Socket.IO rooms to sync session state and valuation algorithms that score 10+ scenarios.",
    link: { label: "live", href: "https://corporate-finance-simulator.onrender.com/", embed: true, title: "Corporate Finance Simulator" },
  },
  {
    date: "2024",
    org: "NeuralTechSoft",
    role: "algorithmic trading intern",
    icon: icons.neuraltechsoft,
    desc: "Integrated AI models into futures trading strategies on India's National Stock Exchange.",
  },
  {
    date: "2022",
    org: "Happy Cow Dairy",
    role: "software development intern",
    icon: icons.milk,
    desc: "Built a Java application that cut daily manual data entry from 3 hours to 30 seconds across milk collection centres.",
    link: { label: "logistics-automation", href: "https://github.com/KshitijKaria/Logistics-Automation-Java-Project" },
  },
  {
    date: "2021",
    org: "NeuralTechSoft",
    role: "software development intern",
    icon: icons.neuraltechsoft,
    desc: "Built a Java program that analyses stock prices with exponential moving averages and generates buy, sell and hold signals.",
  },
];

export const vitals = [
  ["gpa", "3.93 / 4.0 — the 0.07 saw things"],
  ["degree", "bsc cs (specialist) + economics"],
  ["awards", "dean's list scholar · uoft entrance scholarship"],
  ["stack", "typescript · java · python · c · sql — angular · react · spring boot — mongodb · postgresql"],
];

export const EMAIL = "kshitij.karia@mail.utoronto.ca";

export const contacts = [
  { k: "email", label: EMAIL, href: `mailto:${EMAIL}`, icon: icons.mail, external: false },
  { k: "github", label: "github.com/KshitijKaria", href: "https://github.com/KshitijKaria", icon: icons.github, external: true },
  { k: "linkedin", label: "in/kshitij-karia", href: "https://www.linkedin.com/in/kshitij-karia-983b00118", icon: icons.linkedin, external: true },
];

/* Every outbound link on the site, keyed by URL. The assistant may only surface links found here. */
const norm = (u) => u.replace(/\/+$/, "");
const linkIndex = new Map([
  ...projects.flatMap((p) => (p.links || []).map((l) => [norm(l.href), { ...l, title: p.name }])),
  ...jobs.filter((j) => j.link).map((j) => [norm(j.link.href), { ...j.link, title: j.link.title || j.org }]),
  ...contacts.filter((c) => c.external).map((c) => [norm(c.href), { label: c.label, href: c.href, title: c.k }]),
]);
export const findLink = (url) => (typeof url === "string" ? linkIndex.get(norm(url)) || null : null);
