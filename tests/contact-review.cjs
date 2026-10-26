const { chromium } = require("playwright");
(async () => {
    const browser = await chromium.launch({
        executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    });
    const page = await browser.newPage();
    await page.goto("http://127.0.0.1:4173/pages/contact.html");
    await page.locator("img").evaluateAll((images) =>
        Promise.all(
            images.map(async (img) => {
                img.loading = "eager";
                await img.decode();
            }),
        ),
    );
    await page.evaluate(() => document.fonts.ready);
    const enquiry = page.locator("#enquiry-type").locator("..");
    await enquiry.locator(".select-trigger").click();
    if ((await enquiry.locator("[role=option]").count()) !== 4)
        throw Error("Expected four selectable enquiries without placeholder option");
    await enquiry.getByRole("option", { name: "Drop & collect", exact: true }).click();
    if ((await page.locator("#enquiry-type").inputValue()) !== "Drop & collect")
        throw Error("Selection failed");
    await enquiry.locator(".select-trigger").focus();
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    if ((await page.locator("#enquiry-type").inputValue()) !== "Drop & collect")
        throw Error("Keyboard selection failed");
    if (
        await page
            .locator("input:not([type=checkbox]):not([placeholder]),textarea:not([placeholder])")
            .count()
    )
        throw Error("Placeholder missing");
    await page.addStyleTag({ content: ".site-header,.skip-link{visibility:hidden}" });
    for (const width of [1440, 390]) {
        await page.setViewportSize({ width, height: 1000 });
        for (const theme of ["light", "dark"]) {
            await page.evaluate((theme) => {
                document.documentElement.dataset.theme = theme;
                document.documentElement.dir = "ltr";
            }, theme);
            for (const [name, selector] of [
                ["hero", ".pricing-hero"],
                ["help", ".contact-help-panel"],
                ["cards", ".contact-rail"],
                ["form", ".contact-form"],
            ])
                await page
                    .locator(selector)
                    .screenshot({
                        path: `tests/screenshots/contact-${name}-${width}-${theme}.png`,
                    });
            await enquiry.locator(".select-trigger").click();
            await page
                .locator(".contact-form")
                .screenshot({ path: `tests/screenshots/contact-options-${width}-${theme}.png` });
            await page.keyboard.press("Escape");
        }
    }
    await browser.close();
    console.log("Custom select mouse/keyboard selection and form placeholders passed.");
})().catch((error) => {
    console.error(error);
    process.exit(1);
});
