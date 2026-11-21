#!/usr/bin/env python3
"""Refresh Vridhi's live headlines from a small, explicit publisher allowlist.

Only publisher-provided headlines, links and short excerpts are shown. This
script does not invent stories or present feed items as original Vridhi reporting.
"""
import email.utils
import html
import json
import re
import sys
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timedelta, timezone
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[2]
OUTPUT = ROOT / "journal" / "briefs" / "live-signals.json"
MAX_PER_SOURCE = 10
MAX_TOTAL = 40
MAX_AGE_DAYS = 21
FEEDS = [
    ("Mongabay India", "https://india.mongabay.com/feed/", ["india.mongabay.com"], "EARTH & DISCOVERY"),
    ("NASA", "https://www.nasa.gov/rss/dyn/breaking_news.rss", ["nasa.gov"], "SCIENCE & SPACE"),
    ("BBC World", "https://feeds.bbci.co.uk/news/world/rss.xml", ["bbc.co.uk", "bbc.com"], "WORLD"),
    ("BBC Entertainment & Arts", "https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml", ["bbc.co.uk", "bbc.com"], "ENTERTAINMENT"),
    ("Variety", "https://variety.com/feed/", ["variety.com"], "ENTERTAINMENT"),
    ("BBC Technology", "https://feeds.bbci.co.uk/news/technology/rss.xml", ["bbc.co.uk", "bbc.com"], "TECH & AI"),
    ("BBC Business", "https://feeds.bbci.co.uk/news/business/rss.xml", ["bbc.co.uk", "bbc.com"], "BUSINESS"),
]

def clean(value):
    value = html.unescape(value or "")
    value = re.sub(r"<script[\s\S]*?</script>", " ", value, flags=re.I)
    value = re.sub(r"<style[\s\S]*?</style>", " ", value, flags=re.I)
    value = re.sub(r"<[^>]+>", " ", value)
    return re.sub(r"\s+", " ", value).strip()

def tag_name(element):
    return element.tag.rsplit("}", 1)[-1].lower()

def find_child(node, names):
    for child in list(node):
        if tag_name(child) in names:
            return child
    return None

def child_value(node, names):
    child = find_child(node, names)
    if child is None:
        return ""
    if child.text and child.text.strip():
        return child.text.strip()
    return "".join(child.itertext()).strip()

def item_link(node):
    child = find_child(node, {"link"})
    if child is None:
        return ""
    # RSS uses link text; Atom uses href (often with no text node).
    return (child.attrib.get("href") or child.text or "").strip()

def parse_date(value):
    if not value:
        return None
    try:
        dt = email.utils.parsedate_to_datetime(value)
    except (TypeError, ValueError, OverflowError):
        try:
            dt = datetime.fromisoformat(value.replace("Z", "+00:00"))
        except (TypeError, ValueError):
            return None
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc)

def parse_feed(xml_bytes, source, allowed_hosts, category):
    root = ET.fromstring(xml_bytes)
    entries = [node for node in root.iter() if tag_name(node) in {"item", "entry"}]
    rows = []
    cutoff = datetime.now(timezone.utc) - timedelta(days=MAX_AGE_DAYS)

    for entry in entries:
        title = clean(child_value(entry, {"title"}))
        link = item_link(entry)
        summary = clean(child_value(entry, {"description", "summary", "encoded", "content"}))
        date_text = child_value(entry, {"pubdate", "published", "updated", "date"})
        published = parse_date(clean(date_text))

        if not title or not link:
            continue
        parsed = urlparse(link)
        host = (parsed.hostname or "").lower()
        if parsed.scheme != "https" or not any(host == allowed or host.endswith("." + allowed) for allowed in allowed_hosts):
            continue
        # Keep the live strip fresh; undated entries are retained but sorted last.
        if published and published < cutoff:
            continue

        rows.append({
            "title": title[:220],
            "url": link,
            "source": source,
            "category": category,
            "published": published.isoformat() if published else None,
            "summary": summary[:360],
        })
        if len(rows) >= MAX_PER_SOURCE:
            break
    return rows

all_items = []
errors = []
for source, feed_url, allowed_hosts, category in FEEDS:
    try:
        request = urllib.request.Request(
            feed_url,
            headers={
                "User-Agent": "VridhiEditorialFeed/1.1 (+https://vridhi.ink/about/)",
                "Accept": "application/rss+xml, application/atom+xml, application/xml, text/xml",
            },
        )
        with urllib.request.urlopen(request, timeout=25) as response:
            rows = parse_feed(response.read(), source, allowed_hosts, category)
        all_items.extend(rows)
        print(f"{source}: {len(rows)} fresh items")
    except Exception as exc:
        message = f"{source}: {type(exc).__name__}: {exc}"
        errors.append(message)
        print(message, file=sys.stderr)

# Deduplicate by canonical URL and keep newest first.
unique = {}
for item in all_items:
    unique[item["url"]] = item
items = list(unique.values())
items.sort(key=lambda row: row["published"] or "", reverse=True)
items = items[:MAX_TOTAL]

# Never overwrite a working feed with an empty result caused by feed outages.
if not items:
    raise SystemExit("No fresh valid items were received. Previous feed preserved.")

payload = {
    "updated": datetime.now(timezone.utc).isoformat(),
    "editorial_note": "Publisher headlines and short excerpts. Open the source link for the full report.",
    "items": items,
    "source_errors": errors,
}
OUTPUT.parent.mkdir(parents=True, exist_ok=True)
OUTPUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"Updated {OUTPUT} with {len(items)} fresh, attributed items.")
