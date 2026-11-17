"use client";

import { useEffect, useState } from "react";
import ProjectRow from "@/components/ProjectRow";
import { projects } from "@/components/data";

/* All projects, or just the ones in ?show=a,b,c (the assistant links here with a filter). */
export default function ProjectList() {
  const [show, setShow] = useState(null);

  useEffect(() => {
    const ids = (new URLSearchParams(window.location.search).get("show") || "")
      .split(",")
      .filter((id) => projects.some((p) => p.id === id));
    if (ids.length) setShow(ids);
  }, []);

  const list = show ? projects.filter((p) => show.includes(p.id)) : projects;

  return (
    <div>
      {show && (
        <p className="mono pb-5 text-note" style={{ color: "var(--faint)" }}>
          showing {list.length} of {projects.length} ·{" "}
          <a className="a" href="/projects/">
            show all
          </a>
        </p>
      )}
      <div>
        {list.map((p) => (
          <ProjectRow key={p.id} project={p} detailed />
        ))}
      </div>
    </div>
  );
}
