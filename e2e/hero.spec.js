// @ts-check
const { test, expect } = require("@playwright/test");

const lineCount = (page, re) =>
  page.evaluate((src) => {
    const el = [...document.querySelectorAll("#home p")].find((p) => new RegExp(src).test(p.textContent));
    // count rendered lines of the text itself (ignores decorative spans like the dot)
    const tops = [];
    for (const node of el.childNodes) {
      if (node.nodeType !== 3 || !node.textContent.trim()) continue;
      const range = document.createRange();
      range.selectNodeContents(node);
      for (const r of range.getClientRects()) if (!tops.some((t) => Math.abs(t - r.top) < 4)) tops.push(r.top);
    }
    return tops.length;
  }, re.source);

for (const w of [1280, 1440, 1920]) {
  test(`intro and availability sit on one line @ ${w}px`, async ({ page, isMobile }) => {
    test.skip(isMobile);
    await page.setViewportSize({ width: w, height: 900 });
    await page.addInitScript(() => sessionStorage.setItem("xy-loaded", "1"));
    await page.goto("/");
    await page.waitForTimeout(1200);
    expect(await lineCount(page, /Final Year Information Systems/)).toBe(1);
    expect(await lineCount(page, /Open to opportunities/)).toBe(1);
  });
}

test("intro and availability wrap on small screens", async ({ page, isMobile }) => {
  test.skip(!isMobile);
  await page.addInitScript(() => sessionStorage.setItem("xy-loaded", "1"));
  await page.goto("/");
  await page.waitForTimeout(1200);
  expect(await lineCount(page, /Final Year Information Systems/)).toBeGreaterThan(1);
  expect(await lineCount(page, /Open to opportunities/)).toBeGreaterThan(1);
});

test("rotating role sits on the same baseline as 'I am a'", async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem("xy-loaded", "1"));
  await page.goto("/");
  await page.waitForTimeout(1500);

  const measure = () =>
    page.evaluate(() => {
      const slot = document.querySelector("h1 [aria-hidden=true]");
      const lead = slot.parentElement; // span holding "I am a " + slot
      const textNode = [...lead.childNodes].find((n) => n.nodeType === 3 && n.textContent.includes("I am a"));
      const range = document.createRange();
      range.selectNodeContents(textNode);
      const a = range.getBoundingClientRect();
      // the role currently at rest (translateY 0)
      const active = [...slot.children].find((s) => /matrix\(1, 0, 0, 1, 0, 0\)|none/.test(getComputedStyle(s).transform));
      if (!active) return null; // mid-slide
      const r2 = document.createRange();
      r2.selectNodeContents(active);
      const b = r2.getBoundingClientRect();
      return { lead: a.bottom, role: b.bottom, text: active.textContent };
    });

  // check a couple of roles, each once its slide has settled
  const seen = new Set();
  await expect
    .poll(
      async () => {
        const m = await measure();
        if (!m) return seen.size;
        expect(Math.abs(m.lead - m.role), `${m.text}: lead ${m.lead} vs role ${m.role}`).toBeLessThanOrEqual(1);
        seen.add(m.text);
        return seen.size;
      },
      { timeout: 15000, intervals: [300] },
    )
    .toBeGreaterThanOrEqual(2);
});
