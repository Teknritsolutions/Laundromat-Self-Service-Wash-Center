const { chromium } = require("playwright");
(async () => {
    const browser = await chromium.launch({
        executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    });
    const page = await browser.newPage({ viewport: { width: 820, height: 900 } });
    await page.goto("http://127.0.0.1:4173/index-2.html");
    console.log(
        await page.evaluate(() =>
            [...document.querySelectorAll("*")]
                .filter((x) => x.getBoundingClientRect().right > innerWidth + 1)
                .map((x) => [
                    x.tagName,
                    x.className,
                    x.getBoundingClientRect().width,
                    x.textContent.slice(0, 70),
                ]),
        ),
    );
    await page.locator("img").evaluateAll(async (imgs) => {
        await Promise.all(
            imgs.map(async (img) => {
                img.loading = "eager";
                try {
                    await img.decode();
                } catch (e) {}
            }),
        );
    });
    console.log(
        await page
            .locator("img")
            .evaluateAll((imgs) => imgs.map((x) => [x.src, x.complete, x.naturalWidth])),
    );
    await browser.close();
})();
