const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
(async () => {
    const browser = await chromium.launch({
        executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
        headless: true,
    });
    const page = await browser.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    const files = [
        ...fs
            .readdirSync("pages")
            .filter((x) => x.endsWith(".html"))
            .map((x) => "pages/" + x),
        "documentation/index.html",
    ];
    const widths = [
        320, 360, 375, 390, 412, 420, 430, 480, 576, 640, 768, 820, 912, 1024, 1280, 1366, 1440,
        1536, 1920,
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
    for (const file of files) {
        await page.goto("http://127.0.0.1:4173/" + file);
        if ((await page.locator("h1").count()) !== 1) errors.push(file + ": H1 count");
        const count = await page.locator("main > section").count();
        if ((file === "pages/index.html" || file === "pages/index-2.html") && count !== 10)
            errors.push(file + ": section count " + count);
        for (const width of widths) {
            await page.setViewportSize({ width, height: heights[width] });
            for (const theme of ["light", "dark"]) {
                await page.evaluate(
                    (theme) => (document.documentElement.dataset.theme = theme),
                    theme,
                );
                for (const dir of ["ltr", "rtl"]) {
                    await page.evaluate((dir) => (document.documentElement.dir = dir), dir);
                    const overflow = await page.evaluate(
                        () => document.documentElement.scrollWidth > innerWidth + 1,
                    );
                    if (overflow)
                        errors.push(file + ": overflow " + width + " " + theme + " " + dir);
                }
            }
        }
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
        await page.evaluate(async () => {
            for (let y = 0; y < document.documentElement.scrollHeight; y += 600) {
                window.scrollTo(0, y);
                await new Promise((resolve) => setTimeout(resolve, 30));
            }
            window.scrollTo(0, 0);
        });
        await page.waitForTimeout(300);
        const broken = await page
            .locator("img")
            .evaluateAll((images) =>
                images.filter((x) => !x.complete || x.naturalWidth === 0).map((x) => x.src),
            );
        if (broken.length) errors.push(file + ": broken images " + broken);
        const links = await page
            .locator("a[href],link[href],script[src],img[src]")
            .evaluateAll((els) =>
                els
                    .map((x) => x.getAttribute("href") || x.getAttribute("src"))
                    .filter((x) => x && !/^(https?:|mailto:|tel:|#)/.test(x)),
            );
        for (const link of links) {
            const target = path.resolve(
                path.dirname(file),
                decodeURIComponent(link.split(/[?#]/)[0]),
            );
            if (!fs.existsSync(target)) errors.push(file + ": missing " + link);
        }
        await page.setViewportSize({ width: 1440, height: 1000 });
        await page.evaluate(() => {
            document.documentElement.dir = "ltr";
            document.documentElement.dataset.theme = "light";
        });
        fs.mkdirSync("tests/screenshots", { recursive: true });
        await page.waitForTimeout(400);
        await page.screenshot({
            path:
                "tests/screenshots/" +
                (file.startsWith("documentation/")
                    ? "documentation"
                    : path.basename(file, ".html")) +
                ".png",
            fullPage: true,
        });
        console.log(
            "Checked " + file + " at " + widths.length + " widths in light/dark and LTR/RTL.",
        );
    }
    await page.goto("http://127.0.0.1:4173/pages/index.html");
    await page.locator(".dropdown-toggle").hover();
    if (!(await page.getByRole("link", { name: "Home Page 2", exact: true }).isVisible()))
        errors.push("Home dropdown");
    if ((await page.locator(".main-nav > a").first().innerText()) !== "About")
        errors.push("Header order");
    if ((await page.locator(".dropdown-item.active").innerText()) !== "Home Page 1")
        errors.push("Home 1 active");
    await page.getByRole("link", { name: "Home Page 2", exact: true }).hover();
    if (!(await page.locator(".dropdown-menu").isVisible()))
        errors.push("Hover dropdown pointer bridge");
    await page.locator(".header-inner > .brand").hover();
    if (await page.locator(".dropdown-menu").isVisible()) errors.push("Hover dropdown close");
    await page.locator(".theme-toggle").click();
    const theme = await page.evaluate(() => document.documentElement.dataset.theme);
    await page.reload();
    if ((await page.evaluate(() => document.documentElement.dataset.theme)) !== theme)
        errors.push("Theme persistence");
    if (!(await page.locator(theme === "dark" ? ".theme-moon" : ".theme-sun").isVisible()))
        errors.push("Theme icon");
    if (await page.locator(theme === "dark" ? ".theme-sun" : ".theme-moon").isVisible())
        errors.push("Extra theme icon");
    await page.locator(".direction-toggle").click();
    const direction = await page.evaluate(() => document.documentElement.dir);
    await page.reload();
    if ((await page.evaluate(() => document.documentElement.dir)) !== direction)
        errors.push("Direction persistence");
    if (await page.locator(".footer-bottom [data-rtl]").count())
        errors.push("Unexpected footer direction control");
    await page.locator(".direction-toggle").click();
    if ((await page.evaluate(() => document.documentElement.dir)) === direction)
        errors.push("Header direction toggle");
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator(".menu-toggle").click();
    if (!(await page.locator(".main-nav").isVisible())) errors.push("Mobile menu");
    await page.locator(".dropdown-toggle").click();
    if (!(await page.getByRole("link", { name: "Home Page 2", exact: true }).isVisible()))
        errors.push("Mobile home dropdown");
    await page.keyboard.press("Escape");
    if (await page.locator(".main-nav").isVisible()) errors.push("Escape close");
    await page.goto("http://127.0.0.1:4173/pages/index-2.html");
    if ((await page.locator(".dropdown-item.active").textContent()).trim() !== "Home Page 2")
        errors.push("Home 2 active");
    await page.goto("http://127.0.0.1:4173/pages/locations.html");
    await page.locator("#location-search").fill("Riverside");
    await page.waitForTimeout(350);
    if ((await page.locator("[data-location]:visible").count()) !== 1) errors.push("Branch search");
    await page.goto("http://127.0.0.1:4173/pages/contact.html");
    await page.getByRole("button", { name: "Send enquiry" }).click();
    if (!(await page.locator('[aria-invalid="true"]').count()))
        errors.push("Contact required validation");
    await page.locator("#full-name").fill("Demo User");
    await page.locator("#email").fill("demo@example.com");
    await page.locator("#preferred-location").selectOption("Riverside");
    await page.locator("#enquiry-type").selectOption("Drop & collect");
    await page.locator("#message").fill("Please help with a family laundry load.");
    await page.locator('[name="consent"]').check();
    await page.getByRole("button", { name: "Send enquiry" }).click();
    if (!(await page.locator(".form-status").innerText()).includes("ready"))
        errors.push("Contact success");
    await page.goto("http://127.0.0.1:4173/pages/index-2.html");
    await page.locator(".accordion-button").first().click();
    await page.waitForTimeout(400);
    if (!(await page.locator(".accordion-collapse").first().isVisible())) errors.push("Accordion");
    await page.goto("http://127.0.0.1:4173/pages/coming-soon.html");
    if ((await page.locator(".countdown strong").count()) !== 4) errors.push("Countdown");
    const inventory = JSON.parse(fs.readFileSync("documentation/image-inventory.json"));
    if (new Set(inventory).size !== inventory.length) errors.push("Duplicate imagery");
    fs.writeFileSync(
        "tests/qa-results.json",
        JSON.stringify(
            {
                pages: files.length,
                widths,
                heights,
                themes: ["light", "dark"],
                directions: ["ltr", "rtl"],
                errors,
            },
            null,
            2,
        ),
    );
    await browser.close();
    if (errors.length) {
        console.error(errors);
        process.exitCode = 1;
    } else console.log("All QA checks passed.");
})();
