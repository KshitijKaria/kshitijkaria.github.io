import { ArrowRight } from "lucide-react";
import Terminal from "@/components/Terminal";
import SiteHeader from "@/components/SiteHeader";
import ProjectRow from "@/components/ProjectRow";
import { rowClass } from "@/components/styles";
import Ext from "@/components/Ext";
import { LiveLink } from "@/components/EmbedPanel";
import { contacts, icons, jobs, projects, vitals } from "@/components/data";

const factRow = "grid gap-0.5 border-b py-3 first:pt-0 last:border-0 sm:grid-cols-[3.4rem_1fr] sm:gap-5";

export default function Home() {
  const featured = projects.filter((p) => p.featured);

  return (
    <div className="mx-auto max-w-[1000px] px-6 pb-20 pt-8 md:px-10">
      <SiteHeader />

      {/* ---------- hero ---------- */}
      <section className="mt-16 grid items-end gap-10 md:mt-24 md:grid-cols-[1.15fr_1fr] md:gap-14">
        <div className="rise" style={{ animationDelay: "0.06s" }}>
          <p className="mono text-meta uppercase tracking-[0.14em]" style={{ color: "var(--accent)" }}>
            software developer · toronto
          </p>
          <h1
            className="mt-3 text-[3.4rem] font-semibold leading-[0.98] tracking-[-0.035em] sm:text-[5.4rem]"
            style={{ color: "var(--fg)" }}
          >
            Kshitij
            <br />
            Karia
          </h1>
          <p className="mt-6 max-w-[42ch]">
            Full-stack developer who <span className="mark">ships things end to end</span>,
            with a background in economics and finance. Lately, I&rsquo;ve been
            focused on weaving AI into real projects.
          </p>
          <p className="mono mt-6 flex flex-wrap items-center gap-2 text-note" style={{ color: "var(--faint)" }}>
            currently @ {icons.sparcpay}{" "}
            <a className="a" href="https://sparcpay.com" target="_blank" rel="noopener noreferrer">
              sparcpay
            </a>{" "}
            · cs + econ @ {icons.uoft}{" "}
            <a className="a" href="https://www.utoronto.ca" target="_blank" rel="noopener noreferrer">
              uoft
            </a>
          </p>
        </div>
        <div className="rise" style={{ animationDelay: "0.14s" }}>
          <Terminal />
        </div>
      </section>

      <hr className="mt-16 border-t md:mt-24" style={{ borderColor: "var(--border)" }} />

      {/* ---------- 01 work: the most complex projects; the rest live on /projects ---------- */}
      <section id="work" className="doc scroll-mt-16 pt-14">
        <h2 className="doc-label">01 / work</h2>
        <div>
          {featured.map((p) => (
            <ProjectRow key={p.id} project={p} />
          ))}
          <p className="mono pt-5 text-note">
            <a className="a group/all inline-flex items-center gap-1.5" href="/projects/">
              all projects
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform duration-200 group-hover/all:translate-x-0.5"
                style={{ color: "var(--faint)" }}
              />
            </a>
          </p>
        </div>
      </section>

      {/* ---------- 02 experience ---------- */}
      <section id="experience" className="doc scroll-mt-16 pt-14">
        <h2 className="doc-label">02 / experience</h2>
        <div>
          {jobs.map((j) => (
            <article key={j.org + j.date} className={`${rowClass} last:border-0`} style={{ borderColor: "var(--border)" }}>
              <span
                className="mono pt-[5px] text-meta transition-colors group-hover:!text-[color:var(--accent)]"
                style={{ color: "var(--faint)" }}
              >
                {j.date}
              </span>
              <div>
                <h3 className="flex flex-wrap items-center gap-2 text-[1.05rem]" style={{ color: "var(--fg)" }}>
                  {j.icon}
                  <span className="font-medium">{j.org}</span>
                  <span className="mono text-meta" style={{ color: "var(--faint)" }}>
                    {j.role}
                  </span>
                </h3>
                <p className="mt-1 max-w-[62ch] text-[0.92rem]">{j.desc}</p>
                {j.link && (
                  <p className="mono mt-2 text-meta">
                    {j.link.embed ? (
                      <LiveLink href={j.link.href} title={j.link.title || j.org}>{j.link.label}</LiveLink>
                    ) : (
                      <Ext href={j.link.href}>{j.link.label}</Ext>
                    )}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ---------- 03 vitals ---------- */}
      <section id="vitals" className="doc scroll-mt-16 pt-14">
        <h2 className="doc-label">03 / vitals</h2>
        <div>
          {vitals.map(([k, v]) => (
            <div key={k} className={factRow} style={{ borderColor: "var(--border)" }}>
              <span className="mono pt-[3px] text-meta" style={{ color: "var(--faint)" }}>
                {k}
              </span>
              <p className="text-[0.92rem]">{v}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- 04 contact ---------- */}
      <section id="contact" className="doc scroll-mt-16 pt-20">
        <h2 className="doc-label">04 / contact</h2>
        <div>
          <p className="pb-2 text-[0.92rem]">The fastest way to reach me is email.</p>
          {contacts.map((c) => (
            <div key={c.k} className={factRow} style={{ borderColor: "var(--border)" }}>
              <span className="mono pt-[3px] text-meta" style={{ color: "var(--faint)" }}>
                {c.k}
              </span>
              <p className="flex items-center gap-2 text-[0.92rem]">
                {c.icon}
                {c.external ? (
                  <Ext href={c.href}>{c.label}</Ext>
                ) : (
                  <a className="a" href={c.href}>{c.label}</a>
                )}
              </p>
            </div>
          ))}
        </div>
      </section>

      <footer className="mono mt-20 border-t pt-6 text-meta" style={{ borderColor: "var(--border)", color: "var(--faint)" }}>
        © {new Date().getFullYear()} Kshitij Karia
      </footer>
    </div>
  );
}
