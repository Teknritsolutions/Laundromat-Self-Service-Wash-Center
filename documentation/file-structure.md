# Project structure

```text
Laundromat & SelfService Wash Center/
├── index.html                 # Redirects to pages/index.html
├── pages/
│   ├── index.html             # Homepage 1
│   ├── index-2.html           # Homepage 2
│   ├── about.html
│   ├── services.html
│   ├── service-details.html
│   ├── pricing.html
│   ├── locations.html
│   ├── blog.html
│   ├── blog-details.html
│   ├── contact.html
│   ├── 404.html
│   └── coming-soon.html
├── assets/
│   ├── css/                   # Bootstrap and shared stylesheets and standalone utility styles
│   ├── js/                    # Bootstrap and main.js
│   └── images/
│       ├── brand/             # Logos, monogram and favicon
│       ├── home-1/
│       ├── home-2/
│       ├── about/
│       ├── services/
│       ├── locations/
│       ├── blog/
│       ├── contact/
│       ├── utility/
│       └── image-manifest.txt
├── documentation/
│   ├── index.html
│   ├── file-structure.md
│   ├── image-inventory.json
│   ├── image-placements.json
│   └── photo-credits.json
├── tools/
│   ├── build.cjs              # Shared HTML generator
│   ├── refine.cjs             # Individual page compositions
│   ├── brand.cjs              # Original SVG brand assets
│   ├── utility-pages.cjs       # Standalone 404 and launch layouts
│   ├── docs.cjs
│   └── serve.cjs
├── tests/                     # Browser checks, reports and screenshots
├── README.md
├── sitemap.xml
├── robots.txt
├── package.json
├── package-lock.json
├── .prettierrc.json
├── .prettierignore
└── .gitignore
```

Both homepages and every inner page live in `pages/`. All production images are local and listed in the manifest; old unused imagery has been removed.

Edit generated HTML directly, or edit `tools/build.cjs` and `tools/refine.cjs` before running `npm run build`. Rebuilding overwrites generated pages and documentation. The build formats HTML and shared styles with four-space indentation.

Deploy the root entry, `pages/`, `assets/`, `documentation/`, `robots.txt` and `sitemap.xml`. `node_modules/`, `tools/` and `tests/` are development files.
