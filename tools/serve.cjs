const http = require("http");
const fs = require("fs");
const path = require("path");
const root = path.resolve(__dirname, "..");
const types = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css",
    ".js": "text/javascript",
    ".svg": "image/svg+xml",
    ".webp": "image/webp",
    ".json": "application/json",
    ".xml": "application/xml",
};
http.createServer((req, res) => {
    const relative =
        decodeURIComponent(new URL(req.url, "http://localhost").pathname).replace(/^\/+/, "") ||
        "index.html";
    const target = path.resolve(root, relative);
    if (!target.startsWith(root + path.sep)) {
        res.writeHead(403);
        return res.end("Forbidden");
    }
    fs.readFile(target, (err, data) => {
        if (err) {
            res.writeHead(404);
            return res.end("Not found");
        }
        res.writeHead(200, {
            "Content-Type": types[path.extname(target)] || "application/octet-stream",
        });
        res.end(data);
    });
}).listen(4173, "127.0.0.1", () => console.log("Stillwater preview: http://127.0.0.1:4173"));
