const fs = require("fs");
const { execFileSync } = require("child_process");
const path = require("path");
for (const name of ["404", "coming-soon"]) {
    const file = `pages/${name}.html`;
    let html = fs.readFileSync(file, "utf8");
    if (html.includes('class="brand"')) continue;
    html = html.replace(
        '<div class="utility-top container">',
        '<div class="utility-top container">\n<a class="brand" href="index.html" aria-label="Stillwater Laundry home"><img class="logo-dark" src="../assets/images/brand/logo-dark.svg" alt="Stillwater Laundry and Wash Center" width="300" height="64" decoding="async"><img class="logo-light" src="../assets/images/brand/logo-light.svg" alt="Stillwater Laundry and Wash Center" width="300" height="64" decoding="async"></a>',
    );
    // Accommodate the existing class order.
    html = html.replace(
        '<div class="container utility-top">',
        '<div class="container utility-top">\n<a class="brand" href="index.html" aria-label="Stillwater Laundry home"><img class="logo-dark" src="../assets/images/brand/logo-dark.svg" alt="Stillwater Laundry and Wash Center" width="300" height="64" decoding="async"><img class="logo-light" src="../assets/images/brand/logo-light.svg" alt="Stillwater Laundry and Wash Center" width="300" height="64" decoding="async"></a>',
    );
    fs.writeFileSync(file, html);
}
for (const file of fs.readdirSync("pages").filter((f) => f.endsWith(".html"))) {
    let html = fs.readFileSync("pages/" + file, "utf8");
    html = html.replace(/<img\b[^>]*>/g, (tag) => {
        const src = tag.match(/src="([^"]+)"/)?.[1];
        if (!src) return tag;
        if (!tag.includes("decoding=")) tag = tag.replace(/\s*\/>$/, ' decoding="async" />');
        if (src.endsWith(".webp")) {
            const [w, h] = execFileSync(
                "magick",
                ["identify", "-format", "%w %h", path.resolve("pages", src)],
                { encoding: "utf8" },
            )
                .trim()
                .split(" ");
            tag = tag
                .replace(/width="\d+"/, 'width="' + w + '"')
                .replace(/height="\d+"/, 'height="' + h + '"');
        }
        return tag;
    });
    html = html
        .replace(
            'alt="Fresh towels on bedding"',
            'alt="White duvet, sheets and pillowcases ready for washing"',
        )
        .replace(
            'alt="Maintained commercial washing equipment"',
            'alt="Laundry attendant inspecting a commercial washer drum and seal"',
        );
    fs.writeFileSync("pages/" + file, html);
}
const placements = JSON.parse(fs.readFileSync("documentation/image-placements.json"));
const purposes = {
    "blog/choosing-load-capacity.webp":
        "Three commercial washers with different drum capacities; original AI-generated illustration",
    "blog/drying-fabric-with-care.webp":
        "Commercial tumble dryer and a towel checked for dryness; original AI-generated illustration",
    "blog/weekend-bedding-care.webp":
        "White duvet, sheets and pillowcases beside a commercial washer; original AI-generated illustration",
    "about/carefully-maintained-equipment.webp":
        "Attendant inspecting a commercial washer drum and seal; original AI-generated illustration",
    "blog/fabric-texture-detail.webp": "Smooth green textile illustrating delicate fabric care",
    "blog/cozy-folded-sweaters.webp": "Folded knitwear illustrating the knitwear care guide",
    "blog/soft-textile-closeup.webp": "Folded household linen illustrating bedding care",
};
for (const p of placements) if (purposes[p.file]) p.purpose = purposes[p.file];
fs.writeFileSync("documentation/image-placements.json", JSON.stringify(placements, null, 4) + "\n");
fs.writeFileSync(
    "assets/images/image-manifest.txt",
    placements
        .map(
            (p) =>
                `Filename: ${p.file}\nPage: ${p.page}\nSection: ${p.section}\nPurpose: ${p.purpose}\n`,
        )
        .join("\n"),
);
const credits = JSON.parse(fs.readFileSync("documentation/photo-credits.json"));
for (let i = 0; i < credits.length; i++)
    if (purposes[credits[i].file]?.includes("AI-generated"))
        credits[i] = {
            file: credits[i].file,
            id: "generated-" + credits[i].file,
            page: credits[i].page,
            section: credits[i].section,
            purpose: purposes[credits[i].file],
            author: "OpenAI image generation",
            source: "Original image generated for this project",
            license: "AI-generated asset; not a stock photograph",
        };
fs.writeFileSync("documentation/photo-credits.json", JSON.stringify(credits, null, 4) + "\n");
console.log(
    "Updated intrinsic dimensions, async decoding, utility branding, image purposes and provenance.",
);
