import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";

const pages = [
  ["index.html", "https://waltonpowerlines.com/"],
  ["why/index.html", "https://waltonpowerlines.com/why/"],
  ["phased-approach/index.html", "https://waltonpowerlines.com/phased-approach/"],
  ["where-to-start/index.html", "https://waltonpowerlines.com/where-to-start/"],
  ["cost-funding/index.html", "https://waltonpowerlines.com/cost-funding/"],
  ["how-it-works/index.html", "https://waltonpowerlines.com/how-it-works/"],
  ["faq/index.html", "https://waltonpowerlines.com/faq/"],
  ["examples/index.html", "https://waltonpowerlines.com/examples/"],
  ["maps/index.html", "https://waltonpowerlines.com/maps/"],
  ["documents/index.html", "https://waltonpowerlines.com/documents/"],
  ["get-involved/index.html", "https://waltonpowerlines.com/get-involved/"],
  ["404.html", null]
];

const home = readFileSync("index.html", "utf8");
assert.match(home, /<h1>A Long-Term Plan for Undergrounding Walton County’s Power Lines<\/h1>/);
assert.match(home, /<p class="subhead">Exploring a practical, phased approach to moving overhead utilities underground — one corridor and community at a time\.<\/p>/);

const footer = readFileSync("footer.js", "utf8");
assert.match(footer, /not an official Walton County project/);
assert.match(footer, /does not set a timeline, a budget, or a construction plan/);

for (const [file, canonical] of pages) {
  assert.ok(existsSync(file), file);
  const html = readFileSync(file, "utf8");
  assert.match(html, /<html lang="en">/, file);
  assert.match(html, /name="viewport"/, file);
  assert.match(html, /header\.js/, file);
  assert.match(html, /footer\.js/, file);
  assert.match(html, /styles\.css/, file);
  assert.match(html, /id="content"/, file);
  assert.match(html, /property="og:title"|name="robots" content="noindex"/, file);
  if (canonical) {
    assert.ok(html.includes(canonical), file + " canonical");
  }
}

const sitemap = readFileSync("sitemap.xml", "utf8");
for (const loc of [
  "https://waltonpowerlines.com/",
  "https://waltonpowerlines.com/why/",
  "https://waltonpowerlines.com/phased-approach/",
  "https://waltonpowerlines.com/where-to-start/",
  "https://waltonpowerlines.com/cost-funding/",
  "https://waltonpowerlines.com/how-it-works/",
  "https://waltonpowerlines.com/faq/",
  "https://waltonpowerlines.com/examples/",
  "https://waltonpowerlines.com/maps/",
  "https://waltonpowerlines.com/documents/",
  "https://waltonpowerlines.com/get-involved/"
]) {
  assert.ok(sitemap.includes(loc), loc);
}

const robots = readFileSync("robots.txt", "utf8");
assert.match(robots, /Sitemap: https:\/\/waltonpowerlines\.com\/sitemap\.xml/);

const wrangler = readFileSync("wrangler.jsonc", "utf8");
assert.match(wrangler, /"name": "waltonpowerlines"/);

const examples = readFileSync("examples/index.html", "utf8");
for (const host of [
  "www.fpl.com/reliability/storm-secure-underground-program.html",
  "www.energy.gov/sites/default/files/2024-06/060624_GDO_LBNL_Duke_Energy_Florida_Undergrounding.pdf",
  "undergrounding.info/",
  "docs.cpuc.ca.gov",
  "www.centerpointenergy.com",
  "interchange.puc.texas.gov"
]) {
  assert.ok(examples.includes(host), host);
}

const involved = readFileSync("get-involved/index.html", "utf8");
assert.match(involved, /mailto:hello@waltonpowerlines\.com/);
assert.match(involved, /feasibility study/);
assert.match(readFileSync("site.js", "utf8"), /mailto:/);

for (const asset of ["favicon.svg", "favicon.ico", "favicon-16x16.png", "favicon-32x32.png", "apple-touch-icon.png", "images/og.png"]) {
  assert.ok(existsSync(asset), asset);
}

const pkg = JSON.parse(readFileSync("package.json", "utf8"));
assert.ok(pkg.devDependencies.wrangler, "wrangler dependency");
assert.equal(pkg.scripts.dev.includes("wrangler"), true);

console.log("pages.test.mjs ok");
