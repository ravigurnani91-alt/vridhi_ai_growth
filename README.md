# Vridhi — People. Planet. Progress.

The environmental website for Vridhi, rooted in Udaipur, Rajasthan.

## Hosting: GitHub Pages only

The Next.js app is exported as a static site and deployed by GitHub Actions. No Vercel or other hosting platform is used.

### GitHub Pages setup (one-time)
1. Open repository **Settings → Pages**.
2. Under **Build and deployment → Source**, select **GitHub Actions**.
3. Open the **Actions** tab and check the **Deploy Vridhi to GitHub Pages** workflow. If the first run failed before Pages was enabled, re-run it after selecting GitHub Actions.
4. The project preview URL will be `https://ravigurnani91-alt.github.io/vridhi_ai_growth/`.

### Custom domain: vridhi.ink
Do not change the domain's DNS until the existing live website has been backed up and the new GitHub Pages preview has been checked.

For a custom workflow, the custom domain must be entered separately in **Settings → Pages → Custom domain**; a CNAME file in the workflow artifact does not set the domain. After adding the domain in GitHub, update the DNS provider. For an apex domain, GitHub Pages uses A records:
- `185.199.108.153`
- `185.199.109.153`
- `185.199.110.153`
- `185.199.111.153`

For `www`, use a CNAME to `ravigurnani91-alt.github.io`. Check existing records first and preserve MX/email records. DNS changes are not made by this repository.

The workflow currently builds for the project preview path `/vridhi_ai_growth`. When the custom domain is ready, change the workflow's `GITHUB_PAGES_BASE_PATH` value to an empty string and redeploy.

## Local development
Requires Node.js 20+.

```bash
npm install
npm run dev
```

Production static export:

```bash
npm run build
```

Generated files are in `out/`.

## Preservation / rollback
- `main` remains unchanged and contains the earlier AI Growth & Outreach prototype.
- `backup-before-environmental-site-2026-11-07` is a snapshot of that repository's original main branch.
- `environmental-site` contains the environmental website and Pages workflow.

**Important:** The backup branch above is a backup of the GitHub repository's original code, not yet a verified backup of the currently live `vridhi.ink` website. Do not repoint the domain until the live site's actual source/hosting has been identified and backed up.

## Publishing integrity
This is an initial public-facing foundation, not a claim that Vridhi is already a registered NGO or that projects, partnerships, or impact metrics are operational. Add verified organisational details and project updates as they become available.
