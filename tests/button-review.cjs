const { chromium } = require("playwright");
const fs = require("fs");
(async () => {
    const browser = await chromium.launch({
        executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    });
    const page = await browser.newPage();
    const failures = [];
    for (const file of fs.readdirSync("pages").filter((file) => file.endsWith(".html"))) {
        await page.goto("http://127.0.0.1:4173/pages/" + file);
        await page.evaluate(() => document.fonts.ready);
        for (const width of [320, 640, 1280, 1440]) {
            await page.setViewportSize({ width, height: 1000 });
            const issues = await page.locator(".btn").evaluateAll((buttons) =>
                buttons.flatMap((button) => {
                    const rect = button.getBoundingClientRect();
                    if (!rect.height) return [];
                    const style = getComputedStyle(button);
                    const available =
                        rect.height -
                        parseFloat(style.paddingTop) -
                        parseFloat(style.paddingBottom) -
                        2;
                    const range = document.createRange();
                    const node = [...button.childNodes].find(
                        (node) => node.nodeType === 3 && node.textContent.trim(),
                    );
                    if (!node) return [];
                    range.selectNodeContents(node);
                    const text = range.getBoundingClientRect();
                    return text.height > available + 2 || Math.abs(rect.height - 52) > 1
                        ? [
                              {
                                  text: button.textContent.trim(),
                                  height: rect.height,
                                  textHeight: text.height,
                                  available,
                              },
                          ]
                        : [];
                }),
            );
            failures.push(...issues.map((issue) => ({ file, width, ...issue })));
        }
    }
    await page.goto("http://127.0.0.1:4173/pages/index.html");
    await page.addStyleTag({ content: ".site-header, .skip-link { visibility: hidden; }" });
    await page.locator("img").evaluateAll(async (images) =>
        Promise.all(
            images.map(async (image) => {
                image.loading = "eager";
                try {
                    await image.decode();
                } catch {}
            }),
        ),
    );
    for (const width of [1440, 390]) {
        await page.setViewportSize({ width, height: 1000 });
        await page.evaluate(() => {
            document.documentElement.dataset.theme = "light";
            document.documentElement.dir = "ltr";
        });
        await page.waitForTimeout(400);
        for (const selector of ["service-showcase", "steps", "price-preview", "location-grid"])
            await page
                .locator("." + selector)
                .screenshot({ path: `tests/screenshots/refined-${selector}-${width}.png` });
    }
    fs.writeFileSync("tests/button-results.json", JSON.stringify({ failures }, null, 4));
    await browser.close();
    console.log(JSON.stringify({ failures }, null, 2));
    if (failures.length) process.exitCode = 1;
})();
