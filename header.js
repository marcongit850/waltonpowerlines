// The only site header. Pages load this script where the header should appear.
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

  var path = location.pathname || "/";
  if (path.slice(-11) === "/index.html") path = path.slice(0, -10);
  else if (path.slice(-5) === ".html") path = path.slice(0, path.lastIndexOf("/") + 1);
  if (path.slice(-1) !== "/") path += "/";

  var pages = [
    { href: root, label: "Home", current: path === "/" },
    { href: root + "why/", label: "Why", current: path.indexOf("/why/") !== -1 },
    { href: root + "phased-approach/", label: "Phased approach", current: path.indexOf("/phased-approach/") !== -1 },
    { href: root + "where-to-start/", label: "Where to start", current: path.indexOf("/where-to-start/") !== -1 },
    { href: root + "how-it-works/", label: "How it works", current: path.indexOf("/how-it-works/") !== -1 },
    { href: root + "cost-funding/", label: "Cost", current: path.indexOf("/cost-funding/") !== -1 },
    { href: root + "examples/", label: "Examples", current: path.indexOf("/examples/") !== -1 },
    { href: root + "faq/", label: "FAQ", current: path.indexOf("/faq/") !== -1 },
    { href: root + "contact/", label: "Contact Us", current: path.indexOf("/contact/") !== -1 }
  ];

  var links = pages.map(function (page) {
    var attrs = page.current ? ' aria-current="page"' : "";
    return '<a href="' + page.href + '"' + attrs + ">" + page.label + "</a>";
  }).join("\n        ");

  script.insertAdjacentHTML("beforebegin", [
    '<a class="skip-link" href="#content">Skip to content</a>',
    '<header class="site-header">',
    '  <div class="wrap header-inner">',
    '    <a class="brand" href="' + root + '">',
    '      <img class="brand-lockup" src="' + root + 'images/logo-lockup.png" alt="Walton Power Lines">',
    "    </a>",
    '    <details class="nav-disclosure">',
    '      <summary class="menu-toggle">Menu</summary>',
    '      <nav class="nav" id="site-nav" aria-label="Primary">',
    "        " + links,
    "      </nav>",
    "    </details>",
    "  </div>",
    "</header>"
  ].join("\n"));

  var disclosure = document.querySelector(".nav-disclosure");
  var desktopNav = window.matchMedia("(min-width: 1040px)");
  function syncDesktopNav() {
    if (!disclosure) return;
    if (desktopNav.matches) disclosure.setAttribute("open", "");
    else disclosure.removeAttribute("open");
  }
  syncDesktopNav();
  if (desktopNav.addEventListener) desktopNav.addEventListener("change", syncDesktopNav);

  var nav = document.getElementById("site-nav");
  if (nav) {
    nav.addEventListener("click", function (event) {
      if (event.target && event.target.tagName === "A" && !desktopNav.matches && disclosure) {
        disclosure.removeAttribute("open");
      }
    });
  }
})();
