/* ========================= Theme and navigation ========================= */
(() => {
    "use strict";
    const root = document.documentElement;
    // Every journal card resolves to the matching readable article in this template.
    if (
        location.pathname.endsWith("blog-details.html") &&
        new URLSearchParams(location.search).has("article")
    ) {
        const articles = [
            [
                "How to wash bedding without the bulk",
                "Check the duvet label first.",
                "Choose a machine that lets the bedding move freely. A 20 kg washer is useful for bulky washable items, but care instructions and the actual volume come first.",
                "Redistribute during drying.",
                "Pause the dryer to loosen the filling. Check thick corners and seams before storing; bedding must dry thoroughly.",
            ],
            [
                "Choosing the right washer size",
                "Start with the volume of your basket.",
                "An 8 kg drum suits personal everyday clothing. Use 14 kg for larger family washes and 20 kg for bulky washable linen. Keep the load below the machine fill line.",
                "Separate incompatible fabrics.",
                "One large mixed load is not always the best choice. Group items with similar colors, temperatures and fabric care instructions.",
            ],
            [
                "Drying clothes efficiently",
                "Spin well before you dry.",
                "A suitable washer spin removes water before the dryer starts. Follow the fabric label and avoid combining heavy towels with lightweight garments.",
                "Check before adding extra time.",
                "Remove pieces that are dry, untangle the rest and buy another short interval only when needed. Never tumble-dry an item whose label forbids it.",
            ],
            [
                "Laundry symbols, explained",
                "The wash tub tells you about washing.",
                "The number inside a wash tub is the maximum recommended temperature. A hand symbol means hand washing, and a crossed-out tub means do not wash.",
                "Check the square and circle.",
                "A circle inside a square refers to tumble drying; dots indicate the allowed heat. A crossed-out tumble-dry symbol means choose another drying method. Always use the complete manufacturer label.",
            ],
            [
                "A gentler routine for delicates",
                "Separate delicate fabrics before you start.",
                "Read the care label, close fastenings and use a mesh bag where appropriate. Select only a cycle permitted by the fabric manufacturer.",
                "Use a suitable drying method.",
                "Some garments need to dry flat or on a line. Ask staff before dropping off items with special handling, and keep dry-clean-only pieces out of normal wash loads.",
            ],
            [
                "When to refresh your towels",
                "Let towels dry between uses.",
                "Spread towels out where air can circulate. A damp bundle in a basket stays wet longer, so avoid leaving used towels crumpled together.",
                "Wash according to use and care.",
                "Refresh towels regularly, especially after heavy use. Follow their care labels, avoid overloading the drum and dry them completely before folding.",
            ],
            [
                "Caring for knitwear",
                "Read the label before washing.",
                "Separate knitted garments and use only the wash method and temperature permitted by the manufacturer. A mesh bag can help protect machine-washable knits from snagging.",
                "Keep the shape as they dry.",
                "Follow the drying instructions. When flat drying is recommended, gently reshape the garment on a clean towel and avoid hanging it while heavy with water.",
            ],
        ];
        const index = Number(new URLSearchParams(location.search).get("article"));
        const article = articles[index];
        if (article) {
            document.querySelector("h1").textContent = article[0];
            document.title = `${article[0]} | Stillwater Laundry`;
            const visuals = [
                ["bedding-ready-for-washing.webp", "Clean white bedding", 1400, 932],
                [
                    "choosing-load-capacity.webp",
                    "Commercial washers with different drum capacities",
                    1200,
                    900,
                ],
                [
                    "drying-fabric-with-care.webp",
                    "Commercial tumble dryer and a towel checked for dryness",
                    1200,
                    900,
                ],
                ["fabric-care-symbols.svg", "Wash and tumble-dry care symbols", 1200, 800],
                ["sorted-delicate-shirts.webp", "Folded delicate clothing", 1500, 1000],
                ["clean-white-towel-stack.webp", "Clean white towels", 1400, 2100],
                ["cozy-folded-sweaters.webp", "Folded knitted sweaters", 600, 900],
            ];
            const [src, alt, width, height] = visuals[index];
            const image = document.querySelector(".inner-hero img");
            image.src = `../assets/images/blog/${src}`;
            image.alt = alt;
            image.width = width;
            image.height = height;
            document.querySelector('meta[name="description"]')?.setAttribute("content", article[2]);
            document.querySelector(".article-body").innerHTML =
                `<p class="lead">Practical fabric care starts with a few small checks and the instructions on your items.</p><h2>${article[1]}</h2><p>${article[2]}</p><h2>${article[3]}</h2><p>${article[4]}</p><blockquote>Choose the care that suits your fabrics, and ask the on-site team if you are unsure.</blockquote><h3>Before your next wash</h3><ul><li>Read labels and empty pockets.</li><li>Match the machine to the size of the load.</li><li>Confirm temperature and drying instructions.</li></ul><p>Our team can show you machine controls and capacities before you start.</p>`;
        }
    }
    const save = (key, value) => {
        try {
            localStorage.setItem(key, value);
        } catch (_) {}
    };
    const themeButton = document.querySelector(".theme-toggle");
    const updateThemeLabel = () =>
        themeButton?.setAttribute(
            "aria-label",
            `Switch to ${root.dataset.theme === "dark" ? "light" : "dark"} mode`,
        );
    updateThemeLabel();
    themeButton?.addEventListener("click", () => {
        root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
        save("stillwater-theme", root.dataset.theme);
        updateThemeLabel();
    });
    const systemTheme = matchMedia("(prefers-color-scheme: dark)");
    systemTheme.addEventListener("change", (event) => {
        try {
            if (localStorage.getItem("stillwater-theme")) return;
        } catch (_) {}
        root.dataset.theme = event.matches ? "dark" : "light";
        updateThemeLabel();
    });
    const directionButtons = document.querySelectorAll("[data-rtl]");
    const updateDirectionLabels = () =>
        directionButtons.forEach((button) => {
            const target = root.dir === "rtl" ? "LTR" : "RTL";
            button.setAttribute(
                "aria-label",
                `Switch to ${target === "RTL" ? "right-to-left" : "left-to-right"} layout`,
            );
            button.title = button.getAttribute("aria-label");
            const label = button.querySelector(".direction-label");
            if (label) label.textContent = target;
        });
    updateDirectionLabels();
    directionButtons.forEach((button) =>
        button.addEventListener("click", () => {
            root.dir = root.dir === "rtl" ? "ltr" : "rtl";
            save("stillwater-dir", root.dir);
            updateDirectionLabels();
        }),
    );
    document.querySelectorAll(".main-nav .dropdown").forEach((dropdown) => {
        const toggle = dropdown.querySelector(".dropdown-toggle");
        const desktopPointer = () =>
            matchMedia("(min-width: 1200px) and (hover: hover) and (pointer: fine)").matches;
        dropdown.addEventListener("mouseenter", () => {
            if (desktopPointer()) bootstrap.Dropdown.getOrCreateInstance(toggle).show();
        });
        dropdown.addEventListener("mouseleave", () => {
            if (desktopPointer()) bootstrap.Dropdown.getOrCreateInstance(toggle).hide();
        });
    });
    const menu = document.querySelector(".main-nav");
    document.querySelector("[data-go-back]")?.addEventListener("click", () => {
        if (
            history.length > 1 &&
            document.referrer &&
            new URL(document.referrer).origin === location.origin
        )
            history.back();
        else location.href = "index.html";
    });
    const menuButton = document.querySelector(".menu-toggle");
    let backdrop;
    if (menu) {
        const top = document.createElement("div");
        top.className = "mobile-menu-top";
        const brand = document.querySelector(".header-inner > .brand").cloneNode(true);
        const close = document.createElement("button");
        close.type = "button";
        close.className = "icon-button mobile-menu-close";
        close.setAttribute("aria-label", "Close menu");
        close.innerHTML =
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="m5 5 14 14M19 5 5 19"/></svg>';
        top.append(brand, close);
        menu.prepend(top);
        const paths = [
            '<path d="m3 10 9-7 9 7v11h-7v-7h-4v7H3V10Z"/>',
            '<circle cx="12" cy="12" r="9"/><path d="M12 10v7m0-10h.01"/>',
            '<rect x="4" y="3" width="16" height="18" rx="3"/><path d="M4 8h16"/><circle cx="12" cy="14" r="4"/>',
            '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 10h18M7 15h4"/>',
            '<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2"/>',
            '<rect x="5" y="3" width="15" height="18" rx="2"/><path d="M9 8h7M9 12h7M9 16h4M3 7h4m-4 5h4m-4 5h4"/>',
            '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m3 7 9 6 9-6"/>',
        ];
        menu.querySelectorAll(".nav-link").forEach((item, i) =>
            item.insertAdjacentHTML(
                "afterbegin",
                `<svg class="mobile-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[i]}</svg>`,
            ),
        );
        const actions = document.createElement("div");
        actions.className = "mobile-menu-actions";
        actions.innerHTML =
            '<a class="btn btn-primary" href="locations.html">Find a center</a><a class="btn btn-secondary" href="services.html">Explore services</a>';
        menu.append(actions);
        backdrop = document.createElement("div");
        backdrop.className = "menu-backdrop";
        backdrop.hidden = true;
        document.body.append(backdrop);
        close.addEventListener("click", () => {
            closeMenu();
            menuButton.focus();
        });
        backdrop.addEventListener("click", () => closeMenu());
    }
    const closeMenu = () => {
        menu?.classList.remove("is-open");
        document.body.classList.remove("menu-open");
        if (backdrop) backdrop.hidden = true;
        menuButton?.setAttribute("aria-expanded", "false");
        menuButton?.setAttribute("aria-label", "Open navigation");
    };
    menuButton?.addEventListener("click", () => {
        const open = menu.classList.toggle("is-open");
        document.body.classList.toggle("menu-open", open);
        backdrop.hidden = !open;
        menuButton.setAttribute("aria-expanded", String(open));
        menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
        if (open) menu.querySelector("button, a")?.focus();
    });
    document.addEventListener(
        "keydown",
        (event) => {
            if (event.key === "Tab" && menu?.classList.contains("is-open")) {
                const items = [...menu.querySelectorAll("a,button")].filter(
                    (item) => item.getClientRects().length,
                );
                const first = items[0],
                    last = items.at(-1);
                if (event.shiftKey && document.activeElement === first) {
                    event.preventDefault();
                    last.focus();
                } else if (!event.shiftKey && document.activeElement === last) {
                    event.preventDefault();
                    first.focus();
                }
            }
            if (event.key === "Escape" && menu?.classList.contains("is-open")) {
                event.preventDefault();
                event.stopPropagation();
                closeMenu();
                menuButton.focus();
            }
        },
        true,
    );
    matchMedia("(min-width: 1200px)").addEventListener("change", (event) => {
        if (event.matches) closeMenu();
    });
    document.addEventListener("click", (event) => {
        if (!event.target.closest(".site-header")) closeMenu();
    });
    /* ========================= Accessible demo forms ========================= */
    document.querySelectorAll("[data-demo-form]").forEach((form) => {
        form.noValidate = true;
        const controls = [...form.querySelectorAll("input, select, textarea")];
        controls.forEach((control, index) => {
            const errorId = `${control.id || "form-field-" + index}-error`;
            let error = form.querySelector(`[id="${errorId}"]`);
            if (!error) {
                error = document.createElement("span");
                error.id = errorId;
                error.className = "field-error";
                control.closest(".field, .check-label")?.append(error);
                if (!error.parentNode) control.parentNode.after(error);
            }
            control.setAttribute(
                "aria-describedby",
                [control.getAttribute("aria-describedby"), errorId].filter(Boolean).join(" "),
            );
            const validate = () => {
                const valid = control.checkValidity();
                control.setAttribute("aria-invalid", String(!valid));
                error.textContent = valid ? "" : control.validationMessage;
                return valid;
            };
            control.addEventListener("input", () => {
                if (control.hasAttribute("aria-invalid")) validate();
            });
            control.addEventListener("blur", () => {
                if (control.value) validate();
            });
            control._validate = validate;
        });
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            const validity = controls.map((control) => control._validate());
            const status = form.querySelector(".form-status");
            if (validity.includes(false)) {
                status.textContent = "Please correct the highlighted fields.";
                controls[validity.indexOf(false)].focus();
                return;
            }
            status.textContent =
                form.dataset.success ||
                "Your enquiry is ready. This is a template demonstration; no message has been sent. Connect a form service to receive enquiries.";
        });
    });
    const selectedLocation = new URLSearchParams(location.search).get("location");
    if (selectedLocation && document.querySelector("#preferred-location"))
        document.querySelector("#preferred-location").value = selectedLocation;
    /* Branded selects retain native values and form validation. */
    document.querySelectorAll("select.form-control").forEach((select) => {
        const wrap = document.createElement("div");
        wrap.className = "custom-select";
        select.before(wrap);
        wrap.append(select);
        select.classList.add("select-native");
        select.tabIndex = -1;
        select.setAttribute("aria-hidden", "true");
        const trigger = document.createElement("button");
        trigger.type = "button";
        trigger.className = "form-control select-trigger";
        trigger.setAttribute("role", "combobox");
        trigger.setAttribute("aria-haspopup", "listbox");
        trigger.setAttribute("aria-expanded", "false");
        trigger.setAttribute("aria-describedby", select.getAttribute("aria-describedby") || "");
        trigger.setAttribute("aria-required", String(select.required));
        const label = document.querySelector(`label[for="${select.id}"]`);
        if (label) {
            label.id = `${select.id}-label`;
            trigger.setAttribute("aria-labelledby", label.id);
            label.addEventListener("click", () => trigger.focus());
        }
        const list = document.createElement("div");
        list.className = "select-options";
        list.id = `${select.id}-options`;
        list.setAttribute("role", "listbox");
        list.setAttribute("aria-labelledby", label?.id || "");
        list.hidden = true;
        trigger.setAttribute("aria-controls", list.id);
        const text = document.createElement("span");
        trigger.append(text);
        trigger.insertAdjacentHTML(
            "beforeend",
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>',
        );
        const close = () => {
            list.hidden = true;
            trigger.setAttribute("aria-expanded", "false");
        };
        const sync = () => {
            text.textContent =
                select.options[select.selectedIndex]?.textContent || "Choose an option";
            trigger.classList.toggle("is-placeholder", !select.value);
            trigger.setAttribute("aria-invalid", select.getAttribute("aria-invalid") || "false");
            [...list.children].forEach((option) =>
                option.setAttribute("aria-selected", String(option.dataset.value === select.value)),
            );
        };
        [...select.options]
            .filter((option) => option.value)
            .forEach((option) => {
                const item = document.createElement("button");
                item.type = "button";
                item.className = "select-option";
                item.setAttribute("role", "option");
                item.dataset.value = option.value;
                item.textContent = option.textContent;
                item.addEventListener("click", () => {
                    select.value = option.value;
                    select.dispatchEvent(new Event("change", { bubbles: true }));
                    select.dispatchEvent(new Event("input", { bubbles: true }));
                    close();
                    trigger.focus();
                });
                list.append(item);
            });
        const open = () => {
            list.hidden = false;
            trigger.setAttribute("aria-expanded", "true");
        };
        trigger.addEventListener("click", () => (list.hidden ? open() : close()));
        trigger.addEventListener("keydown", (event) => {
            if (["ArrowDown", "ArrowUp"].includes(event.key)) {
                event.preventDefault();
                open();
                (event.key === "ArrowDown"
                    ? list.firstElementChild
                    : list.lastElementChild
                )?.focus();
            }
            if (event.key === "Escape") close();
        });
        list.addEventListener("keydown", (event) => {
            const items = [...list.children];
            const index = items.indexOf(document.activeElement);
            if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
                event.preventDefault();
                const next =
                    event.key === "Home"
                        ? 0
                        : event.key === "End"
                          ? items.length - 1
                          : (index + (event.key === "ArrowDown" ? 1 : -1) + items.length) %
                            items.length;
                items[next].focus();
            }
            if (event.key === "Escape") {
                event.preventDefault();
                close();
                trigger.focus();
            }
        });
        wrap.addEventListener("focusout", () =>
            setTimeout(() => {
                if (!wrap.contains(document.activeElement)) close();
            }, 0),
        );
        document.addEventListener("click", (event) => {
            if (!wrap.contains(event.target)) close();
        });
        select.addEventListener("change", sync);
        select.addEventListener("focus", () => trigger.focus());
        new MutationObserver(sync).observe(select, {
            attributes: true,
            attributeFilter: ["aria-invalid"],
        });
        wrap.append(trigger, list);
        sync();
    });
    /* ========================= Local location filtering ========================= */
    const search = document.querySelector("#location-search");
    let searchTimer;
    const filterLocations = () => {
        const status = document.querySelector("#search-status");
        const grid = document.querySelector(".location-grid");
        grid.setAttribute("aria-busy", "true");
        status.textContent = "Checking demo branchesâ€¦";
        clearTimeout(searchTimer);
        searchTimer = setTimeout(() => {
            let matches = 0;
            document.querySelectorAll("[data-location]").forEach((card) => {
                const found = card.dataset.location.includes(search.value.trim().toLowerCase());
                card.hidden = !found;
                if (found) matches++;
            });
            status.textContent = matches
                ? `${matches} demo ${matches === 1 ? "center" : "centers"} found.`
                : "No demo centers match. Try North Quarter, Riverside, West Park or 46001.";
            grid.removeAttribute("aria-busy");
        }, 220);
    };
    search?.addEventListener("input", filterLocations);
    document.querySelector("#location-search-button")?.addEventListener("click", filterLocations);
    /* ========================= Countdown ========================= */
    const countdown = document.querySelector("[data-countdown]");
    if (countdown) {
        const renderCountdown = () => {
            const seconds = Math.max(
                0,
                Math.floor((new Date(countdown.dataset.countdown) - Date.now()) / 1000),
            );
            countdown.innerHTML = [
                [Math.floor(seconds / 86400), "Days"],
                [Math.floor(seconds / 3600) % 24, "Hours"],
                [Math.floor(seconds / 60) % 60, "Minutes"],
                [seconds % 60, "Seconds"],
            ]
                .map(
                    ([value, label]) =>
                        `<div><strong>${String(value).padStart(2, "0")}</strong><span>${label}</span></div>`,
                )
                .join("");
        };
        renderCountdown();
        setInterval(renderCountdown, 1000);
    }
    /* ========================= Template policy information ========================= */
    const dialog = document.querySelector("#policy-dialog");
    document.querySelectorAll("[data-policy]").forEach((button) =>
        button.addEventListener("click", () => {
            const privacy = button.dataset.policy === "privacy";
            document.querySelector("#policy-title").textContent = privacy
                ? "Demo privacy information"
                : "Demo terms of use";
            document.querySelector("#policy-copy").textContent = privacy
                ? "This template stores your theme and reading direction in your browser. Demo forms do not transmit or store entered information. Google Fonts requests are made to Google when online. Replace this notice with your business privacy policy before publishing."
                : "Stillwater is a fictional demonstration. Prices, branches, reviews and opening dates are illustrative. No bookings, accounts or laundry purchases are created by this website. Add your actual business terms before publishing.";
            dialog.showModal();
        }),
    );
    document.querySelector(".dialog-close")?.addEventListener("click", () => dialog.close());
})();
