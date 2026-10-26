module.exports = function refine(
    file,
    html,
    { section, heading, btn, photo, icon, link, branches, rates },
) {
    if (/\/(404|coming-soon)\.html$/.test(file))
        return require("./utility-pages.cjs")(file, { section, btn, photo, icon });
    const sections = html.match(/<section\b[\s\S]*?<\/section>/g) || [];
    const image = (file, alt, hero = false) =>
        `<div class="image-frame">${photo(file, alt, hero)}</div>`;
    const premiumWasher = `<svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><rect x="5" y="3" width="22" height="26" rx="4" fill="var(--color-surface)" stroke="currentColor" stroke-width="1.5"/><path d="M5 10h22" stroke="currentColor" stroke-width="1.5"/><path d="M9 6.5h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="23" cy="6.5" r="1.2" fill="currentColor"/><circle cx="19" cy="6.5" r="1.2" fill="var(--color-secondary)" opacity=".45"/><circle cx="16" cy="19" r="7" fill="var(--color-soft)" stroke="currentColor" stroke-width="1.5"/><circle cx="16" cy="19" r="4.5" stroke="currentColor" stroke-width="1.2" opacity=".5"/><path d="M12 19c2-3 6 3 8 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M24 17v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`;
    const checklist = (items) =>
        `<ul class="check-list">${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
    const table = (title = "Room for your whole routine.", detail = false) =>
        section(
            "Machine selection",
            `<div class="section-head-row">${heading("FIND YOUR FIT", title)}<p>Give your fabrics room to move. Choose by volume as well as weight.</p></div><div class="table-wrap"><table class="machine-table"><caption class="visually-hidden">Washing machine capacities and recommended uses</caption><thead><tr><th scope="col">Machine</th><th scope="col">Capacity</th><th scope="col">Best for</th><th scope="col">Per cycle</th></tr></thead><tbody>${rates.map((rate, i) => `<tr><th scope="row">${rate[0]}</th><td>${[8, 14, 20][i]} kg</td><td>${["Everyday clothes & light towels", "Family laundry & weekly linen", "Washable duvets & bulky blankets"][i]}</td><td>${rate[2]}</td></tr>`).join("")}${!detail && file === "pages/index-2.html" ? '<tr><th scope="row">Commercial dryer</th><td>Large drum</td><td>Fabric-appropriate drying</td><td>$3 / 20 min</td></tr>' : ""}</tbody></table></div><p class="small-note">Check care labels and the machine fill line. Capacities and rates are illustrative.</p>`,
        );
    const railIcon = (title) => {
        if (file === "pages/locations.html") {
            const shapes = /wash/i.test(title)
                ? '<rect x="5" y="3" width="22" height="26" rx="4"/><path d="M5 10h22M9 6.5h4"/><circle cx="23" cy="6.5" r="1" fill="currentColor"/><circle cx="16" cy="19" r="7"/><circle cx="16" cy="19" r="4.5" opacity=".45"/><path d="M12 19c2-3 6 3 8 0"/>'
                : /wait/i.test(title)
                  ? '<path d="M8 17V9a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v8M5 15v10h22V15M9 25v4m14-4v4M9 17v4h14v-4"/><path d="M12 10h8" opacity=".45"/>'
                  : /payment/i.test(title)
                    ? '<rect x="3" y="7" width="26" height="20" rx="4"/><path d="M3 13h26M7 22h5"/><rect x="7" y="16" width="6" height="3" rx="1" fill="currentColor" opacity=".25" stroke="none"/><path d="M21 17a3 3 0 0 1 0 5m3-7a6 6 0 0 1 0 9"/>'
                    : '<path d="M5 16h5l4 3h5a2 2 0 0 1 0 4h-6M3 23l5 5h13l8-9a2 2 0 0 0-3-3l-5 5M3 14v12"/><path d="M23 5c-2-2-4-1-5 1-1-2-3-3-5-1-3 3 1 6 5 9 4-3 8-6 5-9Z" fill="currentColor" fill-opacity=".15"/>';
            return `<span class="value-icon amenity-icon"><svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${shapes}</svg></span>`;
        }
        const shapes = /clean/i.test(title)
            ? '<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3ZM20 3v4m-2-2h4"/>'
            : /convenience/i.test(title)
              ? '<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>'
              : /care/i.test(title)
                ? '<path d="M20 5c-3-3-6-1-8 1-2-2-5-4-8-1-4 4 2 10 8 14 6-4 12-10 8-14Z"/>'
                : /clarity|payment/i.test(title)
                  ? '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 10h18M7 15h4m4 0h2"/>'
                  : /wait/i.test(title)
                    ? '<path d="M6 12V7a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v5M3 12v6h18v-6M7 12v3h10v-3M5 18v3m14-3v3"/>'
                    : /hand/i.test(title)
                      ? '<path d="m3 14 4-4 4 2 4-2 6 4-4 6-5-3-5 3-4-6ZM8 6l4-3 4 3m-4-3v7"/>'
                      : '<rect x="4" y="3" width="16" height="18" rx="3"/><path d="M4 8h16M8 5h1m6 0h1"/><circle cx="12" cy="14" r="4"/>';
        return `<span class="value-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${shapes}</svg></span>`;
    };
    const rail = (title, items, eyebrow = "THE LITTLE THINGS") =>
        section(
            title,
            heading(eyebrow, title) +
                `<div class="icon-rail">${items.map((item) => `<article>${railIcon(item[0])}<h3>${item[0]}</h3><p>${item[1]}</p></article>`).join("")}</div>`,
        );
    const story = (title, quote, name, copy) =>
        section(
            "Neighborhood story",
            `<div class="story-quote"><div><span class="eyebrow">A NEIGHBORHOOD STORY</span><h2>${title}</h2><p>${copy}</p></div><figure><span class="quote-symbol" aria-hidden="true">“</span><blockquote>${quote}</blockquote><figcaption class="review-person">${photo("about/visitor-portrait.webp", "Illustrative stock portrait of a visitor")}<div><strong>${name}</strong><span>Illustrative customer story · Stock portrait</span></div></figcaption></figure></div>`,
        );
    const ledger = (rows) =>
        `<div class="rate-board">${rows.map((row) => `<div class="rate-row"><div><h3>${row[0]}</h3><p>${row[1]}</p></div><div class="rate"><strong>${row[2]}</strong><span>${row[3]}</span></div></div>`).join("")}</div>`;
    if (file === "pages/index.html") {
        sections[0] = section(
            "Home hero",
            `<div class="hero-grid"><div class="hero-copy"><span class="eyebrow">YOUR NEIGHBORHOOD FRESH START</span><h1>A fresh load.<br>A lighter <span>day.</span></h1><p>Beautifully simple laundry. Spacious machines, clear prices and a little more time for what matters.</p><div class="actions">${btn("Find a location", "pages/locations.html")}${btn("Explore services", "pages/services.html", true)}</div><div class="trust-row"><span>${icon("clock")} Open seven days</span><span>${icon("check")} Self-service & drop-off</span></div><div class="hero-footnote"><span>01 / LAUNDRY, THOUGHTFULLY DONE</span><p>A cleaner routine starts here.</p></div></div><figure class="hero-figure">${photo("home-1/sunlit-wash-center.webp", "Sunlit laundromat with a row of clean front-loading machines", true)}<figcaption>ROOM TO WASH. TIME TO BREATHE.</figcaption></figure></div>`,
            "home-hero",
        );
        sections[2] = section(
            "Service showcase",
            `<div class="section-head-row">${heading("LAUNDRY, YOUR WAY", "One less thing on your list.")}<p>Stay for a wash or leave the whole basket with us. Good care comes either way.</p></div><div class="service-showcase"><article class="service-dominant">${image("home-1/self-service-customer.webp", "Customer loading a front-loading commercial washer")}<div class="service-feature-copy"><span class="eyebrow">01 / DO IT YOUR WAY</span><h3>Self-service, simply better.</h3><p>Three drum sizes. Clear controls. Plenty of space for your everyday load and the bedding you’ve been putting off.</p><a class="text-link" href="${link("pages/service-details.html")}">Meet your machines ${icon("arrow")}</a></div></article><div class="service-support"><article><span class="eyebrow">02 / THE FINISHING TOUCH</span>${icon("clock")}<h3>A faster fresh finish.</h3><p>Spacious dryers with adjustable heat. Check your fabric, choose your setting and finish at your own pace.</p><a class="text-link" href="${link("pages/services.html#dryers")}">Explore dryer use ${icon("arrow")}</a></article><article><span class="eyebrow">03 / LEAVE IT WITH US</span>${icon("check")}<h3>Drop it. We’ll fold it.</h3><p>Your everyday laundry washed separately, carefully dried and neatly folded, ready for collection.</p><a class="text-link" href="${link("pages/services.html#drop-off")}">Drop & collect ${icon("arrow")}</a></article></div></div>`,
        );
        sections[2] = sections[2].replaceAll('class="text-link"', 'class="btn btn-secondary"');
        sections[5] = section(
            "Pricing preview",
            `<div class="price-preview"><div>${heading("A LITTLE CLARITY", "Fresh clothes.<br>Fair, clear prices.", "No subscriptions. No surprises. Just the right machine for the load in your basket.")}${btn("See all rates", "pages/pricing.html", true)}<p class="small-note">Illustrative pricing · Self-service detergent sold separately.</p></div>${ledger([rates[0], rates[1], ["Dryer cycle", "20 minutes · Standard drum", "$3.00", "per cycle"], ["Drop & collect", "3 kg minimum · Includes detergent", "$3.50", "per kg"]])}</div>`,
        );
        sections[6] = section(
            "Large loads and everyday convenience",
            `<div class="split reverse editorial-convenience">${image("home-1/large-load-linen-basket.webp", "Fresh laundry and linen in a spacious basket")}<div class="split-content"><span class="eyebrow">MORE ROOM FOR REAL LIFE</span><h2>The whole week.<br>One easy visit.</h2><p>Bring the family wash, the towels and that bulky duvet. Our larger machines make space for it all.</p>${checklist(["Up to 20 kg of washing capacity", "Comfortable seating while your cycle runs", "Laundry supplies and contactless payments"])}${btn("Find your wash center", "pages/locations.html", true)}</div></div>`,
        );
        sections[8] = section(
            "Customer stories",
            `<div class="section-head-row">${heading("SMALL MOMENTS. FRESH STARTS.", "A good habit,<br>close to home.")}<p>A few notes from the people our demo centers were imagined for.</p></div><div class="testimonial-spotlight"><figure class="spotlight-quote"><span class="eyebrow">NORTH QUARTER / WEEKLY WASH</span><blockquote>“The big machines turned three loads into one visit. I left with fresh bedding and the rest of my Saturday.”</blockquote><figcaption><strong>Alex M.</strong><span>Illustrative customer review</span></figcaption></figure><div class="supporting-quotes"><figure><blockquote>“Dropped it off on the way to work. Collected it folded, with one less chore waiting at home.”</blockquote><figcaption><strong>Jamie R.</strong><span>Riverside · Demo review</span></figcaption></figure><figure><blockquote>“Bright, calm and easy to use. A much nicer way to get the weekly washing done.”</blockquote><figcaption><strong>Sam K.</strong><span>West Park · Demo review</span></figcaption></figure></div></div>`,
        );
    }
    if (file === "pages/index-2.html") {
        sections[0] = section(
            "Editorial home hero",
            `<div class="editorial-hero"><div class="editorial-hero-media">${photo("home-2/open-laundromat-interior.webp", "An open neighborhood laundromat with rows of machines and folding space", true)}</div><div class="editorial-hero-copy"><span class="eyebrow">A LITTLE LESS LAUNDRY DAY</span><h1>Big loads.<br>More life<br>in between.</h1><p>Wash a week in one go. Or drop it off and leave the folding to us. Your time is yours again.</p><div class="actions">${btn("Check services", "pages/services.html")}${btn("See pricing", "pages/pricing.html", true)}</div></div><span class="editorial-hero-caption">STILLWATER / MADE FOR EVERYDAY LIFE</span></div>`,
            "editorial-hero-section",
        );
        sections[2] = table("Big or small. There is room for it all.");
        sections[3] = section(
            "Self-service experience",
            `<div class="experience-layout">${image("home-2/self-service-machine-detail.webp", "Clean front-loading machine in a laundry center")}<div class="experience-copy"><span class="eyebrow">SETTLE INTO A SIMPLER ROUTINE</span><h2>Your wash.<br>Your own pace.</h2><p>Choose a drum, select a cycle and take a seat. Clear machine controls and a helpful team make your first visit feel familiar.</p><div class="mini-steps"><div><strong>01</strong><span>Choose & load</span></div><div><strong>02</strong><span>Wash & unwind</span></div><div><strong>03</strong><span>Fold & head out</span></div></div>${btn("Self-service guide", "pages/service-details.html", true)}</div></div>`,
        );
        sections[4] = section(
            "Drop and collect feature",
            `<div class="drop-feature"><div class="drop-copy"><span class="eyebrow">THE WHOLE BASKET, TAKEN CARE OF</span><h2>A bag in.<br>A fresh week out.</h2><p>We wash, dry and fold everyday laundry, keeping your load separate and your care preferences close at hand.</p><p>Collection is normally within 24–48 hours, confirmed when you drop off.</p>${btn("Talk about your drop-off", "pages/contact.html")}<div class="drop-footnote"><strong>$3.50 / kg</strong><span>3 kg minimum · Illustrative rate</span></div></div>${image("home-2/professionally-folded-shirts.webp", "Stack of professionally folded clothes ready for collection")}</div>`,
        );
        sections[6] = rail(
            "Good care, from the drum to the counter.",
            [
                ["Checked machines", "Drums, seals and controls checked throughout the day."],
                ["Considered cycles", "Choose heat and spin settings to suit your fabrics."],
                ["Fresh folding", "Clean counters and careful handling after every wash."],
                ["Tidy facilities", "Comfortable shared spaces, kept ready for your visit."],
            ],
            "THE CARE STANDARD",
        );
        sections[7] = section(
            "Local convenience",
            `<div class="location-feature">${image("home-2/neighborhood-laundry-exterior.webp", "A neighborhood laundromat illuminated at dusk")}<div><span class="eyebrow">FIT LAUNDRY INTO YOUR DAY</span><h2>Your local stop<br>for a fresh start.</h2><p>Open daily, with evening hours for after-work washes. Find the branch that fits your route.</p><dl class="detail-list"><div><dt>Opening</dt><dd>Seven days a week</dd></div><div><dt>At the center</dt><dd>Seating, supplies & contactless payment</dd></div><div><dt>Before you visit</dt><dd>Check parking and access by branch</dd></div></dl>${btn("Compare our centers", "pages/locations.html", true)}<p class="small-note">Licensed stock photograph; branches are fictional demo locations.</p></div></div>`,
        );
        const careIcons = [
            '<path d="M12 3 4 6v6c0 5 4 8 8 10 4-2 8-5 8-10V6l-8-3Z"/><path d="m8 12 3 3 5-6"/>',
            '<path d="M4 6h16M4 12h16M4 18h16"/><circle cx="8" cy="6" r="2" fill="currentColor"/><circle cx="16" cy="12" r="2" fill="currentColor"/><circle cx="10" cy="18" r="2" fill="currentColor"/>',
            '<path d="m8 4-5 3 2 5 3-1v9h8v-9l3 1 2-5-5-3c-1 3-7 3-8 0Z"/>',
            '<path d="M6 12V7a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v5M5 11a2 2 0 0 0-2 2v5h18v-5a2 2 0 0 0-4 0v2H7v-2a2 2 0 0 0-2-2ZM5 18v3m14-3v3"/>',
        ];
        const care = [
            [
                "checked-drum.webp",
                "Checked machines",
                "Drums, seals and controls checked throughout the day.",
            ],
            [
                "considered-cycles.webp",
                "Considered cycles",
                "Choose heat and spin settings to suit your fabrics.",
            ],
            [
                "fresh-folding-care.webp",
                "Fresh folding",
                "Clean counters and careful handling after every wash.",
            ],
            [
                "tidy-laundry-room.webp",
                "Tidy facilities",
                "Comfortable shared spaces, kept ready for your visit.",
            ],
        ];
        sections[6] = section(
            "Care standards",
            heading("THE CARE STANDARD", "Good care, from the drum to the counter.") +
                `<div class="care-grid">${care.map((item, i) => `<article class="care-card">${photo("home-2/" + item[0], item[1])}<div class="care-card-content"><span class="care-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${careIcons[i]}</svg></span><h3>${item[1]}</h3><p>${item[2]}</p></div></article>`).join("")}</div>`,
        );
        sections[5] = sections[5]
            .replace(
                '<div class="container">',
                '<div class="container"><div class="rate-snapshot">',
            )
            .replace("</div></section>", "</div></div></section>");
    }
    if (file === "pages/about.html") {
        sections[2] = rail(
            "Cleanliness. Convenience. Care. Clarity.",
            [
                [
                    "Cleanliness",
                    "A fresh space is part of a better wash. We check surfaces and equipment throughout the day.",
                ],
                [
                    "Convenience",
                    "Seven-day opening and a choice of machine sizes make room for real schedules.",
                ],
                ["Care", "A helping hand with controls, care labels and collection preferences."],
                ["Clarity", "Easy-to-find prices, honest guidance and no laundry-day guesswork."],
            ],
            "WHAT WE BELIEVE",
        );
        sections[3] = section(
            "Equipment and standards",
            `<div class="equipment-feature">${image("about/carefully-maintained-equipment.webp", "Clean, maintained commercial washing machines")}<div class="equipment-panel"><span class="eyebrow">PRACTICAL BY DESIGN</span><div class="equipment-copy"><h2>Better equipment.<br>A better routine.</h2><p>From everyday clothes to bulky bedding, our three washer sizes give your laundry room to move. Clear controls, spacious drums and a comfortable place to wait make every visit feel easier.</p><p>Choose the right machine, check the price before you start and fit a fresh wash into your week.</p></div><div class="stats-row"><div><strong>3</strong><span>Washer capacities</span></div><div><strong>7</strong><span>Days open</span></div><div><strong>20 kg</strong><span>Largest drum</span></div><div><strong>100%</strong><span>Prices shown upfront</span></div></div></div></div>`,
        );
        sections[4] = story(
            "The care you notice.<br>The routine you keep.",
            "“What I appreciate most is knowing what to expect: a tidy space, clear prices and someone who will help without making a fuss.”",
            "Morgan L. · Illustrative regular visitor",
            "Our fictional centers are built around a simple promise: dependable laundry, delivered with a little more consideration.",
        );
    }
    if (file === "pages/services.html") {
        sections[1] = section(
            "Alternating service showcase",
            `<div class="service-details-list">${[
                [
                    "washing",
                    "Self-service washing",
                    "Choose your load. Choose your cycle.",
                    "Three capacities, from 8 to 20 kg, with clear controls and space for your weekly routine. Bring your detergent or pick up a single-wash pack at the counter.",
                    "services/customer-loading-laundry.webp",
                    "Customer loading clothes into a front-loading washer",
                    "pages/service-details.html",
                ],
                [
                    "dryers",
                    "Fast dryer use",
                    "A fresh finish, at your pace.",
                    "Select heat that suits your fabric and start with a 20-minute interval. Check your laundry before adding time, and use our counters to fold it while it is fresh.",
                    "services/washer-dryer-center.webp",
                    "Washer and dryer equipment ready for a laundry visit",
                    "pages/pricing.html",
                ],
                [
                    "drop-off",
                    "Drop & collect",
                    "Hand over the basket. Take back your time.",
                    "We weigh your everyday laundry, agree care preferences and confirm a collection time. Your wash stays separate and comes back neatly folded.",
                    "services/folded-clothing-handover.webp",
                    "Hands arranging folded clothing for collection",
                    "pages/contact.html",
                ],
            ]
                .map(
                    (item, i) =>
                        `<article class="service-detail-row ${i % 2 ? "reverse" : ""}" id="${item[0]}">${image(item[4], item[5])}<div class="split-content"><span class="eyebrow">0${i + 1} / ${item[1]}</span><h2>${item[2]}</h2><p>${item[3]}</p>${btn(i === 0 ? "Explore self-service" : i === 1 ? "See dryer rates" : "Ask about drop-off", item[6], true)}</div></article>`,
                )
                .join("")}</div>`,
        );
        sections[2] = table("One basket. The right amount of space.");
        const questions = [
            [
                "Getting ready",
                "Do I need to bring detergent?",
                "Bring your usual detergent, or pick up a single-wash pack at the counter. Detergent is included with drop & collect.",
            ],
            [
                "Your visit",
                "How long does a wash take?",
                "Most wash cycles take around 30–40 minutes. The selected program and machine display will show your cycle time.",
            ],
            [
                "Machine selection",
                "Which machine size should I choose?",
                "Choose from 8, 14 or 20 kg drums. Allow room for fabrics to move and stay below the machine’s fill line; our team can help you choose.",
            ],
            [
                "Drop & collect",
                "How is drop & collect priced?",
                "Our illustrative rate is $3.50 per kilogram, with a 3 kg minimum. We confirm the weight, care preferences and total before accepting your bag.",
            ],
            [
                "Fabric care",
                "Can I wash duvets and delicate fabrics?",
                "Check the care label first. Larger drums accommodate washable bedding; ask our team about delicate loads. Dry-clean-only items are not suitable.",
            ],
            [
                "Payments",
                "What payment methods are accepted?",
                "Our demo centers support contactless cards and mobile wallets. Check with your chosen branch before visiting.",
            ],
        ];
        sections[4] = section(
            "Service questions",
            `<div class="service-faq"><div class="service-faq-intro">${heading("GOOD TO KNOW", "A little guidance.<br>A smoother laundry day.", "Everything you need to feel ready for your next visit.")}${btn("Ask our team", "pages/contact.html", true)}</div><div class="service-question-grid">${questions.map((q, i) => `<details class="service-question"><summary><span class="question-number">0${i + 1}</span><span><span class="question-category">${q[0]}</span><strong>${q[1]}</strong></span><span class="question-toggle" aria-hidden="true"></span></summary><p>${q[2]}</p></details>`).join("")}</div></div>`,
        );
    }
    if (file === "pages/service-details.html") {
        sections[1] = sections[1]
            .replace('class="split ', 'class="split split-sixty ')
            .replace('class="split"', 'class="split split-sixty"');
        sections[3] = table("A practical guide to the right drum.", true);
    }
    if (file === "pages/pricing.html") {
        sections[0] = section(
            "Pricing introduction",
            `<nav class="breadcrumb" aria-label="Breadcrumb"><a href="${link("pages/index.html")}">Home</a><span aria-hidden="true">/</span><span aria-current="page">Pricing</span></nav><div class="pricing-hero"><div class="pricing-hero-copy"><span class="eyebrow">STILLWATER LAUNDRY</span><h1>Simple pricing.<br>A lighter laundry day.</h1><p>Choose the capacity you need. Know what it costs before the cycle starts.</p><div class="pricing-assurance">${icon("check")} Clear rates. No subscription.</div></div><figure class="pricing-hero-photo">${photo("pricing/clear-pricing-hero.webp", "Commercial laundry machines and spacious folding counters", true)}<figcaption><span>ROOM FOR EVERY LOAD</span><strong>Choose your drum.<br>Know your price.</strong></figcaption></figure></div>`,
            "inner-intro",
        );
        sections[1] = section(
            "Washer rate board",
            `<div class="section-head-row">${heading("WASHER RATES", "Pay for the load.<br>Keep it simple.")}<p>One price per cycle. Three useful capacities. No subscription required.</p></div><div class="washer-prices premium-washer-prices">${rates.map((rate, i) => `<article><div class="rate-card-top"><span class="rate-machine-icon">${premiumWasher}</span><span class="capacity-pill">${[8, 14, 20][i]} kg capacity</span></div><span class="eyebrow">0${i + 1} / YOUR LOAD, YOUR WAY</span><h3>${rate[0]}</h3><p>${["Personal weekly laundry", "Family loads & towels", "Bedding & bulky washable items"][i]}</p><div class="price-value"><strong>${rate[2]}</strong><span>per wash cycle</span></div><span class="rate-card-note">${icon("check")} Price shown before you start</span></article>`).join("")}</div><p class="small-note">Illustrative rates. Self-service detergent is available separately.</p>`,
        );
        sections[2] = section(
            "Dryer time and rates",
            `<div class="dryer-rate-layout"><div>${heading("DRYER RATES", "Dry a little.<br>Check. Repeat.", "Fabric, load size and wash spin affect drying time. Choose heat according to care labels.")}</div><div class="dryer-price-strip">${[
                ["Standard", "$3.00", "20 minutes"],
                ["Large", "$4.00", "20 minutes"],
                ["Extra time", "$1.00", "8 more minutes"],
            ]
                .map(
                    (row) =>
                        `<article><h3>${row[0]}</h3><strong>${row[1]}</strong><span>${row[2]}</span></article>`,
                )
                .join("")}</div></div>`,
        );
        sections[3] = section(
            "Drop and collect rates",
            `<div class="drop-pricing"><div><span class="eyebrow">WE WEIGH IT. YOU LEAVE IT.</span><h2>Care by the kilogram.</h2><p>Detergent, washing, drying and folding included. We confirm the weight and total before accepting your bag.</p><span class="price-callout">$3.50 <small>/ kg</small></span><p class="small-note">Everyday laundry · 3 kg minimum · Demo rate</p></div><dl class="detail-list"><div><dt>Washable bedding</dt><dd>From $18 per single duvet</dd></div><div><dt>Delicate or special loads</dt><dd>Discuss handling for an upfront quote</dd></div><div><dt>Collection</dt><dd>Usually 24–48 hours; confirmed at drop-off</dd></div></dl></div>`,
        );
        sections[4] = section(
            "What is included",
            `<div class="included-layout premium-included"><div class="included-visual">${heading("WHAT YOUR RATE COVERS", "Clear from the first cycle.")}${image("pricing/comfortable-laundry-space.webp", "Laundry machines and seating in a neighborhood wash center")}<p class="small-note">Space to wash, a place to wait, and guidance when you need it.</p></div><div class="included-benefits"><span class="eyebrow">THE EVERYDAY ESSENTIALS</span>${checklist(["Self-service: the selected wash or dryer cycle", "Machine capacity clearly marked before you start", "Drop & collect: detergent, washing, drying and folding", "On-site guidance with controls and machine selection", "Folding space and seating while your cycle runs"])}</div></div>`,
        );
    }
    if (file === "pages/locations.html") {
        sections[0] = section(
            "Locations introduction",
            `<nav class="breadcrumb" aria-label="Breadcrumb"><a href="${link("pages/index.html")}">Home</a><span aria-hidden="true">/</span><span aria-current="page">Locations</span></nav><div class="pricing-hero"><div class="pricing-hero-copy"><span class="eyebrow">CLOSER TO YOUR EVERYDAY</span><h1>Your neighborhood.<br>Your fresh start.</h1><p>Find your nearest wash center. The same thoughtful laundry experience, closer to your everyday routine.</p><div class="pricing-assurance">${icon("pin")} Three centers. One standard of care.</div></div><figure class="pricing-hero-photo">${photo("locations/neighborhood-visit-hero.webp", "Modern laundry center with washing machines and comfortable seating", true)}<figcaption><span>MADE FOR YOUR ROUTINE</span><strong>Room to wash.<br>A moment to unwind.</strong></figcaption></figure></div>`,
            "inner-intro",
        );
        sections[3] = section(
            "Neighborhood map",
            heading("PLAN YOUR VISIT", "A closer look at the neighborhood.") +
                `<div class="neighborhood-map"><div class="map-address-panel"><span class="map-address-icon">${icon("pin")}</span><span class="eyebrow">EXPLORE THE AREA</span><h3>Monument Circle</h3><address>1 Monument Circle<br>Indianapolis, IN 46204</address><p>A real address shown as a sample map location. Stillwater’s listed branches are fictional.</p><a class="btn btn-secondary" href="https://www.google.com/maps/search/?api=1&amp;query=1+Monument+Circle+Indianapolis+IN+46204" target="_blank" rel="noopener noreferrer">Open in Maps ${icon("arrow")}</a></div><iframe title="Interactive map of Monument Circle, Indianapolis" src="https://maps.google.com/maps?q=1%20Monument%20Circle%20Indianapolis%20IN%2046204&amp;z=15&amp;output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe></div>`,
        );
        sections[4] = rail(
            "The useful details, already considered.",
            [
                ["Room to wash", "Large drums and efficient dryers for bigger baskets."],
                ["Space to wait", "Seating, Wi-Fi and generous folding counters."],
                ["Easy payments", "Contactless cards and mobile wallets in our demo centers."],
                ["A helping hand", "Supplies at the counter and staff to explain the controls."],
            ],
            "WHILE YOU ARE HERE",
        );
    }
    if (file === "pages/blog.html") {
        sections[0] = section(
            "Blog introduction",
            `<nav class="breadcrumb" aria-label="Breadcrumb"><a href="${link("pages/index.html")}">Home</a><span aria-hidden="true">/</span><span aria-current="page">Blog</span></nav><div class="pricing-hero"><div class="pricing-hero-copy"><span class="eyebrow">THE STILLWATER CARE JOURNAL</span><h1>Laundry tips.<br>A little everyday ease.</h1><p>Useful answers for the things in your basket. From choosing a drum to caring for your favorite fabrics.</p><div class="pricing-assurance">${icon("check")} Simple habits. A fresher finish.</div></div><figure class="pricing-hero-photo journal-hero-photo">${photo("blog/everyday-laundry-journal.webp", "Laundry baskets filled with everyday clothes and towels", true)}<figcaption><span>GOOD CARE STARTS HERE</span><strong>Your next load.<br>A little more know-how.</strong></figcaption></figure></div>`,
            "inner-intro",
        );
        sections[2] = sections[2]
            .replace('class="section ', 'class="section journal-section ')
            .replace('class="grid cards blog-grid"', 'class="grid cards blog-grid editorial-grid"')
            .replace(
                '<div class="grid cards blog-grid editorial-grid">',
                '<nav class="journal-categories" aria-label="Journal categories"><a href="blog.html#laundry-guides">All guides</a><a href="blog-details.html?article=0">Bedding</a><a href="blog-details.html?article=1">Machines</a><a href="blog-details.html?article=4">Fabric care</a></nav><div id="laundry-guides" class="grid cards blog-grid editorial-grid">',
            );
    }
    if (file === "pages/blog-details.html") {
        sections[2] = section(
            "Article takeaways",
            `<div class="takeaway-layout">${heading("THE FRESH-FINISH CHECKLIST", "Three small habits worth keeping.")}<ol><li><strong>Read the care label.</strong><span>The manufacturer’s washing and drying instructions come first.</span></li><li><strong>Give fabrics room.</strong><span>Choose by bulk and keep below the drum’s fill line.</span></li><li><strong>Check before adding heat.</strong><span>Remove dry items and redistribute the rest.</span></li></ol></div>`,
        );
        sections[3] = sections[3].replace(
            'class="grid cards blog-grid"',
            'class="related-list premium-related"',
        );
    }
    if (file === "pages/contact.html") {
        sections[0] = section(
            "Contact introduction",
            `<nav class="breadcrumb" aria-label="Breadcrumb"><a href="${link("pages/index.html")}">Home</a><span aria-hidden="true">/</span><span aria-current="page">Contact</span></nav><div class="pricing-hero"><div class="pricing-hero-copy"><span class="eyebrow">A HELPING HAND, CLOSE BY</span><h1>Let’s make laundry<br>day easier.</h1><p>A question about a cycle, a special load or your nearest branch? We’re here to help.</p><div class="pricing-assurance">${icon("check")} Clear guidance. Thoughtful care.</div></div><figure class="pricing-hero-photo">${photo("contact/laundry-guidance-hero.webp", "Commercial washing machines ready for a laundry visit", true)}<figcaption><span>LET’S TALK LAUNDRY</span><strong>A little guidance.<br>A simpler visit.</strong></figcaption></figure></div>`,
            "inner-intro",
        );
        sections[3] = section(
            "Contact map",
            heading("PLAN YOUR VISIT", "Find your way around.") +
                `<div class="neighborhood-map"><div class="map-address-panel"><span class="map-address-icon">${icon("pin")}</span><span class="eyebrow">EXPLORE THE AREA</span><h3>Monument Circle</h3><address>1 Monument Circle<br>Indianapolis, IN 46204</address><p>A real address shown as a sample map location. Stillwater’s listed branches are fictional.</p><a class="btn btn-secondary" href="https://www.google.com/maps/search/?api=1&amp;query=1+Monument+Circle+Indianapolis+IN+46204" target="_blank" rel="noopener noreferrer">Open in Maps ${icon("arrow")}</a></div><iframe title="Interactive map of Monument Circle, Indianapolis" src="https://maps.google.com/maps?q=1%20Monument%20Circle%20Indianapolis%20IN%2046204&amp;z=15&amp;output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe></div>`,
        );
        sections[1] = section(
            "Contact information",
            `<div class="contact-rail"><div><span class="eyebrow">CALL THE TEAM</span><a href="tel:+12025550148">(202) 555-0148</a><span>Fictional demo phone</span></div><div><span class="eyebrow">WRITE TO US</span><a href="mailto:hello@stillwater.example">hello@stillwater.example</a><span>For load and branch questions</span></div><div><span class="eyebrow">COME ON OVER</span><strong>Open seven days</strong><span>Hours vary by center</span></div></div>`,
            "compact",
        );
        sections[2] = sections[2]
            .replace(
                '<div class="form-layout"><div>',
                '<div class="form-layout"><div class="contact-intro">',
            )
            .replace(
                '</div><form data-demo-form class="contact-form">',
                `${image("contact/helpful-linen-care.webp", "A staff member carrying a stack of fresh linen")}<div class="contact-address"><strong>North Quarter center</strong><span>18 Example Lane · Example City 46001</span><span>6 am–10 pm daily · Fictional demo address</span></div></div><form data-demo-form class="contact-form">`,
            );
        sections[4] = section(
            "Quick contact help",
            `<div class="contact-help-panel">${heading("A QUICK ANSWER", "Before you reach out.", "A few useful details to help us get you sorted sooner.")}<div class="contact-help-cards">${[
                [
                    "Machine trouble?",
                    "Tell the on-site attendant the machine number before starting another cycle.",
                    '<rect x="4" y="3" width="16" height="18" rx="3"/><path d="M4 8h16M8 5.5h2"/><circle cx="12" cy="14" r="4"/><path d="M12 12v2m0 2h.01"/>',
                ],
                [
                    "Collection question?",
                    "Have your ticket ready so staff can locate the correct bag.",
                    '<path d="M5 4h14v16l-3-2-4 2-4-2-3 2V4Z"/><path d="M9 8h6M9 12h6m-6 4h3"/>',
                ],
                [
                    "Lost something?",
                    "Contact the branch with your visit date and a description of the item.",
                    '<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6M8 10h4m-2-2v4"/>',
                ],
            ]
                .map(
                    (item, i) =>
                        `<article><div class="help-card-top"><span class="help-card-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${item[2]}</svg></span><span class="help-card-number">0${i + 1}</span></div><h3>${item[0]}</h3><p>${item[1]}</p></article>`,
                )
                .join("")}</div></div>`,
        );
    }
    return sections
        .map((markup, i) => `<!-- Section ${i + 1} -->\n${markup}`)
        .join("\n")
        .replace(/<input\b[^>]*>/g, (tag) => {
            if (/placeholder=|type="(?:checkbox|hidden|submit)"/.test(tag)) return tag;
            const type = tag.match(/type="([^"]+)"/)?.[1];
            const hint =
                type === "email"
                    ? "you@example.com"
                    : type === "tel"
                      ? "Enter your phone number"
                      : "Enter your full name";
            return tag.replace(/>$/, ` placeholder="${hint}">`);
        })
        .replace(/<textarea\b([^>]*)>/g, (tag, attrs) =>
            /placeholder=/.test(attrs)
                ? tag
                : `<textarea${attrs} placeholder="Tell us about your load, visit or question…">`,
        );
};
