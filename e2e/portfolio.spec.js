// @ts-check
const { test, expect } = require("@playwright/test");

const skipPreloader = async (page) => {
  await page.addInitScript(() => sessionStorage.setItem("xy-loaded", "1"));
};

/** Scroll through the page so every scroll-triggered reveal has fired. */
const revealAll = async (page) => {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1200);
};

test.describe("home", () => {
  test("preloader counts up, then lifts to reveal the hero", async ({ page }) => {
    // don't wait for the full load: under a busy machine the 1.5s preloader
    // can finish before the load event fires
    await page.goto("/", { waitUntil: "commit" });
    await expect(page.getByText("Loading the work")).toBeVisible({ timeout: 15000 });
    await expect(page.getByText("Loading the work")).toBeHidden({ timeout: 6000 });
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Hi, I'm Xing Ying.");
  });

  test("renders without console errors and keeps all copy", async ({ page }) => {
    const errors = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    page.on("pageerror", (e) => errors.push(e.message));
    await skipPreloader(page);
    await page.goto("/");
    await expect(page.getByText(/Open to opportunities for Spring 2027/)).toBeVisible();
    await expect(page.getByText(/Final Year Information Systems student @ SMU/)).toBeVisible();
    for (const role of ["Business Product Management Intern", "Full-Stack Web Developer Intern", "Vice President"]) {
      await expect(page.getByRole("heading", { name: role })).toBeAttached();
    }
    await expect(page.locator("#projects li h3")).toHaveCount(3);
    expect(await page.locator("#skills li").count()).toBeGreaterThan(0);
    expect(errors).toEqual([]);
  });

  test("fog canvas initialises WebGL", async ({ page }) => {
    await skipPreloader(page);
    await page.goto("/");
    await expect(page.locator("canvas[data-ready=true]")).toHaveCount(1);
  });

  test("no horizontal overflow", async ({ page }) => {
    await skipPreloader(page);
    await page.goto("/");
    await revealAll(page);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test("the giant name fits the viewport width", async ({ page }) => {
    await skipPreloader(page);
    await page.goto("/");
    await page.waitForTimeout(800);
    const widths = await page.$$eval("#home [data-fit]", (els) =>
      els.filter((e) => e.offsetParent).map((e) => e.getBoundingClientRect().right),
    );
    const vw = page.viewportSize().width;
    for (const right of widths) expect(right).toBeLessThanOrEqual(vw);
  });

  test("menu opens, jumps to a section, and closes on Escape", async ({ page }) => {
    await skipPreloader(page);
    await page.goto("/");
    const btn = page.getByRole("button", { name: "Menu" });
    await btn.click();
    const dialog = page.getByRole("dialog", { name: "Site menu" });
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await btn.click();
    await dialog.getByRole("link", { name: "Experience" }).click();
    await expect(dialog).toBeHidden();
    await page.waitForTimeout(1800);
    const headerBottom = await page.locator("header").evaluate((el) => el.getBoundingClientRect().bottom);
    // the heading lands in view, just below the fixed header, not under it
    const top = await page.locator("#experience h2").evaluate((el) => el.getBoundingClientRect().top);
    expect(top).toBeGreaterThanOrEqual(headerBottom - 1);
    expect(top).toBeLessThan(page.viewportSize().height / 2);
  });

  test("View My Work lands with Featured Projects fully in view", async ({ page }) => {
    await skipPreloader(page);
    await page.goto("/");
    await page.waitForTimeout(1200);
    await page.getByRole("link", { name: "View My Work" }).click();
    await page.waitForTimeout(2200);
    const { headerBottom, headingTop, headingBottom, vh } = await page.evaluate(() => ({
      headerBottom: document.querySelector("header").getBoundingClientRect().bottom,
      headingTop: document.querySelector("#projects h2").getBoundingClientRect().top,
      headingBottom: document.querySelector("#projects h2").getBoundingClientRect().bottom,
      vh: window.innerHeight,
    }));
    expect(headingTop).toBeGreaterThanOrEqual(headerBottom);
    expect(headingBottom).toBeLessThanOrEqual(vh);
  });

  test("home features only the first 3 projects, with no hover image", async ({ page }) => {
    await skipPreloader(page);
    await page.goto("/");
    const rows = page.locator("#projects li");
    await expect(rows).toHaveCount(3);
    await expect(rows.locator("h3")).toHaveText([/TaskAllinOne/, /MaritimeRiskCare/, /HeartSync/]);
    await rows.nth(1).scrollIntoViewIfNeeded();
    await rows.nth(1).hover();
    // only the small-screen inline thumbnails exist, and they are hidden on desktop
    const visibleImgs = await page.$$eval("#projects img", (els) => els.filter((e) => e.offsetParent).length);
    const vw = page.viewportSize().width;
    if (vw >= 768) expect(visibleImgs).toBe(0);
  });

  test("contact exposes email and resume", async ({ page }) => {
    await skipPreloader(page);
    await page.goto("/");
    const contact = page.locator("#contact");
    await expect(contact.getByRole("link", { name: /lauxingying@gmail\.com/ })).toHaveAttribute(
      "href",
      "mailto:lauxingying@gmail.com",
    );
    await expect(contact.getByRole("link", { name: "View Resume" })).toHaveAttribute("href", /drive\.google\.com/);
  });

  test("capture review screenshots", async ({ page }, info) => {
    await skipPreloader(page);
    await page.goto("/");
    await revealAll(page);
    await page.screenshot({ path: `.impeccable/review/${info.project.name}.png`, fullPage: true });
    await page.screenshot({ path: `.impeccable/review/${info.project.name}-hero.png` });
  });
});

test.describe("projects page", () => {
  test("filters by category", async ({ page }) => {
    await skipPreloader(page);
    await page.goto("/projects");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("All Projects");
    await expect(page.locator("main ul > li")).toHaveCount(10);
    await page.getByRole("button", { name: /^Hackathon/ }).click();
    await expect(page.locator("main ul > li")).toHaveCount(2);
    await expect(page.getByRole("button", { name: /^Hackathon/ })).toHaveAttribute("aria-pressed", "true");
  });

  test("capture projects screenshot", async ({ page }, info) => {
    await skipPreloader(page);
    await page.goto("/projects");
    await revealAll(page);
    await page.screenshot({ path: `.impeccable/review/projects-${info.project.name}.png`, fullPage: true });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
});
