#!/usr/bin/env python3
"""Render content/pages/*.md into the site's HTML pages.

Edit the markdown, then run:

    python3 scripts/render.py

The generated HTML keeps the current theme: same stylesheet, nav, and byline.
Blog posts in content/posts/ stay markdown and are still opened from posts.html.
"""

from __future__ import annotations

import html
import re
import sys
from pathlib import Path

try:
    import markdown
except ImportError:
    sys.exit("Install the renderer dependency first: python3 -m pip install -r scripts/requirements.txt")

ROOT = Path(__file__).resolve().parent.parent
PAGES = ROOT / "content" / "pages"

NAV = [
    ("home", "./", False),
    ("projects", "projects.html", False),
    ("posts", "posts.html", False),
    ("resume", "resume.html", False),
    ("email", "mailto:aravindkumar.ai@outlook.com", False),
    ("github", "https://github.com/AravindKumar-AI", True),
    ("linkedin", "https://www.linkedin.com/in/aravindkumar-ai", True),
    ("medium", "https://medium.com/@aravindkumar-rajendran", True),
]

META_RE = re.compile(r"<p><em>([^<]*)</em></p>")
NOTE_ITEM_RE = re.compile(
    r'<p><a href="([^"]*)"([^>]*)>(.*?)</a></p>\s*<p class="note-meta">(.*?)</p>',
    re.DOTALL,
)
LINK_RE = re.compile(r'<a href="([^"]*)"([^>]*)>')


def parse_front_matter(text: str) -> tuple[dict[str, str], str]:
    text = text.replace("\r\n", "\n")
    if not text.startswith("---\n"):
        raise SystemExit("page is missing front matter")
    end = text.find("\n---\n", 3)
    if end == -1:
        raise SystemExit("page front matter is not closed")
    meta: dict[str, str] = {}
    for line in text[4:end].splitlines():
        if not line.strip() or line.lstrip().startswith("#"):
            continue
        key, sep, value = line.partition(":")
        if not sep:
            raise SystemExit(f"bad front matter line: {line}")
        value = value.strip()
        if len(value) >= 2 and value[0] == value[-1] and value[0] in "\"'":
            value = value[1:-1]
        meta[key.strip()] = value
    return meta, text[end + 5 :].lstrip("\n")


def render_markdown(body: str) -> str:
    body = re.sub(r"^\{\{posts\}\}\s*$", '<div id="notes-list"></div>', body, flags=re.MULTILINE)
    rendered = markdown.markdown(body, extensions=["extra", "sane_lists"])
    rendered = LINK_RE.sub(annotate_link, rendered)
    rendered = META_RE.sub(lambda match: f'<p class="note-meta">{match.group(1).strip()}</p>', rendered)
    return rendered


def annotate_link(match: re.Match[str]) -> str:
    href, rest = match.group(1), match.group(2)
    if href.startswith(("http://", "https://")) and "target=" not in rest:
        return f'<a href="{href}"{rest} target="_blank" rel="noopener">'
    return match.group(0)


def promote_note_items(rendered: str) -> str:
    def repl(match: re.Match[str]) -> str:
        href, attrs, label, meta = match.groups()
        return (
            f'<p class="note-item"><a href="{href}"{attrs}>{label}</a>\n'
            f'<span class="note-meta">{meta}</span></p>'
        )

    return NOTE_ITEM_RE.sub(repl, rendered)


def indent(text: str, spaces: int) -> str:
    pad = " " * spaces
    return "\n".join(pad + line if line else "" for line in text.strip().split("\n"))


def nav(current: str) -> str:
    lines = []
    for key, href, external in NAV:
        attrs = f' href="{href}"'
        if key == current:
            attrs += ' aria-current="page"'
        if external:
            attrs += ' target="_blank" rel="noopener"'
        lines.append(f"      <a{attrs}>{key}</a>")
    return "\n".join(lines)


def meta_tags(meta: dict[str, str]) -> str:
    tags = []
    if description := meta.get("description"):
        tags.append(f'  <meta name="description" content="{html.escape(description, quote=True)}">')
    if author := meta.get("author"):
        tags.append(f'  <meta name="author" content="{html.escape(author, quote=True)}">')
    return ("\n".join(tags) + "\n") if tags else ""


def page_shell(source: str, meta: dict[str, str], wrap_inner: str, scripts: str = "") -> str:
    script_block = f"\n{scripts}\n" if scripts else "\n"
    return f"""<!DOCTYPE html>
<html lang="en">
<!-- Generated from {source}. Edit that file, then run: python3 scripts/render.py -->

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{html.escape(meta["title"])}</title>
{meta_tags(meta)}  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/css/style.css">
</head>

<body>
  <nav class="topnav" aria-label="Primary">
    <div class="topnav-inner">
{nav(meta.get("nav", ""))}
    </div>
  </nav>

  <div class="wrap">
{wrap_inner}
  </div>

  <span class="byline">aravind kumar r</span>{script_block}</body>

</html>
"""


def redirect_page(source: str, meta: dict[str, str]) -> str:
    target = meta.get("redirect", "posts.html")
    label = meta.get("label", "posts")
    return f"""<!DOCTYPE html>
<html lang="en">
<!-- Generated from {source}. Edit that file, then run: python3 scripts/render.py -->
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{html.escape(meta["title"])}</title>
  <link rel="canonical" href="{html.escape(target, quote=True)}">
  <script>location.replace("{html.escape(target, quote=True)}" + location.hash);</script>
  <meta http-equiv="refresh" content="0; url={html.escape(target, quote=True)}">
</head>
<body>
  <p><a href="{html.escape(target, quote=True)}">{html.escape(label)}</a></p>
</body>
</html>
"""


def render_page(path: Path) -> str:
    meta, body = parse_front_matter(path.read_text(encoding="utf-8"))
    if "title" not in meta or "layout" not in meta:
        raise SystemExit(f"{path.name} needs title and layout in front matter")
    source = f"content/pages/{path.name}"
    layout = meta["layout"]

    if layout == "redirect":
        return redirect_page(source, meta)

    rendered = render_markdown(body)
    if layout == "posts":
        rendered = promote_note_items(rendered)
        inner = f"    <div id=\"notes-index\">\n{indent(rendered, 6)}\n    </div>\n\n    <article id=\"note\" class=\"note\" hidden></article>"
        scripts = (
            '  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>\n'
            '  <script src="assets/js/notes.js"></script>'
        )
        return page_shell(source, meta, inner, scripts)

    if layout == "note":
        inner = f"    <article class=\"note\">\n{indent(rendered, 6)}\n    </article>"
        return page_shell(source, meta, inner)

    if layout == "prose":
        return page_shell(source, meta, indent(rendered, 4))

    raise SystemExit(f"{path.name} has unknown layout: {layout}")


def main() -> None:
    paths = sorted(PAGES.glob("*.md"))
    if not paths:
        raise SystemExit(f"no markdown pages in {PAGES}")
    for path in paths:
        html_path = ROOT / f"{path.stem}.html"
        html_path.write_text(render_page(path), encoding="utf-8")
        print(f"{path.relative_to(ROOT)} -> {html_path.name}")


if __name__ == "__main__":
    main()
