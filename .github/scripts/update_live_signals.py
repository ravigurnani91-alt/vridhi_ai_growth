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
MAX_TOTAL = 24
FEEDS = [
    ("Mongabay India", "https://india.mongabay.com/feed/", "india.mongabay.com"),
    ("NASA", "https://www.nasa.gov/rss/dyn/breaking_news.rss", "nasa.gov"),
    ("BBC World", "https://feeds.bbci.co.uk/news/world/rss.xml", "bbc.co.uk|bbc.com"),
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

# Deduplicate by canonical URL and prefer dated, recent items.
unique = {}
for item in all_items:
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
OUTPUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\\n", encoding="utf-8")
print(f"Wrote {len(items)} attributed items to {OUTPUT}")
