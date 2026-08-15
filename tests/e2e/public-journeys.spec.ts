import { expect, test } from "@playwright/test";

test("home → filtered search → profile → contact", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /Tu próximo movimiento no tiene por qué pensarse a solas/i,
    }),
  ).toBeVisible();

  await page
    .getByRole("link", { name: /Quiero cambiar de trabajo/i })
    .click();

  await expect(page).toHaveURL(/\/profesionales\?need=cambio-trabajo/);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /Encontrá a alguien que comprenda el momento/i,
    }),
  ).toBeVisible();
  await expect(
    page.getByText(/profesionales? coincide/i).first(),
  ).toBeVisible();

  const firstResult = page.locator("article").filter({
    has: page.getByRole("link", { name: "Contactar" }),
  }).first();
  const professionalName = (await firstResult.getByRole("heading").innerText()).trim();
  await firstResult.getByRole("link", { name: "Ver perfil" }).click();

  await expect(page).toHaveURL(/\/profesionales\/[a-z0-9-]+$/);
  await expect(
    page.getByRole("heading", { level: 1, name: professionalName }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Enviar una consulta" }).click();
  await expect(page).toHaveURL(/#contactar$/);
  await expect(
    page.getByRole("heading", { name: /Iniciá una conversación con/i }),
  ).toBeVisible();

  await page.getByLabel("Nombre").fill("Julia Díaz");
  await page.getByLabel("Email", { exact: true }).fill("julia@example.com");
  await page.getByLabel("Motivo principal").selectOption({ index: 1 });
  await page.getByLabel("¿Cómo preferís que te respondan?").selectOption("WHATSAPP");
  await page.getByLabel("Teléfono").fill("11 5555 1234");
  await page
    .getByLabel("¿Qué te gustaría conversar?")
    .fill(
      "Estoy pensando un cambio de trabajo y necesito ordenar alternativas concretas.",
    );
  await page.getByRole("checkbox", { name: /Acepto que Red Senda/i }).check();

  const responsePromise = page.waitForResponse(
    (response) =>
      response.request().method() === "POST" &&
      new URL(response.url()).pathname === "/api/leads",
  );
  await page
    .getByRole("button", { name: new RegExp(`Enviar consulta a ${professionalName.split(" ")[0]}`, "i") })
    .click();
  const response = await responsePromise;

  expect(response.status()).toBe(201);
  await expect(page.getByRole("status")).toContainText(
    "Tu consulta fue enviada",
  );
  await expect(page.getByRole("status")).toContainText(professionalName);
});

test("matching explains its recommendation and keeps filters in the URL", async ({
  page,
}) => {
  await page.goto("/matching");

  await expect(page.getByText("Paso 1 de 4")).toBeVisible();
  await page.getByLabel("Quiero cambiar o volver a trabajar").check();
  await page.getByRole("button", { name: /Continuar/ }).click();

  await expect(page.getByText("Paso 2 de 4")).toBeVisible();
  await page.getByLabel("Necesito actuar ahora").check();
  await page.getByRole("button", { name: /Continuar/ }).click();

  await expect(page.getByText("Paso 3 de 4")).toBeVisible();
  await page.getByLabel("Herramientas concretas").check();
  await page.getByRole("button", { name: /Continuar/ }).click();

  await expect(page.getByText("Paso 4 de 4")).toBeVisible();
  await page.getByRole("radio", { name: /^Online\b/ }).check();
  await page.getByRole("button", { name: "Ver orientación" }).click();

  await expect(page.getByText("Orientación completada")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /Podrían resultarte útiles/i }),
  ).toContainText("empleabilidad");
  await expect(
    page.getByRole("heading", { name: "Cómo llegamos a esta sugerencia" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Perfiles para empezar a comparar" }),
  ).toBeVisible();

  const resultLink = page.getByRole("link", {
    name: "Explorar coincidencias",
  });
  await expect(resultLink).toHaveAttribute("href", /need=cambio-trabajo/);
  await expect(resultLink).toHaveAttribute("href", /modality=online/);
  await expect(resultLink).toHaveAttribute("href", /type=empleabilidad/);
  await expect(resultLink).toHaveAttribute("href", /sort=match/);

  await page.getByRole("button", { name: "Volver a empezar" }).click();
  await expect(page.getByText("Paso 1 de 4")).toBeVisible();
});
