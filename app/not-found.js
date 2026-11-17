export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-5 px-6 text-center">
      <p className="mono text-meta uppercase tracking-[0.2em]" style={{ color: "var(--faint)" }}>
        Error 404
      </p>
      <h1 className="text-4xl font-semibold tracking-tight" style={{ color: "var(--fg)" }}>
        This page doesn&rsquo;t exist.
      </h1>
      <a href="/" className="a mono mt-3 text-note">
        back to home →
      </a>
    </div>
  );
}
