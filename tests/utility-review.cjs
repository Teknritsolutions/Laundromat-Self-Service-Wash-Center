const { chromium } = require("playwright");
(async () => {
    const browser = await chromium.launch({
        executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    });
    const page = await browser.newPage();
    for (const file of ["404", "coming-soon"]) {
        await page.goto("http://127.0.0.1:4173/pages/" + file + ".html");
        if (await page.locator("header,footer,.main-nav").count())
            throw Error("Standalone page has navigation chrome");
        if ((await page.locator(".brand").count()) !== 1)
            throw Error("Standalone home branding missing");
        await page.locator("img").evaluateAll(async (images) =>
            Promise.all(
                images.map(async (image) => {
                    image.loading = "eager";
                    await image.decode();
                }),
            ),
        );
        await page.evaluate(() => document.fonts.ready);
        for (const width of [1440, 390]) {
            await page.setViewportSize({ width, height: 900 });
            for (const dir of ["ltr", "rtl"]) {
                await page.evaluate((dir) => (document.documentElement.dir = dir), dir);
                const controls = await page.locator(".utility-controls").boundingBox();
                if (
                    dir === "ltr" ? controls.x < width / 2 : controls.x + controls.width > width / 2
                )
                    throw Error(`Controls on wrong side: ${file} ${width} ${dir}`);
            }
            for (const theme of ["light", "dark"]) {
                await page.evaluate((theme) => {
                    document.documentElement.dataset.theme = theme;
                    document.documentElement.dir = "ltr";
                }, theme);
                await page.waitForTimeout(400);
                await page.screenshot({
                    path: `tests/screenshots/utility-${file}-${width}-${theme}.png`,
                    fullPage: true,
                });
            }
        }
        await page.locator(".theme-toggle").click();
        await page.locator(".direction-toggle").click();
        const saved = await page.evaluate(() => ({
            theme: document.documentElement.dataset.theme,
            dir: document.documentElement.dir,
        }));
        await page.reload();
        if (
            JSON.stringify(saved) !==
            JSON.stringify(
                await page.evaluate(() => ({
                    theme: document.documentElement.dataset.theme,
                    dir: document.documentElement.dir,
                })),
            )
        )
            throw Error("Standalone preferences not saved");
        if (file === "coming-soon") {
            await page.locator("#notify-email").fill("visitor@example.com");
            await page.getByRole("button", { name: "Notify me", exact: true }).click();
            if (!(await page.locator(".form-status").innerText()).includes("validated"))
                throw Error("Launch form failed");
            const before = await page.locator(".countdown strong").last().innerText();
            await page.waitForTimeout(1200);
            if (before === (await page.locator(".countdown strong").last().innerText()))
                throw Error("Countdown not ticking");
        }
    }
    await browser.close();
    console.log(
        "Standalone chrome, controls, persistence, countdown and notification form passed.",
    );
})();
