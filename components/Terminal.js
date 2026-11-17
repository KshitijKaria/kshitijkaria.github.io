"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import Ext from "@/components/Ext";
import { LiveLink, useOpenLive } from "@/components/EmbedPanel";
import { useTheme } from "@/components/ThemeProvider";
import { EMAIL, findLink, projects } from "@/components/data";

/** The hero terminal: questions go to the AI assistant (chatbot-backend); `help` and `clear` stay local.
    If the assistant can't be reached, a few plain commands still work offline. */

function assistantUrl() {
  if (process.env.NEXT_PUBLIC_ASSISTANT_URL) return process.env.NEXT_PUBLIC_ASSISTANT_URL;
  const h = window.location.hostname;
  return h === "localhost" || h === "127.0.0.1"
    ? "http://localhost:4000"
    : "https://kshitijkaria-github-io.onrender.com";
}

const SUGGESTIONS = ["tell me about archmind", "show me his react projects", "how can i contact him?"];

const HELP = [
  "ask anything about kshitij — projects, experience, skills — or ask it to show you something.",
  "it can scroll the page, list matching projects, open a live app, start an email, or switch the theme.",
  "local commands: help · clear · open <project> (for projects with a live app)",
];

// plain answers for when the assistant is unreachable
function offline(cmd) {
  switch (cmd) {
    case "whoami":
      return ["kshitij karia — software developer in toronto. cs & economics @ uoft, currently at sparcpay."];
    case "projects":
      return projects.filter((p) => p.featured).map((p) => `${p.name.toLowerCase()} — ${p.stack}`).concat("full list → /projects");
    case "stack":
      return ["typescript · java · python · c · sql — angular · react · spring boot — mongodb · postgresql"];
    case "contact":
      return [`email → ${EMAIL}`, "github → github.com/KshitijKaria · linkedin → /in/kshitij-karia"];
    default:
      return ["offline commands: whoami · projects · stack · contact · clear"];
  }
}

// projects with a deployed app that can be opened from the terminal
const liveApp = (p) => p && p.links?.find((l) => l.label === "live");
const findProject = (text) => {
  const t = text.toLowerCase().replace(/[^a-z0-9]+/g, "");
  return projects.find((p) => p.id.replace(/-/g, "") === t || p.name.toLowerCase().replace(/[^a-z0-9]+/g, "") === t);
};

// ids only need to be unique on screen; random ones survive dev hot reloads without colliding
const line = (type, props) => ({ id: `${type}-${Math.random().toString(36).slice(2)}`, type, ...props });

// fixed ids so the server-rendered banner matches the browser's
const BANNER = [
  { id: "b0", type: "cmd", text: "whoami" },
  { id: "b1", type: "out", text: "cs & economics @ uoft · 3.93 gpa · dean's list" },
  { id: "b2", type: "muted", text: "ask me anything about kshitij, or try:" },
  { id: "b3", type: "suggest" },
];

async function fetchWithTimeout(url, options, ms) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(t);
  }
}

export default function Terminal() {
  const { theme, toggleTheme } = useTheme();
  const openLive = useOpenLive();
  const [lines, setLines] = useState(BANNER);
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(true);
  const [busy, setBusy] = useState(false);
  const histRef = useRef([]); // commands entered, oldest first (arrow-key recall)
  const histPos = useRef(-1); // -1 = live line
  const convo = useRef([]); // recent turns sent to the assistant for follow-up questions
  const inputRef = useRef(null);
  const bodyRef = useRef(null);

  const push = useCallback((...ls) => setLines((l) => [...l, ...ls]), []);

  // collapse by default on small screens; wake the assistant (free hosting sleeps when idle)
  useEffect(() => {
    if (matchMedia("(max-width: 767px)").matches) setOpen(false);
    fetch(`${assistantUrl()}/health`).catch(() => {});
  }, []);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, open]);

  /* Carry out the assistant's action. Only things already on this site are allowed:
     in-page actions run directly, anything that leaves the page becomes a link to click. */
  const runAction = (a) => {
    if (!a || a.type === "none") return;
    const byId = (id) => projects.find((p) => p.id === id);

    if (a.type === "goto_section") {
      const el = document.getElementById(a.section);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        push(line("muted", { text: `→ scrolled to ${a.section}` }));
      }
    } else if (a.type === "show_projects") {
      const ids = (a.projects || []).filter(byId);
      if (ids.length)
        push(
          line("internal", {
            text: `see ${ids.length === 1 ? "this project" : `these ${ids.length} projects`} on /projects`,
            href: `/projects/?show=${ids.join(",")}`,
          })
        );
    } else if (a.type === "open_project") {
      const p = byId(a.project);
      if (!p) return;
      const el = document.getElementById(`project-${p.id}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        push(line("muted", { text: `→ scrolled to ${p.name.toLowerCase()}` }));
      } else {
        push(line("internal", { text: `${p.name.toLowerCase()} on /projects`, href: `/projects/#project-${p.id}` }));
      }
      if (liveApp(p)) push(line("offer", { text: `open ${p.name.toLowerCase()}` }));
    } else if (a.type === "open_link") {
      const known = findLink(a.url); // must be a link that already appears on the site
      if (known) push(line("link", { text: a.label || known.label, href: known.href, embed: known.embed, title: known.title }));
    } else if (a.type === "email") {
      const subject = String(a.subject || "").slice(0, 80);
      push(
        line("mail", {
          text: `email kshitij${subject ? ` — "${subject}"` : ""}`,
          href: `mailto:${EMAIL}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`,
        })
      );
    } else if (a.type === "set_theme" && (a.theme === "light" || a.theme === "dark")) {
      if (a.theme !== theme) toggleTheme();
      push(line("muted", { text: `→ switched to ${a.theme} mode` }));
    }
  };

  const ask = async (q) => {
    setBusy(true);
    const wait = line("muted", { text: "thinking…" });
    push(wait);
    // the first question after a quiet spell wakes the server, which can take a while
    const slow = setTimeout(
      () =>
        setLines((l) =>
          l.map((x) => (x.id === wait.id ? { ...x, text: "waking the assistant up — the first reply can take up to a minute…" } : x))
        ),
      4000
    );
    const drop = () => setLines((l) => l.filter((x) => x.id !== wait.id));

    try {
      const res = await fetchWithTimeout(
        `${assistantUrl()}/chat`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: q, history: convo.current }),
        },
        75000
      );
      const data = await res.json().catch(() => ({}));
      drop();
      if (!res.ok && res.status !== 429) throw new Error(String(res.status));
      push(line("out", { text: data.reply || "sorry, no answer." }));
      if (res.ok) {
        convo.current = [...convo.current, { role: "user", text: q }, { role: "assistant", text: data.reply || "" }].slice(-6);
        runAction(data.action);
      }
    } catch {
      drop();
      const [cmd] = q.toLowerCase().split(/\s+/);
      push(line("muted", { text: "the assistant isn't reachable right now — here's the offline version." }));
      push(...offline(cmd).map((text) => line("out", { text })));
    } finally {
      clearTimeout(slow);
      setBusy(false);
    }
  };

  const submit = (raw) => {
    const q = raw.trim();
    setValue("");
    if (!q || busy) return;
    histRef.current.push(q);
    histPos.current = -1;

    if (q === "clear") return setLines([]);
    push(line("cmd", { text: q }));
    if (q === "help") return push(...HELP.map((text) => line("out", { text })));

    const opening = q.match(/^open\s+(.+)$/i);
    const target = opening && findProject(opening[1]);
    if (target && liveApp(target)) {
      openLive({ href: liveApp(target).href, title: target.name });
      return push(line("muted", { text: `→ opening ${target.name.toLowerCase()} (first load can take a minute)` }));
    }
    ask(q);
  };

  const render = (l) => {
    switch (l.type) {
      case "cmd":
        return (
          <p key={l.id}>
            <span style={{ color: "var(--faint)" }}>$</span> <span style={{ color: "var(--fg)" }}>{l.text}</span>
          </p>
        );
      case "muted":
        return (
          <p key={l.id} style={{ color: "var(--faint)" }}>
            {l.text}
          </p>
        );
      case "offer":
        return (
          <p key={l.id} style={{ color: "var(--faint)" }}>
            want to see it running?{" "}
            <button onClick={(e) => (e.stopPropagation(), submit(l.text))} className="a" disabled={busy}>
              {l.text}
            </button>
          </p>
        );
      case "suggest":
        return (
          <p key={l.id} className="flex flex-wrap gap-x-4 gap-y-1">
            {SUGGESTIONS.map((s) => (
              <button key={s} onClick={(e) => (e.stopPropagation(), submit(s))} className="a text-left" disabled={busy}>
                {s}
              </button>
            ))}
          </p>
        );
      case "link":
        return (
          <p key={l.id}>
            {l.embed ? (
              <LiveLink href={l.href} title={l.title}>{l.text}</LiveLink>
            ) : (
              <Ext href={l.href}>{l.text}</Ext>
            )}
          </p>
        );
      case "internal":
      case "mail":
        return (
          <p key={l.id}>
            <a className="a group/int inline-flex items-center gap-1.5" href={l.href}>
              {l.text}
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/int:translate-x-0.5" style={{ color: "var(--faint)" }} />
            </a>
          </p>
        );
      default:
        return (
          <p key={l.id} className="whitespace-pre-wrap">
            {l.text}
          </p>
        );
    }
  };

  return (
    <div className="w-full rounded-lg border text-left" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center gap-1.5 px-4 py-3"
        style={{ borderBottom: open ? "1px solid var(--border)" : "none" }}
      >
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="mono ml-3 text-meta" style={{ color: "var(--faint)" }}>
          kshitij@toronto ~{open ? "" : " — tap to ask"}
        </span>
        <ChevronDown
          className="ml-auto h-3.5 w-3.5 transition-transform duration-300"
          style={{ color: "var(--faint)", transform: open ? "rotate(180deg)" : "none" }}
        />
      </button>
      {open && (
        <div
          ref={bodyRef}
          onClick={() => inputRef.current?.focus()}
          className="mono h-64 cursor-text space-y-1.5 overflow-y-auto px-5 py-4 text-note leading-relaxed"
        >
          <div role="log" aria-live="polite" aria-label="Assistant conversation" className="space-y-1.5">
            {lines.map(render)}
          </div>
          <p className="flex items-center gap-2">
            <span style={{ color: busy ? "var(--faint)" : "var(--accent)" }}>$</span>
            <input
              ref={inputRef}
              value={value}
              maxLength={500}
              placeholder={busy ? "" : "ask a question…"}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") return submit(value);
                const h = histRef.current;
                if (e.key === "ArrowUp" && h.length) {
                  e.preventDefault();
                  histPos.current = histPos.current === -1 ? h.length - 1 : Math.max(0, histPos.current - 1);
                  setValue(h[histPos.current]);
                } else if (e.key === "ArrowDown" && histPos.current !== -1) {
                  e.preventDefault();
                  if (histPos.current >= h.length - 1) {
                    histPos.current = -1;
                    setValue("");
                  } else {
                    histPos.current += 1;
                    setValue(h[histPos.current]);
                  }
                }
              }}
              aria-label="Ask the assistant about Kshitij"
              className="w-full bg-transparent outline-none placeholder:text-[color:var(--faint)] focus-visible:!outline-none"
              style={{ color: "var(--fg)", caretColor: "var(--accent)" }}
              spellCheck={false}
              autoComplete="off"
            />
          </p>
        </div>
      )}
    </div>
  );
}
