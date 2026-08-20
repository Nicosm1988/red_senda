import { expect, test, type Locator } from "@playwright/test";

async function expectIndependentVerticalScroll(container: Locator) {
  await expect(container).toBeVisible();

  const scrollState = await container.evaluate(async (element) => {
    const documentScrollBefore = window.scrollY;
    const maximumScroll = element.scrollHeight - element.clientHeight;

    element.scrollTop = 0;
    element.scrollTop = Math.min(160, maximumScroll);
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

    return {
      documentScrollAfter: window.scrollY,
      documentScrollBefore,
      maximumScroll,
      overflowY: getComputedStyle(element).overflowY,
      scrollTop: element.scrollTop,
    };
  });

  expect(scrollState.maximumScroll).toBeGreaterThan(0);
  expect(scrollState.overflowY).toBe("auto");
  expect(scrollState.scrollTop).toBeGreaterThan(0);
  expect(scrollState.documentScrollAfter).toBe(scrollState.documentScrollBefore);
}

test("home is search-first, compact, and free of photos or questionnaires", async ({ page }) => {
  await page.goto("/");

  const search = page.getByRole("search");
  await expect(search).toBeVisible();
  await expect(page.getByRole("link", { name: "Ingresar para contactar" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Crear cuenta gratuita" })).toBeVisible();
  await expect(page.locator("main img, main picture")).toHaveCount(0);
  await expect(page.locator('a[href="/matching"]')).toHaveCount(0);
  await expect(page.getByText(/No sé qué ayuda necesito/i)).toHaveCount(0);

  const searchBox = await search.boundingBox();
  const searchButtonBox = await search.getByRole("button", { name: "Buscar profesionales" }).boundingBox();
  const viewportHeight = page.viewportSize()?.height ?? 900;
  expect(searchBox).not.toBeNull();
  expect(searchButtonBox).not.toBeNull();
  expect(searchBox?.y ?? -1).toBeGreaterThanOrEqual(0);
  expect((searchBox?.y ?? Number.POSITIVE_INFINITY) + (searchBox?.height ?? 0)).toBeLessThanOrEqual(viewportHeight);
  expect((searchButtonBox?.y ?? Number.POSITIVE_INFINITY) + (searchButtonBox?.height ?? 0)).toBeLessThanOrEqual(viewportHeight);

  const mainHeight = await page.locator("main").evaluate((element) => element.scrollHeight);
  expect(mainHeight).toBeLessThanOrEqual(viewportHeight * 1.5);

  await search.getByRole("searchbox").fill("orientación");
  await search.locator('select[name="type"]').selectOption("psicopedagogia");
  await search.locator('select[name="modality"]').selectOption("online");
  await search.getByRole("button", { name: "Buscar profesionales" }).click();

  await expect(page).toHaveURL(/q=orientaci%C3%B3n/);
  await expect(page).toHaveURL(/type=psicopedagogia/);
  await expect(page).toHaveURL(/modality=online/);
});

test("home → filtered search → profile → contact", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Encontrá tu profesional.",
    }),
  ).toBeVisible();

  await page
    .getByRole("link", { name: "Cambiar de trabajo" })
    .click();

  await expect(page).toHaveURL(/\/profesionales\?need=cambio-trabajo/);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /Encontrá a tu profesional orientador/i,
    }),
  ).toBeVisible();
  await expect(
    page.getByText(/profesional(?:es)? coincide/i).first(),
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
  await page.getByRole("link", { name: "Contactar ahora" }).first().click();
  await expect(page).toHaveURL(/#contactar$/);
  await expect(
    page.locator("#contactar").getByRole("heading", { name: new RegExp(`Contactá a ${professionalName.split(" ")[0]}`, "i") }),
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

test("directory filters apply immediately and stay synchronized with the URL", async ({ page }) => {
  await page.goto("/profesionales");

  const professionalType = page.locator('select[name="type"]:visible');
  const jobChange = page.getByRole("checkbox", {
    name: "Cambiar o encontrar trabajo",
  });

  await expect(professionalType).toHaveValue("");
  await expect(professionalType.locator("option")).toHaveText([
    "Profesional orientador",
    "Psicólogo/a",
    "Psicopedagogo/a",
  ]);

  await professionalType.selectOption("psicologia");
  await expect(page).toHaveURL(/type=psicologia/);
  await expect(professionalType).toHaveValue("psicologia");

  await jobChange.check();
  await expect(page).toHaveURL(/need=cambio-trabajo/);
  await expect(jobChange).toBeChecked();

  const resultCards = page.getByTestId("professional-card").filter({
    has: page.getByRole("link", { name: "Contactar" }),
  });
  expect(await resultCards.count()).toBeGreaterThan(0);
  for (const card of await resultCards.all()) {
    await expect(card.getByText(/Psicólog[oa]/i)).toBeVisible();
  }

  await page.getByRole("link", { name: "Limpiar" }).click();
  await expect(page).toHaveURL(/\/profesionales$/);
  await expect(jobChange).not.toBeChecked();

  await page.goBack();
  await expect(page).toHaveURL(/type=psicologia/);
  await expect(page).toHaveURL(/need=cambio-trabajo/);
  await expect(professionalType).toHaveValue("psicologia");
  await expect(jobChange).toBeChecked();
});

test("professional cards align by section and the filter rail scrolls independently", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 720 });
  await page.goto("/profesionales");

  const cards = page.getByTestId("professional-card");
  expect(await cards.count()).toBeGreaterThanOrEqual(2);

  const layout = await cards.evaluateAll((elements) => {
    const sectionNames = ["identity", "headline", "needs", "facts", "actions"];

    return elements.slice(0, 2).map((card) => {
      const cardRect = card.getBoundingClientRect();
      const factColumns = card.querySelectorAll('[data-card-section="facts"] > div');

      return {
        card: { top: cardRect.top, width: cardRect.width, height: cardRect.height },
        factColumnWidths: Array.from(factColumns, (column) => column.getBoundingClientRect().width),
        sections: sectionNames.map((name) => {
          const matches = card.querySelectorAll(`[data-card-section="${name}"]`);
          const rect = matches.item(0)?.getBoundingClientRect();

          return {
            count: matches.length,
            name,
            top: rect?.top ?? null,
            width: rect?.width ?? null,
          };
        }),
      };
    });
  });

  const [firstCardLayout, secondCardLayout] = layout;
  if (!firstCardLayout || !secondCardLayout) throw new Error("Se necesitan 2 tarjetas para verificar la alineación.");

  expect(Math.abs(firstCardLayout.card.top - secondCardLayout.card.top)).toBeLessThanOrEqual(1);
  expect(Math.abs(firstCardLayout.card.height - secondCardLayout.card.height)).toBeLessThanOrEqual(1);
  expect(Math.abs(firstCardLayout.card.width - secondCardLayout.card.width)).toBeLessThanOrEqual(1);
  for (let index = 0; index < firstCardLayout.sections.length; index += 1) {
    const firstSection = firstCardLayout.sections[index];
    const secondSection = secondCardLayout.sections[index];
    if (!firstSection || !secondSection) throw new Error("Falta una fila esperada en la tarjeta.");

    expect(firstSection.count, `La primera tarjeta debe tener una sola sección ${firstSection.name}.`).toBe(1);
    expect(secondSection.count, `La segunda tarjeta debe tener una sola sección ${secondSection.name}.`).toBe(1);
    expect(firstSection.top).not.toBeNull();
    expect(secondSection.top).not.toBeNull();
    expect(firstSection.width).not.toBeNull();
    expect(secondSection.width).not.toBeNull();
    expect(Math.abs((firstSection.top ?? 0) - (secondSection.top ?? 0))).toBeLessThanOrEqual(1);
    expect(Math.abs((firstSection.width ?? 0) - (secondSection.width ?? 0))).toBeLessThanOrEqual(1);
  }

  for (const cardLayout of [firstCardLayout, secondCardLayout]) {
    expect(cardLayout.factColumnWidths).toHaveLength(3);
    expect(Math.max(...cardLayout.factColumnWidths) - Math.min(...cardLayout.factColumnWidths)).toBeLessThanOrEqual(1);
  }

  const filterRail = page.getByTestId("professional-filters-desktop-scroll");
  await expectIndependentVerticalScroll(filterRail);

  await page.setViewportSize({ width: 390, height: 600 });
  await page.goto("/profesionales");
  const mobileFilterRail = page.getByTestId("professional-filters-mobile-scroll");
  await expectIndependentVerticalScroll(mobileFilterRail);
});

test("every professional card communicates its verification state", async ({ page }) => {
  await page.goto("/profesionales");

  const cards = page.getByTestId("professional-card");
  expect(await cards.count()).toBeGreaterThan(0);

  for (const card of await cards.all()) {
    await expect(card.getByText(/^(?:✓ Verificado|Verificación en curso)$/)).toHaveCount(1);
  }

  const pendingCard = cards.filter({ hasText: "Verificación en curso" });
  expect(await pendingCard.count()).toBeGreaterThan(0);
  await expect(pendingCard.first().getByText("Verificación en curso", { exact: true })).toBeVisible();
});

test("the end of a professional profile repeats the contact action", async ({ page }) => {
  await page.goto("/profesionales/valentina-acosta");

  const finalCallToAction = page.getByTestId("profile-final-cta");
  await finalCallToAction.scrollIntoViewIfNeeded();
  await expect(finalCallToAction).toBeVisible();

  const contact = finalCallToAction.getByRole("link", { name: "Contactar a Valentina" });
  await expect(contact).toHaveAttribute("href", "#contactar");
  await contact.click();
  await expect(page).toHaveURL(/#contactar$/);
  await expect(page.locator("#contactar form")).toBeVisible();
});

test("directory and profile never publish prices and keep ratings and opinions", async ({ page }) => {
  await page.goto("/profesionales");

  const forbiddenPublicPrice = /\b(?:ARS|USD)\b|\$\s*\d|valor\s+orientativo|honorarios?|precio\s+(?:desde|por|de\s+la\s+consulta)/i;
  expect(await page.locator("main").innerText()).not.toMatch(forbiddenPublicPrice);

  const firstCard = page.getByTestId("professional-card").first();
  await expect(firstCard.locator('[data-card-section="actions"]')).toContainText(
    /\d+[,.]\d\s*·\s*\d+\s+opiniones?/i,
  );
  await firstCard.getByRole("link", { name: "Ver perfil" }).click();

  expect(await page.locator("main").innerText()).not.toMatch(forbiddenPublicPrice);
  await expect(page.locator("main")).toContainText(/\d+[,.]\d\s*·\s*\d+\s+opiniones?/i);
  await expect(page.getByRole("heading", { name: "Opiniones" })).toBeVisible();
  const publishedOpinion = page.locator('section[aria-labelledby="opiniones"] blockquote').first();
  await expect(publishedOpinion).toBeVisible();
  await expect(publishedOpinion).toContainText(/\S/);
  await expect(page.getByRole("link", { name: "Contactar ahora" }).first()).toBeVisible();
  expect(await page.content()).not.toMatch(/priceCurrency|starting_price|show_starting_price|price_from/i);
});

test("theme choice persists across public pages", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  await page.evaluate(() =>
    window.localStorage.removeItem("red-senda-theme:v1"),
  );
  await page.reload();

  const root = page.locator("html");
  const activateLight = page.getByRole("button", {
    name: "Activar modo claro",
  });

  await expect(root).toHaveAttribute("data-theme", "dark");
  await expect(activateLight).toHaveAttribute("aria-pressed", "true");
  await activateLight.click();
  await expect(root).toHaveAttribute("data-theme", "light");

  expect(
    await page.evaluate(() =>
      window.localStorage.getItem("red-senda-theme:v1"),
    ),
  ).toBe("light");

  await page.reload();
  await expect(root).toHaveAttribute("data-theme", "light");
  await page.getByRole("button", { name: "Activar modo oscuro" }).click();
  await expect(root).toHaveAttribute("data-theme", "dark");

  await page.goto("/terminos");
  await expect(root).toHaveAttribute("data-theme", "dark");
  await expect(
    page.getByRole("button", { name: "Activar modo claro" }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(
    page.getByRole("heading", { level: 1, name: "Términos y condiciones" }),
  ).toBeVisible();
});

test("legacy matching route leads directly to the professional search", async ({ page }) => {
  await page.goto("/matching");
  await expect(page).toHaveURL(/\/profesionales$/);
  await expect(page.getByRole("heading", { level: 1, name: /Encontrá a tu profesional orientador/i })).toBeVisible();
});
