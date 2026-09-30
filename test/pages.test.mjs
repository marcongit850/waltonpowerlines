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
  ["contact/index.html", "https://waltonpowerlines.com/contact/"],
  ["404.html", null]
];

const home = readFileSync("index.html", "utf8");
assert.match(home, /<h1>A Case for Studying Underground Power Lines in Walton County<\/h1>/);
assert.match(home, /<p class="subhead">Exploring a practical, phased approach to moving overhead utilities underground — one corridor and community at a time\.<\/p>/);
assert.match(home, /<h2>Contact Us<\/h2>/);
assert.match(home, /href="contact\/">Contact Us</);
assert.equal(home.includes("Get involved"), false);
assert.equal(home.includes("get-involved"), false);
assert.equal(home.includes("An independent civic explainer"), false);

const footer = readFileSync("footer.js", "utf8");
assert.match(footer, /Independent civic information site\. Walton Power Lines is not affiliated with Walton County, FPL, CHELCO, or any other utility\. No undergrounding project, tax, assessment, budget, or construction schedule has been adopted\./);
assert.match(footer, /© 2026 Walton Power Lines/);
assert.match(footer, /Research &amp; Documents/);

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
  "https://waltonpowerlines.com/contact/"
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

const contactPage = readFileSync("contact/index.html", "utf8");
assert.match(contactPage, /<title>Contact Walton Power Lines<\/title>/);
assert.match(contactPage, /<h1>Questions or comments\?<\/h1>/);
assert.match(contactPage, /<p class="kicker">Contact Us<\/p>/);
assert.match(contactPage, /name="community"/);
assert.match(contactPage, /name="role"/);
assert.match(contactPage, /Community or neighborhood/);
assert.match(contactPage, /does not subscribe you to a list/);
assert.match(contactPage, /not published on this site/);
assert.equal(contactPage.includes("A note, not a vote"), false);
assert.match(contactPage, /action="\/api\/contact"/);
assert.match(contactPage, /<h2>Contact Us<\/h2>/);
assert.match(contactPage, />Submit</);
assert.equal(contactPage.includes("mailto:"), false);
assert.equal(contactPage.includes("hello@"), false);
assert.equal(contactPage.includes("No account is required"), false);
assert.equal(contactPage.includes("Get involved"), false);
assert.equal(contactPage.includes("Interest form"), false);
assert.equal(contactPage.includes("What this note is"), false);
assert.equal(contactPage.includes("Neighborhood or community"), false);
assert.equal(contactPage.includes("name=\"study\""), false);
assert.equal(contactPage.includes("Say what community you are in"), false);
assert.equal(contactPage.includes("Checking the study box"), false);
assert.equal(existsSync("get-involved/index.html"), false);

const site = readFileSync("site.js", "utf8");
assert.match(site, /\/api\/contact/);
assert.equal(site.includes("mailto:"), false);
assert.match(site, /Thank you\. Your note is on its way\./);

assert.equal(footer.includes("mailto:"), false);
assert.equal(footer.includes("hello@"), false);
assert.equal(footer.includes("Updated September"), false);
assert.match(footer, /Independent civic information site/);

const header = readFileSync("header.js", "utf8");
assert.match(header, /alt="Walton Power Lines"/);
assert.match(header, /images\/logo-lockup\.png/);
assert.match(header, /href: root \+ "contact\/", label: "Contact Us"/);
assert.match(footer, /href: root \+ "contact\/", label: "Contact Us"/);
assert.equal(header.includes("get-involved"), false);
assert.equal(footer.includes("get-involved"), false);

const redirects = readFileSync("_redirects", "utf8");
assert.match(redirects, /\/get-involved \/contact\/ 301/);
assert.match(redirects, /\/get-involved\/ \/contact\/ 301/);

const faq = readFileSync("faq/index.html", "utf8");
assert.match(faq, /<h1>Common questions<\/h1>/);
assert.match(faq, /Short answers about phased undergrounding in Walton County\./);
assert.equal(faq.includes("limits left in"), false);
assert.equal(faq.includes("someone else’s data"), false);

assert.match(home, /images\/hero-inlet-beach\.jpg/);
assert.match(home, /What is actually being proposed\?/);
assert.match(home, /A feasibility study — not a construction project\./);
assert.match(home, /No construction project, tax, assessment, budget, utility commitment, or schedule has been adopted\./);
assert.match(home, /Potential benefits — and tradeoffs/);
assert.match(home, /Learn About Costs &amp; Funding/);
assert.match(home, /See How Undergrounding Works/);
assert.match(home, /See Real-World Examples/);
assert.match(home, /Explore a Phased Approach/);
assert.match(readFileSync("why/index.html", "utf8"), /Underground does not mean outage-proof/);
assert.match(readFileSync("why/index.html", "utf8"), /Information and sources last reviewed September 2026/);
assert.match(readFileSync("phased-approach/index.html", "utf8"), /Stopping is an acceptable outcome/);
assert.match(readFileSync("how-it-works/index.html", "utf8"), /The wires move underground\. The equipment does not disappear\./);
assert.match(readFileSync("cost-funding/index.html", "utf8"), /There is no Walton County price yet/);
assert.match(readFileSync("cost-funding/index.html", "utf8"), /would largely be speculation/);
assert.match(readFileSync("cost-funding/index.html", "utf8"), /Study first\. Funding decision later/);
assert.match(faq, /What is actually being proposed right now\?/);
assert.match(faq, /Is this a proposal to raise taxes\?/);
assert.match(faq, /Undergrounding changes the risks\. It reduces exposure to wind, trees, and falling debris while introducing different repair, flooding, excavation, and equipment-access considerations\./);
assert.equal(faq.includes("trades one set of problems"), false);
const documents = readFileSync("documents/index.html", "utf8");
assert.equal(documents.includes("The library is empty on purpose"), false);
assert.match(documents, /Research &amp; Documents/);
assert.match(documents, /These documents do not exist yet/);
assert.match(documents, /Information and sources last reviewed September 2026/);
const start = readFileSync("where-to-start/index.html", "utf8");
assert.equal(start.includes("Miramar Beach sits at the eastern end"), false);
assert.equal(start.includes("Miramar Beach is at the western end"), false);
assert.match(start, /not the western end of Scenic Highway 30A/);
assert.match(start, /near Dune Allen/);
assert.match(start, /Miramar Beach lies west of the 30A corridor/);
assert.match(start, /CHELCO/);
const map = readFileSync("maps/index.html", "utf8");
assert.match(map, /West is toward Miramar Beach/);
assert.equal(map.includes("West is toward Inlet Beach"), false);
assert.match(map, /Dune Allen/);
assert.match(map, /Orientation only — not a proposed construction map/);
assert.match(map, /These detailed maps do not exist yet/);
assert.equal(map.includes("from Miramar Beach in the west"), false);
assert.match(map, /Bay County/);
assert.match(readFileSync("why/index.html", "utf8"), /images\/why-grayton-beach\.jpg/);
assert.match(readFileSync("examples/index.html", "utf8"), /example-mark/);

const how = readFileSync("how-it-works/index.html", "utf8");
assert.equal(how.includes("This drawing is a teaching sketch"), false);
assert.equal(how.includes("not a before-and-after photo"), false);
assert.equal(how.includes("pole-to-pad"), false);
assert.equal(how.includes("Pole and wires"), false);
assert.equal(how.includes("Pad-mounted box"), false);
assert.match(how, /Overhead today/);
assert.match(how, /After undergrounding/);
assert.match(how, /The drawing is not to scale/);
assert.equal(readFileSync("styles.css", "utf8").includes(".pole-to-pad"), false);

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
for (const file of ["index.html", "footer.js", "header.js", "site.js", "contact/index.html", "faq/index.html", "README.md", "styles.css"]) {
  const text = readFileSync(file, "utf8");
  for (const phrase of banned) {
    assert.equal(text.includes(phrase), false, file + " contains " + phrase);
  }
}

const pkg = JSON.parse(readFileSync("package.json", "utf8"));
assert.ok(pkg.devDependencies.wrangler, "wrangler dependency");
assert.equal(pkg.scripts.dev.includes("wrangler"), true);

console.log("pages.test.mjs ok");
