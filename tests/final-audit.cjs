const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const widths = [
    320, 360, 375, 390, 412, 420, 430, 480, 576, 640, 768, 820, 912, 1024, 1280, 1366, 1440, 1536,
    1920,
];
const heights = {
    320: 568,
    360: 800,
    375: 667,
    390: 844,
    412: 915,
    420: 900,
    430: 932,
    480: 900,
    576: 900,
    640: 900,
    768: 1024,
    820: 1180,
    912: 1368,
    1024: 768,
    1280: 720,
    1366: 768,
    1440: 900,
    1536: 960,
    1920: 1080,
};
(async () => {
    const browser = await chromium.launch({
        executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    });
    const page = await browser.newPage();
    const errors = [],
        results = [],
        imageInventory = new Map();
    page.on("pageerror", (error) => errors.push(error.message));
    fs.mkdirSync("tests/screenshots/final", { recursive: true });
    for (const file of fs.readdirSync("pages").filter((f) => f.endsWith(".html"))) {
        await page.goto("http://127.0.0.1:4173/pages/" + file);
        await page.locator("img").evaluateAll((imgs) =>
            Promise.all(
                imgs.map(async (img) => {
                    img.loading = "eager";
                    try {
                        await img.decode();
                    } catch {}
                }),
            ),
        );
        await page.evaluate(() => document.fonts.ready);
        const images = await page
            .locator("img")
            .evaluateAll((imgs) =>
                imgs.map((img) => ({
                    file: img.getAttribute("src").replace("../assets/images/", ""),
                    width: img.naturalWidth,
                    height: img.naturalHeight,
                    alt: img.alt,
                    section: img.closest("section")?.getAttribute("aria-label") || "Brand",
                    declaredWidth: img.getAttribute("width"),
                    declaredHeight: img.getAttribute("height"),
                })),
            );
        for (const img of images) {
            if (!img.width || !img.alt || !img.declaredWidth || !img.declaredHeight)
                errors.push({ file, image: img });
            if (!imageInventory.has(img.file)) imageInventory.set(img.file, { ...img, uses: [] });
            imageInventory.get(img.file).uses.push({ page: file, section: img.section });
        }
        for (const width of widths) {
            await page.setViewportSize({ width, height: heights[width] });
            for (const theme of ["light", "dark"])
                for (const dir of ["ltr", "rtl"]) {
                    await page.evaluate(
                        ({ theme, dir }) => {
                            document.documentElement.dataset.theme = theme;
                            document.documentElement.dir = dir;
                        },
                        { theme, dir },
                    );
                    await page.waitForTimeout(220);
                    const issues = await page.evaluate(() => {
                        const issues = [];
                        if (document.documentElement.scrollWidth > innerWidth + 1)
                            issues.push({
                                kind: "overflow",
                                width: document.documentElement.scrollWidth,
                            });
                        for (const el of document.querySelectorAll(
                            "h1,h2,h3,p,.btn,summary,.eyebrow,.rate-row,.countdown",
                        )) {
                            const r = el.getBoundingClientRect();
                            if (!r.height || !r.width || el.closest("[hidden]")) continue;
                            if (
                                el.scrollWidth > el.clientWidth + 2 &&
                                getComputedStyle(el).overflowX === "visible"
                            )
                                issues.push({
                                    kind: "text overflow",
                                    selector: el.className,
                                    text: el.textContent.trim().slice(0, 90),
                                });
                        }
                        for (const grid of document.querySelectorAll(
                            ".cards,.location-grid,.care-grid,.washer-prices,.contact-help-cards,.premium-related",
                        )) {
                            const rows = new Map();
                            for (const child of grid.children) {
                                const r = child.getBoundingClientRect();
                                if (!r.height) continue;
                                const key = Math.round(r.top);
                                if (!rows.has(key)) rows.set(key, []);
                                rows.get(key).push(r.bottom);
                            }
                            for (const bottoms of rows.values())
                                if (
                                    bottoms.length > 1 &&
                                    Math.max(...bottoms) - Math.min(...bottoms) > 3
                                )
                                    issues.push({
                                        kind: "card baseline",
                                        selector: grid.className,
                                        delta: Math.max(...bottoms) - Math.min(...bottoms),
                                    });
                        }
                        const sections = [...document.querySelectorAll("main>section")].map((el) =>
                            el.getBoundingClientRect(),
                        );
                        for (let i = 1; i < sections.length; i++)
                            if (sections[i].top < sections[i - 1].bottom - 1)
                                issues.push({ kind: "section overlap", section: i });
                        return issues;
                    });
                    results.push({ file, width, height: heights[width], theme, dir, issues });
                    errors.push(...issues.map((issue) => ({ file, width, theme, dir, ...issue })));
                    if (dir === "ltr" && [320, 820, 1440].includes(width)) {
                        const prefix = `tests/screenshots/final/${path.basename(file, ".html")}-${width}-${theme}`;
                        await page.screenshot({ path: prefix + ".png", fullPage: true });
                        execFileSync("magick", [
                            prefix + ".png",
                            "-resize",
                            "320x",
                            prefix + "-thumb.jpg",
                        ]);
                    }
                }
        }
        console.log("Rendered " + file + " at all 19 widths, both themes and directions.");
    }
    for (const [file, item] of imageInventory) {
        item.bytes = fs.statSync("assets/images/" + file).size;
        item.format = path.extname(file).slice(1);
    }
    fs.writeFileSync(
        "documentation/image-audit.json",
        JSON.stringify([...imageInventory.values()], null, 2),
    );
    fs.writeFileSync(
        "tests/final-audit-results.json",
        JSON.stringify({ widths, heights, cases: results.length, errors, results }, null, 2),
    );
    await browser.close();
    console.log(JSON.stringify({ cases: results.length, errors }, null, 2));
    if (errors.length) process.exitCode = 1;
})().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
