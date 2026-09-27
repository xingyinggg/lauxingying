// @ts-check
const { test, expect } = require("@playwright/test");

// Phones, tablets, laptops, desktops and ultrawide.
const WIDTHS = [320, 360, 375, 390, 414, 480, 600, 768, 820, 1024, 1180, 1280, 1366, 1440, 1920, 2560];
const heightFor = (w) => (w < 768 ? 780 : w < 1024 ? 1024 : w < 1920 ? 900 : 1200);

test.describe.configure({ mode: "parallel" });
// geometry only; one browser project is enough
test.skip(({ isMobile }) => isMobile, "sweep runs once, in the desktop project");

async function load(page, path, w) {
  await page.setViewportSize({ width: w, height: heightFor(w) });
  await page.addInitScript(() => sessionStorage.setItem("xy-loaded", "1"));
  await page.goto(path);
  await page.waitForTimeout(500);
  // fire every scroll reveal so hidden-until-revealed content is measured too
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 350) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 40));
    }
  });
  await page.waitForTimeout(1300);
}

/** Visible elements that stick out past the viewport's right edge. */
const spills = (page) =>
  page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const out = [];
    for (const el of document.querySelectorAll("main *, header *, footer *")) {
      if (el.closest("#site-menu, [aria-hidden=true]")) continue;
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === "hidden" || cs.display === "none") continue;
      if (r.right > vw + 1 || r.left < -1) {
        out.push(`${el.tagName.toLowerCase()}.${String(el.className).slice(0, 40)} [${Math.round(r.left)}→${Math.round(r.right)}]`);
      }
    }
    return out.slice(0, 8);
  });

for (const path of ["/", "/projects"]) {
  for (const w of WIDTHS) {
    test(`${path} @ ${w}px: no overflow, header readable`, async ({ page }) => {
      await load(page, path, w);

      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, "horizontal scroll").toBeLessThanOrEqual(0);
      expect(await spills(page), "elements past the edge").toEqual([]);

      // text hidden by an overflow mask (e.g. a heading wider than its line)
      const clipped = await page.evaluate(() =>
        [...document.querySelectorAll(".mask-line > span, h1, h2, h3, p, a")]
          .filter((el) => el.offsetParent && !el.closest("#site-menu"))
          .filter((el) => {
            const box = el.closest(".mask-line") || el;
            return el.scrollWidth > box.clientWidth + 2;
          })
          .map((el) => el.textContent.trim().slice(0, 30)),
      );
      expect(clipped, "clipped text").toEqual([]);

      // scrolled mid-page: header must carry an opaque-ish backing
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
      await page.waitForTimeout(700);
      const header = page.locator("header");
      const bg = await header.evaluate((el) => getComputedStyle(el).backgroundColor);
      const alpha = Number((bg.match(/rgba?\(([^)]+)\)/) || [, "0,0,0,0"])[1].split(",")[3] ?? 1);
      expect(alpha, `header background ${bg}`).toBeGreaterThan(0.8);

      // header items never collide
      const boxes = await header.locator("a, button, p").evaluateAll((els) =>
        els
          .filter((e) => e.offsetParent)
          .map((e) => e.getBoundingClientRect())
          .map((r) => ({ l: r.left, r: r.right, t: r.top, b: r.bottom })),
      );
      for (let i = 0; i < boxes.length; i++)
        for (let j = i + 1; j < boxes.length; j++) {
          const a = boxes[i], b = boxes[j];
          const inside = (a.l >= b.l && a.r <= b.r && a.t >= b.t && a.b <= b.b) || (b.l >= a.l && b.r <= a.r && b.t >= a.t && b.b <= a.b);
          const hit = a.l < b.r - 1 && b.l < a.r - 1 && a.t < b.b - 1 && b.t < a.b - 1;
          expect(hit && !inside, "header items overlap").toBe(false);
        }

      if ([320, 390, 768, 1024, 1440, 2560].includes(w)) {
        const name = path === "/" ? "home" : "projects";
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.waitForTimeout(400);
        await page.screenshot({ path: `.impeccable/review/sweep/${name}-${w}.png`, fullPage: true });
        await page.evaluate(() => window.scrollTo(0, 1400));
        await page.waitForTimeout(700);
        await page.screenshot({ path: `.impeccable/review/sweep/${name}-${w}-scrolled.png` });
      }
    });
  }
}
