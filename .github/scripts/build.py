"""Package static pages and generate their directory without a runtime API."""
import json
import re
import shutil
from html.parser import HTMLParser
from pathlib import Path


class PageTitle(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_title = False
        self.parts = []

    def handle_starttag(self, tag, attrs):
        if tag == "title":
            self.in_title = True

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False

    def handle_data(self, data):
        if self.in_title:
            self.parts.append(data)

root = Path(__file__).resolve().parents[2]
output = root / "dist"
if output.exists():
    shutil.rmtree(output)
output.mkdir()
for filename in ("index.html", ".nojekyll"):
    shutil.copy2(root / filename, output / filename)
for folder in ("assets", "pages"):
    shutil.copytree(root / folder, output / folder)
pages = sorted(path.relative_to(output).as_posix() for path in (output / "pages").rglob("*") if path.is_file() and path.suffix.lower() in (".html", ".htm"))
reports = []
for path in pages:
    match = re.search(r"/(\d{4}-\d{2}-\d{2})\.html?$", path, re.I)
    if not match:
        continue
    parser = PageTitle()
    parser.feed((output / path).read_text(encoding="utf-8", errors="replace"))
    title = " ".join("".join(parser.parts).split()) or "AI 日报"
    reports.append({"path": path, "date": match.group(1), "title": title})
reports.sort(key=lambda report: report["date"], reverse=True)
(output / "pages.json").write_text(json.dumps({"pages": pages, "reports": reports}, ensure_ascii=False), encoding="utf-8")
print(f"Packaged {len(pages)} HTML pages")
