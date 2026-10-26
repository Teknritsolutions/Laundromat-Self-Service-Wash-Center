const { chromium } = require("playwright");
(async () => {
    const browser = await chromium.launch({
        executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    });
    const page = await browser.newPage();
    await page.goto("http://127.0.0.1:4173/pages/index.html");
    await page.evaluate(() => document.fonts.ready);
    for (const width of [390, 820, 1024]) {
        await page.setViewportSize({ width, height: 850 });
        for (const theme of ["light", "dark"])
            for (const dir of ["ltr", "rtl"]) {
                await page.evaluate(
                    ({ theme, dir }) => {
                        document.documentElement.dataset.theme = theme;
                        document.documentElement.dir = dir;
                    },
                    { theme, dir },
                );
                await page.locator(".menu-toggle").click();
                await page.locator(".main-nav .dropdown-toggle").click();
                await page.screenshot({
                    path: `tests/screenshots/menu-${width}-${theme}-${dir}.png`,
                });
                const panel = await page.locator(".main-nav").boundingBox();
                if (panel.x < 0 || panel.x + panel.width > width + 1)
                    throw Error("Drawer overflows");
                if (
                    (await page.evaluate(() => getComputedStyle(document.body).overflow)) !==
                    "hidden"
                )
                    throw Error("Body scroll unlocked");
                await page.locator(".mobile-menu-close").click();
                if (await page.locator(".main-nav").isVisible()) throw Error("Close button failed");
                await page.locator(".menu-toggle").click();
                await page.keyboard.press("Escape");
                if (await page.locator(".main-nav").isVisible()) throw Error("Escape failed");
            }
    }
    await page.setViewportSize({ width: 390, height: 650 });
    await page.locator(".menu-toggle").click();
    await page.locator(".mobile-menu-actions a").last().focus();
    await page.keyboard.press("Tab");
    if (
        !(await page
            .locator(".mobile-menu-top .brand")
            .evaluate((el) => el === document.activeElement))
    )
        throw Error("Focus trap failed");
    await page.keyboard.press("Escape");
    await browser.close();
    console.log("Menu layout, close button, Escape, scroll lock and focus trap passed.");
})().catch((error) => {
    console.error(error);
    process.exit(1);
});
