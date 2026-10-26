const fs = require("fs");
const path = require("path");
const root = path.resolve(__dirname, "..");
const files = [
    "documentation/index.html",
    ...fs
        .readdirSync(path.join(root, "pages"))
        .filter((file) => file.endsWith(".html"))
        .map((file) => "pages/" + file),
];
const failures = [];
for (const file of files) {
    const content = fs.readFileSync(path.join(root, file), "utf8");
    for (const match of content.matchAll(/(?:href|src)="([^"]+)"/g)) {
        const reference = match[1].split(/[?#]/)[0];
        if (!reference || /^(?:https?:|mailto:|tel:|data:)/.test(reference)) continue;
        if (!fs.existsSync(path.resolve(root, path.dirname(file), decodeURIComponent(reference))))
            failures.push(file + ": " + reference);
    }
}
const inventory = JSON.parse(
    fs.readFileSync(path.join(root, "documentation/image-inventory.json"), "utf8"),
);
for (const image of inventory) {
    if (!fs.existsSync(path.join(root, "assets/images", image)))
        failures.push("Missing image: " + image);
}
if (new Set(inventory).size !== inventory.length) failures.push("Repeated image in inventory");
if (failures.length) {
    console.error(failures.join("\n"));
    process.exitCode = 1;
} else {
    console.log(
        `Verified local links and assets in ${files.length} HTML files and all ${inventory.length} unique image placements.`,
    );
}
