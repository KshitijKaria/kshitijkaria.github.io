"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { ArrowUpRight, X } from "lucide-react";

/* Opens a live app inside the site, in a bordered panel over the page.
   Only used on wide screens — on phones, and without JS, LiveLink is a normal new-tab link. */

const EmbedContext = createContext({ openEmbed: () => {} });
export const useEmbed = () => useContext(EmbedContext);

const WIDE = "(min-width: 1024px)";

/* Open a live app from code (e.g. the terminal): in the panel on wide screens, a new tab otherwise.
   Call it from a click or key handler so browsers allow the new tab. */
export function useOpenLive() {
  const { openEmbed } = useEmbed();
  return useCallback(
    ({ href, title }) => {
      if (matchMedia(WIDE).matches) openEmbed({ href, title });
      else window.open(href, "_blank", "noopener,noreferrer");
    },
    [openEmbed]
  );
}

export function LiveLink({ href, title, children }) {
  const { openEmbed } = useEmbed();
  return (
    <a
      className="a group/link inline-flex items-center gap-1"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => {
        // let modified clicks (new tab / new window) and small screens behave like a normal link
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        if (!matchMedia(WIDE).matches) return;
        e.preventDefault();
        openEmbed({ href, title });
      }}
    >
      {children}
      <ArrowUpRight
        className="h-3.5 w-3.5 shrink-0 transition-all duration-200 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 group-hover/link:!text-[color:var(--accent)]"
        style={{ color: "var(--faint)" }}
      />
    </a>
  );
}

export default function EmbedProvider({ children }) {
  const [app, setApp] = useState(null); // { href, title }
  const [loaded, setLoaded] = useState(false);
  const closeRef = useRef(null);
  const lastFocus = useRef(null);

  const openEmbed = useCallback((next) => {
    lastFocus.current = document.activeElement;
    setLoaded(false);
    setApp(next);
  }, []);

  const close = useCallback(() => {
    setApp(null);
    lastFocus.current?.focus?.();
  }, []);

  useEffect(() => {
    if (!app) return;
    closeRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && close();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden"; // the page behind doesn't scroll while the panel is open
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [app, close]);

  let host = "";
  try {
    host = app ? new URL(app.href).host : "";
  } catch {}

  return (
    <EmbedContext.Provider value={{ openEmbed }}>
      {children}
      {app && (
        <div
          className="fixed inset-0 z-50 p-4 lg:p-8"
          style={{ background: "color-mix(in srgb, var(--bg) 85%, transparent)" }}
          onClick={close}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${app.title} — live app`}
            className="flex h-full w-full flex-col overflow-hidden rounded-lg border"
            style={{ borderColor: "var(--border)", background: "var(--card)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="mono flex items-center gap-4 border-b px-4 py-2.5 text-meta"
              style={{ borderColor: "var(--border)", color: "var(--faint)" }}
            >
              <span style={{ color: "var(--fg)" }}>{app.title}</span>
              <span className="truncate">{host}</span>
              <a
                className="a ml-auto inline-flex shrink-0 items-center gap-1"
                href={app.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                open in new tab
                <ArrowUpRight className="h-3.5 w-3.5" style={{ color: "var(--faint)" }} />
              </a>
              <button
                ref={closeRef}
                onClick={close}
                aria-label="Close"
                className="inline-flex shrink-0 items-center gap-1 transition-colors hover:!text-[color:var(--fg)]"
                style={{ color: "var(--faint)" }}
              >
                close <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="relative flex-1">
              {!loaded && (
                <p className="mono absolute inset-0 flex items-center justify-center px-6 text-center text-note">
                  loading {app.title} — it runs on free hosting, so the first load can take up to a minute
                </p>
              )}
              <iframe
                key={app.href}
                src={app.href}
                title={app.title}
                onLoad={() => setLoaded(true)}
                className="relative h-full w-full"
                style={{ opacity: loaded ? 1 : 0, background: "#fff" }}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads"
                allow="clipboard-write"
              />
            </div>
          </div>
        </div>
      )}
    </EmbedContext.Provider>
  );
}
