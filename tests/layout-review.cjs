const { chromium } = require("playwright");
const fs = require("fs");
(async () => {
    const browser = await chromium.launch({
        executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    });
    const page = await browser.newPage();
    const results = [];
    const failures = [];
    for (const file of fs.readdirSync("pages").filter((file) => file.endsWith(".html"))) {
        await page.goto("http://127.0.0.1:4173/pages/" + file);
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
        await page.evaluate(() => document.fonts.ready);
        for (const width of [768, 1280, 1920]) {
            await page.setViewportSize({ width, height: 1000 });
            for (const dir of ["ltr", "rtl"]) {
                await page.evaluate((dir) => {
                    document.documentElement.dir = dir;
                    document.documentElement.dataset.theme = "light";
                }, dir);
                await page.waitForTimeout(400);
                const checks = await page.evaluate(() => {
                    const checks = [];
                    for (const parent of document.querySelectorAll(
                        ".split,.service-detail-row,.experience-layout,.drop-feature,.location-feature,.hero-grid",
                    )) {
                        const children = [...parent.children].filter(
                            (child) => getComputedStyle(child).display !== "none",
                        );
                        if (children.length !== 2) continue;
                        const [a, b] = children.map((child) => child.getBoundingClientRect());
                        if (Math.abs(a.top - b.top) < 3 && Math.abs(a.left - b.left) > 20)
                            checks.push({
                                kind: "split",
                                selector: parent.className,
                                delta: Math.abs(a.height - b.height),
                            });
                    }
                    for (const parent of document.querySelectorAll(
                        ".card-grid,.location-grid,.editorial-grid,.washer-prices",
                    )) {
                        const rows = new Map();
                        for (const child of parent.children) {
                            const rect = child.getBoundingClientRect();
                            if (!rect.height) continue;
                            const key = Math.round(rect.top);
                            if (!rows.has(key)) rows.set(key, []);
                            rows.get(key).push(rect.height);
                        }
                        for (const heights of rows.values())
                            if (heights.length > 1)
                                checks.push({
                                    kind: "row",
                                    selector: parent.className,
                                    delta: Math.max(...heights) - Math.min(...heights),
                                });
                    }
                    return checks;
                });
                for (const check of checks)
                    if (check.delta > 3) failures.push({ file, width, dir, ...check });
                results.push({ file, width, dir, checks });
            }
        }
        await page.setViewportSize({ width: 768, height: 1024 });
        await page.evaluate(() => {
            document.documentElement.dir = "rtl";
            document.documentElement.dataset.theme = "dark";
        });
        await page.waitForTimeout(400);
        await page.screenshot({
            path: "tests/screenshots/tablet-rtl-" + file.replace(".html", "") + ".png",
            fullPage: true,
        });
    }
    fs.writeFileSync("tests/layout-results.json", JSON.stringify({ results, failures }, null, 4));
    await browser.close();
    console.log(JSON.stringify({ layouts: results.length, failures }, null, 2));
    if (failures.length) process.exitCode = 1;
})();
