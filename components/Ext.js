import { ArrowUpRight } from "lucide-react";

/* external link: underline at rest + arrow that nudges on hover */
export default function Ext({ href, children, className = "" }) {
  return (
    <a
      className={`a group/link inline-flex items-center gap-1 ${className}`}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
      <ArrowUpRight
        className="h-3.5 w-3.5 shrink-0 transition-all duration-200 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 group-hover/link:!text-[color:var(--accent)]"
        style={{ color: "var(--faint)" }}
      />
    </a>
  );
}
