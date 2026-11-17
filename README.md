# kshitijkaria.github.io

Personal site — Next.js 14 (App Router) + Tailwind CSS, statically exported to GitHub Pages.

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
```

## Deploy

Push to `main`. The GitHub Actions workflow in `.github/workflows/deploy.yml`
builds the static export and publishes it to Pages automatically.

One-time setup: repo **Settings → Pages → Source → "GitHub Actions"**.

## Notes

- Theme follows the system setting until the visitor toggles it; the choice
  then persists in `localStorage`. An inline script in `app/layout.js` applies
  it before paint so there's no flash.
- Fonts (Geist, via the `geist` package) and company logos (`public/logos`)
  are self-hosted — the page makes no third-party requests.
- The hero terminal is interactive (`components/Terminal.js`) — type `help`.
- All content lives in `components/data.js`. Projects marked `featured: true`
  appear on the home page; every project appears on `/projects`.
- Project media stays collapsed on `/projects` until a visitor opens it. Videos
  show a local still frame (`public/media`) and only load YouTube on play.
- `npm run lint` runs ESLint with `next/core-web-vitals`.
