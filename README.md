# Vridhi — People. Planet. Progress.

The environmental website for Vridhi, rooted in Udaipur, Rajasthan.

## GitHub Pages deployment

This site is exported as a static Next.js website and published directly by GitHub Pages. No Vercel account or external hosting platform is used.

### Automatic deployment
- Production branch: `environmental-site`
- Workflow: `.github/workflows/deploy.yml`
- Every push to `environmental-site` triggers a static build and GitHub Pages deployment.
- Output directory: `out/`

### Custom domain
The site is configured for `vridhi.ink` through `public/CNAME`. In the repository, open **Settings → Pages** and confirm that the publishing source is **GitHub Actions** and the custom domain is `vridhi.ink`.

At the domain registrar, configure GitHub Pages DNS records (four A records for the apex domain: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`; optionally AAAA records as listed in GitHub's documentation). For `www`, use a CNAME to `ravigurnani91-alt.github.io`. Check existing DNS records first and preserve MX/email records. DNS changes are not made by this repository.

### Local development
Requires Node.js 20+.

```bash
npm install
npm run dev
```

For a production static export:

```bash
npm run build
```

The generated site is in `out/`.

## Preservation and rollback
- `main` remains unchanged and contains the original AI Growth & Outreach prototype.
- `backup-before-environmental-site-2026-11-07` is the pre-change backup branch.
- `environmental-site` contains the environmental website and Pages workflow.
- To restore the previous site on GitHub Pages, change the Pages deployment workflow/branch back to the prior published source. The original code remains preserved on `main`.

## Publishing integrity
This is an initial public-facing foundation, not a claim that Vridhi is already a registered NGO or that projects, partnerships, or impact metrics are operational. Add verified organisational details and project updates as they become available.
