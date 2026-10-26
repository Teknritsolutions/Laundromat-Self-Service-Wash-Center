# Final website QA — October 6, 2026

The existing design was preserved. Repairs were made directly in the final HTML, CSS, JavaScript and local image assets.

## Scope and evidence

- Public pages: Home 1, Home 2, About, Services, Service Details, Pricing, Locations, Blog, Blog Details, Contact, 404 and Coming Soon. The root redirect and documentation links were also checked. No Login, Register or dashboard pages exist.
- Rendered widths: **320, 360, 375, 390, 412, 420, 430, 480, 576, 640, 768, 820, 912, 1024, 1280, 1366, 1440, 1536 and 1920 px**. Realistic viewport heights are recorded in the JSON reports.
- 912 public-page/width/theme/direction combinations passed the geometry audit: no document horizontal overflow, detected text overflow, section overlap or mismatched comparable-card baselines.
- 72 split-layout checks passed. All pages were rendered in light/dark mode and LTR/RTL; text contrast on solid backgrounds passed measured checks. Photo-overlay text was reviewed visually.
- 456 full-page screenshots cover every public page at all 19 widths in both themes. Another 72 cover mobile/tablet/desktop RTL. Screenshots are under `tests/screenshots/final/`.
- Visual review included full-page mobile, tablet and desktop overview/contact sheets, detailed mobile tiles, all original photographs and all four generated replacements. Automated rendering at every width is distinct from manual visual inspection of every screenshot.
- Navigation, Home dropdown, mobile Escape/focus behavior, theme/direction persistence, all demo forms, custom-select keyboard controls, Bootstrap FAQs, native detail accordions, seven article routes, branch search, root redirect and countdown passed functional checks. No JavaScript exceptions were reported.
- Local links, stylesheets, scripts, images and favicon references passed. No broken local resources were found.

## Repairs

1. Replaced four local photographs with contextually appropriate, optimized AI-generated images: washer capacities, tumble drying, bedding preparation and equipment maintenance. This also eliminated two visually duplicated photographs/crops. Old image contents were replaced in place; no additional unused image files were retained.
2. Corrected the related article topics, copy and links to match their fabric/knitwear/linen images. The featured bedding link now opens the bedding article. Article hero imagery and descriptions follow the selected topic. Reuse of a guide image on its own article page is intentional.
3. Updated actual intrinsic image dimensions, async decoding, alt text, image manifest and provenance. Optimized seven stock files that exceeded 200 KB. All 43 raster content images are now under 200 KB individually.
4. Stacked the mobile footer into one column and refined narrow-screen contact text so the email address fits without splitting mid-word.
5. Added theme-aware branding and skip links to the utility pages.
6. Preserved existing form descriptions and exposed required/error information on custom selects.
7. Preserved natural English punctuation and right alignment in the RTL preview.
8. Removed unused map-placeholder/help CSS and expanded reusable QA tests to all requested widths.
9. Changed the default build to format and validate the final files, preventing older generators from overwriting these repairs.

## Image inventory

There are **48 image assets**: 39 stock photographs, four AI-generated images, one fabric-care SVG, and four brand SVG assets. There are no identical SHA-256 hashes. Remaining stock photographs were compared visually for content relevance and repetition. All content images are local. No unreferenced content photographs were found, so no additional image files required deletion; the logo mark is retained as a brand asset.

- `assets/images/image-manifest.txt`: page, section and purpose for all 44 content images.
- `documentation/complete-image-inventory.json`: every image file, format, dimensions, byte size, hash and references.
- `documentation/image-audit.json`: rendered image information and placements.
- `documentation/photo-credits.json`: stock provenance and generated-image attribution.

## Limits

- Automated browser tests used installed Microsoft Edge. Firefox, Safari and physical devices were not tested.
- Google Maps embeds appeared blank in this environment; their responsive containers and external Open in Maps links were checked. The remote provider's display could not be verified. Google Fonts and Maps still require network access.
- Forms deliberately validate without transmitting. Branches, prices, availability, reviews, domain metadata and opening date remain explicitly fictional demo data. Connect real services and replace business data before production use.
- No Lighthouse/Core Web Vitals benchmark was performed. RTL is a layout preview of English content, not a translation.
- Optional generation tools remain available and can overwrite edited files if run explicitly; they are no longer invoked by the default build.

## Re-run

Start `npm run dev`, then run `npm test`, `npm run test:audit`, `npm run test:interactions` and `npm run test:assets`. Supplemental checks: `node tests/contrast-audit.cjs`, `node tests/layout-review.cjs`, `node tests/utility-review.cjs`, `node tests/capture-final.cjs`, and `node tests/capture-final.cjs --rtl`.

Machine-readable evidence is saved in `tests/qa-results.json`, `tests/final-audit-results.json`, `tests/layout-results.json`, `tests/contrast-results.json`, `tests/interaction-results.json`, `tests/capture-results.json` and `tests/capture-rtl-results.json`.
