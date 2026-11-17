# Assistant backend

Powers the terminal on the home page. The site sends a question; this server asks Gemini, using only the
fact sheet in `facts.js`, and returns a short answer plus at most one action.

```
POST /chat    { "message": "...", "history": [{ "role": "user" | "assistant", "text": "..." }] }
           →  { "reply": "...", "action": { "type": "none" | "goto_section" | "show_projects" |
                                                     "open_project" | "open_link" | "email" | "set_theme", ... } }
GET  /health  →  { "ok": true }      the site calls this on page load to wake the free Render instance
```

## Updating what it knows

Edit `facts.js`. It is the only thing the assistant answers from.

- Project `id`s must match the `id` fields in `components/data.js` on the site.
- Link URLs in `LINKS` must match hrefs that already appear on the site. The site refuses any link it
  doesn't already show, so a typo here just means the link isn't offered.
- Anything listed under "NOT COVERED" gets "I don't know — email him".

## Safety limits

- The model only chooses from fixed lists (sections, project ids, link ids, light/dark). `sanitizeAction`
  in `server.js` drops anything else, and the site checks again before acting.
- Requests from other websites are refused before Gemini is called.
- 20 questions per visitor per 10 minutes, and 400 per day across everyone (`RATE_PER_IP`, `DAILY_CAP`).
  Counts live in memory, so they reset whenever Render restarts the instance.
- Questions are capped at 500 characters; only the last 6 turns are sent back for follow-ups.

## Environment variables

| Name | Required | Default |
|---|---|---|
| `GEMINI_API_KEY` | yes | — |
| `GEMINI_MODEL` | no | `gemini-3.5-flash` (2.5 Flash is closed to new API keys) |
| `GEMINI_FALLBACK_MODELS` | no | `gemini-flash-lite-latest,gemini-3.1-flash-lite,gemini-3.8-flash`, tried in order when the main model is overloaded, slow (12s) or retired. The Lite models are usually the least congested |
| `ALLOWED_ORIGINS` | no | `https://kshitijkaria.github.io,http://localhost:3000,http://localhost:3002` |
| `RATE_PER_IP` | no | `20` |
| `DAILY_CAP` | no | `400` |
| `PORT` | no | `4000` (Render sets this itself) |

## Run locally

```bash
npm install
GEMINI_API_KEY=your-key npm start
```

Then run the site with `npm run dev`; on localhost it talks to `http://localhost:4000` automatically.
To point the site somewhere else, build it with `NEXT_PUBLIC_ASSISTANT_URL=https://...`.

## Deploying

The existing Render service (`kshitijkaria-github-io.onrender.com`) runs the old version of this folder
from the `kshitijkaria.github.io` repo. Replacing that folder's contents with this one and pushing is
enough — the start command (`npm start`) and `GEMINI_API_KEY` stay the same.

The old live site keeps working against this version: it only reads `reply` and ignores `action`.
Its answers will switch to describing Kshitij in the third person.
