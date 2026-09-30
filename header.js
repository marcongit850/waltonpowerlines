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
    { href: root + "get-involved/", label: "Get involved", current: path.indexOf("/get-involved/") !== -1 }
  ];

  var links = pages.map(function (page) {
    var attrs = page.current ? ' aria-current="page"' : "";
    return '<a href="' + page.href + '"' + attrs + ">" + page.label + "</a>";
  }).join("\n        ");

  var mark = [
    '<svg class="brand-mark" viewBox="0 0 48 48" aria-hidden="true" focusable="false">',
    '  <rect width="48" height="48" rx="10" fill="#0c3554"/>',
    '  <path d="M8 30.5h32" stroke="#c4a15a" stroke-width="1.6"/>',
    '  <path d="M16 10v20.5" stroke="#f7f4ee" stroke-width="2.2" stroke-linecap="round"/>',
    '  <path d="M10.5 15.5h11" stroke="#f7f4ee" stroke-width="2.2" stroke-linecap="round"/>',
    '  <path d="M16 15.5c8 0 10 5 14 9.5 2.2 2.5 4 4 8 4.5" fill="none" stroke="#7ecfc8" stroke-width="2.2" stroke-linecap="round"/>',
    '  <rect x="30" y="33" width="12" height="5" rx="1.5" fill="#1c8f86"/>',
    "</svg>"
  ].join("");

  script.insertAdjacentHTML("beforebegin", [
    '<a class="skip-link" href="#content">Skip to content</a>',
    '<header class="site-header">',
    '  <div class="wrap header-inner">',
    '    <a class="brand" href="' + root + '">',
    "      " + mark,
    '      <span class="brand-name"><span class="brand-walton">Walton</span><span class="brand-rest">Power Lines</span></span>',
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
