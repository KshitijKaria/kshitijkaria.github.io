// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

// NOTE: Node 18+ has global fetch. On Node <18: `npm i node-fetch` then:
// const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));

if (!process.env.GEMINI_API_KEY) {
  console.warn("[WARN] GEMINI_API_KEY is missing. Set it in your .env file.");
}

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash"; // 👈 updated default

const app = express();
app.use(cors());
app.use(express.json());

const PROFILE = `
Name: Kshitij Karia
Education: BSc, Computer Science & Economics (University of Toronto Mississauga, Co-op); Dean’s List Scholar (Oct 2024); Entrance Scholarship (Apr 2023); Current CGPA: 3.91/4.0
Core skills: Java, Python, C, Assembly Language, JavaScript/TypeScript, React, Node/Express, Three.js/WebGL, Google Cloud TTS, Gemini API, REST APIs, Git/Linux, SQL, Bootstrap, HTML/CSS, software design patterns, systems programming
Highlights & Experience:
- Internships:
  • NeuralTechSoft (Jul–Aug 2024, Mumbai): Integrated AI-driven models into futures trading strategies on the National Stock Exchange (NSE), enhancing data-driven decision making. Strengthened expertise in algorithmic trading systems, financial modelling, and AI applications.
  • Happy Cow Dairy Company (Jun–Jul 2022, Mumbai): Built and deployed a Java application with backend database integration that reduced manual data entry from 3 hours to 30 seconds for ~300 daily records, improving efficiency by 95%.
  • NeuralTechSoft (Oct–Dec 2021, Mumbai): Developed a Java program for exponential moving average (EMA) stock analysis, generating automated buy/sell/hold signals. Gained exposure to treasury functions, risk analysis, and trading systems.

- Academic & Personal Projects:
  • Custom Shell in C (2025): Implemented a UNIX-like shell with process control, job management, piping, redirection, and socket-based networking. Advanced skills in systems programming and low-level process/resource management.
  • IoT Plant Monitoring with ESP32 (2025): Designed system with temperature, humidity, and soil sensors; built live dashboard, TFT display, and automated email alerts.
  • Wellthing – AI Wellness Ecosystem (Hackathon, 2025): React app with 3D Blender characters, Rhubarb lip sync, Google Gemini AI, Google Cloud TTS, and pose detection for real-time personalized therapy and fitness.
  • AI Paint App in Java (2024): JavaFX app with MVC architecture, advanced tools, undo/redo, design patterns, and Ollama API integration for drawable content generation.
  • Othello Game in Java (2024): Two-player game with Greedy/Random AI, modular architecture, and JUnit test coverage.
  • MewbileTech Phone Company Simulation in Python (2024): Telecom billing system with contracts, call tracking, and PyGame visualization.
  • Treemap Visualizer in Python (2024): Recursive treemap GUI with PyGame, object-oriented design, and hierarchical data visualization.

- Systems/CS Competencies: Strong in algorithms, data structures, recursion, OOP, design patterns, assembly programming, Git, debugging with Valgrind/GDB, socket programming.

- Volunteering: Ashray Akruti Foundation (2022): Organized Diwali sale of diyas by specially-abled youth; raised $200 in one week; managed sales and deliveries; developed empathy and community engagement skills.

- Organizer/Tech: Global Investment Immigration Summit (backend, video, media coordination); Acquest Advisors (digital campaigns, webinars, analytics for EB-5/Dubai Golden Visa).

- Interests: Software engineering, fintech & algorithmic trading, AI-driven applications, real-time systems, immersive AI integrations (voice, 3D, pose detection), data-driven decision systems.
`;

const SYSTEM_PROMPT = `You are Kshitij Karia (use first-person). Answer questions about your background using PROFILE.
• Be concise (2–5 sentences) unless the user asks for more detail.
• If something isn’t in PROFILE, say you’re not sure or summarize at a high level.
• For contact, point to the email on the site.
• Keep a friendly, professional tone; avoid sharing private/confidential details.
• When relevant, highlight recent projects (Virtual 3D AI Therapist, Virtual Fitness Coach with pose detection & lip-sync, C shell/socket programs) and key skills (Java, Python, C, React, Node, Three.js, Google Cloud TTS, Gemini API).
`;

// Chat endpoint
app.post("/chat", async (req, res) => {
  try {
    const userMessage = (req.body?.message || "").toString().slice(0, 2000);

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
      GEMINI_MODEL
    )}:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: {
          role: "system",
          parts: [{ text: `${SYSTEM_PROMPT}\n\nPROFILE:\n${PROFILE}` }],
        },
        generationConfig: { temperature: 0.6, topP: 0.9 },
        contents: [
          // Few-shot examples to steer answers
          { role: "user", parts: [{ text: "What internships have you done?" }] },
          {
            role: "model",
            parts: [
              {
                text:
                  "I completed two internships: at NeuralTechSoft I built a Java EMA-based stock analysis tool and explored AI-driven trading; at Moowing I created a Java Swing GUI to help automate dairy workflows.",
              },
            ],
          },
          { role: "user", parts: [{ text: "What are your main skills?" }] },
          {
            role: "model",
            parts: [
              {
                text:
                  "I mainly work with Java and Python. I’ve also used RISC-V assembly for a Sokoban puzzle, plus JavaScript/Bootstrap for web, and I’m interested in AI/ML and fintech algorithms.",
              },
            ],
          },

          // Actual user message
          { role: "user", parts: [{ text: userMessage }] },
        ],
      }),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      console.error("Gemini API error:", resp.status, errText);
      return res.status(500).json({ reply: "My brain (API) returned an error." });
    }

    const data = await resp.json();
    const parts = data?.candidates?.[0]?.content?.parts || [];
    const text = parts.map((p) => p.text).filter(Boolean).join("\n");
    const reply = text || "Sorry, I don’t know.";
    return res.json({ reply, model: GEMINI_MODEL }); // include model for quick debugging
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ reply: "Error contacting Gemini API" });
  }
});

// Start server (export app for tests)
if (require.main === module) {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Chatbot backend running on port ${PORT} (model: ${GEMINI_MODEL})`);
  });
}
module.exports = app;

