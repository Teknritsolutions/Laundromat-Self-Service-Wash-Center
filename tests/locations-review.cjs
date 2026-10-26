const { chromium } = require("playwright");
(async () => {
    const browser = await chromium.launch({
        executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    });
    const page = await browser.newPage();
    await page.goto("http://127.0.0.1:4173/pages/locations.html");
    await page.locator("img").evaluateAll((images) =>
        Promise.all(
            images.map(async (img) => {
                img.loading = "eager";
                await img.decode();
            }),
        ),
    );
    await page.evaluate(() => document.fonts.ready);
    await page.locator(".neighborhood-map").scrollIntoViewIfNeeded();
    const map = page.frameLocator(".neighborhood-map iframe");
    try {
        await map.locator(".gm-style").waitFor({ timeout: 30000 });
        await page.waitForTimeout(4000);
        console.log("Interactive map rendered.");
    } catch {
        console.log("Map frame could not be verified on this network.");
    }
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
                ["map", ".neighborhood-map"],
                ["amenities", ".icon-rail"],
            ])
                await page
                    .locator(selector)
                    .screenshot({
                        path: `tests/screenshots/locations-${name}-${width}-${theme}.png`,
                    });
        }
    }
    await browser.close();
})();
