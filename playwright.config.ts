import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  use: {
    baseURL: "http://127.0.0.1:4173/test-atlas/?lang=zh",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "pnpm build && pnpm preview --port 4173",
    url: "http://127.0.0.1:4173/test-atlas/",
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["iPhone 13"] } },
  ],
});
