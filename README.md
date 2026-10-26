# Stillwater Laundry

Complete responsive HTML template built in the existing project folder. Two distinct homepages and ten inner/utility pages. No framework or production backend.

## Setup

Open pages/index.html, or run npm install, npm run dev and visit http://127.0.0.1:4173. Run npm test in a second terminal for the responsive and interaction checks.

## Deployment

Publish the repository root directory. Its index.html automatically opens Home Page 1 at pages/index.html. For GitHub Pages, select the main branch and / (root) in Settings > Pages.

## Pages

Home 1, Home 2, About, Services, Self-service details, Pricing, Locations, Blog, Article, Contact, 404, Coming Soon.

## Features

Bootstrap 5, local assets, persistent light/dark themes, RTL, accessible navigation and FAQ, branch filtering, validated demo forms, countdown, favicon, metadata and structured data.

## Structure

- assets/css: vendor and shared theme styles
- assets/js: Bootstrap and interactions
- assets/images: 39 stock photos, four original AI-generated images, a fabric-care diagram and SVG brand assets
- pages: both homepages and all inner pages
- documentation: customization guide and image inventory
- tools: development server and optional page generator
- tests: QA script, report and screenshots

## Customization

Read documentation/index.html. The final HTML is ready to edit. npm run build formats and validates these files without regenerating the website. The optional tools/build.cjs and other generation scripts overwrite edited files; they are no longer part of the default build. Brand details, rates, branches, reviews and opening date are fictional. Forms demonstrate validation without sending data.

## Credits

Bootstrap 5.3.3 (MIT), Manrope and Inter (SIL OFL), locally stored Pexels and Unsplash photography. Individual photo and license links are in documentation. SVG illustrations and icons were made for this template. The placement manifest and individual source credits accompany the new imagery.

## Browser support

Modern Chromium, Firefox and Safari intended. Automated QA uses installed Microsoft Edge. Replace demo domain URLs, policies, images and business data before production deployment. Performance targets are design goals, not a measured score.
