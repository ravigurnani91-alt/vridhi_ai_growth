# Vridhi Search & Answer Visibility Standard

This standard applies to every page and every future article across Discover, Earth, Originals, Experiences, Journal/blogs, topic hubs, city pages, country pages, explainers and interactive resources.

## 1. SEO — traditional search

Every indexable page must have:
- One distinct, descriptive title tag, generally 50–60 characters where practical.
- A unique meta description that accurately summarises the page.
- One clear H1, followed by logical H2/H3 headings.
- A clean, stable, lowercase canonical URL.
- Descriptive internal links and useful anchor text.
- Descriptive image filenames and meaningful alt text; decorative images use empty alt text.
- Mobile-friendly layout, fast loading, HTTPS and accessible HTML.
- Relevant contextual links to related Vridhi pages and authoritative external sources.
- Inclusion in sitemap.xml only when the page is canonical and intended to be indexed.
- No keyword stuffing, doorway pages, duplicate city pages or thin AI-generated pages.

## 2. AEO — answer engines

Where useful, articles should:
- Answer the central question clearly near the beginning.
- Include concise definitions and direct responses to likely reader questions.
- Use question-led H2s and an FAQ section only when it genuinely helps readers.
- Explain unfamiliar terms, units, dates and geographic context.
- Use lists, comparison tables, steps and timelines when they clarify the subject.
- Make claims traceable to visible sources; avoid unsupported answer snippets.
- Keep facts and caveats together so a short extract is not misleading.

FAQ structured data must not be used as a promise of rich results. Markup must match visible page content and current search-engine policies.

## 3. GEO — generative engine visibility

Every substantive article should make its subject and evidence easy to understand:
- State the main subject, location, time period and central finding precisely.
- Attribute statistics, quotations, research and official statements.
- Link to primary sources and provide enough context to verify important claims.
- Distinguish established facts from estimates, interpretation, opinion, allegations, folklore and uncertainty.
- Include original analysis, reporting, interviews, data or useful synthesis—not merely rewritten summaries.
- Provide meaningful headings, tables and concise summaries without removing nuance.
- Maintain transparent authorship, editorial responsibility, corrections and update history.

No wording or schema can guarantee inclusion in AI-generated answers.

## 4. LLMO — large language model optimisation

Make content machine-understandable without writing unnaturally for machines:
- Use consistent names for Vridhi and its divisions.
- Define entities, abbreviations, locations, dates and technical terms.
- Keep article pages self-contained and context-rich.
- Use semantic HTML and valid structured data that matches visible content.
- Maintain canonical URLs, internal links, author details, dates and citations.
- Publish an accurate llms.txt as a supplementary orientation file; it is not a guaranteed crawler control or ranking signal.
- Do not hide keyword blocks, create fake consensus, fabricate citations or manipulate model outputs.

## 5. Structured data

Use only schema types that accurately describe the page. Common candidates:
- Organization and WebSite for the brand/site.
- WebPage, CollectionPage or AboutPage for site pages.
- Article or BlogPosting for editorial articles.
- BreadcrumbList for navigational hierarchy.
- Person for real authors, with accurate profile information.
- Book for actual published books.
- Dataset only for genuine, documented datasets.
- Event only for real events with current details.

JSON-LD must validate, reflect visible content and be updated when content changes. Never add fake ratings, reviews, authors, dates, FAQs or locations.

## 6. Article publishing checklist

Before publication:
1. Confirm the reader question and intended audience.
2. Research primary and credible sources; retain source URLs and access dates.
3. Fact-check names, dates, locations, figures and quotations.
4. Write an original, useful article with a clear answer and context.
5. Add author, reviewer where relevant, published date and updated date.
6. Add a unique title, description, slug and canonical URL.
7. Add suitable Article/BlogPosting and BreadcrumbList JSON-LD.
8. Add relevant internal links, source links, image alt text and social sharing metadata.
9. Check mobile usability, accessibility, performance and indexability.
10. Add the canonical URL to sitemap.xml and verify the live page.

## 7. Earth reporting requirements

For local environmental stories, record where possible:
- Country, state/region, district, town/village and coordinates only when appropriate and safe.
- Population/households affected, with source and year.
- Issue type, duration, seasonality and affected resource.
- Human, ecological and livelihood impacts.
- Evidence type: official data, peer-reviewed research, reported information, community observation or Vridhi-verified.
- Responsible agency and documented response.
- Follow-up date and whether the situation changed.

Never label an issue Vridhi-verified without a documented verification method. Protect vulnerable sources and avoid publishing sensitive personal data.

## 8. Measurement

When analytics and search tools are connected, track:
- Index coverage and crawl errors.
- Organic impressions, clicks, queries and landing pages.
- Referral traffic and engagement by topic.
- Article updates, broken links and Core Web Vitals.
- Qualified readership and meaningful return visits.

Do not claim rankings, traffic gains or AI citations without measured evidence.

## 9. Current scope and limitations

The current site is a static GitHub Pages foundation. Metadata and basic structured data are being added to the existing division pages. Individual article templates, a CMS, automated sitemap generation, analytics integrations, editorial workflows and live feeds still need to be built before they can be considered operational.
