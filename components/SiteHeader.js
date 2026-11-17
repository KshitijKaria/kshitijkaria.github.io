"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

const links = [
  ["work", "/#work"],
  ["experience", "/#experience"],
  ["contact", "/#contact"],
];

const item = "transition-colors hover:!text-[color:var(--fg)]";

export default function SiteHeader() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="rise mono flex items-center text-meta" style={{ color: "var(--faint)" }}>
      {/* site name is dropped on phones so it can't collide with the nav */}
      <a href="/" className={`hidden sm:inline ${item}`} style={{ color: "var(--faint)" }}>
        kshitijkaria.github.io
      </a>
      <nav className="flex w-full items-center justify-between gap-5 sm:ml-auto sm:w-auto sm:justify-end">
        {links.map(([label, href]) => (
          <a key={label} href={href} className={item} style={{ color: "var(--faint)" }}>
            {label}
          </a>
        ))}
        <button onClick={toggleTheme} aria-label="Toggle theme" className={item} style={{ color: "var(--faint)" }}>
          {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
        </button>
      </nav>
    </header>
  );
}
