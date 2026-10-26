const { chromium } = require("playwright");
const fs = require("fs");
(async () => {
    const browser = await chromium.launch({
        executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    });
    const page = await browser.newPage({
        viewport: { width: 320, height: 568 },
        reducedMotion: "reduce",
    });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    for (const file of fs.readdirSync("pages").filter((f) => f.endsWith(".html"))) {
        await page.goto("http://127.0.0.1:4173/pages/" + file);
        if (await page.locator(".menu-toggle").count()) {
            await page.locator(".menu-toggle").click();
            await page.locator(".dropdown-toggle").click();
            if (!(await page.getByRole("link", { name: "Home Page 2", exact: true }).isVisible()))
                errors.push(file + ": dropdown");
            await page.keyboard.press("Escape");
            if (await page.locator(".main-nav").isVisible()) errors.push(file + ": escape");
        }
        for (const form of await page.locator("[data-demo-form]").all()) {
            await form.locator("button[type=submit],button:not([type])").last().click();
            if (!(await form.locator("[aria-invalid=true]").count()))
                errors.push(file + ": empty form validation");
            for (const input of await form.locator("input").all()) {
                const type = await input.getAttribute("type");
                if (type === "checkbox") {
                    await input.check();
                    continue;
                }
                await input.fill(
                    type === "email"
                        ? "qa@example.com"
                        : type === "tel"
                          ? "2025550148"
                          : "QA Visitor",
                );
            }
            for (const trigger of await form.locator(".select-trigger").all()) {
                await trigger.click();
                await page.keyboard.press("ArrowDown");
                await page.keyboard.press("Enter");
                if (!(await trigger.getAttribute("aria-describedby")))
                    errors.push(file + ": select errors not announced");
            }
            for (const textarea of await form.locator("textarea").all())
                await textarea.fill("Please confirm laundry collection details.");
            await form.locator("button[type=submit],button:not([type])").last().click();
            if (await form.locator("[aria-invalid=true]").count())
                errors.push(file + ": valid submission");
        }
        for (const button of await page.locator(".accordion-button").all()) {
            await button.click();
            await page.waitForTimeout(50);
            if ((await button.getAttribute("aria-expanded")) !== "true")
                errors.push(file + ": accordion");
            await button.click();
        }
        for (const summary of await page.locator("details summary").all()) {
            await summary.focus();
            await page.keyboard.press("Enter");
            if (!(await summary.evaluate((e) => e.parentNode.open)))
                errors.push(file + ": details keyboard");
            await page.keyboard.press("Enter");
        }
    }
    for (let article = 0; article < 7; article++) {
        await page.goto("http://127.0.0.1:4173/pages/blog-details.html?article=" + article);
        if ((await page.locator("h1").innerText()) === "Give every load the care it deserves.")
            errors.push("Article " + article + " unresolved");
    }
    await page.goto("http://127.0.0.1:4173/");
    await page.waitForURL("**/pages/index.html");
    if (!page.url().endsWith("/pages/index.html")) errors.push("Root redirect");
    await browser.close();
    fs.writeFileSync("tests/interaction-results.json", JSON.stringify({ errors }, null, 2));
    console.log({ errors });
    if (errors.length) process.exitCode = 1;
})().catch((e) => {
    console.error(e);
    process.exitCode = 1;
});
