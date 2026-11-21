#!/usr/bin/env python3
"""Refresh Vridhi's sourced live-signals feed from a fixed publisher allowlist.

This script republishes publisher-provided headlines/excerpts with attribution.
It does not invent stories, write original articles, or turn headlines into claims.
"""
import email.utils
import html
import json
import re
import sys
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[2]
OUTPUT = ROOT / "journal" / "briefs" / "live-signals.json"
MAX_PER_SOURCE = 8
MAX_TOTAL = 32
FEEDS = [
    ("Mongabay India", "https://india.mongabay.com/feed/", "india.mongabay.com"),
    ("NASA", "https://www.nasa.gov/rss/dyn/breaking_news.rss", "nasa.gov"),
    ("BBC World", "https://feeds.bbci.co.uk/news/world/rss.xml", "bbc.co.uk|bbc.com"),
    ("BBC Entertainment & Arts", "https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml", "bbc.co.uk|bbc.com"),
    ("Variety", "https://variety.com/feed/", "variety.com"),
    ("BBC Technology", "https://feeds.bbci.co.uk/news/technology/rss.xml", "bbc.co.uk|bbc.com"),
    ("BBC Business", "https://feeds.bbci.co.uk/news/business/rss.xml", "bbc.co.uk|bbc.com"),
    ("Down To Earth", "https://www.downtoearth.org.in/rss.xml", "downtoearth.org.in"),
]

def clean(value):
    value = html.unescape(value or "")
    value = re.sub(r"<script[\s\S]*?</script>", " ", value, flags=re.I)
    value = re.sub(r"<style[\s\S]*?</style>", " ", value, flags=re.I)
    value = re.sub(r"<[^>]+>", " ", value)
    return re.sub(r"\s+", " ", value).strip()

def parse_date(value):
    if not value:
        return None
    try:
        dt = email.utils.parsedate_to_datetime(value)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt.astimezone(timezone.utc).isoformat()
    except Exception:
        try:
            return datetime.fromisoformat(value.replace("Z", "+00:00")).astimezone(timezone.utc).isoformat()
        except Exception:
            return None

def local_name(tag):
    return tag.rsplit("}", 1)[-1].lower()

def child_text(node, names):
    for child in list(node):
        if local_name(child.tag) in names:
            if child.text:
                return child.text
            # Atom content can contain nested XHTML.
            return ET.tostring(child, encoding="unicode", method="xml")
    return ""

def parse_feed(xml_bytes, source, expected_host):
    root = ET.fromstring(xml_bytes)
    entries = [n for n in root.iter() if local_name(n.tag) in ("item", "entry")]
    rows = []
    for entry in entries[:MAX_PER_SOURCE * 3]:
        title = clean(child_text(entry, {"title"}))
        link = child_text(entry, {"link"}).strip()
        if not link:
            for child in list(entry):
                if local_name(child.tag) == "link":
                    link = child.attrib.get("href", "")
                    if link:
                        break
        summary = clean(child_text(entry, {"description", "summary", "content", "encoded"}))
        pub = child_text(entry, {"pubdate", "published", "updated", "date"})
        if not title or not link:
            continue
        parsed = urlparse(link)
        host = (parsed.hostname or "").lower()
        allowed_hosts = expected_host.split("|")
        if parsed.scheme != "https" or not any(host == allowed or host.endswith("." + allowed) for allowed in allowed_hosts):
            continue
        rows.append({
            "title": title[:220],
            "url": link,
            "source": source,
            "category": ("CELEBRITY & POP CULTURE" if "Entertainment" in source or source == "Variety" else "TECH & BUSINESS" if source in ("BBC Technology", "BBC Business") else "EARTH & SCIENCE" if source in ("NASA", "Mongabay India", "Down To Earth") else "WORLD"),
            "published": parse_date(clean(pub)),
            "summary": summary[:360],
        })
        if len(rows) >= MAX_PER_SOURCE:
            break
    return rows

all_items = []
errors = []
for source, feed_url, expected_host in FEEDS:
    try:
        request = urllib.request.Request(feed_url, headers={"User-Agent": "VridhiEditorialFeed/1.0 (+https://vridhi.ink/about/)", "Accept": "application/rss+xml, application/atom+xml, application/xml, text/xml"})
        with urllib.request.urlopen(request, timeout=25) as response:
            items = parse_feed(response.read(), source, expected_host)
        all_items.extend(items)
        print(f"{source}: {len(items)} items")
    except Exception as exc:
        errors.append(f"{source}: {type(exc).__name__}: {exc}")
        print(errors[-1], file=sys.stderr)

# Curated, source-linked explainers give the ticker a sharper editorial voice.
# Keep reported numbers scoped to the source, date and population.
curated = [
    {
        "title": "Samsung India: 80–100 executives reportedly asked to leave in TV and home-appliance units",
        "url": "https://economictimes.indiatimes.com/industry/cons-products/electronics/samsung-india-pays-the-price-of-costlier-chips-with-a-round-of-layoffs/articleshow/133894023.cms",
        "source": "The Economic Times · 8 Sep 2026",
        "category": "WORK & MONEY",
        "published": "2026-09-08T03:06:00+00:00",
        "summary": "The report cited industry executives and described cuts in Samsung India's television and home-appliance businesses. It did not report a company-wide global layoff figure."
    },
    {
        "title": "AI job apocalypse? WEF projects 92 million jobs displaced—and 170 million created—by 2030 across major labour-market shifts",
        "url": "https://www.weforum.org/publications/the-future-of-jobs-report-2025/",
        "source": "World Economic Forum · 2025 forecast",
        "category": "AI & THE FUTURE",
        "published": "2025-01-07T00:00:00+00:00",
        "summary": "The estimate covers several structural trends, not AI alone. The WEF projects a net increase of 78 million jobs by 2030."
    },
    {
        "title": "Trump's wealth claims face another fact-check: what the financial figures actually show",
        "url": "https://www.factcheck.org/2026/11/factchecking-trumps-post-election-60-minutes-interview/",
        "source": "FactCheck.org · November 2026",
        "category": "POLITICS & MONEY",
        "published": "2026-11-14T00:00:00+00:00",
        "summary": "A fact-check examined statements about Trump's reported wealth and business income. This is a review of claims, not a claim that he is poor."
    }
]
items.extend(curated)
# Deduplicate and prioritise current source headlines; curated context items remain available.
unique = {}
for item in items:
    unique[item["url"]] = item
items = list(unique.values())
items.sort(key=lambda x: x["published"] or "", reverse=True)
items = items[:MAX_TOTAL]

if not items:
    raise SystemExit("No valid items from the publisher allowlist; keeping the previous feed unchanged.")

payload = {
    "updated": datetime.now(timezone.utc).isoformat(),
    "editorial_note": "Publisher-provided headlines and excerpts. These are source links, not independently reported Vridhi articles.",
    "items": items,
    "source_errors": errors,
}
OUTPUT.parent.mkdir(parents=True, exist_ok=True)
OUTPUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"Wrote {len(items)} attributed items to {OUTPUT}")
