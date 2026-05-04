import { test, expect } from "@playwright/test";

/**
 * P0.2 Viewport Smoke Tests
 *
 * Verifies responsive app shell behavior across target viewports:
 * - 375x667 (iPhone SE, small phone)
 * - 390x844 (Modern phone)
 * - 768x1024 (Tablet)
 * - 1366x768 (Laptop)
 * - 1440x900 (Desktop)
 *
 * Tests:
 * 1. Dashboard renders without errors
 * 2. Navigation is visible and functional
 * 3. No horizontal overflow on mobile
 * 4. Layout adapts correctly to viewport
 */

const routes = [
  { path: "/cong-trinh", text: "Công trình" },
  { path: "/tai-chinh", text: "Tài chính" },
  { path: "/vat-tu", text: "Vật tư" },
];

test.describe("Viewport Smoke Tests", () => {
  test("dashboard renders on all viewports", async ({ page, viewport }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: "Tổng quan vận hành" })
    ).toBeVisible();
    await expect(page.getByLabel("Company metrics")).toBeVisible();

    await page.screenshot({
      path: `test-results/screenshots/dashboard-${viewport?.width}x${viewport?.height}.png`,
      fullPage: false,
    });
  });

  test("navigation is visible and functional", async ({ page, viewport }) => {
    await page.goto("/");

    const isMobile = viewport && viewport.width < 768;

    if (isMobile) {
      const bottomNav = page.getByRole("navigation", {
        name: "Mobile navigation",
      });
      await expect(bottomNav).toBeVisible();
      await expect(page.getByRole("complementary")).toBeHidden();

      const navButtons = bottomNav.locator("a");
      const count = await navButtons.count();

      for (let i = 0; i < count; i++) {
        const button = navButtons.nth(i);
        const box = await button.boundingBox();
        if (box) {
          expect(box.height).toBeGreaterThanOrEqual(44);
        }
      }
    } else {
      const sidebar = page.getByRole("complementary");
      await expect(sidebar).toBeVisible();
      await expect(
        page.getByRole("navigation", { name: "Mobile navigation" })
      ).toBeHidden();
    }
  });

  test("no accidental horizontal overflow", async ({ page, viewport }) => {
    await page.goto("/");

    const documentWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const viewportWidth = viewport?.width || 0;

    expect(documentWidth).toBeLessThanOrEqual(viewportWidth + 1);
  });

  test("navigation routes work", async ({ page }) => {
    for (const route of routes) {
      await page.goto(route.path);

      await expect(
        page.getByRole("heading", { name: route.text })
      ).toBeVisible();

      await page.screenshot({
        path: `test-results/screenshots/${route.path.slice(1)}-${page.viewportSize()?.width}x${page.viewportSize()?.height}.png`,
        fullPage: false,
      });
    }
  });

  test("content container stays within viewport", async ({ page, viewport }) => {
    await page.goto("/");

    const main = page.locator("main").first();
    const pageShell = page.locator(".page").first();
    await expect(main).toBeVisible();
    await expect(pageShell).toBeVisible();

    const shellBox = await pageShell.boundingBox();
    if (shellBox && viewport) {
      expect(shellBox.width).toBeLessThanOrEqual(viewport.width + 1);
    }
  });
});
