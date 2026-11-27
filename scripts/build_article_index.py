#!/usr/bin/env python3
"""Rebuild articles.json from published Vridhi article pages and their Article JSON-LD."""
import json
import re
from datetime import date
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(".")
INDEX = ROOT / "articles.json"

class MetadataParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.meta = {}
        self.jsonld = []
        self._jsonld = False
        self._buffer = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag.lower() == "meta":
            key = attrs.get("property") or attrs.get("name")
            if key and attrs.get("content"):
                self.meta[key.lower()] = attrs["content"].strip()
        elif tag.lower() == "script" and attrs.get("type", "").lower() == "application/ld+json":
            self._jsonld = True
            self._buffer = []

    def handle_data(self, data):
        if self._jsonld:
            self._buffer.append(data)

    def handle_endtag(self, tag):
        if tag.lower() == "script" and self._jsonld:
            raw = "".join(self._buffer).strip()
            if raw:
                try:
                    self.jsonld.append(json.loads(raw))
                except json.JSONDecodeError:
                    pass
            self._jsonld = False
            self._buffer = []

def walk_json(value):
    if isinstance(value, dict):
        yield value
        for child in value.values():
            yield from walk_json(child)
    elif isinstance(value, list):
        for child in value:
            yield from walk_json(child)

def article_object(doc):
    for node in walk_json(doc):
        kinds = node.get("@type", [])
        if isinstance(kinds, str):
            kinds = [kinds]
        if any(k in ("Article", "NewsArticle", "BlogPosting") for k in kinds):
            return node
    return {}

def first_image(value):
    if isinstance(value, list):
        value = value[0] if value else None
    if isinstance(value, dict):
        value = value.get("url") or value.get("contentUrl")
    return value if isinstance(value, str) and value.startswith("https://") else ""

def section_for(path, article, previous):
    if path.startswith("originals/"):
        return "Originals"
    if path.startswith("earth/"):
        return "Earth"
    if path.startswith("discover/"):
        return "Discover"
    section = article.get("articleSection")
    if isinstance(section, list):
        section = next((x for x in section if x in ("Earth", "Discover", "Originals")), "")
    if section in ("Earth", "Discover", "Originals"):
        return section
    return previous.get("section", "Discover")

def main():
    existing = json.loads(INDEX.read_text(encoding="utf-8"))
    previous = {item.get("url", "").strip("/"): item for item in existing.get("articles", []) if item.get("url")}
    merged = dict(previous)

    for folder in ("journal", "originals", "discover", "earth"):
        base = ROOT / folder
        if not base.exists():
            continue
        for page in base.rglob("index.html"):
            rel = page.parent.as_posix().strip("/")
            if not rel or rel == folder:
                continue
            parser = MetadataParser()
            parser.feed(page.read_text(encoding="utf-8", errors="replace"))
            article = next((a for doc in parser.jsonld if (a := article_object(doc))), {})
            canonical = parser.meta.get("og:url") or article.get("mainEntityOfPage") or article.get("url")
            canonical_path = ""
            if isinstance(canonical, str) and canonical.startswith("https://vridhi.ink/"):
                canonical_path = canonical.split("https://vridhi.ink/", 1)[1].strip("/")
            url = canonical_path or rel
            title = article.get("headline") or parser.meta.get("og:title")
            if not title:
                title = re.sub(r"\s*\|\s*Vridhi$", "", page.read_text(encoding="utf-8", errors="replace").split("<title>",1)[-1].split("</title>",1)[0]) if "<title>" in page.read_text(encoding="utf-8", errors="replace") else ""
            title = re.sub(r"\s*\|\s*Vridhi$", "", str(title)).strip()
            description = article.get("description") or parser.meta.get("og:description") or parser.meta.get("description")
            published = article.get("datePublished")
            if not title or not published:
                # Do not invent dates or publish incomplete records; retain any existing curated entry.
                continue
            old = merged.get(url, {})
            image = first_image(article.get("image")) or parser.meta.get("og:image") or parser.meta.get("twitter:image") or old.get("image", "")
            section = section_for(url, article, old)
            keywords = article.get("keywords", [])
            if isinstance(keywords, str):
                keywords = [x.strip() for x in keywords.split(",") if x.strip()]
            topic = old.get("topic") or (keywords[0] if keywords else (section if section != "Discover" else "Research"))
            record = {
                "title": title,
                "description": str(description or old.get("description", "")).strip(),
                "image": image,
                "published": str(published)[:10],
                "modified": str(article.get("dateModified") or published)[:10],
                "url": url + "/",
                "section": section,
                "topic": topic,
            }
            if image:
                record["imageAlt"] = old.get("imageAlt") or title
            merged[url] = record

    articles = sorted(merged.values(), key=lambda item: (item.get("published", ""), item.get("modified", "")), reverse=True)
    payload = {"version": 3, "updated": date.today().isoformat(), "articles": articles}
    INDEX.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Indexed {len(articles)} Vridhi stories.")

if __name__ == "__main__":
    main()
