"""Package static pages and generate their directory without a runtime API."""
import json
import shutil
from pathlib import Path

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
(output / "pages.json").write_text(json.dumps({"pages": pages}, ensure_ascii=False), encoding="utf-8")
print(f"Packaged {len(pages)} HTML pages")
