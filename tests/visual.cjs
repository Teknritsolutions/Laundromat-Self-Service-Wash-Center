const { chromium } = require("playwright");
const fs = require("fs");
(async () => {
    const browser = await chromium.launch({
        executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    });
    const page = await browser.newPage();
    const files = [
        ...fs
            .readdirSync("pages")
            .filter((x) => x.endsWith(".html"))
            .map((x) => "pages/" + x),
    ];
    for (const file of files) {
        await page.goto("http://127.0.0.1:4173/" + file);
        await page.locator("img").evaluateAll(async (images) => {
            await Promise.all(
                images.map(async (image) => {
                    image.loading = "eager";
                    try {
                        await image.decode();
                    } catch (_) {}
                }),
            );
        });
        await page.setViewportSize({ width: 390, height: 844 });
        await page.evaluate(() => {
            document.documentElement.dataset.theme = "dark";
            document.documentElement.dir = "ltr";
        });
        await page.waitForTimeout(220);
        await page.screenshot({
            path:
                "tests/screenshots/mobile-dark-" +
                file.split("/").pop().replace(".html", "") +
                ".png",
            fullPage: true,
        });
    }
    await browser.close();
    console.log("Captured all 14 pages in mobile dark mode.");
})();
