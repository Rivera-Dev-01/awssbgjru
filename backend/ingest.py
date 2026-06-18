import os
import sys
import json
import re
from pathlib import Path
from bs4 import BeautifulSoup

sys.path.insert(0, str(Path(__file__).parent.parent))

from backend.rag import build_index


PROJECT_ROOT = Path(__file__).parent.parent
PAGES_DIR = PROJECT_ROOT / "frontend" / "pages"
JS_DIR = PROJECT_ROOT / "frontend" / "js"
README_PATH = PROJECT_ROOT / "README.md"
FAQ_PATH = PROJECT_ROOT / "backend" / "data" / "faq.json"

CHUNK_SIZE = 500
CHUNK_OVERLAP = 80


NOISE_LINES = {
    "register", "sign up", "back", "home", "members", "about", "events",
    "it's always day one", "grow. learn. lead.", "contact us", "privacy policy",
    "terms of service", "all rights reserved", "sidebar", "menu", "close",
}

def extract_text_from_html(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        soup = BeautifulSoup(f.read(), "html.parser")
    for tag in soup(["script", "style", "nav", "header", "footer", "aside"]):
        tag.decompose()
    for cls in ("sidebar", "hamburger-btn", "site-header", "register-back",
                "register-title", "progress-bar", "register-card"):
        for el in soup.find_all(class_=cls):
            el.decompose()
    text = soup.get_text(separator="\n")
    lines = [l.strip() for l in text.splitlines()]
    lines = [l for l in lines if l and l.lower() not in NOISE_LINES and len(l) > 2]
    text = "\n".join(lines)
    text = re.sub(r"\n{3,}", "\n\n", text).strip()
    return text


def extract_events_from_js():
    filepath = JS_DIR / "event-data.js"
    if not filepath.exists():
        return ""
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    start = content.find("const eventDetailData = ")
    if start == -1:
        return ""
    raw = content[start + len("const eventDetailData = "):]
    raw = raw.rsplit(";", 1)[0].strip()

    raw = re.sub(r"//.*", "", raw)
    raw = re.sub(r"(?m)^(\s*)(\w+)\s*:", r'\1"\2":', raw)
    raw = re.sub(r"([\[{,]\s*)(\w+)\s*:", r'\1"\2":', raw)

    def replace_sq(m):
        val = m.group(1)
        val = val.replace('"', '\\"')
        return f'"{val}"'
    raw = re.sub(r"'([^']*)'", replace_sq, raw)
    raw = re.sub(r",\s*}", r"}", raw)
    raw = re.sub(r",\s*\]", r"]", raw)

    try:
        events = json.loads(raw)
    except json.JSONDecodeError:
        return ""

    parts = []
    for ev in events:
        if not isinstance(ev, dict):
            continue
        lines = [f"Event: {ev.get('title', '')}"]
        for key in ("category", "date", "time", "location", "summary"):
            val = ev.get(key)
            if val:
                k = key.capitalize() if key != "summary" else "Summary"
                lines.append(f"{k}: {val}")
        for insight in ev.get("insights", []):
            if not isinstance(insight, dict):
                continue
            title = insight.get("title", "")
            items = insight.get("items", [])
            item_strs = []
            for item in items:
                if isinstance(item, dict):
                    item_strs.append(" - ".join(filter(None, [item.get("name", ""), item.get("role", "")])))
                else:
                    item_strs.append(str(item))
            if item_strs:
                lines.append(f"{title}: {'; '.join(item_strs)}")
        parts.append("\n".join(lines))
    return "\n\n".join(parts)


def extract_readme():
    if not README_PATH.exists():
        return ""
    with open(README_PATH, "r", encoding="utf-8") as f:
        return f.read()


def extract_faq():
    if not FAQ_PATH.exists():
        return ""
    with open(FAQ_PATH, "r", encoding="utf-8") as f:
        faqs = json.load(f)
    parts = []
    for faq in faqs:
        parts.append(f"Q: {faq['question']}\nA: {faq['answer']}")
    return "\n\n".join(parts)


def chunk_text(text, source_label):
    if not text.strip():
        return []
    sentences = re.split(r"(?<=[.!?])\s+", text)
    chunks = []
    current = []
    current_len = 0

    for sent in sentences:
        sent_len = len(sent)
        if current_len + sent_len > CHUNK_SIZE and current:
            chunk_text = " ".join(current)
            chunks.append(f"[{source_label}]\n{chunk_text}")
            overlap = []
            ol_len = 0
            for s in reversed(current):
                if ol_len >= CHUNK_OVERLAP:
                    break
                overlap.insert(0, s)
                ol_len += len(s)
            current = overlap
            current_len = ol_len
        current.append(sent)
        current_len += sent_len

    if current:
        chunks.append(f"[{source_label}]\n{' '.join(current)}")

    return chunks


def main():
    all_chunks = []

    skip = {"loading", "waiting-approval", "explanation", "event-detail", "events"}
    html_pages = sorted(PAGES_DIR.glob("*.html"))
    for page in html_pages:
        name = page.stem
        if name in skip:
            print(f"  {name}.html -> skipped (shell page)")
            continue
        text = extract_text_from_html(page)
        chunks = chunk_text(text, name)
        all_chunks.extend(chunks)
        print(f"  {name}.html -> {len(chunks)} chunks")

    events_text = extract_events_from_js()
    if events_text:
        chunks = chunk_text(events_text, "events")
        all_chunks.extend(chunks)
        print(f"  event-data.js -> {len(chunks)} chunks")

    readme_text = extract_readme()
    if readme_text:
        chunks = chunk_text(readme_text, "README")
        all_chunks.extend(chunks)
        print(f"  README.md -> {len(chunks)} chunks")

    faq_text = extract_faq()
    if faq_text:
        chunks = chunk_text(faq_text, "faq")
        all_chunks.extend(chunks)
        print(f"  faq.json -> {len(chunks)} chunks")

    print(f"\nTotal: {len(all_chunks)} chunks")
    build_index(all_chunks)
    print("Done. Run 'uvicorn backend.main:app --port 8001' to start the backend.")


if __name__ == "__main__":
    main()
