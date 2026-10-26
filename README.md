# Kulam 2.0 — Community Water Watch

A responsive, front-end hackathon prototype for community waterbody issue reporting, rule-based demo triage, and simulated IoT readings.

## Files
- `index.html` — page structure and forms
- `style.css` — responsive design
- `script.js` — sample reports, demo triage, simulated readings, local browser storage

## Run locally
Open `index.html` in a browser. For best results, use a local web server or deploy with GitHub Pages.

## Publish free with GitHub Pages
1. Upload all three files to the root of your GitHub repository.
2. Open the repository on GitHub in a browser.
3. Go to **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select branch `main` and folder `/ (root)`, then save.
6. Wait for the Pages URL to appear on the Settings → Pages screen.

## Important limitations
This is a demo only. It uses illustrative sample data, simulated sensor values, and a simple rule-based priority suggestion. It has no backend, no physical sensor connection, no external AI model, and no government integration. User-created reports are stored only in the same browser using localStorage; they are not sent to a server or shared with other visitors.
