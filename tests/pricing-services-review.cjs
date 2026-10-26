const { chromium } = require("playwright");
(async () => {
    const browser = await chromium.launch({
        executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    });
    const page = await browser.newPage();
    for (const file of ["pricing", "services"]) {
        await page.goto(`http://127.0.0.1:4173/pages/${file}.html`);
        await page.locator("img").evaluateAll((images) =>
            Promise.all(
                images.map(async (img) => {
                    img.loading = "eager";
                    await img.decode();
                }),
            ),
        );
        await page.evaluate(() => document.fonts.ready);
        await page.addStyleTag({ content: ".site-header,.skip-link{visibility:hidden}" });
        if (file === "services") {
            const summary = page.locator(".service-question summary").first();
            await summary.click();
            if (!((await page.locator(".service-question").first().getAttribute("open")) !== null))
                throw Error("FAQ did not open");
            await summary.focus();
            await page.keyboard.press("Enter");
            if ((await page.locator(".service-question").first().getAttribute("open")) !== null)
                throw Error("FAQ keyboard close failed");
            await summary.click();
        }
        for (const width of [1440, 390]) {
            await page.setViewportSize({ width, height: 1000 });
            for (const theme of ["light", "dark"]) {
                await page.evaluate((theme) => {
                    document.documentElement.dataset.theme = theme;
                    document.documentElement.dir = "ltr";
                }, theme);
                const selectors =
                    file === "pricing"
                        ? [".pricing-hero", ".premium-washer-prices", ".premium-included"]
                        : [".service-faq"];
                for (const [i, selector] of selectors.entries())
                    await page
                        .locator(selector)
                        .screenshot({
                            path: `tests/screenshots/${file}-redesign-${i}-${width}-${theme}.png`,
                        });
            }
        }
    }
    await browser.close();
    console.log(
        "Services FAQ mouse and keyboard checks passed; Pricing and Services captured at desktop/mobile in both themes.",
    );
})().catch((error) => {
    console.error(error);
    process.exit(1);
});
