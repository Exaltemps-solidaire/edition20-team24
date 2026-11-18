import { expect, test } from "@playwright/test";

// Démo du cas passant, de bout en bout. Chaque itération ajoute ses étapes (test.step).
test("Démo : le cas passant", async ({ page }) => {
  await test.step("J'ouvre l'application", async () => {
    await page.goto("/");
    await expect(page.locator("body")).toBeVisible();
  });

  await test.step("Je vois le calendrier des sessions avec leur badge", async () => {
    await expect(page.getByRole("heading", { name: "Calendrier des sessions" })).toBeVisible();
    await expect(page.getByTestId("badge").first()).toBeVisible();
  });

  await test.step("Je vois qui anime déjà chaque session", async () => {
    await expect(page.getByTestId("equipe-assignee").first()).toBeVisible();
  });
});
