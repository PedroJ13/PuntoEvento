const { test, expect } = require("@playwright/test");
const AxeBuilder = require("@axe-core/playwright").default;

async function expectNoCriticalA11y(page) {
  const results = await new AxeBuilder({ page }).include("main").analyze();
  const critical = results.violations.filter(
    (violation) => violation.impact === "critical",
  );
  expect(critical).toEqual([]);
}

test.describe("smoke local publico", () => {
  test("home publica carga contenido base y no tiene overflow horizontal critico", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await expect(page).toHaveTitle(/Punto Evento/i);
    await expect(page.locator("body")).toContainText(
      /Punto Evento CR|Punto Evento/i,
    );
    await expect(page.locator("main")).toBeVisible();

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(overflow).toBe(false);
    await expectNoCriticalA11y(page);
  });

  test("panel y admin cargan sin autenticacion ni secretos", async ({
    page,
  }) => {
    await page.goto("/panel.html", { waitUntil: "domcontentloaded" });
    await expect(page.locator("body")).toContainText(/Panel empresa/i);
    await expect(page.locator("[data-auth-section]")).toBeVisible();

    await page.goto("/admin.html", { waitUntil: "domcontentloaded" });
    await expect(page.locator("body")).toContainText(/Administraci/i);
    await expect(page.locator("[data-login-panel]")).toBeVisible();
    await expectNoCriticalA11y(page);
  });
});
