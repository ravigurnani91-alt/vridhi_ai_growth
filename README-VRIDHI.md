# Vridhi umbrella platform — first website foundation

This branch contains the first static homepage concept for Vridhi.

## Files
- `index.html` — homepage and division structure
- `styles.css` — responsive editorial design
- `script.js` — mobile navigation and sample quiz interaction
- `docs/VRIDHI_FOUNDATION.md` — business and editorial foundation

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
The homepage is a visual and structural foundation. The daily brief, article library, newsletter capture, search, accounts, payments, publishing workflow and content feeds are not yet connected. The sample quiz is local browser interaction only. All editorial content must be researched, sourced and reviewed before publication.
