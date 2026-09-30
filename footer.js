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
    { href: root + "documents/", label: "Research &amp; Documents" },
    { href: root + "contact/", label: "Contact Us" }
  ];

  var links = pages.map(function (page) {
    return '<a href="' + page.href + '">' + page.label + "</a>";
  }).join("\n      ");

  script.insertAdjacentHTML("beforebegin", [
    '<aside class="site-disclaimer">',
    '  <div class="wrap">',
    "    <p>Independent civic information site. Walton Power Lines is not affiliated with Walton County, FPL, CHELCO, or any other utility. No undergrounding project, tax, assessment, budget, or construction schedule has been adopted.</p>",
    "  </div>",
    "</aside>",
    '<footer class="site-footer">',
    '  <div class="wrap footer-grid">',
    "    <div>",
    '      <p class="footer-name">Walton Power Lines</p>',
    "      <p>A plain-language look at whether phased undergrounding in Walton County deserves a feasibility study.</p>",
    '      <p class="legal">Independent civic information site.</p>',
    '      <p class="copyright">© 2026 Walton Power Lines</p>',
    "    </div>",
    '    <nav class="footer-nav" aria-label="Footer">',
    "      " + links,
    "    </nav>",
    "  </div>",
    "</footer>"
  ].join("\n"));
})();
