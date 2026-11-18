# ECHOES: The Forgotten Worlds

*Their missions ended. Their stories didn't.*

**ECHOES** is an interactive educational experience about the spacecraft, experiments, and exploration hardware left behind on the Moon and Mars. It was created for the **NASA Space Apps Challenge 2026**, responding to **“Abandoned but Not Forgotten: Storytelling about NASA's Discarded Equipment on the Moon and Mars.”**

Created by a student team including **Sonica Gill** and **Humaira Rajar**.

## Explore the project

- **20 artifacts:** Ten lunar and ten Martian exhibits, including Opportunity, Spirit, Viking, InSight, Surveyor, Apollo hardware, and Ingenuity.
- **Interactive 3D worlds:** Rotate the Moon and Mars, inspect equipment, and explore stylized walkable surfaces.
- **Two modes:** Story Mode presents illustrated, narrated mission histories; Discovery Mode lets visitors interact with artifacts and complete challenges.
- **Evidence investigations:** Use linked NASA records to support scientific conclusions.
- **Ask Echo:** A local, source-linked educational guide. It matches questions to curated material; it is **not** a generative AI chatbot.
- **Learning progress:** Source-based investigations, collected stamps, and optional progress export.

## Run locally

Requires **Node.js 20+**. No API key or package installation is required.

```bash
npm start
```

Open **http://127.0.0.1:4173/**. The website is served from `dist/` and needs a local server; opening `dist/index.html` directly will not load all browser modules and 3D models.

## Project structure

| Location | Purpose |
| --- | --- |
| `dist/index.html` | Website entry point |
| `dist/*.js` | Exploration, educational content, interaction, and presentation logic |
| `dist/*.css` | Interface and responsive styles |
| `dist/assets/` | Mission photographs, 3D models, narration, and short videos |
| `dist/vendor/` | Local Three.js modules and required third-party licenses |
| `ASSETS.json` | Asset sources and attribution |
| `serve.mjs` | Lightweight development server |
| `test.mjs` | Scientific-content and functionality checks |

This is a **static JavaScript application**, so `dist/` contains the active project files rather than an expendable generated build. Media are included to keep narrated stories and 3D models available without paid services.

## Test

```bash
npm test
npm run build
```

The `build` command performs syntax checks; it does not generate a separate compiled bundle.

## Science and sources

Mission facts, models, and evidence are based on public materials from:

- [NASA Science](https://science.nasa.gov/)
- [NASA Image and Video Library](https://images.nasa.gov/)
- [NASA NSSDCA](https://nssdc.gsfc.nasa.gov/)
- [NASA Planetary Data System](https://pds.nasa.gov/)
- [LROC](https://www.lroc.asu.edu/) and [HiRISE](https://www.uahirise.org/)

Individual image, model, and narration credits are listed in `ASSETS.json` and the in-app Sources & Credits panel. Third-party code and font licenses remain with their files.

### Accuracy notes

Surface walking routes, lighting, artifact spacing, and some models are **illustrative**, not surveyed reconstructions. Some models show complete engineering designs rather than the precise hardware that remains today. Mars Polar Lander's final resting location is not confirmed. Story narration is dramatized educational writing, **not** a historical quotation. Evidence-based claims link back to scientific records.

## Development and AI disclosure

AI-assisted tools were used during project development, including discussion and coding assistance. The challenge submission should identify the exact uses of those tools. ECHOES's on-site **Ask Echo** guide is a deterministic, curated question-and-answer interface, not a remote AI model. Scientific claims are intended to be independently traceable to NASA and other mission records.

## Live demonstration

[Explore ECHOES](https://phenomenal-boba-f6ee3a.netlify.app/)

## Acknowledgements

NASA, JPL-Caltech, LROC, HiRISE, and planetary science teams for their open educational data; the creators of Three.js and the Audiowide font. ECHOES is an independent educational project and is **not endorsed by NASA**.
