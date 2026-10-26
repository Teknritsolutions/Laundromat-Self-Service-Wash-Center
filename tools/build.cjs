const fs = require("fs");
const path = require("path");
const write = (p, s) => {
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, s);
};
const icon = (name = "washer") =>
    `<svg class="icon" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">${name === "washer" ? '<rect x="5" y="3" width="22" height="26" rx="4"/><path d="M5 10h22M9 7h3m9 0h2"/><circle cx="16" cy="19" r="6"/><path d="M10 19q3-3 6 0t6 0"/>' : name === "arrow" ? '<path d="M5 16h22M19 8l8 8-8 8"/>' : name === "clock" ? '<circle cx="16" cy="16" r="12"/><path d="M16 8v9l6 3"/>' : name === "pin" ? '<path d="M25 13c0 8-9 16-9 16S7 21 7 13a9 9 0 1 1 18 0Z"/><circle cx="16" cy="13" r="3"/>' : '<path d="m7 16 6 6L26 8"/>'}</svg>`;
const branches = [
    [
        "North Quarter",
        "18 Example Lane",
        "46001",
        "6:00 am – 10:00 pm",
        "Step-free access · Free parking",
    ],
    ["Riverside", "42 Sample Street", "46002", "6:00 am – 11:00 pm", "Extra-large washers · Wi-Fi"],
    [
        "West Park",
        "7 Demo Avenue",
        "46003",
        "7:00 am – 10:00 pm",
        "Family seating · Drop-off counter",
    ],
];
let prefix = "",
    used = [];
const link = (p) => (prefix && p.startsWith("pages/") ? p.slice(6) : prefix + p);
const btn = (text, p, secondary = false) =>
    `<a class="btn ${secondary ? "btn-secondary" : "btn-primary"}" href="${link(p)}">${text} ${icon("arrow")}</a>`;
const photo = (name, alt, hero = false) => {
    return `<img src="${prefix}assets/images/${name}" alt="${alt}" width="1500" height="1125" ${hero ? 'fetchpriority="high"' : 'loading="lazy"'}>`;
};
const photography = {
    "home-1/clean-machine-row": "home-1/clean-steel-machine-row.webp",
    "home-2/big-load-washers": "home-2/open-laundromat-interior.webp",
    "home-2/self-service-interior": "home-2/self-service-machine-detail.webp",
    "home-2/drop-collect-folds": "home-2/professionally-folded-shirts.webp",
    "home-2/neighborhood-storefront": "home-2/neighborhood-laundry-exterior.webp",
    "about/center-introduction": "about/bright-laundry-interior.webp",
    "about/our-story": "about/customer-laundry-visit.webp",
    "services/services-intro": "services/commercial-laundry-room.webp",
    "services/staff-folded-laundry": "services/freshly-folded-textiles.webp",
    "services/self-service-guide": "services/laundry-bag-and-washer.webp",
    "locations/branch-0": "locations/north-quarter-laundry.webp",
    "locations/branch-1": "locations/riverside-laundry.webp",
    "locations/branch-2": "locations/west-park-laundrette.webp",
    "blog/featured-bedding": "blog/weekend-bedding-care.webp",
    "blog/guide-0": "blog/bedding-ready-for-washing.webp",
    "blog/guide-1": "blog/choosing-load-capacity.webp",
    "blog/guide-2": "blog/drying-fabric-with-care.webp",
    "blog/guide-3": "blog/fabric-care-symbols.svg",
    "blog/guide-4": "blog/sorted-delicate-shirts.webp",
    "blog/guide-5": "blog/clean-white-towel-stack.webp",
    "blog/article-fabric-care": "blog/everyday-fabric-care.webp",
    "blog/related-0": "blog/fabric-texture-detail.webp",
    "blog/related-1": "blog/cozy-folded-sweaters.webp",
    "blog/related-2": "blog/soft-textile-closeup.webp",
};
const credits = JSON.parse(fs.readFileSync("documentation/photo-credits.json", "utf8"));
if (!Array.isArray(credits) || credits.some((item) => !item.file || !item.source)) {
    throw new Error("Photo credits must contain a flat list of source records.");
}
const placements = [];
const pic = (name, alt, type = 0, hero = false) => {
    const image = photography[name];
    if (!image) throw new Error("Missing image assignment: " + name);
    return photo(image, credits.find((item) => item.file === image)?.purpose || alt, hero);
};
const refine = require("./refine.cjs");
const brand = () =>
    '<img class="logo-dark" src="' +
    prefix +
    'assets/images/brand/logo-dark.svg" width="280" height="66" alt="Stillwater Laundry &amp; Wash Center"><img class="logo-light" src="' +
    prefix +
    'assets/images/brand/logo-light.svg" width="280" height="66" alt="Stillwater Laundry &amp; Wash Center">';
const section = (name, content, cls = "") =>
    `\n<!-- ========================= ${name} ========================= -->\n<section class="section ${cls}" aria-label="${name}"><div class="container">${content}</div></section>`;
const heading = (eyebrow, title, text = "") =>
    `<div class="section-header"><span class="eyebrow">${eyebrow}</span><h2>${title}</h2>${text ? `<p>${text}</p>` : ""}</div>`;
const cta = (
    title = "Make laundry day the easy part of your week.",
    text = "Fresh clothes. A little more time for everything else.",
    a = "Find a location",
    p = "pages/locations.html",
) =>
    section(
        "Visit Stillwater",
        `<div class="cta-panel"><div><span class="eyebrow">YOUR NEXT FRESH START</span><h2>${title}</h2><p>${text}</p></div><div class="actions">${btn(a, p)}${btn("View pricing", "pages/pricing.html", true)}</div></div>`,
    );
const split = (ey, title, text, img, type = 0, reverse = false, extra = "") =>
    section(
        title,
        `<div class="split ${reverse ? "reverse" : ""}"><div class="image-frame">${pic(img, title, type)}</div><div><span class="eyebrow">${ey}</span><h2>${title}</h2><p>${text}</p>${extra}</div></div>`,
    );
const cards = (items) =>
    `<div class="grid cards">${items.map((x, i) => `<article class="card"><span class="card-icon">${icon(x[3] || "washer")}</span><h3>${x[0]}</h3><p>${x[1]}</p>${x[2] ? `<a class="text-link" href="${link(x[2])}">Explore service ${icon("arrow")}</a>` : ""}</article>`).join("")}</div>`;
const services = () =>
    section(
        "Core services",
        heading(
            "A BETTER LAUNDRY ROUTINE",
            "Everything your laundry day needs",
            "Do it yourself, or leave the folding to us.",
        ) +
            cards([
                [
                    "Self-service washing",
                    "From your weekly wash to the whole family’s bedding. Pick a machine that gives your laundry room to move.",
                    "pages/service-details.html",
                ],
                [
                    "Fast dryer use",
                    "Spacious drums and adjustable heat help you finish your load without the long wait.",
                    "pages/services.html#dryers",
                    "clock",
                ],
                [
                    "Drop & collect",
                    "Bring us your everyday laundry. We wash, dry and neatly fold it, ready for your next collection.",
                    "pages/services.html#drop-off",
                    "check",
                ],
            ]),
    );
const steps = (title = "Four small steps. One fresh start.") =>
    section(
        "Laundry process",
        heading("HOW IT WORKS", title) +
            `<div class="steps">${[
                [
                    "Choose your machine",
                    "Match the drum to your load. Leave room for fabrics to move.",
                ],
                ["Load & wash", "Check labels, add detergent and choose the right cycle."],
                [
                    "Dry your laundry",
                    "Select a suitable heat setting and check before adding time.",
                ],
                ["Fold & go", "Use our spacious folding counters, then get on with your day."],
            ]
                .map(
                    (x, i) =>
                        `<article><span class="step-number">0${i + 1}</span><h3>${x[0]}</h3><p>${x[1]}</p></article>`,
                )
                .join(
                    "",
                )}</div><p class="small-note">Prefer a helping hand? Our drop & collect team takes care of the whole process.</p>`,
    );
const rates = [
    ["Standard washer", "8 kg · Everyday clothing", "$5.00", "per cycle"],
    ["Large washer", "14 kg · Family loads", "$8.00", "per cycle"],
    ["Extra-large washer", "20 kg · Bedding & bulky loads", "$11.00", "per cycle"],
];
const rateboard = (
    title = "Clear prices. Fresh possibilities.",
    rows = [
        ...rates,
        ["Dryer cycle", "Standard drum · 20 minutes", "$3.00", "per cycle"],
        ["Drop & collect", "Washed, dried & folded · 3 kg minimum", "$3.50", "per kg"],
    ],
) =>
    section(
        "Rate board",
        heading("NO SURPRISES", title) +
            `<div class="rate-board">${rows.map((x) => `<div class="rate-row"><div><h3>${x[0]}</h3><p>${x[1]}</p></div><div class="rate"><strong>${x[2]}</strong><span>${x[3]}</span></div></div>`).join("")}</div><div class="section-bottom"><p class="small-note">Illustrative demo rates. Detergent sold separately for self-service washes.</p><a class="text-link" href="${link("pages/pricing.html")}">See full pricing ${icon("arrow")}</a></div>`,
    );
const locations = (full = false) =>
    section(
        "Branch locations",
        heading(
            "CLOSE TO HOME",
            "A fresh start, around the corner.",
            "Three neighborhood centers. The same care at every one.",
        ) +
            `<div class="grid cards location-grid">${branches.map((b, i) => `<article class="card location-card" data-location="${b.join(" ").toLowerCase()}" id="branch-${i}">${full ? `<div class="card-image">${pic("locations/branch-" + i, b[0] + " illustrative storefront", i * 3 + 5)}</div>` : icon("pin")}<div class="card-body"><span class="eyebrow">${["NORTH SIDE", "BY THE RIVER", "WEST SIDE"][i]}</span><h3>${b[0]}</h3><p>${b[1]}, Example City ${b[2]}</p><p class="hours">${icon("clock")} ${b[3]}</p><p>${b[4]}</p>${full ? '<a href="tel:+12025550148">(202) 555-0148</a>' : ""}<a class="text-link" href="${link(full ? "pages/contact.html?location=" + encodeURIComponent(b[0]) : "pages/locations.html#branch-" + i)}">${full ? "Ask for directions" : "View location"} ${icon("arrow")}</a></div></article>`).join("")}</div><p class="small-note">All branches and addresses are fictional template demonstrations.</p><p id="search-status" class="small-note" aria-live="polite"></p>`,
    );
const faq = (variant = "general") =>
    section(
        "Frequently asked questions",
        `<div class="faq-layout">${heading("GOOD TO KNOW", variant === "general" ? "A few things before your first visit." : "Your questions, sorted.", "A little preparation makes laundry day easier.")}<div class="accordion" id="faq">${[
            [
                "Do I need to bring detergent?",
                "Bring your usual detergent, or purchase a single-wash pack at the counter. Detergent is included with drop & collect.",
            ],
            [
                "How long does a wash take?",
                "Most standard cycles take 30–40 minutes. The machine displays the selected cycle time before you start.",
            ],
            [
                "Which machine size should I choose?",
                "Use 8 kg for everyday loads, 14 kg for family washes and 20 kg for bulky bedding. Never fill above the marked line.",
            ],
            [
                "How is drop & collect priced?",
                "Everyday laundry is $3.50 per kg with a 3 kg minimum. We weigh your load and confirm the total before accepting it.",
            ],
            [
                "Can I wash duvets and delicate fabrics?",
                "Check the care label first. Washable duvets need room to tumble; dry-clean-only items cannot be processed here. Ask staff about delicate loads.",
            ],
            [
                "What payment methods are accepted?",
                "Our demo centers accept contactless cards and mobile wallets. Staff can explain the machine payment terminal when you arrive.",
            ],
        ]
            .map(
                (x, i) =>
                    `<div class="accordion-item"><h3 class="accordion-header"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#answer-${i}" aria-expanded="false" aria-controls="answer-${i}">${x[0]}</button></h3><div id="answer-${i}" class="accordion-collapse collapse" data-bs-parent="#faq"><div class="accordion-body">${x[1]}</div></div></div>`,
            )
            .join("")}</div></div>`,
    );
const values = (title = "Thoughtful details. Everyday comfort.") =>
    section(
        "Care standards",
        heading("THE STILLWATER STANDARD", title) +
            `<div class="value-list">${[
                [
                    "01",
                    "Clean machines",
                    "Drums, seals and touchpoints checked throughout the day.",
                ],
                [
                    "02",
                    "Space for bigger loads",
                    "Three washer capacities, with clear guidance on each machine.",
                ],
                [
                    "03",
                    "A comfortable pause",
                    "Bright seating, folding counters and complimentary Wi-Fi.",
                ],
                [
                    "04",
                    "Care without guesswork",
                    "Visible prices, simple controls and staff ready to help.",
                ],
            ]
                .map((x) => `<div><span>${x[0]}</span><h3>${x[1]}</h3><p>${x[2]}</p></div>`)
                .join("")}</div>`,
    );
const testimonials = (featured = false) =>
    section(
        "Customer stories",
        heading(
            "NEIGHBORHOOD NOTES",
            featured ? "Good service is in the small things." : "Laundry done. Week made.",
        ) +
            `<div class="${featured ? "quote-feature" : "grid cards"}">${[
                [
                    "“The big washers made our bedding day so much easier. Everything was clean, and the prices were right on the machines.”",
                    "Alex M.",
                    "North Quarter",
                ],
                [
                    "“Dropped off a busy week’s laundry and picked it up beautifully folded. Such a useful part of my routine.”",
                    "Jamie R.",
                    "Riverside",
                ],
                [
                    "“Bright, tidy and easy to use. I could get two loads done together and still make it home before lunch.”",
                    "Sam K.",
                    "West Park",
                ],
            ]
                .map(
                    (x) =>
                        `<figure class="card review"><span class="stars" aria-label="5 out of 5 stars">★★★★★</span><blockquote>${x[0]}</blockquote><figcaption><strong>${x[1]}</strong><span>${x[2]} · Illustrative review</span></figcaption></figure>`,
                )
                .join("")}</div>`,
    );
const hero = (title, desc, name = null, type = 0) =>
    section(
        "Page introduction",
        `<nav aria-label="Breadcrumb" class="breadcrumb"><a href="${link("pages/index.html")}">Home</a><span>/</span><span>${title.includes("Pricing") ? "Pricing" : currentLabel}</span></nav><div class="inner-hero ${name ? "split" : ""}"><div><span class="eyebrow">STILLWATER LAUNDRY</span><h1>${title}</h1><p>${desc}</p></div>${name ? `<div class="image-frame">${pic(name, title, type, true)}</div>` : ""}</div>`,
        "inner-intro",
    );
let currentLabel = "";
const newsletter = () =>
    section(
        "Stay in the loop",
        `<div class="newsletter"><div><span class="eyebrow">A LITTLE FRESH IN YOUR INBOX</span><h2>Useful tips. Local updates.</h2><p>Occasional laundry advice and news from your neighborhood center.</p></div><form data-demo-form data-success="Demo complete. Your email has not been stored or submitted."><label for="newsletter-email">Email address</label><div class="input-action"><input id="newsletter-email" name="email" type="email" class="form-control" required autocomplete="email"><button class="btn btn-primary" type="submit">Keep me posted</button></div><p class="form-status" role="status"></p><p class="small-note">Template demonstration. Connect an email service to accept subscribers.</p></form></div>`,
    );
const map = () =>
    section(
        "Map",
        heading("PLAN YOUR VISIT", "Find us in your neighborhood.") +
            `<div class="map-placeholder"><svg viewBox="0 0 1200 330" aria-hidden="true"><rect width="1200" height="330" fill="currentColor" opacity=".05"/><g stroke="currentColor" opacity=".12" stroke-width="18"><path d="M0 70h1200M0 230h1200M160 0v330M500 0v330M950 0v330M0 0l1200 330"/></g></svg><div>${icon("pin")}<h3>Your map belongs here</h3><p>Demo addresses are fictional. Add your real branch map before publishing.</p><a class="text-link" href="${link("pages/contact.html")}">Get branch assistance ${icon("arrow")}</a></div></div>`,
    );
const machines = () =>
    section(
        "Machine capacities",
        heading("ROOM FOR EVERY LOAD", "Choose the drum that fits your day.") +
            cards(
                rates.map((r, i) => [
                    r[0],
                    r[1] +
                        ". " +
                        [
                            "Ideal for a week of personal laundry.",
                            "More space for towels and family clothing.",
                            "Room for washable duvets and bulky blankets.",
                        ][i],
                    "pages/service-details.html",
                ]),
            ),
    );
const field = (label, name, type = "text", required = true) =>
    `<div class="field"><label for="${name}">${label}</label><input class="form-control" id="${name}" name="${name}" type="${type}" ${required ? "required" : ""} ${type === "password" ? 'minlength="8" autocomplete="new-password"' : type === "email" ? 'autocomplete="email"' : ""}><span class="field-error" id="${name}-error"></span></div>`;
function header(active, file) {
    return `<a class="skip-link" href="#main">Skip to content</a><header class="site-header"><div class="container header-inner"><a class="brand" href="${link("pages/index.html")}">${brand()}</a><nav class="main-nav" id="main-nav" aria-label="Main navigation"><div class="dropdown"><button class="nav-link dropdown-toggle ${active === "Home" ? "active" : ""}" data-bs-toggle="dropdown" aria-expanded="false">Home</button><ul class="dropdown-menu"><li><a class="dropdown-item ${file === "pages/index.html" ? "active" : ""}" ${file === "pages/index.html" ? 'aria-current="page"' : ""} href="${link("pages/index.html")}">Home Page 1</a></li><li><a class="dropdown-item ${file === "pages/index-2.html" ? "active" : ""}" ${file === "pages/index-2.html" ? 'aria-current="page"' : ""} href="${link("pages/index-2.html")}">Home Page 2</a></li></ul></div>${["About", "Services", "Pricing", "Locations", "Blog", "Contact"].map((x) => `<a class="nav-link ${active === x ? "active" : ""}" ${active === x ? 'aria-current="page"' : ""} href="${link("pages/" + x.toLowerCase() + ".html")}">${x}</a>`).join("")}</nav><div class="header-actions"><button class="icon-button theme-toggle" aria-label="Switch color theme"><svg class="icon theme-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></svg><svg class="icon theme-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M20 15.5A8 8 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z"/></svg></button><button class="icon-button direction-toggle" data-rtl aria-label="Switch to right-to-left layout"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M4 7h16m-4-4 4 4-4 4M20 17H4m4-4-4 4 4 4"/></svg><span class="direction-label">RTL</span></button><a class="btn btn-primary header-cta" href="${link("pages/locations.html")}">Find a center ${icon("pin")}</a><button class="icon-button menu-toggle" aria-label="Open navigation" aria-controls="main-nav" aria-expanded="false"><svg class="icon" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg></button></div></div></header>`;
}
function utilityChrome(file) {
    const controls = header("", file)
        .match(/<button class="icon-button (?:theme-toggle|direction-toggle)"[\s\S]*?<\/button>/g)
        .join("");
    return (
        '<div class="utility-top container"><div class="utility-controls">' +
        controls +
        "</div></div>"
    );
}
function footer() {
    return `<footer class="site-footer"><div class="container"><div class="footer-grid"><div><a class="brand" href="${link("pages/index.html")}">${brand()}</a><p>A cleaner routine. A calmer day.<br>Your neighborhood laundry, thoughtfully done.</p><div class="social-links"><a href="${link("pages/contact.html")}" aria-label="Ask about our Instagram" title="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg></a><a href="${link("pages/contact.html")}" aria-label="Ask about our Facebook" title="Facebook"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 22v-9h3l.5-4H14V7c0-1.2.4-2 2-2h2V1.5A25 25 0 0 0 15 1c-3 0-5 1.8-5 5v3H7v4h3v9h4Z"/></svg></a><a href="${link("pages/contact.html")}" aria-label="Ask about our X profile" title="X"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="M4 3h4l12 18h-4L4 3ZM20 3l-7 8M4 21l7-8"/></svg></a><a href="${link("pages/contact.html")}" aria-label="Ask about our YouTube channel" title="YouTube"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="4"/><path d="m10 9 6 3-6 3V9Z" fill="currentColor" stroke="none"/></svg></a></div></div><div><h3>Explore</h3>${["Home", "About", "Services", "Pricing", "Locations"].map((x) => `<a href="${link(x === "Home" ? "pages/index.html" : "pages/" + x.toLowerCase() + ".html")}">${x}</a>`).join("")}</div><div><h3>Laundry your way</h3>${["Self-service washing", "Dryer use", "Drop & collect", "Wash, dry & fold"].map((x, i) => `<a href="${link(i === 0 ? "pages/service-details.html" : "pages/services.html" + (i === 1 ? "#dryers" : "#drop-off"))}">${x}</a>`).join("")}</div><div><h3>Say hello</h3><a href="tel:+12025550148">(202) 555-0148</a><a href="mailto:hello@stillwater.example">hello@stillwater.example</a><p>Open seven days a week<br>Hours vary by center.</p><a href="${link("pages/contact.html")}">Contact the team ↗</a></div></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} Stillwater Laundry. Fictional demo business.</span><div><button class="footer-link" data-policy="privacy">Privacy</button><button class="footer-link" data-policy="terms">Terms</button></div></div></div></footer><dialog id="policy-dialog"><button class="icon-button dialog-close" aria-label="Close dialog">×</button><h2 id="policy-title"></h2><p id="policy-copy"></p></dialog>`;
}
function page(file, title, desc, active, body) {
    prefix = file.includes("/") ? "../" : "";
    currentLabel = active;
    const standalone = /[/](404|coming-soon)[.]html$/.test(file);
    let content = refine(file, body(), {
        section,
        heading,
        btn,
        photo,
        icon,
        link,
        branches,
        rates,
    });
    for (const match of content.matchAll(/<section\b[\s\S]*?<\/section>/g)) {
        const sectionName = /aria-label="([^"]+)"/.exec(match[0])?.[1] || "Content";
        for (const image of match[0].matchAll(/<img[^>]+src="[^"]*assets\/images\/([^"]+)"/g)) {
            used.push(image[1]);
            placements.push({
                file: image[1],
                page: file,
                section: sectionName,
                purpose:
                    credits.find((item) => item.file === image[1])?.purpose ||
                    "Original fabric-care symbol diagram",
            });
        }
    }
    write(
        file,
        `<!doctype html><html lang="en" dir="ltr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} | Stillwater Laundry</title><meta name="description" content="${desc}"><link rel="canonical" href="https://stillwater.example/${file}"><meta property="og:title" content="${title} | Stillwater Laundry"><meta property="og:description" content="${desc}"><meta property="og:type" content="website"><meta property="og:url" content="https://stillwater.example/${file}"><link rel="icon" type="image/svg+xml" href="${prefix}assets/images/brand/favicon.svg"><script>try{const t=localStorage.getItem('stillwater-theme');document.documentElement.dataset.theme=t||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.dir=localStorage.getItem('stillwater-dir')||'ltr'}catch(e){}</script><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet"><link rel="stylesheet" href="${prefix}assets/css/bootstrap.min.css"><link rel="stylesheet" href="${prefix}assets/css/style.css"><link rel="stylesheet" href="${prefix}assets/css/responsive.css"><link rel="stylesheet" href="${prefix}assets/css/dark-mode.css"><link rel="stylesheet" href="${prefix}assets/css/rtl.css">${standalone ? `<link rel="stylesheet" href="${prefix}assets/css/utility.css">` : ""}${active === "Home" ? '<script type="application/ld+json">' + JSON.stringify({ "@context": "https://schema.org", "@type": "LocalBusiness", name: "Stillwater Laundry — fictional template demonstration", url: "https://stillwater.example", telephone: "+1-202-555-0148", description: "Fictional laundromat template. Replace with real business details before publishing.", priceRange: "$5–$11" }) + "</script>" : ""}</head><body class="page-${path.basename(file, ".html")}${standalone ? " standalone-page" : ""}">${standalone ? utilityChrome(file) : header(active, file)}<main id="main">${content}</main>${standalone ? "" : footer()}<script src="${prefix}assets/js/bootstrap.bundle.min.js" defer></script><script src="${prefix}assets/js/main.js" defer></script></body></html>`,
    );
}
page(
    "pages/index.html",
    "Fresh laundry, less waiting",
    "Modern machines, clear prices and helpful neighborhood laundry care.",
    "Home",
    () =>
        [
            section(
                "Home hero",
                `<div class="hero-grid"><div class="hero-copy"><span class="eyebrow"><span class="status-dot"></span> FRESH LAUNDRY, LESS WAITING</span><h1>Clean clothes.<br>Clear prices.<br><span>A lighter day.</span></h1><p>Modern machines. A welcoming space. And a little more time for you. Laundry day feels different here.</p><div class="actions">${btn("Find a location", "pages/locations.html")}${btn("View services", "pages/services.html", true)}</div><div class="trust-row"><span>${icon("clock")} Open 7 days</span><span>${icon()} Modern machines</span><span>${icon("check")} Drop & collect</span></div></div><div class="hero-image">${photo("home-1/modern-laundromat-hero.webp", "Row of washing machines inside a neighborhood laundromat", true)}<div class="image-caption"><span>LESS CHORE. MORE LIFE.</span><span>Your fresh start is here.</span></div></div></div>`,
                "home-hero",
            ),
            section(
                "Machine availability",
                `<div class="availability"><div><span class="eyebrow">NORTH QUARTER CENTER</span><h2>A good time to drop in.</h2><p class="small-note">Static demo availability · Not connected to machines</p></div><div class="availability-numbers" data-availability>${[
                    ["08", "Washers available"],
                    ["12", "Dryers available"],
                    ["03", "Large-load machines"],
                    ["~0", "Minutes waiting"],
                ]
                    .map((x) => `<div><strong>${x[0]}</strong><span>${x[1]}</span></div>`)
                    .join("")}</div></div>`,
                "availability-section",
            ),
            services(),
            split(
                "BUILT AROUND YOUR DAY",
                "A little care makes a big difference.",
                "Clean spaces, helpful people and machines that work as hard as you do. We’ve thought about the small details so you can focus on the rest of your day.",
                "home-1/clean-machine-row",
                0,
                false,
                '<ul class="check-list"><li>High-capacity washers for the whole week</li><li>Cleaned and checked throughout the day</li><li>Upfront pricing on every machine</li><li>Convenient hours and easy controls</li></ul>',
            ),
            steps(),
            rateboard(),
            section(
                "Laundry made easier",
                `<div class="editorial"><div><span class="eyebrow">MORE ROOM. LESS RUSH.</span><h2>Room for the big loads.<br>Space to slow down.</h2><p>Wash the duvet. Catch up on a chapter. Fold at your own pace. Laundry fits comfortably into your day.</p>${btn("Meet your wash center", "pages/about.html", true)}</div><div class="image-frame">${photo("home-1/fresh-folded-knitwear.webp", "Fresh folded knitwear ready to put away")}</div><div class="editorial-note"><strong>The practical extras</strong><p>Efficient dryers · Detergent at the counter · Comfortable seating · Contactless payment</p></div></div>`,
            ),
            locations(),
            testimonials(),
            cta(),
        ].join(""),
);
page(
    "pages/index-2.html",
    "Big loads. More time back.",
    "Efficient self-service washing and carefully folded drop-off laundry.",
    "Home",
    () =>
        [
            section(
                "Alternative hero",
                `<div class="alt-hero"><div><span class="eyebrow">YOUR WEEK, A LITTLE LIGHTER</span><h1>Big loads.<br>Fast cycles.<br>More time back.</h1><p>Get the family wash done together, or leave your bag with us. We make space for the things you would rather be doing.</p><div class="actions">${btn("Check services", "pages/services.html")}${btn("See pricing", "pages/pricing.html", true)}</div></div><div class="image-frame">${pic("home-2/big-load-washers", "Illustration of spacious commercial washing machines", 3, true)}</div></div>`,
                "alt-intro",
            ),
            section(
                "Quick values",
                `<div class="quick-values">${["Open daily", "Multiple machine sizes", "Fast drying", "Drop-off available"].map((x, i) => `<div>${icon(i === 0 ? "clock" : i === 3 ? "check" : "washer")}<strong>${x}</strong></div>`).join("")}</div>`,
                "compact",
            ),
            machines(),
            split(
                "YOUR SELF-SERVICE VISIT",
                "Settle in. Let the machines do their thing.",
                "Arrive with your load, choose a drum and pay at the machine. While the cycle runs, our seating and folding space are yours to use. Staff can help you get started.",
                "home-2/self-service-interior",
                6,
                true,
                btn("See how it works", "pages/service-details.html"),
            ),
            split(
                "DROP IT. WE’LL DO THE REST.",
                "Freshly folded, ready for your week.",
                "We keep every customer’s laundry separate, follow agreed care instructions and pack your finished load neatly. Standard collection is within 24–48 hours, confirmed at drop-off.",
                "home-2/drop-collect-folds",
                4,
                false,
                '<p class="small-note">Drop it → We wash & dry → Professionally folded → Ready to collect</p>' +
                    btn("Ask about drop-off", "pages/contact.html"),
            ),
            rateboard("Your laundry. One simple rate board."),
            values("Clean facilities. Considered fabric care."),
            split(
                "LOCAL AND EASY",
                "A neighborhood stop worth making.",
                "With seven-day opening, accessible entrances and useful parking options, your wash center is never far from the day’s other errands. Check each branch’s facilities before visiting.",
                "home-2/neighborhood-storefront",
                2,
                true,
                btn("Compare locations", "pages/locations.html"),
            ),
            faq(),
            cta(
                "Your next wash is closer than you think.",
                "Find a center that fits your routine.",
                "Find a wash center",
                "pages/locations.html",
            ),
        ].join(""),
);
page(
    "pages/about.html",
    "About our neighborhood wash centers",
    "Get to know the care, cleanliness and clear pricing behind Stillwater.",
    "About",
    () =>
        [
            hero(
                "Making laundry simpler, cleaner and more convenient.",
                "Thoughtful spaces for a necessary part of life.",
                "about/center-introduction",
                9,
            ),
            split(
                "OUR STORY",
                "Made for real neighborhood routines.",
                "Stillwater began with a straightforward idea: everyday laundry deserves a pleasant place. Our fictional brand brings dependable equipment, clear guidance and caring people together under one roof.",
                "about/our-story",
                7,
                true,
            ),
            values("Our promise: clean, convenient, caring and clear."),
            section(
                "Center differences",
                heading("PRACTICAL BY DESIGN", "The details that change your visit.") +
                    '<div class="stats-row"><div><strong>3</strong><span>Washer capacities</span></div><div><strong>7</strong><span>Days open each week</span></div><div><strong>20 kg</strong><span>Largest wash capacity</span></div><div><strong>100%</strong><span>Prices shown upfront</span></div></div>',
            ),
            testimonials(true),
            cta(
                "Ready for an easier laundry day?",
                "Come in for the machines. Come back for the care.",
            ),
        ].join(""),
);
page(
    "pages/services.html",
    "Laundry services for every routine",
    "Self-service washers, spacious dryers and staff-assisted wash, dry and fold.",
    "Services",
    () =>
        [
            hero(
                "Your laundry. Your way.",
                "A quick weekly wash or a little help with a full basket—we have a service that fits.",
                "services/services-intro",
                12,
            ),
            section(
                "Main laundry services",
                heading("CHOOSE YOUR ROUTINE", "Three ways to leave feeling fresh.") +
                    `<div class="service-rows">${[
                        [
                            "Self-service washing",
                            "Choose from 8, 14 and 20 kg machines. Wash everyday fabrics on the cycle their care labels recommend.",
                            "washing",
                            "pages/service-details.html",
                        ],
                        [
                            "Fast dryer use",
                            "Adjust the heat to suit your fabric. A standard 20-minute cycle starts at $3, with extra time available.",
                            "dryers",
                            "pages/pricing.html",
                        ],
                        [
                            "Drop & collect",
                            "Leave your everyday laundry with our team. We weigh it, agree your care preferences and confirm collection.",
                            "drop-off",
                            "pages/contact.html",
                        ],
                    ]
                        .map(
                            (x, i) =>
                                `<article class="service-row" id="${x[2]}"><span class="step-number">0${i + 1}</span><h3>${x[0]}</h3><p>${x[1]}</p><a class="text-link" href="${link(x[3])}">Learn more ${icon("arrow")}</a></article>`,
                        )
                        .join("")}</div>`,
            ),
            machines(),
            split(
                "STAFF-ASSISTED CARE",
                "Wash, dry, fold. All taken care of.",
                "A busy week is easier with one less task. Your load is washed separately, dried at an appropriate setting and folded for collection. Please tell us about stains, sensitivities and special care at drop-off.",
                "services/staff-folded-laundry",
                10,
                true,
                btn("Talk to our team", "pages/contact.html"),
            ),
            faq("service"),
            cta(
                "Not sure which service fits your load?",
                "Tell us what is in your basket and we will help you choose.",
                "Contact us",
                "pages/contact.html",
            ),
        ].join(""),
);
page(
    "pages/service-details.html",
    "Self-service washing",
    "A practical guide to capacities, wash cycles and your first Stillwater visit.",
    "Services",
    () =>
        [
            hero(
                "A better way to do your own laundry.",
                "Modern self-service washing, with room for your whole routine.",
            ),
            split(
                "SELF-SERVICE WASHING",
                "You choose the cycle. We make it simple.",
                "Our front-loading washers have clear capacity labels and easy payment controls. Sort by color and care requirements, check pockets, and leave enough drum space for your fabrics to circulate.",
                "services/self-service-guide",
                15,
                false,
                btn("Find your machine", "pages/locations.html"),
            ),
            steps("From full basket to fresh clothes."),
            machines(),
            section(
                "Service pricing and FAQs",
                rateboard("Self-service wash rates.", rates)
                    .replace(/^.*?<div class="container">/s, "")
                    .replace(/<\/div><\/section>$/, "") +
                    '<div style="margin-top:64px">' +
                    faq("washing")
                        .replace(/^.*?<div class="container">/s, "")
                        .replace(/<\/div><\/section>$/, "") +
                    "</div>",
            ),
            cta(
                "Finish the job, or let us take over.",
                "Explore dryer use and drop & collect on our services page.",
                "Related services",
                "pages/services.html",
            ),
        ].join(""),
);
page(
    "pages/pricing.html",
    "Simple laundry pricing",
    "See per-cycle washer and dryer rates plus weight-based drop-off pricing.",
    "Pricing",
    () =>
        [
            hero(
                "Simple pricing. No laundry-day guesswork.",
                "Choose the capacity you need. Know what it costs before the cycle starts.",
            ),
            rateboard("Washer rates, by the load.", rates),
            section(
                "Dryer rates",
                `<div class="split"><div>${heading("DRY AT YOUR PACE", "Warm clothes. Clear costs.", "Drying time depends on fabric, load size and the spin used during washing. Check your load before buying extra time.")}</div><div class="rate-board">${[
                    ["Standard dryer", "$3.00", "20 minutes"],
                    ["Large dryer", "$4.00", "20 minutes"],
                    ["Extra time", "$1.00", "8 additional minutes"],
                ]
                    .map(
                        (x) =>
                            `<div class="rate-row"><h3>${x[0]}</h3><div class="rate"><strong>${x[1]}</strong><span>${x[2]}</span></div></div>`,
                    )
                    .join("")}</div></div>`,
            ),
            rateboard("Drop & collect: care by the kilogram.", [
                ["Everyday laundry", "3 kg minimum · Detergent included", "$3.50", "per kg"],
                ["Washable bedding", "Single duvet · Confirm care label", "$18.00", "per item"],
                [
                    "Special handling",
                    "Discuss delicate fabrics before drop-off",
                    "Ask us",
                    "quoted upfront",
                ],
            ]),
            values("What your laundry rate includes."),
            cta(
                "Have a large or special load?",
                "These are replaceable demo rates. Ask the team for the right care and a clear quote.",
                "Contact us",
                "pages/contact.html",
            ),
        ].join(""),
);
page(
    "pages/locations.html",
    "Find your nearest wash center",
    "Compare three fictional Stillwater locations, hours and facilities.",
    "Locations",
    () =>
        [
            hero(
                "Find your nearest wash center.",
                "The same thoughtful laundry experience, closer to your everyday routine.",
            ),
            section(
                "Location finder",
                `<div class="search-panel"><label for="location-search">Search by area, postcode or branch name</label><div class="input-action"><input class="form-control" type="search" id="location-search" placeholder="Try Riverside or 46001"><button class="btn btn-primary" id="location-search-button">Find a center ${icon("pin")}</button></div></div>`,
                "compact",
            ),
            locations(true),
            map(),
            values("Everything you need while your wash runs."),
            cta(
                "Know where you are washing next?",
                "Check the rates, pack your basket and come on over.",
            ),
        ].join(""),
);
const topics = [
    "How to wash bedding without the bulk",
    "Choosing the right washer size",
    "Drying clothes efficiently",
    "Laundry symbols, explained",
    "A gentler routine for delicates",
    "When to refresh your towels",
];
const journalDescriptions = [
    "Give washable duvets room to move, then check thick corners before storing.",
    "Match basket volume to drum capacity and leave space for an effective wash.",
    "Use the right heat, separate fabric weights and check before adding time.",
    "Read the wash tub, temperature and drying marks on your garment labels.",
    "Sort fragile fabrics, choose a suitable cycle and dry with care.",
    "Keep towels airy between uses and dry them completely before folding.",
];
const articleCards = (related = false) =>
    `<div class="grid cards blog-grid">${(related ? topics.slice(1, 4) : topics).map((t, i) => `<article class="card blog-card"><div class="card-image">${pic("blog/" + (related ? "related-" : "guide-") + i, t, i + 1)}</div><div class="card-body"><span class="eyebrow">${["EVERYDAY CARE", "MACHINE GUIDE", "FABRIC NOTES"][i % 3]} · ${4 + i} MIN READ</span><h3>${t}</h3><p>${journalDescriptions[related ? i + 1 : i]}</p><a class="text-link" href="${link("pages/blog-details.html?article=" + (related ? i + 1 : i))}">Read the guide ${icon("arrow")}</a></div></article>`).join("")}</div>`;
page(
    "pages/blog.html",
    "Laundry tips & everyday care",
    "Practical tips for bedding, washer capacity, drying and gentle fabric care.",
    "Blog",
    () =>
        [
            hero("Laundry tips & everyday care.", "Useful answers for the things in your basket."),
            split(
                "THE WEEKEND READ · 6 MIN",
                "Give your bedding room to breathe.",
                "A large drum, a suitable cycle and a little patience make bulky bedding easier to wash. Start with the care label and finish with thorough drying.",
                "blog/featured-bedding",
                13,
                true,
                btn("Bedding care guide", "pages/blog-details.html"),
            ),
            section(
                "Laundry guides",
                heading("THE CARE JOURNAL", "Good habits for fresh laundry.") + articleCards(),
            ),
            newsletter(),
            cta(
                "Put your new routine into practice.",
                "Find the right machine at your local wash center.",
                "Explore our services",
                "pages/services.html",
            ),
        ].join(""),
);
page(
    "pages/blog-details.html",
    "The everyday laundry care guide",
    "A readable step-by-step guide to preparing, washing and drying laundry.",
    "Blog",
    () =>
        [
            hero(
                "Give every load the care it deserves.",
                "Everyday care · 6 minute read · Stillwater Journal",
                "blog/article-fabric-care",
                16,
            ),
            section(
                "Article body",
                `<article class="article-body"><p class="lead">A good laundry routine starts before you press the start button. A few simple checks help you choose the right machine and avoid unnecessary re-washing.</p><h2>Start with the label, then the load.</h2><p>Look at each care label before combining items. Separate dark and light colors, and put delicate pieces aside if their temperature or drying instructions differ.</p><h3>Leave room in the drum</h3><p>A tightly packed washer cannot move water and detergent freely through the fabric. Choose the next drum size for bulky pieces, rather than pushing them into a small machine.</p><ul><li>8 kg: everyday clothing and light towels.</li><li>14 kg: family loads and heavier linen.</li><li>20 kg: washable bedding with plenty of movement.</li></ul><blockquote>Room to move is just as important as the capacity number on the machine.</blockquote><h2>Use detergent thoughtfully.</h2><p>Follow the detergent pack’s guidance for load size and soil level. More detergent does not automatically mean cleaner laundry; too much can leave residue.</p><h2>Dry for the fabric, not the clock.</h2><p>Check the tumble-dry symbol first. Choose low heat for appropriate delicate items and avoid mixing fabrics with very different drying times. Check halfway through and remove pieces that are already dry.</p><h3>Let bedding dry completely</h3><p>Bulky washable bedding may need more than one drying interval. Pause to redistribute it and make sure the filling is thoroughly dry before storing. Always follow the manufacturer’s instructions.</p></article>`,
            ),
            section(
                "Takeaways",
                heading("KEEP THESE THREE THINGS IN MIND", "A fresher finish starts here.") +
                    cards([
                        ["Read the care label", "The fabric manufacturer’s directions come first."],
                        ["Give laundry space", "Match drum size to bulk, not only weight."],
                        [
                            "Check before adding time",
                            "Remove dry items and avoid unnecessary heat.",
                        ],
                    ]),
            ),
            section(
                "Related reading",
                heading("NEXT IN YOUR ROUTINE", "More from the care journal.") + articleCards(true),
            ),
            newsletter(),
        ].join(""),
);
page(
    "pages/contact.html",
    "Contact our laundry team",
    "Ask a laundry question, discuss a special load or find help with your branch visit.",
    "Contact",
    () =>
        [
            hero(
                "Let’s make laundry day easier.",
                "A question about a cycle, a special load or your nearest branch? We are here to help.",
            ),
            section(
                "Contact information",
                cards([
                    ["Call the team", "(202) 555-0148 · Fictional demo phone", null, "clock"],
                    ["Email us", "hello@stillwater.example", null, "check"],
                    ["Visit North Quarter", "18 Example Lane · 6 am–10 pm daily", null, "pin"],
                ]),
            ),
            section(
                "Enquiry form",
                `<div class="form-layout"><div>${heading("HOW CAN WE HELP?", "Send a little detail.", "Tell us about your load or visit. This template demonstrates form validation; no message is sent.")}<p>For branch opening hours, check the <a href="${link("pages/locations.html")}">locations page</a>.</p></div><form data-demo-form class="contact-form">${field("Full name", "full-name")}${field("Email address", "email", "email")}${field("Phone number", "phone", "tel", false)}<div class="field"><label for="preferred-location">Preferred location</label><select id="preferred-location" name="location" class="form-control" required><option value="">Choose a center</option>${branches.map((b) => `<option>${b[0]}</option>`).join("")}</select></div><div class="field full"><label for="enquiry-type">Enquiry type</label><select id="enquiry-type" name="enquiry" class="form-control" required><option value="">Select an enquiry</option><option>Self-service help</option><option>Drop & collect</option><option>Special load</option><option>Branch visit</option></select></div><div class="field full"><label for="message">Your message</label><textarea id="message" name="message" class="form-control" rows="5" required minlength="10"></textarea></div><label class="check-label full"><input type="checkbox" name="consent" required> I agree to be contacted about this enquiry.</label><button class="btn btn-primary" type="submit">Send enquiry ${icon("arrow")}</button><p class="form-status full" role="status"></p></form></div>`,
            ),
            map(),
            section(
                "Quick help",
                heading("A QUICK ANSWER", "Before you reach out.") +
                    cards([
                        [
                            "Machine trouble?",
                            "Tell the on-site attendant the machine number before starting another cycle.",
                        ],
                        [
                            "Collection question?",
                            "Have your collection ticket ready so staff can locate the correct bag.",
                        ],
                        [
                            "Lost something?",
                            "Contact the branch you visited with the date and a description of the item.",
                        ],
                    ]),
            ),
            cta(
                "Open daily. Ready when you are.",
                "North Quarter 6 am–10 pm · Riverside 6 am–11 pm · West Park 7 am–10 pm.",
            ),
        ].join(""),
);
page(
    "pages/404.html",
    "Page not found",
    "Find your way back to Stillwater services and locations.",
    "",
    () =>
        section(
            "Page not found",
            `<div class="error-shell"><span class="eyebrow">A SMALL WRONG TURN</span><div class="error-code" aria-hidden="true">4${icon()}4</div><h1>This page is out for a spin.</h1><p>The address may have changed. Let’s get you back to something fresh.</p><div class="actions">${btn("Back to home", "pages/index.html")}${btn("Explore services", "pages/services.html", true)}</div></div>`,
        ),
);
page(
    "pages/coming-soon.html",
    "A new wash center is coming",
    "A front-end countdown and notification demonstration for a new Stillwater branch.",
    "",
    () =>
        section(
            "Coming soon",
            `<div class="coming-shell"><span class="eyebrow">A NEW NEIGHBORHOOD. THE SAME CARE.</span><h1>A fresh start is on its way.</h1><p>Our next wash center is taking shape. We cannot wait to make laundry a little easier around here.</p><div class="countdown" data-countdown="2027-06-01T10:00:00-04:00" aria-label="Time until demo opening"></div><form data-demo-form data-success="Demo signup validated. Connect an email platform to collect notifications."><label for="notify-email">Be first to hear about opening day</label><div class="input-action"><input id="notify-email" type="email" name="email" required class="form-control"><button class="btn btn-primary">Notify me</button></div><p class="form-status" role="status"></p></form><p class="small-note">Illustrative opening date: June 1, 2027. Notification form is a demo.</p><a class="text-link" href="${link("pages/contact.html")}">Get in touch ${icon("arrow")}</a></div>`,
        ),
);
if (new Set(used).size !== used.length) throw new Error("Repeated content image detected");
write("documentation/image-inventory.json", JSON.stringify(used, null, 4));
write(
    "assets/images/image-manifest.txt",
    placements
        .map(
            (item) =>
                item.file +
                "\nPage: " +
                item.page +
                "\nSection: " +
                item.section +
                "\nPurpose: " +
                item.purpose +
                "\n",
        )
        .join("\n"),
);
write("documentation/image-placements.json", JSON.stringify(placements, null, 4));
const pages = fs
    .readdirSync("pages")
    .filter((x) => x.endsWith(".html"))
    .map((x) => "pages/" + x);
write(
    "sitemap.xml",
    '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
        pages
            .filter((x) => !/(login|register|404|coming-soon)/.test(x))
            .map((x) => `<url><loc>https://stillwater.example/${x}</loc></url>`)
            .join("") +
        "</urlset>",
);
write("robots.txt", "User-agent: *\nAllow: /\nSitemap: https://stillwater.example/sitemap.xml\n");
write(
    "index.html",
    `<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta http-equiv="refresh" content="0; url=pages/index.html">
        <title>Stillwater Laundry</title>
        <link rel="icon" href="assets/images/brand/favicon.svg">
        <link rel="canonical" href="https://stillwater.example/pages/index.html">
    </head>
    <body>
        <p>Continue to <a href="pages/index.html">Stillwater Laundry</a>.</p>
    </body>
</html>`,
);
console.log("Built " + pages.length + " website pages in pages/, plus the root entry redirect.");
