const fs = require('fs');
const path = require('path');
const pages = fs.readdirSync('pages').filter(x => x.endsWith('.html'));
const audit = pages.map(file => {
    const html = fs.readFileSync('pages/' + file, 'utf8');
    const sections = [...html.matchAll(/<section\b[^>]*aria-label="([^"]+)"/g)].map(x => x[1]);
    const headings = [...html.matchAll(/<h[123][^>]*>([\s\S]*?)<\/h[123]>/g)].map(x => x[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim());
    const images = [...html.matchAll(/<img\b[^>]*src="([^"]+)"/g)].map(x => x[1]);
    return {file, sections, headings, images, forms: (html.match(/<form/g) || []).length, header: html.includes('main-nav'), footer: html.includes('site-footer')};
});
fs.writeFileSync('tests/audit-before.json', JSON.stringify(audit, null, 4));
audit.forEach(x => console.log(`${x.file}: ${x.sections.length} sections, ${x.images.length} images, ${x.forms} forms | ${x.sections.join(' / ')}`));
console.log('CSS and JS inspected:', fs.readdirSync('assets/css').join(', '), fs.readdirSync('assets/js').join(', '));
