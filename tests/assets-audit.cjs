const fs = require("fs");
const crypto = require("crypto");
const inventory = JSON.parse(fs.readFileSync("documentation/image-inventory.json"));
const credits = JSON.parse(fs.readFileSync("documentation/photo-credits.json"));
const hashes = inventory.map((file) =>
    crypto
        .createHash("sha256")
        .update(fs.readFileSync("assets/images/" + file))
        .digest("hex"),
);
if (
    new Set(hashes).size !== hashes.length ||
    new Set(credits.map((item) => item.id)).size !== credits.length
)
    throw new Error("Duplicate image source or bytes");
const html =
    fs
        .readdirSync("pages")
        .map((file) => fs.readFileSync("pages/" + file, "utf8"))
        .join("\n") +
    fs.readFileSync("documentation/index.html", "utf8") +
    fs.readFileSync("assets/js/main.js", "utf8");
const files = ["style.css", "responsive.css", "dark-mode.css", "rtl.css", "utility.css"];
const unused = {};
for (const file of files) {
    const css = fs.readFileSync("assets/css/" + file, "utf8");
    unused[file] = [
        ...new Set([...css.matchAll(/\.([a-z][a-z0-9-]*)/g)].map((match) => match[1])),
    ].filter((name) => !html.includes(name));
}
fs.writeFileSync(
    "tests/assets-results.json",
    JSON.stringify(
        {
            contentImages: inventory.length,
            photos: credits.length,
            uniqueHashes: new Set(hashes).size,
            uniqueSources: new Set(credits.map((item) => item.id)).size,
            unused,
        },
        null,
        4,
    ),
);
console.log(
    JSON.stringify({ contentImages: inventory.length, photos: credits.length, unused }, null, 2),
);
