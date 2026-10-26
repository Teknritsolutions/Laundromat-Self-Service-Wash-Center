const { chromium } = require("playwright");
const fs = require("fs");
(async () => {
    const browser = await chromium.launch({
        executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    });
    const page = await browser.newPage();
    const failures = [];
    for (const file of fs.readdirSync("pages").filter((f) => f.endsWith(".html"))) {
        await page.goto("http://127.0.0.1:4173/pages/" + file);
        for (const theme of ["light", "dark"]) {
            await page.evaluate((t) => (document.documentElement.dataset.theme = t), theme);
            await page.waitForTimeout(250);
            const issues = await page.evaluate(() => {
                const rgb = (s) => s.match(/[\d.]+/g)?.map(Number);
                const lum = (c) =>
                    c
                        .slice(0, 3)
                        .map((v) => {
                            v /= 255;
                            return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
                        })
                        .reduce((a, v, i) => a + v * [0.2126, 0.7152, 0.0722][i], 0);
                const issues = [];
                for (const el of document.querySelectorAll(
                    "main *,header *,footer *, .utility-top *",
                )) {
                    if (
                        ![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()) ||
                        !el.getClientRects().length ||
                        el.closest(".visually-hidden, figcaption")
                    )
                        continue;
                    const style = getComputedStyle(el);
                    let parent = el,
                        bg,
                        photo = false;
                    while (parent) {
                        const ps = getComputedStyle(parent);
                        if (ps.backgroundImage !== "none") {
                            photo = true;
                            break;
                        }
                        const c = rgb(ps.backgroundColor);
                        if (c?.length === 3 || c?.[3] === 1) {
                            bg = c;
                            break;
                        }
                        parent = parent.parentElement;
                    }
                    if (photo || !bg) continue;
                    const color = rgb(style.color);
                    if (!color) continue;
                    const a = lum(color),
                        b = lum(bg),
                        ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
                    const large =
                        parseFloat(style.fontSize) >= 24 ||
                        (parseFloat(style.fontSize) >= 18.66 && parseInt(style.fontWeight) >= 700);
                    if (ratio < (large ? 3 : 4.5) - 0.05)
                        issues.push({
                            text: el.textContent.trim().slice(0, 70),
                            selector: el.className,
                            ratio,
                            color: style.color,
                            bg,
                        });
                }
                return issues;
            });
            failures.push(...issues.map((i) => ({ file, theme, ...i })));
        }
    }
    fs.writeFileSync("tests/contrast-results.json", JSON.stringify({ failures }, null, 2));
    console.log(JSON.stringify({ failures }, null, 2));
    await browser.close();
    if (failures.length) process.exitCode = 1;
})().catch((e) => {
    console.error(e);
    process.exitCode = 1;
});
