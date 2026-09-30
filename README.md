# Walton Power Lines

A civic information site about a practical idea: phased undergrounding of overhead power and utility lines in Walton County, Florida, starting with a study of Scenic Highway 30A and Miramar Beach.

The pages are static HTML, CSS, and JavaScript. They explain the idea in plain language. They are not a Walton County plan, not a utility plan, and not a budget.

The Worker name is **`waltonpowerlines`**. Leave that name in `wrangler.jsonc`. A Cloudflare Workers Builds project deploys the Worker it is tied to. Renaming the Worker creates a different one, and an existing project would stop updating this site.

## Preview

From the repository root, the static pages are enough. The interest form opens the visitor’s email app. It does not call a server.

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080/`.

The same pages through Wrangler:

```bash
npm install
npm run dev
```

```bash
npm test
```

## Deploy

Cloudflare Workers Builds deploys this repository with `npx wrangler deploy`, using `wrangler.jsonc`.

- `"name"` must stay `waltonpowerlines`.
- `assets.directory` is `.`, so `index.html` at the repository root is the home page.
- There is no `"main"` script. This version does not use Worker variables or secrets. An assets-only Worker cannot hold them. If a form endpoint is added later, add a script then, and do not commit secrets.

Custom DNS for waltonpowerlines.com is not part of this repository. Attach the domain in Cloudflare after the Worker exists.

## Logo

The header, favicon, and social image use a placeholder: the words “Walton Power Lines” plus a simple pole-to-conduit mark. Marc will supply the real logo. Replace `favicon.svg`, the PNG and ICO favicons, `images/og.png`, and the inline mark in `header.js` when that file arrives.

## Contact address

The public address in the footer and on `/get-involved/` is `hello@waltonpowerlines.com`. It is a placeholder until a mailbox is connected. Change it in `footer.js`, `get-involved/index.html`, and `site.js` together.

## Pages

- `/` — the long-term idea, from why it matters through how to get involved
- `/why/` — benefits and limits
- `/phased-approach/` — corridor by corridor, bundled with other street work
- `/where-to-start/` — 30A and Miramar Beach as a suggested study focus
- `/cost-funding/` — funding options under evaluation, with no Walton budget
- `/how-it-works/` — diagram and what stays above ground
- `/faq/`
- `/examples/` — sourced programs elsewhere
- `/maps/` — a schematic only
- `/documents/` — empty library
- `/get-involved/` — mailto interest form

## Example sources used

Facts on `/examples/` and the pages that cite them come from these public sources. Figures are dated in the page copy. They are not Walton County costs.

1. **Florida Power & Light, Storm Secure Underground Program** — [fpl.com](https://www.fpl.com/reliability/storm-secure-underground-program.html). Neighborhood laterals inside the storm protection plan; no upfront charge on selected projects; voluntary conversions paid by the community; FPL’s own 2024 hurricane comparison.
2. **FPL 2024 Storm Protection Plan annual status report** (Florida Public Service Commission) — six municipalities and nine voluntary projects in 2024. [PDF](https://www.floridapsc.com/pscfiles/website-files/PDF/Utilities/Electricgas/StormProtectionPlans/2024/2024%20Florida%20Power%20%26%20Light%20Company%20SPP%20Annual%20Status%20Report%20.pdf).
3. **U.S. Department of Energy / Lawrence Berkeley National Laboratory, June 2024** — Duke Energy Florida targeted undergrounding, including the 196 line-miles / about $207 million (2020–2022) and the planned miles and dollars through 2032, as stated in that study. Also recounts the Florida Public Service Commission’s 2005 preliminary statewide distribution estimate of $94.5 billion. [PDF](https://www.energy.gov/sites/default/files/2024-06/060624_GDO_LBNL_Duke_Energy_Florida_Undergrounding.pdf).
4. **Town of Palm Beach undergrounding project** — phased town-wide conversion. [Project site](https://undergrounding.info/), [Phase 8 called the last phase](https://www.townofpalmbeach.com/Calendar.aspx?EID=3095), [2026 construction notes](https://www.townofpalmbeach.com/m/newsflash), [January 2018 update on $9 million commercial paper for the initial phases](https://undergrounding.info/wp-content/uploads/2018/01/JAN-2018-UNDERGROUNDING-OF-UTILITIES-TOWN-UPDATE-1.pdf).
5. **California Public Utilities Commission** — Rule 20 history, what underground equipment includes, and longer fault-finding. [Program description](https://www.cpuc.ca.gov/industries-and-topics/electrical-energy/infrastructure/electric-reliability/undergrounding-program-description), [Rule 20](https://www.cpuc.ca.gov/industries-and-topics/electrical-energy/infrastructure/electric-reliability/undergrounding-program-description/rule-20), [Decision 21-06-013](https://docs.cpuc.ca.gov/PublishedDocs/Published/G000/M387/K099/387099230.PDF), [Decision 23-06-008](https://docs.cpuc.ca.gov/PublishedDocs/Published/G000/M511/K130/511130681.PDF).
6. **CenterPoint Energy, Greater Houston** — targeted undergrounding. [May 6, 2025 news release (400 miles)](https://www.centerpointenergy.com/en-us/about-us/news/2025/may/ghri-phase-two-update-centerpoint-energy-co-123074), [later company summary (430+ miles)](https://assets.centerpointenergy.com/api/public/content/ghri-2026-summary-0414.pdf?v=f1e22585), [June 12, 2025 settlement in PUCT Docket 57579](https://interchange.puc.texas.gov/Documents/57579_261_1507610.PDF) (estimated $837 million for the strategic undergrounding measure, and the three target types).

Other pages also cite CHELCO’s service-area statement, the Gulf Power merger into FPL, Florida Statutes sections 366.96 and 125.01, Florida Administrative Code rules 25-6.078 and 25-6.115, the 2019 House staff analysis of the storm-protection law, the Florida Office of Economic and Demographic Research handbook on MSTUs and MSBUs, and a Florida Public Service Commission staff audit describing Duke’s underground flood-mitigation program.
