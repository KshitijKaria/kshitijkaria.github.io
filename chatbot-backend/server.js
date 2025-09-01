const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  console.warn("[WARN] GEMINI_API_KEY is missing. Set it in your .env file.");
}

const app = express();
app.use(cors());          // Allow frontend (your portfolio) to call the backend
app.use(express.json());  // Parse JSON requests

// Persona & profile used to ground answers about you
const PROFILE = `
Name: Kshitij Karia
Education: Computer Science & Economics (UTM)
Core skills: Java, Python, AI/ML, algorithms, basic web (HTML/CSS/JS/Bootstrap)
Highlights:
- Internships: NeuralTechSoft (Java EMA stock analysis + AI trading experiments); Moowing (Java Swing GUI for dairy automation)
- Organizer/Tech: Global Investment Immigration Summit (backend/video/media coordination)
- Projects: Sokoban in RISC‑V assembly; AI Paint App in Java; Virtual 3D AI Therapist (Gemini API);
- Interests: fintech/trading algorithms, AI integrations, EB‑5/Dubai Golden Visa campaign ops/analytics
`;

const SYSTEM_PROMPT = `You are Kshitij Karia (first person voice). Answer questions about your background using the provided PROFILE.
• Be concise (2–5 sentences) unless the user asks for detail.
• If a question is outside the PROFILE, say you’re not sure.
• If asked about contact details, direct them to the email on the site.
• Keep a friendly, professional tone.`;

// Chat endpoint
app.post("/chat", async (req, res) => {
  try {
    const userMessage = (req.body?.message || "").toString().slice(0, 2000);

    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { role: "system", parts: [{ text: `${SYSTEM_PROMPT}\n\nPROFILE:\n${PROFILE}` }] },
          generationConfig: { temperature: 0.6, topP: 0.9 },
          contents: [
            // Few-shot examples to steer answers
            { role: "user", parts: [{ text: "What internships have you done?" }] },
            { role: "model", parts: [{ text: "I completed two internships: at NeuralTechSoft I built a Java EMA‑based stock analysis tool and explored AI‑driven trading; at Moowing I created a Java Swing GUI to help automate dairy workflows." }] },
            { role: "user", parts: [{ text: "What are your main skills?" }] },
            { role: "model", parts: [{ text: "I mainly work with Java and Python. I’ve also used RISC‑V assembly for a Sokoban puzzle, plus JavaScript/Bootstrap for web, and I’m interested in AI/ML and fintech algorithms." }] },

            // The actual user question
            { role: "user", parts: [{ text: userMessage }] }
          ]
        })
      }
    );

    if (!resp.ok) {
      const errText = await resp.text();
      console.error("Gemini API error:", resp.status, errText);
      return res.status(500).json({ reply: "My brain (API) returned an error." });
    }

    const data = await resp.json();
    const parts = data?.candidates?.[0]?.content?.parts || [];
    const text = parts.map(p => p.text).filter(Boolean).join("\n");
    const reply = text || "Sorry, I don’t know.";
    return res.json({ reply });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ reply: "Error contacting Gemini API" });
  }
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Chatbot backend running on port ${PORT}`);
});