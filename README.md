# Vidhi & Yash — Directors' Cut

Three **fully authored React wedding story experiences** in one Vite project, with different designs, chapter scripts, scroll animation timelines, and interactive sound controls.

## Run the project

```bash
npm install
npm run dev
```

Open `http://localhost:5173/` and choose an experience, or navigate directly to:

- **`/royal`** — The Royal Film: an illuminated palace, automatically opening gates, flower welcome, a ceremonial procession, bride and groom portraits, a mandap that assembles, seven symbolic lamps, and a grand wedding invitation. 11 chapters.
- **`/minimal`** — The Living Letter: a couture paper invitation, wax seal, unfolding letter, magazine-like portrait stories, family folios, oversized date typography, and a closing personal note. 11 chapters.
- **`/floral`** — The Enchanted Garden: animated butterflies, botanical scenery, garden arch, falling petals, character reveals, growing mandap, and a luminous resort finale. 11 chapters.

This isn't three palettes on the same component. The experiences have independent React scene trees and independent GSAP/ScrollTrigger sequences; common code covers only verified family information, navigation, sound and reusable controls.

## Technology

- React 19 / Vite 7
- GSAP 3 / ScrollTrigger (scroll-scrubbing, parallax, staged reveals, coordinated character travel)
- Three.js (optional GPU-accelerated 3D atmosphere with depth, shader glows and camera drift on desktop; falls back gracefully)
- CSS and procedural SVG (particle showers, flames, petals, flowers, mandap ornaments)
- Lucide React for functional iconography
- Illustrated PNG/WebP scenic assets included, fully local
- Optional recorded sound effects, off by default; see [`docs/AUDIO-LICENSING.md`](docs/AUDIO-LICENSING.md)

## Build and QA

```bash
npm run check  # offline JSX syntax / asset existence / scene-count checks
npm run build  # writes dist/
npm run preview
```

Deploy the built `dist/` folder to Vercel / Netlify / Cloudflare Pages. Configure SPA fallback to `/index.html` for the direct `/royal`, `/minimal`, `/floral` routes.

### Vercel fallback

Add a Vercel rewrite in `vercel.json` (provided). Most Vercel Vite presets recognize it.

### Netlify fallback

A `_redirects` file is included in `public/` for deployment.

## Exact wedding information

- Wedding: **Wednesday, 25 November 2026**
- Bride: **Vidhi**, daughter of **Smt. Babita and Late Shri Rajesh Kumar**
- Groom: **Yash**, son of **Smt. Sumitra Devi and Shri Tula Ram**
- Venue: **Shri Shyam Farm, Sector 102, Dhankot, Gurugram**

Event start times, schedule, story of meeting, personal photographs, guest-specific RSVP forms and unverified phone numbers are deliberately **not invented**. The available CTA exports an all-day `.ics` reminder, shares the invitation URL, and opens a Google Maps *search* for the provided venue. Verify the map pin before sending the invitation publicly.

All names, venue and dates are centralized in `src/data.js`.

## Verification status

The exported source passed the included **offline structural QA checks** (JSX syntax, asset references and chapter counts). npm installation and full React/Vite production-build and live-browser interaction checks were **not available in the generation environment**; run `npm install && npm run build` locally before publishing. Recorded SFX endpoints also need live verification before sending to guests.

## Quality and accessibility

- Responsive desktop and mobile CSS with 390px-specific adjustments.
- Scroll chapter navigation, a jump-to-scene drawer, keyboard-accessible buttons, clear readable text on artistic backgrounds.
- `prefers-reduced-motion` disables decorative particle loops and GSAP motion timelines for guests who prefer less motion.
- Sound is opt-in, volume-limited; audio playback failures are handled.
- No trackers, analytics, cookies, sign-up pages or fabricated RSVP collection.

## Design and asset caveat

Artwork is a stylized cinematic **illustration of a fictional palace/resort**, not a photograph of Shri Shyam Farm and not a portrait of the actual couple. To produce feature-film-level character animation, commission rigged 3D characters and animation clips for Three.js/R3F or Rive; these pages instead provide responsive, scroll-controlled 2D/2.5D motion design suitable for a deployable wedding site.

## Source structure

```
src/
  App.jsx                     // chooser + route selection
  pages/Royal.jsx             // unique Royal story & motion timeline
  pages/Minimal.jsx           // unique Living Letter story & motion timeline
  pages/Floral.jsx            // unique Enchanted Garden story & motion timeline
  styles/{base,royal,minimal,floral}.css
  components/StoryUtils.jsx   // navigation, scene hooks and particles
  components/AudioDirector.jsx
  components/Details.jsx
  data.js
public/art/                     // illustrated artwork
```
# wedding
