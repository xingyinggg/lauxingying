// @ts-check
const { defineConfig, devices } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  retries: 0,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3100",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["Pixel 7"], viewport: { width: 390, height: 844 } } },
  ],
  webServer: {
    command: "npm start",
    url: "http://localhost:3100",
    reuseExistingServer: true,
    timeout: 180_000,
    env: { PORT: "3100", BROWSER: "none" },
  },
});
