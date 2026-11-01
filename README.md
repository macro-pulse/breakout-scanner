# Undervalued Breakout Scanner

Static site (no build step) showing an end-of-day scan of undervalued stocks setting up for breakouts:
Justin Banks AI watchlist + S&P 500 + Nasdaq-100 + S&P 400.

- `index.html`, `assets/style.css`, `assets/app.js` – the page (vanilla JS, no external libraries)
- `data/scan.json` – data the page loads; `data/scan.csv` – same data for download
- `.nojekyll` – tells GitHub Pages to serve files as-is

Hosting: GitHub Pages → Settings → Pages → Deploy from branch `main`, folder `/ (root)`.
Refresh: run the scanner, then `python3 export_site.py`, then re-upload `data/scan.json` and `data/scan.csv`.
Opening `index.html` directly from disk (file://) won't load the JSON; use a web server (`python3 -m http.server`).

Not financial advice. Data from Finviz and Yahoo Finance, may be delayed or wrong.
