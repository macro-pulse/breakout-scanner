# Undervalued Breakout Scanner

Static site (no build step) showing an end-of-day scan of undervalued stocks setting up for breakouts:
AI watchlist + S&P 500 + Nasdaq-100 + S&P 400.

- `index.html`, `assets/style.css`, `assets/app.js`, `assets/favicon.svg` – the page (vanilla JS, no external libraries)
- `data/scan.json` – data the page loads; `data/scan.csv` – same data for download
- `.nojekyll` – tells GitHub Pages to serve files as-is

Top picks: setup ≥ 60, within 4% of trigger, stop distance ≥ 1.5%, top 8 by combined score, plus the 2 best AI names.

Hosting: GitHub Pages → Settings → Pages → Deploy from branch `main`, folder `/ (root)`.
Refresh: run the scanner, then `python3 export_site.py`, then re-upload `data/scan.json` and `data/scan.csv`.
Opening `index.html` directly from disk (file://) won't load the JSON; use a web server (`python3 -m http.server`).

For informational purposes only. Not investment advice. Data from Finviz and Yahoo Finance, may be delayed or wrong.
