const { chromium } = require("playwright");
(async () => {
    const browser = await chromium.launch({
        executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    });
    const page = await browser.newPage();
    await page.goto("http://127.0.0.1:4173/pages/about.html");
    await page.locator("img").evaluateAll(async (images) =>
        Promise.all(
            images.map(async (image) => {
                image.loading = "eager";
                await image.decode();
            }),
        ),
    );
    await page.evaluate(() => document.fonts.ready);
    await page.addStyleTag({ content: ".site-header,.skip-link {visibility:hidden}" });
    for (const width of [1440, 390]) {
        await page.setViewportSize({ width, height: 1000 });
        for (const theme of ["light", "dark"]) {
            await page.evaluate((theme) => {
                document.documentElement.dataset.theme = theme;
                document.documentElement.dir = "ltr";
            }, theme);
            await page.waitForTimeout(400);
            for (const [name, selector] of [
                ["values", ".icon-rail"],
                ["story-intro", "main > section:nth-child(2) .split"],
                ["metrics", ".equipment-panel"],
                ["testimonial", ".story-quote"],
            ])
                await page
                    .locator(selector)
                    .screenshot({ path: `tests/screenshots/about-${name}-${width}-${theme}.png` });
        }
    }
    if (!(await page.locator(".review-person img").isVisible())) throw Error("Portrait missing");
    await browser.close();
    console.log(
        "About values, split panel, metrics and portrait testimonial captured in both themes.",
    );
})();
