// The only site footer. Pages load this script where the footer should appear.
// Relative links follow the script src: each "../" is one directory above the site root.
(function () {
  var script = document.currentScript;
  if (!script) return;

  var src = script.getAttribute("src") || "";
  var depth = 0;
  while (src.indexOf("../") === 0) {
    depth += 1;
    src = src.slice(3);
  }
  var root = depth === 0 ? "./" : "../".repeat(depth);

  var pages = [
    { href: root, label: "Home" },
    { href: root + "why/", label: "Why this matters" },
    { href: root + "phased-approach/", label: "Phased approach" },
    { href: root + "where-to-start/", label: "Where to start" },
    { href: root + "how-it-works/", label: "How it works" },
    { href: root + "cost-funding/", label: "Cost and funding" },
    { href: root + "examples/", label: "Examples" },
    { href: root + "faq/", label: "FAQ" },
    { href: root + "maps/", label: "Maps" },
    { href: root + "documents/", label: "Documents" },
    { href: root + "contact/", label: "Contact Us" }
  ];

  var links = pages.map(function (page) {
    return '<a href="' + page.href + '">' + page.label + "</a>";
  }).join("\n      ");

  script.insertAdjacentHTML("beforebegin", [
    '<footer class="site-footer">',
    '  <div class="wrap footer-grid">',
    "    <div>",
    '      <p class="footer-name">Walton Power Lines</p>',
    "      <p>A plain-language look at a long-term idea: moving overhead power and utility lines underground in Walton County, Florida, one corridor at a time. Scenic Highway 30A and Miramar Beach are the suggested place to start a study.</p>",
    '      <p class="legal">Civic education and exploration only. This is not an official Walton County project, not a utility project, and not an adopted policy. Nothing here is an endorsement by Walton County, a municipality, or any electric or communications utility. This site does not set a timeline, a budget, or a construction plan.</p>',
    "    </div>",
    '    <nav class="footer-nav" aria-label="Footer">',
    "      " + links,
    "    </nav>",
    "  </div>",
    "</footer>"
  ].join("\n"));
})();
