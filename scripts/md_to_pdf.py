#!/usr/bin/env python3
"""Convert markdown to PDF using Python markdown + Playwright (already in project)."""

from pathlib import Path
import subprocess, sys, json

ROOT = Path(__file__).resolve().parents[1]
md_path = ROOT / "technical-analysis-report.md"
html_path = ROOT / "technical-analysis-report.html"
pdf_path = ROOT / "technical-analysis-report.pdf"

# Step 1: Convert MD to HTML using Python markdown
try:
    import markdown
except ImportError:
    subprocess.check_call([sys.executable, "-m", "pip", "install", "markdown", "-q"])
    import markdown

md_text = md_path.read_text(encoding="utf-8")

html_body = markdown.markdown(
    md_text,
    extensions=["tables", "fenced_code", "codehilite", "toc", "nl2br"],
)

full_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Three.js Game Skills — Technical Analysis Report</title>
<style>
  @page {{ size: A4; margin: 2cm 2.2cm; }}
  body {{
    font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
    font-size: 11pt; line-height: 1.6; color: #1a1a1a;
    max-width: 100%;
  }}
  h1 {{ font-size: 22pt; margin-top: 0; border-bottom: 3px solid #2563eb; padding-bottom: 8px; }}
  h2 {{ font-size: 16pt; margin-top: 28px; border-bottom: 1.5px solid #93c5fd; padding-bottom: 4px; }}
  h3 {{ font-size: 13pt; margin-top: 20px; }}
  h4 {{ font-size: 11.5pt; margin-top: 16px; }}
  h1, h2, h3, h4 {{ color: #1e3a5f; }}
  code {{
    font-family: 'Cascadia Code', 'Fira Code', 'Consolas', monospace;
    font-size: 9pt; background: #f0f4f8; padding: 1px 4px; border-radius: 3px;
  }}
  pre {{
    background: #1e293b; color: #e2e8f0; padding: 12px 16px;
    border-radius: 6px; font-size: 9pt; line-height: 1.45;
    overflow-x: auto; white-space: pre-wrap; word-break: break-word;
  }}
  pre code {{ background: none; padding: 0; color: inherit; }}
  table {{
    border-collapse: collapse; width: 100%; margin: 12px 0; font-size: 9.5pt;
  }}
  th, td {{ border: 1px solid #cbd5e1; padding: 6px 10px; text-align: left; vertical-align: top; }}
  th {{ background: #2563eb; color: white; font-weight: 600; }}
  tr:nth-child(even) {{ background: #f8fafc; }}
  blockquote {{
    border-left: 4px solid #2563eb; margin: 12px 0; padding: 8px 16px;
    background: #eff6ff; color: #1e3a5f;
  }}
  hr {{ border: none; border-top: 1px solid #cbd5e1; margin: 24px 0; }}
  ul, ol {{ padding-left: 24px; }}
  li {{ margin: 2px 0; }}
  a {{ color: #2563eb; text-decoration: none; }}
  strong {{ color: #0f172a; }}
</style>
</head>
<body>
{html_body}
</body>
</html>"""

html_path.write_text(full_html, encoding="utf-8")
print(f"HTML saved: {html_path} ({html_path.stat().st_size:,} bytes)")

# Step 2: Use Playwright to render HTML → PDF
script = f"""
const {{ chromium }} = require('@playwright/test');
(async () => {{
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('file:///{html_path.as_posix()}');
  await page.pdf({{
    path: '{pdf_path.as_posix()}',
    format: 'A4',
    margin: {{ top: '20mm', bottom: '20mm', left: '22mm', right: '22mm' }},
    printBackground: true,
  }});
  await browser.close();
  console.log('PDF saved: {pdf_path} (' + require('fs').statSync('{pdf_path.as_posix()}').size + ' bytes)');
}})();
"""

result = subprocess.run(
    ["node", "-e", script],
    cwd=str(ROOT),
    capture_output=True,
    text=True,
    timeout=60,
)
if result.returncode != 0:
    print("Playwright PDF generation failed:", result.stderr[:500])
    # Fallback: try npx @playwright/test
    print("Trying npx playwright...")
    result2 = subprocess.run(
        ["npx", "--yes", "playwright", "pdf", str(html_path), str(pdf_path)],
        cwd=str(ROOT),
        capture_output=True,
        text=True,
        timeout=60,
    )
    if result2.returncode != 0:
        print("npx playwright pdf also failed:", result2.stderr[:500])
        sys.exit(1)

print(result.stdout)
