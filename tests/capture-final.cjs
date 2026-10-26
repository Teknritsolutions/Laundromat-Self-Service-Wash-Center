const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
(async () => {
    const qa = JSON.parse(fs.readFileSync("tests/qa-results.json"));
    const rtl = process.argv.includes("--rtl");
    const widths = rtl ? [320, 820, 1440] : qa.widths;
    const heights = qa.heights;
    const browser = await chromium.launch({
        executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    });
    const page = await browser.newPage({ reducedMotion: "reduce" });
    let captures = 0;
    const errors = [];
    for (const file of fs.readdirSync("pages").filter((f) => f.endsWith(".html"))) {
        await page.goto("http://127.0.0.1:4173/pages/" + file);
        await page.locator("img").evaluateAll((imgs) =>
            Promise.all(
                imgs.map(async (img) => {
                    img.loading = "eager";
                    await img.decode();
                }),
            ),
        );
        await page.evaluate(() => document.fonts.ready);
        for (const width of widths) {
            await page.setViewportSize({ width, height: heights[width] });
            for (const theme of ["light", "dark"]) {
                await page.evaluate(
                    ({ theme, rtl }) => {
                        document.documentElement.dataset.theme = theme;
                        document.documentElement.dir = rtl ? "rtl" : "ltr";
                    },
                    { theme, rtl },
                );
                if (
                    await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)
                )
                    errors.push(file + " " + width + " " + theme);
                await page.screenshot({
                    path: `tests/screenshots/final/${path.basename(file, ".html")}-${width}-${theme}${rtl ? "-rtl" : ""}.png`,
                    fullPage: true,
                });
                captures++;
            }
        }
        console.log("Saved all " + widths.length * 2 + " viewport/theme screenshots: " + file);
    }
    await browser.close();
    fs.writeFileSync(
        rtl ? "tests/capture-rtl-results.json" : "tests/capture-results.json",
        JSON.stringify({ captures, widths, heights, errors }, null, 2),
    );
    console.log({ captures, errors });
    if (errors.length) process.exitCode = 1;
})().catch((e) => {
    console.error(e);
    process.exitCode = 1;
});
