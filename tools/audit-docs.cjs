const fs = require("fs");
const credits = JSON.parse(fs.readFileSync("documentation/photo-credits.json"));
let html = fs.readFileSync("documentation/index.html", "utf8");
for (const item of credits.filter((item) => item.id.startsWith("generated-"))) {
    html = html.replace(/<li>[\s\S]*?<\/li>/g, (block) =>
        block.includes(item.file)
            ? `<li>${item.file} — original AI-generated image for this project.</li>`
            : block,
    );
}
html = html.replace(
    "All 43 photographs were newly selected, downloaded locally and optimized as WebP. Each content image has one unique placement.",
    "The site contains 39 stock photographs and four original AI-generated images, stored locally as optimized WebP, plus one fabric-care SVG. Article pages intentionally reuse the corresponding guide image.",
);
html = html.replace(
    "Replace the styled map placeholder with a responsive embed after choosing your map provider and configuring real coordinates.",
    "The responsive Google Maps embeds show Monument Circle as an explicitly labeled sample; replace them with real branch coordinates.",
);
fs.writeFileSync("documentation/index.html", html);
let readme = fs
    .readFileSync("README.md", "utf8")
    .replace("43 unique local photos", "39 stock photos, four original AI-generated images");
fs.writeFileSync("README.md", readme);
console.log("Documentation now reflects replacement image provenance and sample maps.");
