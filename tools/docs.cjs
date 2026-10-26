const fs = require("fs");
const sections = [
    [
        "Installation",
        "Open pages/index.html directly, or install Node.js and run npm install followed by npm run dev. Visit http://127.0.0.1:4173. The website itself uses plain HTML, Bootstrap 5, CSS and vanilla JavaScript. Node is only a development convenience.",
    ],
    [
        "Project structure",
        "Both homepages are in pages/. The root index.html redirects to pages/index.html. pages/ contains ten inner and utility pages. assets/css contains Bootstrap and four shared theme stylesheets and utility.css for standalone pages. assets/js contains Bootstrap and main.js. Images and the favicon are local. tools/build.cjs is an optional source generator; running it overwrites generated HTML. Edit the generator for durable page changes, or edit the final HTML and avoid rebuilding.",
    ],
    [
        "Colors and typography",
        "Edit the tokens at the top of assets/css/style.css. The theme uses Manrope for headings and Inter for body text via Google Fonts, with local sans-serif fallbacks. Change the font link on every HTML page and the body font-family when replacing it. Major spacing, colors and container width use CSS variables.",
    ],
    [
        "Images and credits",
        "All 43 photographs were newly selected, downloaded locally and optimized as WebP. Each content image has one unique placement. assets/images/image-manifest.txt records filename, page, section and purpose; documentation/photo-credits.json provides sources and licenses. The fabric-care SVG is an original explanatory illustration. Storefront photographs are licensed stock imagery, not photographs of the fictional branches. Preserve alt text, dimensions and loading attributes when replacing assets.",
    ],
    [
        "Logo and favicon",
        "The custom folded monogram and wordmark are local SVG assets in assets/images/brand/. Dark and light versions adapt to the theme, and favicon.svg uses the same mark. Edit tools/brand.cjs to regenerate them.",
    ],
    [
        "Dark mode",
        "The head initializes the theme before styles load. System preference selects the initial theme; the header toggle persists a manual choice in localStorage under stillwater-theme. Dark variables and targeted overrides live in assets/css/dark-mode.css.",
    ],
    [
        "RTL mode",
        'Use the RTL / LTR icon in the header, or set dir="rtl" on the html element. The header setting persists under stillwater-dir. Logical CSS properties handle spacing and border placement; rtl.css mirrors directional icons and corrects the accordion and dropdown. Content translation must be supplied separately.',
    ],
    [
        "Forms",
        'All forms validate locally and report inline errors and an explicit demo success state. No form is sent and no enquiry or email is stored. Contact integration: add your Formspree action and method="post", then replace the demo submit handler in main.js with a real submission and server-error handling. For Netlify, add the required form name and data-netlify attributes and adapt the handler. ',
    ],
    [
        "Location finder and maps",
        "Search matches the three fictional branches by name, area or postcode. Results are static data; no geolocation is used. Replace branch records with real addresses. Replace the styled map placeholder with a responsive embed after choosing your map provider and configuring real coordinates. Directions actions currently link to a branch enquiry because demo addresses are fictional.",
    ],
    [
        "Availability and countdown",
        "Machine availability is explicitly static demonstration data. Connect a live machine API before advertising current availability. The coming-soon countdown targets June 1, 2027 at 10 am Eastern time; edit data-countdown on that page. The countdown stops at zero.",
    ],
    [
        "Third-party libraries",
        "Bootstrap 5.3.3 CSS and bundle are vendored locally under the MIT license. Google Fonts supplies Manrope and Inter under the SIL Open Font License. Interface icons are original inline SVGs. Development tools include Playwright and Prettier. Keep vendor license headers in place.",
    ],
    [
        "Customization and deployment",
        "Replace fictional details, demo reviews, pricing, privacy and terms information. Replace stillwater.example in canonical URLs, Open Graph tags, structured data, robots.txt and sitemap.xml. Upload root HTML, pages/, assets/, documentation/, robots.txt and sitemap.xml to your static host. Do not upload node_modules or tests. Configure your host to serve pages/404.html for missing routes. A production form endpoint, real map are separate integrations.",
    ],
    [
        "Verification and browser support",
        "Run npm test with the preview server running. QA checks all pages at 320, 375, 390, 430, 640, 768, 820, 1024, 1280, 1440 and 1920 pixels, both themes and directions. It checks links, images, overflow, section counts and key interactions, and produces full-page screenshots. Modern Chrome, Edge, Firefox and Safari are intended targets; automated verification runs in installed Edge. No measured PageSpeed score is claimed.",
    ],
];
const credits = JSON.parse(fs.readFileSync("documentation/photo-credits.json", "utf8"));
fs.writeFileSync(
    "documentation/index.html",
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Template documentation | Stillwater Laundry</title><meta name="description" content="Installation, customization, image credits and deployment for the Stillwater HTML template."><link rel="icon" href="../assets/images/brand/favicon.svg"><link rel="stylesheet" href="../assets/css/bootstrap.min.css"><link rel="stylesheet" href="../assets/css/style.css"><link rel="stylesheet" href="../assets/css/responsive.css"><link rel="stylesheet" href="../assets/css/dark-mode.css"><link rel="stylesheet" href="../assets/css/rtl.css"></head><body><main id="main"><section class="section"><div class="container article-body"><a class="text-link" href="../pages/index.html">← Back to website</a><span class="eyebrow">STILLWATER HTML TEMPLATE</span><h1>Make it your own.</h1><p>Practical documentation for a complete neighborhood laundromat website.</p><nav aria-label="Documentation topics">${sections.map((x, i) => `<a href="#topic-${i}" style="display:block;padding:8px 0">${x[0]}</a>`).join("")}</nav>${sections.map((x, i) => `<article id="topic-${i}"><h2>${x[0]}</h2><p>${x[1].replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")}</p></article>`).join("")}<h2>Photo source links</h2><ul>${credits.map((photo) => `<li><a href="${photo.source}">${photo.author} — ${photo.file}</a> (${photo.license})</li>`).join("")}</ul><p><a href="https://www.pexels.com/license/">Pexels license</a> · <a href="https://unsplash.com/license">Unsplash license</a></p></div></section></main></body></html>`,
);
fs.writeFileSync(
    "README.md",
    `# Stillwater Laundry\n\nComplete responsive HTML template built in the existing project folder. Two distinct homepages and ten inner/utility pages. No framework or production backend.\n\n## Setup\n\nOpen pages/index.html, or run npm install, npm run dev and visit http://127.0.0.1:4173. Run npm test in a second terminal for the responsive and interaction checks.\n\n## Pages\n\nHome 1, Home 2, About, Services, Self-service details, Pricing, Locations, Blog, Article, Contact, 404, Coming Soon.\n\n## Features\n\nBootstrap 5, local assets, persistent light/dark themes, RTL, accessible navigation and FAQ, branch filtering, validated demo forms, countdown, favicon, metadata and structured data.\n\n## Structure\n\n- assets/css: vendor and shared theme styles\n- assets/js: Bootstrap and interactions\n- assets/images: 43 unique local photos, a fabric-care diagram and SVG brand assets\n- pages: both homepages and all inner pages\n- documentation: customization guide and image inventory\n- tools: development server and optional page generator\n- tests: QA script, report and screenshots\n\n## Customization\n\nRead documentation/index.html. Generated HTML is ready to edit. If using the optional generator, make changes in tools/build.cjs first: rebuilding overwrites HTML. Brand details, rates, branches, reviews and opening date are fictional. Forms demonstrate validation without sending data.\n\n## Credits\n\nBootstrap 5.3.3 (MIT), Manrope and Inter (SIL OFL), locally stored Pexels and Unsplash photography. Individual photo and license links are in documentation. SVG illustrations and icons were made for this template. The placement manifest and individual source credits accompany the new imagery.\n\n## Browser support\n\nModern Chromium, Firefox and Safari intended. Automated QA uses installed Microsoft Edge. Replace demo domain URLs, policies, images and business data before production deployment. Performance targets are design goals, not a measured score.\n`,
);
const pkg = JSON.parse(fs.readFileSync("package.json"));
Object.assign(pkg, {
    name: "stillwater-laundry-template",
    version: "1.0.0",
    private: true,
    scripts: {
        dev: "node tools/serve.cjs",
        build: "node tools/brand.cjs && node tools/build.cjs && node tools/docs.cjs && npm run format",
        test: "node tests/qa.cjs",
        format: 'prettier --write "*.html" "pages/*.html" "documentation/*.html" "assets/css/*.css" "assets/js/main.js"',
    },
});
fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2));
fs.writeFileSync(".gitignore", "node_modules/\ntests/screenshots/\n");
