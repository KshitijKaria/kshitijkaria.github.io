import "./globals.css";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import ThemeProvider from "@/components/ThemeProvider";
import EmbedProvider from "@/components/EmbedPanel";

const SITE = "https://kshitijkaria.github.io";
const TITLE = "Kshitij Karia — Software Developer";

export const metadata = {
  title: TITLE,
  description:
    "CS & Economics @ University of Toronto. Software Developer Co-op @ SparcPay. Full-stack, fintech, applied AI.",
  metadataBase: new URL(SITE),
  alternates: { canonical: "/" },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: TITLE,
    description:
      "CS & Economics @ UofT · SWE Co-op @ SparcPay · full-stack, fintech, applied AI",
    url: SITE,
    siteName: "Kshitij Karia",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description:
      "CS & Economics @ UofT · SWE Co-op @ SparcPay · full-stack, fintech, applied AI",
    images: ["/og.png"],
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Kshitij Karia",
  url: SITE,
  image: `${SITE}/og.png`,
  jobTitle: "Software Developer",
  worksFor: { "@type": "Organization", name: "SparcPay", url: "https://sparcpay.com" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "University of Toronto" },
  address: { "@type": "PostalAddress", addressLocality: "Toronto", addressCountry: "CA" },
  sameAs: [
    "https://github.com/KshitijKaria",
    "https://www.linkedin.com/in/kshitij-karia-983b00118",
  ],
};

// Saved choice wins; otherwise follow the system setting. Runs before paint so there's no flash.
const themeInit = `(function(){var d=document.documentElement,t=null;try{t=localStorage.getItem("theme")}catch(e){}if(t!=="light"&&t!=="dark"){t=window.matchMedia&&matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"}d.classList.toggle("dark",t==="dark")})()`;

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`dark ${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body className="min-h-screen antialiased">
        <ThemeProvider>
          <EmbedProvider>{children}</EmbedProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
