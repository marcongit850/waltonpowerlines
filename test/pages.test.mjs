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
assert.match(wrangler, /"main": "src\/worker\.js"/);
assert.match(wrangler, /\/api\/contact/);
assert.equal(wrangler.includes("re_"), false);

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
assert.match(involved, /action="\/api\/contact"/);
assert.match(involved, /feasibility study/);
assert.match(involved, />Submit</);
assert.equal(involved.includes("mailto:"), false);
assert.equal(involved.includes("hello@"), false);
assert.equal(involved.includes("No account is required"), false);

const site = readFileSync("site.js", "utf8");
assert.match(site, /\/api\/contact/);
assert.equal(site.includes("mailto:"), false);
assert.match(site, /Thank you\. Your note is on its way\./);

assert.equal(footer.includes("mailto:"), false);
assert.equal(footer.includes("hello@"), false);
assert.equal(footer.includes("Updated September"), false);
assert.match(footer, /not an official Walton County project/);

const header = readFileSync("header.js", "utf8");
assert.match(header, /alt="Walton Power Lines"/);
assert.match(header, /images\/logo-lockup\.png/);

const faq = readFileSync("faq/index.html", "utf8");
assert.match(faq, /<h1>Common questions<\/h1>/);
assert.match(faq, /Short answers about phased undergrounding in Walton County\./);
assert.equal(faq.includes("limits left in"), false);
assert.equal(faq.includes("someone else’s data"), false);

assert.match(home, /images\/hero-inlet-beach\.jpg/);
assert.match(readFileSync("why/index.html", "utf8"), /images\/why-grayton-beach\.jpg/);
assert.match(readFileSync("examples/index.html", "utf8"), /example-mark/);

for (const asset of [
  "favicon.ico",
  "favicon-16x16.png",
  "favicon-32x32.png",
  "apple-touch-icon.png",
  "images/og.png",
  "images/logo-lockup.png",
  "images/hero-inlet-beach.jpg",
  "images/why-grayton-beach.jpg",
  "images/where-western-lake.jpg",
  "images/involved-miramar-beach.jpg",
  "src/worker.js",
  "src/contact.js"
]) {
  assert.ok(existsSync(asset), asset);
}

assert.equal(existsSync("favicon.svg"), false);

const banned = ["hello@waltonpowerlines.com", "mailto:", "Updated September", "No account is required"];
for (const file of ["index.html", "footer.js", "header.js", "site.js", "get-involved/index.html", "faq/index.html", "README.md", "styles.css"]) {
  const text = readFileSync(file, "utf8");
  for (const phrase of banned) {
    assert.equal(text.includes(phrase), false, file + " contains " + phrase);
  }
}

const pkg = JSON.parse(readFileSync("package.json", "utf8"));
assert.ok(pkg.devDependencies.wrangler, "wrangler dependency");
assert.equal(pkg.scripts.dev.includes("wrangler"), true);

console.log("pages.test.mjs ok");
