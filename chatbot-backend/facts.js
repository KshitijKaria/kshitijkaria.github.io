// The only source of truth the assistant answers from.
// Keep this in step with the website (components/data.js in the site repo):
//   - project ids must match the `id` fields there
//   - link urls must match the hrefs there exactly, or the site will refuse to show them

const PROJECTS = [
  {
    id: "archmind",
    name: "ArchMind",
    year: "2026",
    summary:
      "Searchable memory for engineering teams. You select any code and ask why it exists; it searches GitHub (commits and pull requests), Jira, Confluence and the team's recorded decisions in parallel and answers with links back to the original sources. Decisions, temporary workarounds and conventions can be saved as memories tied to specific files and tickets, with control over who can see them and how long they last.",
    context:
      "Built by a team of four at MongoDB's 'Agents in Context' hackathon in Toronto (November 2026). The team did not place.",
    hisPart:
      "Kshitij built the semantic code search (Voyage voyage-code-3 embeddings combined with keyword search and rerank-2.5 reranking; re-indexing only re-embeds changed code), multi-repository 'repo groups' with merged architecture maps and cross-repo search, the interactive class-level architecture map, UI work (light mode, collapsible panels), and deployed the FastAPI and Next.js services to Render.",
    stack: "Python, FastAPI, MongoDB Atlas (Vector Search), Voyage AI, Gemini, Next.js, React, TypeScript, Tailwind, Render",
    notes: "The live app requires signing in. The repo is under a teammate's GitHub account.",
  },
  {
    id: "mars-shield",
    name: "Mars Shield",
    year: "2026",
    summary:
      "Crisis command platform for a product recall: a supply-chain risk map of the distribution network, a financial scenario simulator, brand sentiment tracking and an AI advisor for mitigation decisions.",
    stack: "React, Gemini 2.5",
  },
  {
    id: "wellthify",
    name: "Wellthify",
    year: "2025",
    summary:
      "AI health ecosystem that combines a fitness coach, a personalised dietitian and a mental-health therapist in one web app. Gemini generates adaptive fitness routines, diet plans and empathetic therapy conversations; MediaPipe gives real-time posture and form feedback through the webcam; the 3D avatar speaks with voice and lip-sync.",
    context: "Built at GenAI Genesis, Canada's largest AI hackathon, in March 2025.",
    stack: "React, Three.js and React Three Fiber, Gemini, MediaPipe, Flask (diet plans), Node.js (therapist), Google Cloud Text-to-Speech",
    notes: "Has a demo video on the projects page.",
  },
  {
    id: "prestige-circle",
    name: "Prestige Circle",
    year: "2025",
    summary:
      "Loyalty-points platform with role-based interfaces: members see events, promotions and their transactions (history, transfers, redemptions); cashiers create purchases and process redemptions; managers view and filter all transactions and make adjustments. Includes a Gemini chat assistant with optional ElevenLabs voice output.",
    context: "University of Toronto course project (CSC309).",
    notes: "The live app opens on a sign-in page.",
    stack: "React, Express, Prisma, JWT authentication, Gemini, ElevenLabs, MapTiler",
  },
  {
    id: "knowledge-nexus",
    name: "Knowledge Nexus",
    year: "2025",
    summary:
      "Turns course notes into an interactive knowledge graph: each note becomes a concept node with an embedding, and Gemini infers typed links between concepts (prerequisite, related, contrasts with).",
    stack: "TypeScript, Node.js, Gemini, embeddings",
  },
  {
    id: "unix-shell",
    name: "UNIX Shell",
    year: "2025",
    summary:
      "UNIX-style shell written in C with built-in commands, a custom parser, pipelines, I/O redirection, background jobs, signal handling and socket-based messaging so multiple clients can chat inside the shell. No memory leaks under Valgrind.",
    context: "University of Toronto Mississauga course project, January to April 2025.",
    stack: "C, POSIX, sockets, GDB, Valgrind",
  },
  {
    id: "plant-monitor",
    name: "Plant Monitor",
    year: "2025",
    summary:
      "ESP32 system that tracks temperature, humidity and soil moisture, with a live web dashboard (history, CSV download), a TFT display and email alerts when moisture drops below a threshold.",
    stack: "ESP32, C/C++, DHT11 and capacitive moisture sensors, HTML/CSS/JavaScript",
    notes: "Has a demo video on the projects page.",
  },
  {
    id: "ai-paint-app",
    name: "AI Paint App",
    year: "2024",
    summary:
      "JavaFX paint application with shape tools, undo/redo, a custom file format with its own parser, PNG export, and drawing generation from text descriptions through a local LLM (Ollama). Built with MVC and several design patterns in a Scrum team.",
    stack: "Java, JavaFX, Ollama",
  },
  {
    id: "sokoban",
    name: "Sokoban",
    year: "2024",
    summary:
      "Sokoban puzzle game written entirely in RISC-V assembly, with configurable grid sizes (5x5 to 127x127), a single-player mode and a competitive multiplayer mode with a leaderboard ranked by move count.",
    stack: "RISC-V assembly",
  },
  {
    id: "othello",
    name: "Othello",
    year: "2024",
    summary: "Two-player Othello with human and computer modes, greedy and random AI strategies, and JUnit test coverage.",
    stack: "Java, JUnit, Maven",
  },
  {
    id: "telecom-billing",
    name: "Telecom Billing System",
    year: "2024",
    summary:
      "Billing system for a phone company (MewbileTech) modelling customers, contract types and call records, with call activity visualised on a map of Toronto.",
    stack: "Python, PyGame",
  },
  {
    id: "treemap",
    name: "Treemap Visualizer",
    year: "2024",
    summary: "Interactive treemap that recursively partitions hierarchical data into proportional rectangles.",
    stack: "Python, PyGame",
  },
];

// Links the assistant may offer. Nothing outside this list can ever be returned.
const LINKS = {
  "archmind-live": { url: "https://archmind-web.onrender.com/", label: "open archmind (live app)" },
  "archmind-repo": { url: "https://github.com/parthtyagi9/ArchMind", label: "archmind repo" },
  "mars-shield-live": { url: "https://mars-shield.vercel.app", label: "open mars shield (live app)" },
  "wellthify-devpost": { url: "https://devpost.com/software/wellthify", label: "wellthify on devpost" },
  "prestige-circle-live": { url: "https://prestige-circle.vercel.app/login", label: "open prestige circle (live app)" },
  "prestige-circle-repo": { url: "https://github.com/KshitijKaria/prestige-circle", label: "prestige circle repo" },
  "knowledge-nexus-repo": { url: "https://github.com/KshitijKaria/knowledge-nexus", label: "knowledge nexus repo" },
  "plant-monitor-devpost": { url: "https://devpost.com/software/plant-monitoring-system", label: "plant monitor on devpost" },
  "finance-simulator-live": { url: "https://corporate-finance-simulator.onrender.com/", label: "open the corporate finance simulator" },
  "logistics-repo": { url: "https://github.com/KshitijKaria/Logistics-Automation-Java-Project", label: "logistics automation repo" },
  github: { url: "https://github.com/KshitijKaria", label: "github.com/KshitijKaria" },
  linkedin: { url: "https://www.linkedin.com/in/kshitij-karia-983b00118", label: "linkedin" },
};

const SECTIONS = ["work", "experience", "vitals", "contact"];

const FACTS = `
ABOUT
- Kshitij Karia is a software developer based in Toronto, Canada.
- He is a full-stack developer, most interested in full-stack development and agentic AI.

EDUCATION
- University of Toronto (Mississauga campus): BSc, Computer Science (Specialist) and Economics.
- CGPA 3.93 / 4.0. Dean's List Scholar (October 2024). University of Toronto Entrance Scholarship (April 2023).

EXPERIENCE
- SparcPay, software developer co-op, 2026 to present. Full-stack development at a fintech; a 12-month PEY (Professional Experience Year) co-op. No other details about this role are public — do not describe projects, clients, products or technologies there.
- Rotman Commerce (University of Toronto), software developer, January to April 2026. Built the Corporate Finance Simulator, a real-time web app in Node.js and JavaScript used by 50+ students to run simulations: Socket.IO rooms and server-side broadcasts keep session state in sync across users, and valuation algorithms compute cash flows, returns and scores across 10+ scenarios. The live app requires signing in.
- NeuralTechSoft (Mumbai), algorithmic trading intern, July to August 2024. Integrated AI models into futures trading strategies on India's National Stock Exchange (NSE).
- Happy Cow Dairy (Mumbai; the company is also known as Moowing), software development intern, June to July 2022. Built and deployed a Java application with database integration that cut daily manual data entry from 3 hours to 30 seconds, about 300 records a day across milk collection centres.
- NeuralTechSoft (Mumbai), software development intern, October to December 2021. Built a Java program that analyses stock prices with exponential moving averages (EMA) and generates buy, sell and hold signals.

PROJECTS (id — name, year)
${PROJECTS.map(
  (p) =>
    `- ${p.id} — ${p.name}, ${p.year}. ${p.summary}${p.context ? " " + p.context : ""}${p.hisPart ? " " + p.hisPart : ""} Stack: ${p.stack}.${p.notes ? " " + p.notes : ""}`
).join("\n")}

SKILLS
- Languages: TypeScript, JavaScript, Java, Python, C, C++, SQL, RISC-V assembly.
- Frameworks and libraries: Angular, React, Next.js, Node.js, Express, Spring Boot, FastAPI, Flask, Three.js, JavaFX, Socket.IO, Prisma.
- Data: MongoDB (including Atlas Vector Search), PostgreSQL.
- AI: Gemini API, Voyage AI embeddings and reranking, MediaPipe, Ollama.
- Tools: Git, Linux, GDB, Valgrind, Render, Vercel.

CONTACT
- Email: kshitij.karia@mail.utoronto.ca (the fastest way to reach him).
- GitHub: github.com/KshitijKaria. LinkedIn: linkedin.com/in/kshitij-karia-983b00118.

NOT COVERED — say you don't know and suggest emailing him:
- whether he is looking for a job or internship, his availability or start dates, graduation date, salary, work authorisation, willingness to relocate, references, anything personal.
`.trim();

module.exports = { FACTS, PROJECTS, LINKS, SECTIONS, PROJECT_IDS: PROJECTS.map((p) => p.id) };
