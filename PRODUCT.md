# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Recruiters and hiring managers for product management and software engineering roles (internships Fall 2026 / Spring 2027, full-time July 2027). They skim fast, often from a job application or LinkedIn link, and need to understand who Xing Ying is, see real projects and experience, then act.

## Product Purpose

Personal portfolio of Lau Xing Ying, Year 4 Information Systems student at SMU, Singapore. Success is a recruiter emailing her or opening her resume after seeing her work.

## Positioning

Sits between product and engineering: ships full-stack apps and also shapes product strategy (Shopee BPM intern, MindFlex full-stack intern, SMU Ellipsis VP), with hackathon results (DSTA CODE_EXP 2025 Finalist, AfterClass 6th place).

## Operating Context

React (CRA) + Tailwind single-page site with a React Three Fiber scene on the first screen. All projects live on the home page; `/projects` redirects there. Primary actions: email (lauxingying@gmail.com), resume (Google Drive link), LinkedIn, GitHub.

## Capabilities and Constraints

- All existing copy and facts (about, experience, projects, skills) must be kept verbatim; restyling only.
- Project data lives in `src/data/projects.js`.
- Skills section may be merged into another section; other sections stay.

## Brand Commitments

- Concept (set by the user): the whole site is one open styrofoam cai fan box on a hawker table. No header and no title at the side; labels on the scene are the navigation, and clicking one flies to that part. Chosen from three previewed directions on 2026-11-15; the full system is in `DESIGN.md`.
- Dishes she asked to feature: curry chicken, sweet and sour pork, fried chicken, french bean, cabbage, eggplant, tomato egg, steamed egg, egg tofu. Sauces are curry and sambal only.
- Singapore objects: a small flimsy red plastic bag that moves in the wind, an SGQR-style QR stand, a CDC-voucher-style resume slip. Official logos are not copied.
- Sound: object sound effects plus a stall voice ("xiao mei", "zhe ge", "na ge"). Sound starts off. Voice recordings are not yet supplied.
- Tone: playful and local, but credible for PM/SWE recruiters. It must not feel like a gimmick.
- Cuteness level follows `colourscheme-cutevibe.png` (bright, flat, friendly colour).
- No mascot or character: the food is the personality.
- The scene is real interactive 3D with animation, not an illustration.
- The resume link points to Google Drive; the PDF in `src/` is not published because it carries her phone number.
- Visual references chosen by the user live in `design/refs/`:
  - `3d-label-overallbigpicture.png`: one 3D scene as the whole site, with labels on its parts.
  - `animated-moving.png`: a 3D object that animates as the page moves.
  - `overallcutevibe.png`: overall cute vibe of chunky 3D objects.
  - `colourscheme-cutevibe.png`: colour scheme and cute vibe.

## Evidence on Hand

- Portrait: `src/assets/me.png`; about photos `src/assets/about1-4`.
- Project screenshots in `src/assets/*.png`, one per project in `projects.js`.
- No testimonials, metrics, or press exist; none may be invented.

## Product Principles

1. A recruiter should know who she is and how to reach her within one viewport.
2. Work is proof: projects and experience lead over self-description.
3. Craft of the site itself demonstrates product/design sense, but never slows the path to resume or email.
