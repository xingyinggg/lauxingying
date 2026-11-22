---
name: Lau Xing Ying
description: A portfolio served as one open styrofoam cai fan box on a hawker table. No header, no side title; the box is the page, and price-card labels on its parts are the navigation.
colors:
  sky: "#A9E4FB"
  sky-deep: "#17475C"
  styrofoam: "#FAF8F2"
  styrofoam-shade: "#E4E0D5"
  rice: "#FFFFFF"
  curry: "#F0A21C"
  sambal: "#D8372E"
  kangkong: "#2F8F3E"
  kangkong-deep: "#1F6F33"
  bag-red: "#E5484D"
  bag-blue: "#3B7DDD"
  grape: "#7B4FD1"
  table: "#F28A4B"
  steel: "#C5CCD2"
  ink: "#1C1B19"
  ink-soft: "#4A4742"
  rule: "rgba(28, 27, 25, 0.22)"
typography:
  display:
    fontFamily: "M PLUS Rounded 1c, system-ui, sans-serif"
    fontSize: "clamp(40px, 5.2vw, 72px)"
    fontWeight: 900
    lineHeight: 0.98
    letterSpacing: "-0.03em"
  title:
    fontFamily: "M PLUS Rounded 1c, system-ui, sans-serif"
    fontSize: "clamp(28px, 3vw, 40px)"
    fontWeight: 900
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  heading:
    fontFamily: "M PLUS Rounded 1c, system-ui, sans-serif"
    fontSize: "24px"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  body-lg:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.55
  body:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
  small:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
  tag:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.01em"
  label:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0.08em"
  price:
    fontFamily: "Sometype Mono, ui-monospace, monospace"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "0.02em"
    fontFeature: '"tnum"'
rounded:
  price: "3px"
  photo: "10px"
  compartment: "18px"
  panel: "28px"
  pill: "9999px"
spacing:
  unit: "4px"
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
  3xl: "64px"
  wall: "12px"
  gutter: "clamp(16px, 3vw, 44px)"
components:
  price-card:
    backgroundColor: "{colors.rice}"
    textColor: "{colors.ink}"
    typography: "{typography.price}"
    rounded: "{rounded.price}"
    padding: "8px 12px 8px 30px"
  price-card-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.styrofoam}"
  compartment-card:
    backgroundColor: "{colors.styrofoam}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "24px"
  compartment-cell:
    backgroundColor: "{colors.rice}"
    rounded: "{rounded.compartment}"
    padding: "16px"
  lid-sticker:
    backgroundColor: "{colors.rice}"
    textColor: "{colors.ink}"
    typography: "{typography.display}"
    rounded: "3px"
  lid-sticker-band:
    backgroundColor: "{colors.sambal}"
    textColor: "{colors.styrofoam}"
  lid-name-card:
    backgroundColor: "{colors.rice}"
    textColor: "{colors.ink}"
    typography: "{typography.heading}"
    rounded: "2px"
  lid-name-card-band:
    backgroundColor: "{colors.sambal}"
    textColor: "{colors.styrofoam}"
    typography: "{typography.display}"
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.styrofoam}"
    typography: "{typography.tag}"
    rounded: "{rounded.pill}"
    padding: "13px 20px"
  button-primary-hover:
    backgroundColor: "{colors.sambal}"
    textColor: "{colors.styrofoam}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.tag}"
    rounded: "{rounded.pill}"
    padding: "13px 20px"
---

# Design System: Lau Xing Ying

## Overview

**Creative North Star: "One Box, Dabao"**

The whole site is one object: an open styrofoam cai fan box sitting on a long hawker table that floats in a flat blue sky. There is no header and no title at the side. The box fills the first screen, and everything a recruiter needs is a labelled part of it. The camera rides an orbit round the table from stop to stop, and each stop opens its content beside it.

The reference photos in `design/refs/` set the truth of the object. A real box is a single white clamshell with a tab latch, and the food is piled over the rice. Real stalls only offer two sauces, curry and sambal. Real stalls mark dishes with small colour-coded price cards. How each dish looks comes from `caifan-dishes.png`. The cute, flat, bright colour mood comes from `colourscheme-cutevibe.png`. The one-object-with-labels structure comes from `3d-label-overallbigpicture.png`.

The food is the personality, and it is never explained: no text names the food, and labels say only the real thing (a section, a project, her name). There is no mascot, no face and no character. The tone is playful and local, but the content is written plainly so it stays credible to a product or engineering recruiter.

**What is in the scene:**

| Part of the scene                             | Section           | What it holds                                                              |
| --------------------------------------------- | ----------------- | -------------------------------------------------------------------------- |
| The rice                                      | About             | The about statement and photo                                              |
| The three dishes in the box                   | Featured projects | AI Contract Review Platform, MaritimeRiskCare, TaskAllinOne. One stop each |
| Six small plates along the front of the table | Projects          | The other projects as side dishes, and the full project list               |
| Curry pot and sambal pot                      | Skills            | The six skill groups, split across the two sauces                          |
| The inside of the lid                         | Experience        | A name card: her name, roles, the four jobs and her contacts               |
| The sticker on the lid                        | Name              | "Xing Ying" and the availability line                                      |
| The small red plastic bag                     | Contact           | Email, LinkedIn, GitHub                                                    |
| A QR stand on the table                       | Scan to connect   | A real, working QR code that opens her LinkedIn on a phone                 |
| A voucher slip tucked under the box           | Resume            | Opens the resume PDF                                                       |

Every dish is one real project. Nothing in the scene is decoration that leads nowhere.

### The dishes

The box always holds the same three featured projects, served large and heaped over a full bed of rice, with grains showing under and between them. They are the stars of the scene and the first three stops after the overview. The other projects are side dishes: six small white plates in a row along the front of the table, like a stall's display. Clicking a plate opens that project. Pressing the curry pot pours curry over the food; pressing the sambal pot drops a dollop in the corner of the box. A "Reset the box" control appears once a sauce has been added and takes it off again.

| Project                     | Dish                | Where                |
| --------------------------- | ------------------- | -------------------- |
| AI Contract Review Platform | Sweet and sour pork | In the box, featured |
| MaritimeRiskCare            | Cabbage             | In the box, featured |
| TaskAllinOne                | Tomato egg          | In the box, featured |
| Infoguard                   | Curry chicken       | Side plate           |
| MakanSimi                   | Fried chicken       | Side plate           |
| CloudPantry                 | French bean         | Side plate           |
| HeartSync                   | Eggplant            | Side plate           |
| ClearPass                   | Steamed egg         | Side bowl            |
| AfterClass Hackathon UI     | Egg tofu            | Side plate           |

**The Real Food Rule.** Dishes follow `design/refs/caifan-dishes.png`, not clean geometry. Pieces are irregular and uneven in size, they pile up and overlap, and sauce pools under them and runs between them. Sauces and glazes are glossy: a soft highlight from the one scene light. Vegetables are a little translucent where they are thin.

| Dish                | What makes it recognisable                                                           |
| ------------------- | ------------------------------------------------------------------------------------ |
| Sweet and sour pork | Glossy red-orange lumps in a thick red glaze, with green pepper, pineapple and onion |
| Cabbage             | Soft, curled, pale green and white leaves, slightly see-through, with carrot strips  |
| Tomato egg          | Fluffy scrambled yellow curds with soft red tomato wedges, in a light orange sauce   |
| Curry chicken       | Chicken pieces and a potato chunk in yellow-orange gravy                             |
| Fried chicken       | Craggy golden-brown pieces, piled                                                    |
| French bean         | Short bright green batons with garlic bits                                           |
| Eggplant            | Glossy purple pieces in a brown sauce                                                |
| Steamed egg         | A smooth pale yellow surface in a small bowl, with green dots                        |
| Egg tofu            | Golden-edged coins in a brown sauce                                                  |

The box shape follows `design/refs/styrofoambox.png`: thick foam walls that slope in toward the base, a deep single cavity, a stepped lip all the way round, a wide latch tab at the front, and food heaped higher than the rim. The camera sits low enough that the wall thickness is always visible.

The box sits on a long hawker table so the scene spans a wide laptop screen, with the pots at one end, the bag, QR stand and voucher at the other, and the side plates along the front.

The two sauces are separate from the dishes: a curry pot and a sambal pot, and nothing else.

Projects with no dish (the design case studies) appear only in the project list.

**Key characteristics:**

- One real 3D scene, full screen, with price-card labels pinned to its parts.
- Flat, bright, saturated colour. No gradients and no glass, except the gloss on sauces.
- Rounded heavy lettering for the name and titles, a plain grotesk for copy.
- Content opens in foam panels laid out like box compartments.
- A camera orbit round the table is the one signature motion.

## Colors

The palette is taken from the stall: the white of the box, the two sauces, the vegetables, the plastic bags, and the table. Sky blue is the ground that makes those colours look bright.

### Ground

- **Sky** (sky): the page background and the theme colour. It is flat and it never carries a gradient.
- **Sky Deep** (sky-deep): secondary text set directly on sky.

### The box

- **Styrofoam White** (styrofoam): the box, the lid and every content panel. It is the main surface for reading.
- **Styrofoam Shade** (styrofoam-shade): the box's edge, panel dividers and the shaded inner wall.
- **Rice** (rice): the rice, compartment cells inside a panel, price labels and the lid sticker.

### The food and sauces

- **Curry Orange** (curry): the curry pot, the product design colour, and warm highlights. Ink text is allowed on it.
- **Sambal Red** (sambal): the sambal pot, the name card and sticker bands, and award badges. Styrofoam text is allowed on it.
- **Kangkong Green** (kangkong): the vegetables. It is a swatch colour only.
- **Kangkong Deep** (kangkong-deep): the green used whenever green carries text, such as an achievement line.

### Singapore objects

- **Bag Red** (bag-red): the small, thin red plastic takeaway bag.
- **Bag Blue** (bag-blue): the software engineering colour (see The Kind Of Work Rule).
- **Grape** (grape): the AI & data colour. A swatch colour only; text never sits on it.
- **Table Orange** (table): the round hawker table under the box.
- **Steel** (steel): the sauce pots and the spoon.

### Neutral

- **Ink** (ink): all text, the label pills and the primary button.
- **Ink Soft** (ink-soft): secondary text on styrofoam.
- **Rule** (rule): 1px dividers inside panels.

### Named rules

**The Kind Of Work Rule.** Colour answers the one question a recruiter brings: what kind of work is this? The three kinds match the three roles on her card. Every project carries a small square in its colour: **grape for AI & data**, **bag blue for software engineering**, **curry for product design**. The kind is also always written as a word beside it (in lists and project cards), so colour is never the only signal. Nothing else is colour-coded: sections carry no square, "featured" is shown by size and order (the box, the top of the list), and an award is spelled out in a sambal badge ("Finalist", "6th Place"), with the full award name in the project card.

| Kind of work         | Colour   | Projects                                                                |
| -------------------- | -------- | ----------------------------------------------------------------------- |
| AI & Data            | grape    | AI Contract Review Platform, ClearPass, MaritimeRiskCare                |
| Software engineering | bag-blue | TaskAllinOne, MakanSimi, CloudPantry, HeartSync, Infoguard              |
| Product design       | curry    | AfterClass Hackathon UI, Artify, Cathay Cineplex Digital Transformation |

**The Flat Colour Rule.** Every colour is used flat. A region is one colour edge to edge. There are no gradients, tints or translucent overlays. The one exception is in the 3D scene: sauces, glazes and the plastic bag are glossy, which is how they look in real life.

**The Readable Green Rule.** Text never sits on kangkong or on either bag colour, and those colours are never used for text. Use kangkong-deep for green text and ink for everything else.

## Typography

**Display font:** M PLUS Rounded 1c, weights 800 and 900
**Body font:** Schibsted Grotesk, weights 400 and 600
**Figure font:** Sometype Mono, weight 500, for price cards and dates only

**Character:** The rounded heavy face is the hand-cut lettering of a hawker signboard and a marker on a styrofoam lid. The grotesk is deliberately plain, so the writing reads like a resume and not like a menu joke.

### Scale

- **Display** (900, clamp(40px, 5.2vw, 72px), line-height 0.98): the name on the lid sticker, and the one large title when a section opens. Never above 96px.
- **Title** (900, clamp(28px, 3vw, 40px)): panel titles such as "About Me" and "Experience".
- **Heading** (800, 24px): project names and role titles.
- **Body Large** (400, 18px, line-height 1.55): lead paragraphs. Lines stay under 65 characters.
- **Body** (400, 16px, line-height 1.6): descriptions.
- **Small** (400, 14px): tech stacks joined with " · ", captions, hints.
- **Tag** (600, 14px): button text.
- **Label** (600, 12px, uppercase, 0.08em): categories and organisation names.
- **Price** (Sometype Mono 500, 13px, tabular figures): every label in the scene, and experience dates.

### Named rules

**The No Food Words Rule.** No text explains the food. Labels and panels name only the real thing: "About", "MaritimeRiskCare", "Skills". Never "the rice", "curry", "sambal", "dabao" or a dish name.

**The Mono Is For Price Cards Rule.** Sometype Mono is used only where a real stall prints: the price cards in the scene, and dates.

## Layout

### The first screen

The scene is the entire viewport. The box sits at the centre and takes about 60% of the width on desktop. The table sits under it. The sauce pots are at the upper left, the red bag, the QR stand and the voucher slip are at the right, and the six side plates run along the front edge. Nothing else is on screen except the price cards and the stop control.

**The Few Labels Rule.** The overview names only what a recruiter should reach first: the three featured projects and the sections (About, Experience, Skills, Contact, Scan to connect, Resume). The side plates carry no names there; a plate's name appears when it is hovered or tabbed to, and all six appear, in their own row along the table edge, at the Projects stop. A featured dish keeps its name at its own stop.

There is no header and no side title. The name is the sticker on the lid. The resume is the voucher slip under the box, with its own label.

### The compartment grid

Content panels use the proportions of a classic three-compartment cai fan box: one large cell beside two stacked smaller cells.

- Columns: `3fr 2fr`. The right column splits into two equal rows.
- The gap between cells is the box wall: 12px (`wall`).
- The panel's inner padding is 24px.
- The large cell holds the main content (the description, the about statement). The two small cells hold supporting content (the screenshot and the links, or photos and a short fact).
- Below 768px the grid becomes one column, large cell first.

### Spacing

A 4px unit, used in the steps 8, 12, 16, 24, 32, 48 and 64. Tight inside a group, generous between groups, and always more space above a heading than below it.

### Where panels sit

When the camera flies to a part, that part moves to one side of the screen and its panel opens on the other side, at most 560px wide on desktop. On mobile the part sits in the top third and the panel is a sheet covering the lower two thirds.

### Small screens

On a phone the overview frames the box itself, and lets the far ends of the table run off the sides, so the box and the order on its lid are large enough to read. The stop control moves to the bottom of the screen, in thumb reach, with its dots above it; the content sheet sits above the control, and the Sound pill moves to the top. At the Projects stop the plate names run in two straight rows, one above the plates and one below (a name too long for its row gets a row of its own), each joined to its plate by a thin ink line; there they are 11px, the one place a scene label is that small. Price cards in the scene stay at least 32px tall; everything in panels keeps a 44px touch height. The panel opens as a sheet over the lower part of the screen.

## Border Radius

- **Pill** (9999px): buttons.
- **Panel** (28px): content panels, matching the soft outer corner of the box.
- **Compartment** (18px): cells inside a panel.
- **Photo** (10px): screenshots and photos.
- **Price** (3px): price cards, the only label shape in the scene.
- **Sticker** (2px): the name sticker, which is nearly square like a printed label.

## Textures

- **Styrofoam:** a very fine pebbled bead surface on the 3D box, visible only up close. Content panels stay flat styrofoam white with no pattern, so text stays easy to read.
- **Plastic bag:** the small flimsy red kind. Thin, slightly see-through, glossy, with soft creases and two loop handles. Flat colour in any 2D use.
- **Steel:** a soft even sheen on the sauce pots. No reflections of a made-up room.
- **Table and sky:** completely flat.
- No paper grain, noise overlays or photographic textures anywhere in the interface.

## Shadows

- **In the scene:** one soft directional light casts real shadows from the box, pots and bags onto the table. That is the only source of depth in the scene.
- **Under the table:** none. The table floats in flat sky.
- **Content panels:** one soft shadow, `0 16px 40px -16px rgba(28, 27, 25, 0.3)`, because a panel really does float above the scene.
- **Everything else:** no shadow. Pills, labels and buttons are flat.

## Motion

**The Orbit.** The camera rides a loop round the table, one stop per part: Overview, AI Contract Review Platform, MaritimeRiskCare, TaskAllinOne, Projects (the side plates), About, Experience, Skills, Contact, Scan to connect, and back to the Overview. Scrolling, swiping, ← → (or A D), the stop control and clicking a label move it to a stop, on a spring that eases in and out. The panel opens once the stop is reached. Escape goes back to the Overview.

**The Free Look.** Dragging with a mouse swings the camera freely round the whole table. Letting go leaves it exactly there. It moves to a stop again only on a scroll, a key or a pick, starting from the stop nearest the view. Touch has no free look; a swipe moves between stops.

Supporting motion, all quiet:

- **Idle:** the box and table drift up and down by a few pixels over six seconds. Steam rises slowly from the food.
- **Wind:** the plastic bag is never quite still. Its handles and loose edges tremble all the time, and every few seconds a light gust makes the whole bag lean and ripple before it settles. The voucher slip lifts at one corner in the same gust. Nothing else in the scene reacts to wind.
- **Hover:** the part under the pointer lifts slightly and its price card turns ink.
- **Arrival:** the box arrives closed, with a name sticker on its lid and one label, "Open the box". Pressing the box opens the lid and reveals the food and the other labels.
- **Dabao:** reaching Contact closes the lid.

Rules:

- One thing moves at a time. Nothing loops except the idle drift, the steam and the bag in the wind.
- Under reduced motion, the orbit cuts between stops, the cursor lean, idle drift, steam and wind stop, and there is no free look.
- Content is never hidden behind an animation that might not finish.

## Sound

Sound is part of the scene, like the steam. It makes the objects feel real, and it is never needed to use the site.

### Object sounds

| Moment                               | Sound                                |
| ------------------------------------ | ------------------------------------ |
| Hovering or touching the plastic bag | A thin plastic crinkle               |
| A gust of wind                       | A much quieter rustle from the bag   |
| The lid opening or closing           | The squeak and soft pop of styrofoam |
| Picking a dish                       | A spoon tapping a steel tray         |
| Pressing the curry pot               | Thick liquid pouring                 |
| Pressing the sambal pot              | One wet dollop                       |
| Flying in and out                    | A soft whoosh, barely there          |

The bag, box and curry sounds are recordings supplied by Xing Ying (`design/sound`, served from `public/audio`). The rest are generated in the browser.

### The stall voice

Short spoken phrases, the way ordering cai fan actually sounds:

- **"Xiao mei!"** once, as a greeting, on the visitor's first click.
- **"Zhe ge"** and **"na ge"** ("this one", "that one"), alternating, when a dish is picked.

The voice is a real recording of a person, kept to a second or less per phrase. A synthetic computer voice is not acceptable here, because it would turn a warm local detail into a joke.

### Rules

- **Sound is on from the first click.** Browsers do not allow sound before the visitor clicks or taps, so nothing plays on arrival; the first click anywhere wakes it. A "Sound" tag in the scene mutes it, and the choice is remembered.
- Every sound is under one second, except the greeting. Nothing loops and there is no background music.
- Hover sounds have a short cooldown, so sweeping the pointer across the scene does not fire them in a burst.
- All sounds sit well below speech volume. The voice is slightly louder than the object sounds.
- Sound never carries information that is not also visible.

## Components

### QR stand (Scan to connect)

- A small acrylic QR stand on the table, like the SGQR payment stand at every stall.
- The QR code is real and opens Xing Ying's LinkedIn, so a visitor can scan it with a phone.
- It is drawn in this site's own style. It does not copy the official SGQR logo or any payment network's marks, and it never looks like a real payment code.

### Voucher slip (Resume)

- A paper voucher tucked under the box, in the spirit of a CDC voucher: a bold value panel and a tear-off edge.
- It reads "Resume" where a voucher would show its value, and opens the resume PDF.
- It is this site's own design. It does not copy the official CDC Vouchers logo or artwork.

### Sound tag

- A pill in the corner that reads "Sound off" or "Sound on". It is a page control, not a scene label.

### Navigation (scene labels)

Navigation is the price cards pinned to the scene, plus one stop control. There is no nav bar.

- The price cards are real buttons. Keyboard users can tab through them and press Enter to go to that stop.
- **The stop control** sits at the top left once the box is open: an Overview button, ‹ and › steps, and a price card naming where you are ("3 / 9 TaskAllinOne") with where › goes next under it in small soft type ("Next: MaritimeRiskCare"), and a row of dots under that, one per stop, that jumps to any stop. The steps and dots name their stop on hover and to screen readers ("Next stop: Experience"). It says where you are and where you go next without listing every name at once. It is styled as price cards, the same as the scene labels. On phones the "3 / 9" count is left to the dots, so the names have the room.
- How to get around is taught by the How to order sign (below), not by a hint bar.
- After a free look, a quiet hint says how to carry on ("Scroll or press → to carry on").
- If 3D is unavailable, the labels become a plain list and each opens its panel directly.

### How to order sign

The one place the site says how to get around, written as the numbered "how to order" sign a cai fan stall puts up.

- **Shape:** a styrofoam card, 8px radius, the panel shadow, with a sambal band across the top reading "How to order" in the display face and a "Hide" button at its right end.
- **Steps:** three, numbered in curry discs, with a dashed rule between, like the jobs on the lid name card. Each is a bold line and a soft how-to line:
  - Mouse and keyboard: 1 "Open the box" (click it, scroll, or press →); 2 "Go round the table" (scroll, or press ← →); 3 "Pick what you want" (click any label to jump there). A foot line adds "Drag to look around" and "Esc for the overview".
  - Touch: 1 "Tap the box" (to open it); 2 "Swipe the table" (to go round); 3 "Tap a label" (to jump there). No foot line: touch has no drag or Esc.
  - Keys are drawn as small keycaps, the same as the free-look hint.
- **Ticking off:** a step is ticked as the visitor does it: its disc turns kangkong green with a check, and its line is struck through in sambal. Step 2 ticks on the first scroll, swipe, arrow key or › step once the box is open; step 3 on the first label, dish, plate or pot picked once the box is open.
- **Where it sits:** on the overview only. Desktop (1024px wide and over 600px tall, or more): top right, 296px wide, where the sky is empty. At a stop the card has the space, so the sign steps away.
- **Small screens** (phones, portrait tablets, short landscape screens): the open lid rises into the space the full sign would take, so the sign becomes a one-line strip about 50px tall: the curry disc with the step to do now, a small sambal "How to order" label with three pips (kangkong when done), the step in one line ("Swipe the table to go round"), and "Hide". It sits top right at 300px on portrait tablets and landscape phones, bottom right on short wide screens such as landscape tablets (clear of the stop control and the Sound pill), and on portrait phones across the top, just under the Sound pill. The scene's labels treat it like the stop control and step a row up or down round it, so it never hides a label that would otherwise show. On tablets a long stop name is cut short so it never runs under the strip.
- **Folding:** once steps 2 and 3 are both done, the sign folds, after a short pause so the last tick is seen, into a "How to order" tag beside the Sound pill. "Hide" folds it straight away. The tag opens it again as a reference: no ticks or strike-through, and the strip shows both ways to move in one line ("Swipe the table to go round, tap a label to jump there") with a "?" in its disc. Opened at a stop on desktop, it rises above the tag at the bottom left. The fold lasts for the visit; a new visit starts with the sign up.
- **Access:** a labelled region ("How to get around") with the steps as a list; a done step is read as done. "Hide" and the tag are real buttons.
- Not shown without 3D: the plain list needs no instructions.

### Price card

The one label style in the scene, after a stall's price card. Sections, projects, Resume and "Open the box" all use it, in the same way.

- **Shape:** rice-white rectangle, 3px radius, with a small colour square at the left.
- **Text:** the real name only, in Sometype Mono: "About", "MaritimeRiskCare". Never a food word, never an invented price.
- **Colour square:** projects only, in their discipline colour (see The Kind Of Work Rule). Section labels and "Open the box" carry no square.
- **No award badge** on scene labels or in the Projects list: a project's award is shown only inside its own card.
- **Hover and focus:** ink fill, styrofoam text, and the part of the scene under it lifts. Focus adds a rice outline and an ink ring.
- **Primary:** "Open the box", the first thing anyone does, is filled ink from the start, so the way in is never in doubt.
- **Touch:** at least 32px tall in the scene; it always stays fully on screen.
- In lists inside panels, the same square sits beside each project name, with the discipline written at the right.

### Projects list

- Filter chips at the top, one per discipline with its square and count ("AI & data 3 · Software engineering 5 · Product design 3"), plus "All". They double as the colour key.
- Two groups, Featured then More projects; a filter hides the rows of other disciplines and any group left empty.

### Compartment card

The content panel that opens when the camera reaches a stop.

- **Surface:** styrofoam, 28px radius, 24px padding, the one panel shadow.
- **Inside:** the compartment grid. Cells are rice white with an 18px radius and 16px padding.
- **Header:** the title in the display face, with the label line under it, never above it.
- **Project card contents:** name, category and price colour, achievement line in kangkong-deep where one exists, description, tech stack as plain text joined with commas, screenshot, and links.
- **Close:** the Overview pill or Escape. The panel has no separate close cross.
- No card sits inside another card. Cells are flat regions, not raised cards.

### Lid sticker

- A sticker on top of the lid, tilted about 3 degrees, made to match the name card inside: the two read as one set.
- **Band:** "Xing Ying" in the display face, styrofoam white on a sambal-red band.
- **Below the band:** the availability line, word for word, split in two: "Open to opportunities for" as a small Sometype Mono label, then "Spring 2027 (Internship), and Full-Time Roles (July 2027)" in semibold.
- It is the only place the name appears on the first screen. Like the card inside, it is printed into the scene, so it sits on the foam and takes its light.

### Lid name card (Experience)

- The lid itself stays plain styrofoam, as on a real box. Inside it sits a name card in the proportions of a real one (90 × 54 mm), the kind a hawker hands across the counter.
- **Band:** a sambal-red band across the top: "Xing Ying" in the display face in styrofoam white, and under it her roles ("Product Manager, AI Engineer, Software Engineer") as a small uppercase label. Where the full roles cannot fit at the size the card is shown, they become "Product, Engineering".
- **Jobs:** the four roles listed like a menu, one per row with a dashed rule between: the role on the left in the heading face, the organisation on the right. On the card only, the long titles are shortened to fit one row ("PM Intern", "Business PM Intern", "Full-Stack Dev Intern"); the Experience card keeps them in full, with dates and descriptions.
- **Foot:** her email and LinkedIn (linkedin.com/in/lauxingying) in Sometype Mono, one at each end. If the LinkedIn address would crowd the email, it is left off.
- It is printed into the scene at about four times the size it ever covers on screen: sharp up close, lit like paper, and hidden by the foam whenever the lid is turned away. It sits inside the lid's recess with a margin of foam all round.

### Buttons

- **Primary:** ink pill, styrofoam text, turns sambal on hover. Used for Email and Resume.
- **Outline:** 1.5px ink outline, fills ink on hover. Used for LinkedIn and GitHub.
- Arrows on external links come from one icon set, at one stroke weight.

## Do's and Don'ts

### Do

- **Do** keep the box as the only thing on the first screen.
- **Do** make every piece of food a real project, and every object a real section.
- **Do** let the food speak for itself. Labels name only the real thing.
- **Do** use flat colour, and let whole regions be one colour.
- **Do** keep all existing copy word for word.
- **Do** give every motion a reduced-motion version.

### Don't

- **Don't** add a header bar, a hero title at the side, or a footer strip on the first screen.
- **Don't** add a mascot, a face on the food, or a third sauce.
- **Don't** copy official logos or artwork (SGQR, CDC Vouchers, payment networks). Draw this site's own versions.
- **Don't** play any sound once the visitor has muted it, and never use a synthetic voice.
- **Don't** invent prices, stall numbers, ratings or any other fact.
- **Don't** use gradients, glass, glows, or more than the one panel shadow. Gloss belongs only to sauces and the bag in the 3D scene.
- **Don't** name the food in any text: no "the rice", "curry", "sambal", "dabao" or dish names.
- **Don't** render skills or tech stacks as chips. Use plain text.
- **Don't** put text on kangkong green or on the bag colours.
- **Don't** use the mono face for anything except price cards and dates.
