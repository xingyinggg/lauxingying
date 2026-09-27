---
name: Lau Xing Ying
description: A portfolio seen through a soft mint weather system, with monumental wide type and hairline index rows.
colors:
  ink: "#111311"
  ink-lift: "#26302A"
  ground: "#E9EFEA"
  paper: "#F3F6F3"
  mint: "#C5EBC3"
  mint-deep: "#2F5A3A"
  mat: "#D7E0D8"
  rule: "rgba(17, 19, 17, 0.16)"
  fog-sea-glass: "#A9DCCB"
  fog-lilac: "#D9D2F2"
  fog-peach: "#F6D9C6"
typography:
  display:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "fitted to container width (FitName)"
    fontWeight: 900
    lineHeight: 0.8
    letterSpacing: "-0.04em"
    fontVariation: "\"wdth\" 125"
  headline:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(56px, 10.5vw, 160px)"
    fontWeight: 900
    lineHeight: 0.9
    letterSpacing: "-0.04em"
  statement:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(28px, 3.9vw, 58px)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(22px, 3.4vw, 48px)"
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "-0.03em"
  body-lg:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "19px"
    fontWeight: 400
    lineHeight: 1.55
  body:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.6
  meta:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.4
  label:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 500
    letterSpacing: "0.12em"
  time:
    fontFamily: "Martian Mono, ui-monospace, monospace"
    fontSize: "12px"
    fontWeight: 400
    letterSpacing: "0.06em"
    fontFeature: "\"tnum\""
rounded:
  photo: "3px"
  sheet-sm: "20px"
  sheet: "28px"
  pill: "9999px"
spacing:
  gutter: "clamp(16px, 2.8vw, 40px)"
  grid-gap: "24px"
  row-y: "40px"
  section-y: "128px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "12px 20px"
  button-primary-hover:
    backgroundColor: "{colors.ink-lift}"
    textColor: "{colors.paper}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "12px 20px"
  button-outline-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  filter-toggle:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "10px 16px"
  filter-toggle-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  sheet:
    backgroundColor: "{colors.ground}"
    rounded: "{rounded.sheet}"
  project-mat:
    backgroundColor: "{colors.mat}"
    rounded: "{rounded.photo}"
    padding: "clamp(6px, 0.8vw, 12px)"
  project-mat-hover:
    backgroundColor: "{colors.mint}"
  achievement-label:
    textColor: "{colors.mint-deep}"
    typography: "{typography.label}"
  menu-overlay:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
---

# Design System: Lau Xing Ying

## Overview

**Creative North Star: "The Mint Weather Window"**

The page is a pale fog ground with a live mint haze that drifts and leans toward the cursor. The work sits on an opaque sheet floating inside that weather. The hero and the contact close are the two windows where the fog shows through. Everything between them sits on the calm ground sheet. The type does the structural work. A single Archivo family runs across its width axis: wide and black for the name, normal width for everything else. Near-black ink carries all of it, and mint is the only colour that answers when you hover.

Density is low and asymmetric. Every section keeps one large empty region on a 12-column grid, and content never sits centred as filler. Depth comes from the fog behind the sheet, never from shadows. Content is divided by hairline rules. There are no cards and no chips, only ink pills for actions. Motion is slow, expo-eased and masked: headings slide up out of line masks, rows flood with mint from the bottom, and the preloader and menu lift away as clip-path curtains.

The system rejects the old dark-background, neon-accent, card-grid and skill-chip portfolio look it replaced.

**Key Characteristics:**
- Live WebGL mint fog seen only through the hero and contact windows. A 20-28px rounded ground sheet carries the content between them.
- One type family (Archivo) across its width axis, plus Martian Mono only for times and dates.
- Ink on fog, with mint as the hover and selection response and mint-deep as the only accent for text.
- Hairline index rows instead of cards, and ink pills instead of buttons with shadows.
- Expo-eased, masked, curtain-style motion that falls back cleanly under reduced motion.

## Colors

A cool, desaturated green-grey world lit by one signature mint, with near-black ink for all structure.

### Primary
- **Signature Mint** (mint): the brand colour. It is the base of the fog field, the row flood on hover in the experience index, the project-mat hover, the text selection, the arrow inside dark pills, the cursor label, and the active Menu/Close button. It covers large areas only as a response to hover or as atmosphere. It is never used for text on the ground.
- **Deep Fern** (mint-deep): the only accent colour for text. It is used for achievement labels (such as "DSTA CODE_EXP 2025 Finalist") and the availability line with its 8px dot. It keeps legible contrast on ground and fog.

### Neutral
- **Ink** (ink): all type, pill fills, hairline rules (as the `rule` alpha), the menu overlay and the preloader panel.
- **Ink Lift** (ink-lift): the hover state for dark pills only.
- **Fog Ground** (ground): the page background, the sheet surface, the theme-color and the fog's base.
- **Paper** (paper): text and arrows set on ink.
- **Project Mat** (mat): the recessed tone behind each screenshot on /projects. It shifts to mint on hover.
- **Hairline** (rule): 1px dividers between index rows, experience rows and the skills grid. The footer uses a slightly stronger ink at 25% alpha.

### Tertiary (fog only)
- **Sea-glass, Lilac, Peach** (fog-sea-glass, fog-lilac, fog-peach): these tints appear only inside the fog shader and its CSS fallback gradient. Lilac stays in the top-right corner and peach in the bottom-right. Neither may appear as a UI colour.

### Named Rules
**The Mint Answers Rule.** Mint floods a surface only in response to the visitor, through hover, selection, or an open menu, or as the fog itself. At rest the page is ink on fog.

**The Fog Stays Behind Glass Rule.** The fog palette lives only in the fixed fog layer. Opaque ground sheets cover it, so it shows through only the hero and the closing contact section.

## Typography

**Display Font:** Archivo at wdth 125, weight 900 (with system-ui)
**Body Font:** Archivo at normal width (with system-ui)
**Label/Mono Font:** Archivo 11px uppercase for labels. Martian Mono (with ui-monospace) only for times and dates.

**Character:** One grotesque family stretched from monumental to modest. The wide black cut is a mark, and the normal-width semibold is the voice. Mono appears only where digits need to hold still.

### Hierarchy
- **Display** (900, wdth 125, line-height 0.8, -0.04em): the name "XING YING" is set on one line on desktop and two lines on mobile. JS fits it to span the full gutter-to-gutter width. The same cut sets the XY mark (22px) and the preloader counter (clamp(96px, 22vw, 340px)).
- **Headline** (900, clamp(56px, 10.5vw, 160px), 0.9, -0.04em): section titles such as "Experience", "Featured Projects", "All Projects" and the contact line (up to 176px, line-height 0.88). They are always revealed with masked lines. The menu items use a sibling cut: 800, clamp(44px, 8.5vw, 120px), line-height 0.95.
- **Statement** (600, clamp(28px, 3.9vw, 58px), 1.1, -0.03em): the about statement, lit word by word on scroll from 0.2 opacity to full ink. The hero h1 uses the same voice at clamp(32px, 4.2vw, 58px) with line-height 1.04.
- **Title** (600, clamp(22px, 3.4vw, 48px), 1.02, -0.03em): project index rows. Experience roles use clamp(24px, 2.6vw, 36px) and /projects titles use clamp(22px, 2.4vw, 34px). Sub-section heads such as "Skills & Expertise" use clamp(28px, 3vw, 44px).
- **Body** (400, 17px to 19px at line-height 1.5-1.55 for lead copy; 15px to 16px at 1.6 for row copy): ink at 80% alpha, capped near 430-520px or 56ch.
- **Meta** (400, 13px): tech stacks joined with " · " at 70% ink.
- **Label** (500, 11px, 0.12em, uppercase): navigation, categories, organisations, footer, captions and pill text (11.5px). Always set in Archivo, never in mono.
- **Time** (Martian Mono, 12px, 0.06em, uppercase, tabular): experience periods, and the live Singapore clock inside the header and footer labels.

### Named Rules
**The One Family Rule.** Every word is Archivo, with width and weight carrying the hierarchy. Martian Mono is reserved for numerals that tick or date. Using it for general labels breaks the system.

**The Wide Is a Mark Rule.** wdth 125 / 900 is reserved for the name, the XY monogram and the preloader count. Headlines use normal-width 900.

## Layout

The layout is a 12-column grid with a 24px column gap, inset by a fluid gutter (clamp(16px, 2.8vw, 40px)). Content sits asymmetrically. Headlines start at column 4, labels hold columns 1-3, and body copy takes a 4-column slice at the far end, which leaves one deliberate empty field in each section. Sections breathe at 96px on mobile and 128-144px on desktop. The hero and contact are full viewport height (100svh) and pin content to top and bottom with space between. The ground sheet is inset 6px on mobile and 8px on desktop, so a rim of fog shows at its edges.

The home project index is a typographic list: title, category (190px) and tech/links (260px) on desktop, and a 88px thumbnail plus text on mobile. /projects is a staggered two-column wall. The right column drops 128px (md:mt-32), with fluid column gaps of clamp(24px, 5vw, 96px) and 64-96px between rows, so it reads as a hung wall rather than a grid. Below 768px everything collapses to a single column, and the hero portrait moves to a small tilted 104px print above the name.

## Elevation & Depth

The system is flat and uses no box-shadows. Depth has three layers: the fixed fog field (z-0), the opaque rounded ground sheet and content above it (z-10), and ink curtains (the menu at z-55, the preloader at z-90) that cover everything and lift away via clip-path. Photos gain presence through slight rotation (-3deg to 3deg) and a cursor-driven tilt, not through elevation.

### Named Rules
**The Layered Weather Rule.** Depth comes from the fog behind the sheet and from curtains over it. Never from shadows, glows or blurs on components.

## Shapes

- **Pills** (fully rounded) for every action and filter.
- **Sheets** have soft large corners (20px on mobile, 28px on desktop).
- **Photographs and screenshots** use a near-square 3px radius and are often rotated a few degrees like loose prints.
- **Round dots:** the 8px availability dot and the circular cursor.
- **Lines:** 1px hairlines divide rows, and a full-weight ink underline sits under the contact email.
- **Link underlines** draw in from the left over 0.6s (1px, currentColor).

## Components

### Buttons (Pills)
Pills are ink, compact and set as uppercase labels, with an arrow that turns 45 degrees on hover.
- **Shape:** fully rounded (pill), 12px 20px padding, label at 11.5px.
- **Primary:** ink fill, paper text and a mint arrow. On hover the fill shifts to ink-lift.
- **Outline:** 1px ink border at 80% alpha, ink text. On hover it fills with ink and the text turns paper. In the header it sits on ground at 40% alpha.
- **Focus:** 2px ink outline with a 4px offset, globally.
- **Transitions:** colour over 300ms. The arrow rotates over 500ms with expo easing.

### Filter Toggles (/projects)
- **Style:** pill outline at 30% ink alpha, 10px 16px, label text, with a mono count at 60% opacity.
- **State:** the active toggle is solid ink with paper text (aria-pressed). An inactive toggle's border goes to full ink on hover. These are toggles, not tags. The system has no tag or chip components.

### Index Rows (Experience, Project Index)
- **Structure:** full-bleed rows split by hairline rules, with no container.
- **Experience hover:** a mint fill scales up from the row's bottom edge (700ms, expo easing).
- **Project index hover:** the title slides 20px right, other rows dim to 35%, and a 3:2 screenshot follows the cursor with a slight lag and lean. It opens from its centre via clip-path. On touch, a thumbnail sits inline in the row.
- **Achievements:** set inline after the title as a mint-deep label.

### Project Wall Item (/projects)
- **Mat:** a 16:10 mat tile with a 3px radius and fluid padding. The screenshot sits inside it with object-contain. On hover the mat turns mint and the image scales to 1.03 over 1.2s.
- **Text:** the title (600) and category label share a baseline row. Under them come the achievement label in mint-deep, 15px description, 13px tech meta and label links with small arrows.

### Navigation
- **Header:** fixed and transparent. The XY mark and name label sit at the left, the live SGT clock (label + mono) at the centre on desktop, and the Resume outline pill and Menu ink pill at the right.
- **Menu:** a full-screen ink curtain drops in via clip-path (0.8s expo). It lists four heavy (800) items divided by paper hairlines at 15% alpha. On hover an item turns mint, slides 16px and shows an arrow. The Menu button becomes a mint "Close" pill. Contact links sit at the bottom as label draw-links.

### Signature: Fog, Cursor, Preloader
- **Fog:** a half-resolution WebGL field with mint dominant, sea-glass mixed through, and lilac and peach held in the corners. It bends toward the pointer and runs only while a fog window is on screen. A static radial-gradient fallback uses the same colours.
- **Cursor:** on fine pointers only. A 10px ink dot trails the pointer and grows into an 88px ink ring with a mint label ("View", "Email") over tagged targets. Over plain links it shows a faint 36px halo.
- **Preloader:** once per session, a wide black counter runs 000 to 100 on ink, then the panel lifts as a curtain and the hero entrance plays.

## Do's and Don'ts

### Do:
- **Do** set section headlines in Archivo 900 at normal width with tight tracking (-0.04em), revealed through line masks.
- **Do** keep mint for responses (hover floods, selection, the open menu, the cursor label) and for the fog. Use mint-deep (#2F5A3A) for any accent text.
- **Do** divide lists with 1px hairlines at 16% ink and let rows run full-bleed.
- **Do** use ink pills with the rotating arrow for every action.
- **Do** keep one large empty field per section on the 12-column grid.
- **Do** use expo easing (cubic-bezier(0.16, 1, 0.3, 1)) with 0.5-1.2s durations, and give every motion a reduced-motion fallback.

### Don't:
- **Don't** add box-shadows, glows or card containers. Depth is fog, sheet and curtain.
- **Don't** render tech stacks or skills as chips or tags. Use plain text joined with " · " or set as lists.
- **Don't** introduce a second sans or use mono beyond times and dates.
- **Don't** use wdth 125 outside the name, the XY mark and the preloader count.
- **Don't** let fog colours (lilac, peach, sea-glass) become UI colours.
- **Don't** add section numbers or kicker labels above headlines.
