# Vridhi umbrella platform — first website foundation

This branch contains the Vridhi umbrella website: a shared homepage, four division destinations and an editorial standards page. It is a static GitHub Pages site designed to work without paid hosting or a backend at the foundation stage.

## Files
- `index.html` — umbrella homepage and daily editorial formats
- `discover/index.html` — Vridhi Discover subject library and browser-side filters
- `earth/index.html` — India-wide Vridhi Earth scope, research framework and source directory
- `originals/index.html` — Vridhi-owned publishing catalogue framework
- `experiences/index.html` — interactive quiz and local conversion tools
- `about/index.html` — mission, editorial principles and platform boundaries
- `404.html` — branded not-found page
- `robots.txt` and `sitemap.xml` — basic search-engine discovery
- `styles.css` — shared responsive editorial design
- `script.js` — navigation, filters, quiz and local conversion interactions
- `docs/VRIDHI_FOUNDATION.md` — business, editorial, audience and product foundation

## Preview locally
Open `index.html` in a browser. The visual font imports use Google Fonts; if unavailable, the site falls back to system fonts.

## Publish using GitHub Pages
1. Open the repository Settings → Pages.
2. Under Build and deployment, choose **Deploy from a branch**.
3. Select branch `foundation/vridhi-umbrella` and folder `/ (root)`.
4. Save and wait for GitHub Pages to publish.
5. Test the generated `github.io` address before connecting the custom domain.

Do not change the custom domain DNS until the GitHub Pages preview works and the current live-site arrangement has been checked. If the domain is currently serving another site, preserve its DNS records and take a backup before changing them.

## Important deployment note
The repository's existing `main` branch contains a Next.js AI Growth Engine prototype. This umbrella homepage is a separate static-site experiment on its own branch. Do not merge or replace the existing `main` branch until the new site has been reviewed and the deployment plan is confirmed.

## Prototype limitations
The website now has a complete static umbrella structure and division landing pages. Discover subject filters, the Experiences sample quiz and unit converters run locally in the browser. The homepage's daily editorial formats are a publishing framework, not live or scheduled feeds. The Earth page links to primary research portals but does not claim live data integration, exhaustive state/district monitoring or independent sensor measurements. The Originals page presents planned product lines, not titles already for sale. Newsletter capture, article CMS, search across published articles, accounts, saved progress, payments, automated publishing, live feeds and dashboards are not yet connected. All editorial content must be researched, sourced and reviewed before publication.

## Vridhi Earth scope
Vridhi Earth is designed as an India-wide environmental intelligence vertical covering all states and union territories, with city/district-level issue tracking where credible sources permit. Global developments are included for relevant context and solutions. Udaipur is an optional early field-study location, not the boundary of coverage. The homepage and `docs/VRIDHI_FOUNDATION.md` describe the national-first scope and the planned geographic/evidence record structure.
