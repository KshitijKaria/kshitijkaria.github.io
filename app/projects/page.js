import { ArrowLeft } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import ProjectList from "@/components/ProjectList";

export const metadata = {
  title: "Projects — Kshitij Karia",
  description: "Everything Kshitij Karia has built, most recent first.",
  alternates: { canonical: "/projects/" },
};

export default function Projects() {
  return (
    <div className="mx-auto max-w-[1000px] px-6 pb-20 pt-8 md:px-10">
      <SiteHeader />

      <section className="rise mt-16 md:mt-24" style={{ animationDelay: "0.06s" }}>
        <a className="a mono inline-flex items-center gap-1.5 text-note" href="/">
          <ArrowLeft className="h-3.5 w-3.5" style={{ color: "var(--faint)" }} />
          home
        </a>
        <h1
          className="mt-6 text-[2.6rem] font-semibold leading-none tracking-[-0.035em] sm:text-[3.4rem]"
          style={{ color: "var(--fg)" }}
        >
          Projects
        </h1>
        <p className="mt-4 max-w-[52ch]">Everything I&rsquo;ve built, most recent first.</p>
      </section>

      <hr className="mt-12 border-t md:mt-16" style={{ borderColor: "var(--border)" }} />

      <section className="doc pt-14">
        <h2 className="doc-label">all / projects</h2>
        <ProjectList />
      </section>

      <footer className="mono mt-20 border-t pt-6 text-meta" style={{ borderColor: "var(--border)", color: "var(--faint)" }}>
        © {new Date().getFullYear()} Kshitij Karia
      </footer>
    </div>
  );
}
