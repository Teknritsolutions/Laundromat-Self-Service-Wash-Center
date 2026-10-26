const fs = require("fs");
fs.mkdirSync("assets/images/brand", { recursive: true });
const mark = (color, accent) =>
    `<g fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="33" cy="33" r="28" stroke="${accent}" stroke-width="1.3"/><path d="M44 21c-5-5-19-5-22 2-4 9 23 9 21 18-2 7-16 9-23 3" stroke="${color}" stroke-width="2.8"/><path d="M17 52c6-3 10-3 16 0s10 3 16 0" stroke="${accent}" stroke-width="1.2"/></g>`;
for (const [name, color, accent] of [
    ["dark", "#172f40", "#967b52"],
    ["light", "#f6f4ee", "#d3bc96"],
])
    fs.writeFileSync(
        `assets/images/brand/logo-${name}.svg`,
        `<svg xmlns="http://www.w3.org/2000/svg" width="280" height="66" viewBox="0 0 280 66" role="img" aria-label="Stillwater Laundry and Wash Center"><title>Stillwater Laundry and Wash Center</title>${mark(color,accent)}<text x="76" y="36" fill="${color}" font-family="Georgia, 'Times New Roman', serif" font-size="35" font-weight="400" letter-spacing="-0.7">stillwater</text><text x="78" y="53" fill="${color}" font-family="Arial, sans-serif" font-size="8.8" font-weight="600" letter-spacing="1.1">LAUNDRY &amp; WASH CENTER</text></svg>`,
    );
fs.writeFileSync(
    "assets/images/brand/logo-mark.svg",
    `<svg xmlns="http://www.w3.org/2000/svg" width="66" height="66" viewBox="0 0 66 66" role="img" aria-label="Stillwater monogram">${mark("#172f40", "#967b52")}</svg>`,
);
fs.writeFileSync(
    "assets/images/brand/favicon.svg",
    `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><rect width="80" height="80" rx="18" fill="#172f40"/><g transform="translate(7 7)">${mark("#f6f4ee", "#d3bc96")}</g></svg>`,
);
