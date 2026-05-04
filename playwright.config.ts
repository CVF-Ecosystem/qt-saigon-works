import { defineConfig } from '@playwright/test';

/**
 * Playwright configuration for QT Saigon Works viewport smoke tests
 * Tests responsive behavior across mobile, tablet, and desktop viewports
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  
  use: {
    baseURL: 'http://127.0.0.1:5179',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'mobile-small',
      use: {
        browserName: 'chromium',
        hasTouch: true,
        isMobile: true,
        viewport: { width: 375, height: 667 },
      },
    },
    {
      name: 'mobile-modern',
      use: {
        browserName: 'chromium',
        hasTouch: true,
        isMobile: true,
        viewport: { width: 390, height: 844 },
      },
    },
    {
      name: 'tablet',
      use: {
        browserName: 'chromium',
        hasTouch: true,
        viewport: { width: 768, height: 1024 },
      },
    },
    {
      name: 'laptop',
      use: {
        browserName: 'chromium',
        viewport: { width: 1366, height: 768 },
      },
    },
    {
      name: 'desktop',
      use: {
        browserName: 'chromium',
        viewport: { width: 1440, height: 900 },
      },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://127.0.0.1:5179',
    reuseExistingServer: true,
    timeout: 120 * 1000,
  },
});
