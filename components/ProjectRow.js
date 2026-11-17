"use client";

import { useState } from "react";
import { ChevronDown, Play } from "lucide-react";
import Ext from "@/components/Ext";
import { LiveLink } from "@/components/EmbedPanel";
import { rowClass } from "@/components/styles";

/* Shared row: year | name, one or two lines, stack.
   `detailed` (the /projects page) adds extra links and media that stays collapsed until asked for. */


function Video({ id, poster, title }) {
  const [playing, setPlaying] = useState(false);
  const frame = "mt-4 block aspect-video w-full max-w-[62ch] overflow-hidden rounded-md border";

  if (playing) {
    return (
      <iframe
        className={frame}
        style={{ borderColor: "var(--border)" }}
        src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
        title={title}
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    );
  }
  // Still frame only — nothing is loaded from YouTube until the visitor presses play.
  return (
    <button
      onClick={() => setPlaying(true)}
      className={`${frame} group/v relative`}
      style={{ borderColor: "var(--border)", background: "var(--card)" }}
      aria-label={`Play ${title}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={poster}
        alt=""
        loading="lazy"
        className="h-full w-full object-cover opacity-70 transition-opacity duration-300 group-hover/v:opacity-100"
      />
      <span
        className="mono absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded border px-2 py-1 text-meta"
        style={{ background: "var(--bg)", borderColor: "var(--border)", color: "var(--fg)" }}
      >
        <Play className="h-3 w-3" style={{ color: "var(--accent)" }} /> play demo
      </span>
    </button>
  );
}

export default function ProjectRow({ project: p, detailed = false }) {
  const [open, setOpen] = useState(false);
  const hasExtras = p.links?.length || (detailed && p.video);

  return (
    <article id={`project-${p.id}`} className={`${rowClass} scroll-mt-16`} style={{ borderColor: "var(--border)" }}>
      <span
        className="mono pt-[5px] text-meta transition-colors group-hover:!text-[color:var(--accent)]"
        style={{ color: "var(--faint)" }}
      >
        {p.year}
      </span>
      <div>
        {/* name on the left; links share the title line, right-aligned (they wrap under the name on phones) */}
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
          <h3 className="flex items-center gap-2 text-[1.05rem] font-medium" style={{ color: "var(--fg)" }}>
            {p.icon}
            <span>{p.name}</span>
          </h3>
          {hasExtras ? (
            <p className="mono flex flex-wrap items-center gap-x-4 gap-y-1 text-meta">
              {p.links?.map((l) =>
                l.embed ? (
                  <LiveLink key={l.label} href={l.href} title={p.name}>{l.label}</LiveLink>
                ) : (
                  <Ext key={l.label} href={l.href}>{l.label}</Ext>
                )
              )}
              {detailed && p.video && (
                <button
                  onClick={() => setOpen((o) => !o)}
                  aria-expanded={open}
                  className="a inline-flex items-center gap-1"
                >
                  demo video
                  <ChevronDown
                    className="h-3.5 w-3.5 transition-transform duration-200"
                    style={{ color: "var(--faint)", transform: open ? "rotate(180deg)" : "none" }}
                  />
                </button>
              )}
            </p>
          ) : null}
        </div>
        <p className="mt-1 max-w-[62ch] text-[0.92rem]">{p.desc}</p>
        {detailed && p.more && <p className="mt-1 max-w-[62ch] text-[0.92rem]">{p.more}</p>}
        <p className="mono mt-2 text-meta" style={{ color: "var(--faint)" }}>
          {p.stack}
        </p>

        {detailed && p.video && open && (
          <Video id={p.video.id} poster={p.video.poster} title={`${p.name} demo`} />
        )}
      </div>
    </article>
  );
}
