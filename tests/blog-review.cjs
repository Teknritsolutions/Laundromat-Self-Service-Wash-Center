const { chromium } = require("playwright");
(async () => {
    const browser = await chromium.launch({
        executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    });
    const page = await browser.newPage();
    for (const [file, selector] of [
        ["blog", ".pricing-hero"],
        ["blog-details", ".premium-related"],
    ]) {
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
        for (const width of [1440, 390]) {
            await page.setViewportSize({ width, height: 1000 });
            for (const theme of ["light", "dark"]) {
                await page.evaluate((theme) => {
                    document.documentElement.dataset.theme = theme;
                    document.documentElement.dir = "ltr";
                }, theme);
                await page
                    .locator(selector)
                    .screenshot({
                        path: `tests/screenshots/${file}-premium-${width}-${theme}.png`,
                    });
            }
            if (file === "blog-details" && width === 1440) {
                const bottoms = await page
                    .locator(".premium-related .text-link")
                    .evaluateAll((links) =>
                        links.map((link) => link.getBoundingClientRect().bottom),
                    );
                if (Math.max(...bottoms) - Math.min(...bottoms) > 2)
                    throw Error("Related article links are not aligned");
            }
        }
    }
    await browser.close();
    console.log("Blog hero and related cards reviewed in both themes; article links aligned.");
})().catch((error) => {
    console.error(error);
    process.exit(1);
});
