"use client";

import { useState } from "react";

/**
 * Small brand icon served from /public/logos (self-hosted — no third-party requests).
 * Falls back to a glyph if the image fails to load.
 */
export default function Favicon({ src, fallback = "◆", alt = "" }) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <span
        aria-hidden
        className="inline-flex h-4 w-4 items-center justify-center text-[0.7rem] leading-none"
      >
        {fallback}
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={16}
      height={16}
      onError={() => setFailed(true)}
      className="inline-block h-4 w-4 rounded-[3px] object-contain align-[-2px]"
    />
  );
}
