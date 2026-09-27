// @ts-check
const { test, expect } = require("@playwright/test");

// Common computer screens at 100% zoom
const SCREENS = [[1280, 720], [1366, 768], [1440, 900], [1536, 864], [1920, 1080]];
const SECTIONS = ["home", "about", "experience", "skills", "projects", "contact"];

test.skip(({ isMobile }) => isMobile, "one-screen sections are a computer-screen layout");

for (const [w, h] of SCREENS) {
  test(`each section fits one screen @ ${w}x${h}`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: h });
    await page.addInitScript(() => sessionStorage.setItem("xy-loaded", "1"));
    await page.goto("/");
    await page.waitForTimeout(1200);
    for (const id of SECTIONS) {
      const height = await page.locator(`#${id}`).evaluate((el) => el.getBoundingClientRect().height);
      expect(Math.round(height), `#${id} height`).toBeLessThanOrEqual(h);
    }
    if (w === 1366 || w === 1440) {
      for (const id of SECTIONS) {
        await page.locator(`#${id}`).evaluate((el) => window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY));
        await page.waitForTimeout(1300); // let reveals and the scroll-lit text settle
        await page.screenshot({ path: `.impeccable/review/screens/${w}-${id}.png` });
      }
    }
  });
}
