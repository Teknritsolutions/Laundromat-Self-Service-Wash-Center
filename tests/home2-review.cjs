const { chromium } = require("playwright");
const fs = require("fs");
(async () => {
    const browser = await chromium.launch({
        executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    });
    const page = await browser.newPage();
    await page.goto("http://127.0.0.1:4173/pages/index-2.html");
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
    const checks = [];
    for (const width of [1440, 390]) {
        await page.setViewportSize({ width, height: 1000 });
        for (const theme of ["light", "dark"]) {
            await page.evaluate((theme) => {
                document.documentElement.dataset.theme = theme;
                document.documentElement.dir = "ltr";
            }, theme);
            await page.waitForTimeout(400);
            checks.push(
                await page.evaluate(() => {
                    const strip = document.querySelector(".quick-values").getBoundingClientRect();
                    const cards = [...document.querySelectorAll(".care-card")].map((card) =>
                        card.getBoundingClientRect(),
                    );
                    return {
                        width: innerWidth,
                        theme: document.documentElement.dataset.theme,
                        leftMargin: strip.left,
                        rightMargin: innerWidth - strip.right,
                        careHeights: cards.map((card) => card.height),
                        footerDirectionControls:
                            document.querySelectorAll(".site-footer [data-rtl]").length,
                    };
                }),
            );
            for (const selector of ["care-grid", "rate-snapshot", "quick-values"])
                await page
                    .locator("." + selector)
                    .screenshot({
                        path: `tests/screenshots/home2-${selector}-${width}-${theme}.png`,
                    });
        }
    }
    fs.writeFileSync("tests/home2-results.json", JSON.stringify(checks, null, 4));
    await browser.close();
    if (
        checks.some(
            (check) =>
                Math.abs(check.leftMargin - check.rightMargin) > 1 || check.footerDirectionControls,
        )
    )
        throw Error("Unequal spacing or footer control");
    console.log(
        "Both themes reviewed at desktop and mobile; equal outer margins and no footer direction control.",
    );
})();
