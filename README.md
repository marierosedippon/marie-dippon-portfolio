# Marie Dippon portfolio

A static site. There is no build step and nothing to install. Open `index.html` in a browser to see it.

## Files

- `content.js` holds every word on the site. This is the file you edit.
- `styles.css` holds the colors, fonts, and layout. The color tokens are at the top.
- `app.js` builds the page from `content.js` and runs the animation and the playground.
- `index.html` is the shell.

## Update the site

1. Open `content.js` in VS Code.
2. Change a value. Save.
3. Refresh the page.

To add a project, copy one block inside `projects`, change the text, and set `art` to `"search"`, `"chat"`, `"browser"` or `"cards"`.

To add your photo, put `photo.jpg` in this folder and set `photo: "photo.jpg"`. Your GitHub, LinkedIn and resume are set under `links`. To update the resume, replace `resume.pdf` with the new file (same name). An empty link hides its button.

## Change the colors

Edit the tokens at the top of `styles.css`:

- `--bg` is the cream paper color.
- `--accent` is viridian (`#40826D`).
- `--accent-2` is ocean blue (`#2F6FA8`).
- The dark theme has its own block of tokens right below.
- The phone in the playground uses its own blue tokens, set on the `.phone` rule.

## Put it online

Netlify, no account setup beyond signing in:

1. Go to app.netlify.com/drop.
2. Drag this whole folder onto the page.
3. Netlify gives you a live link right away.

To update later, drag the folder again, or connect the folder to a GitHub repo so every push deploys by itself.

For a custom domain, buy one from any registrar (about $12 a year) and add it under Domain settings in Netlify.

## Notes

- Fonts load from Google Fonts. Offline, the site falls back to system fonts.
- Every animation respects the "reduce motion" setting on the visitor's device.
- The App Store link in `content.js` points to ClipScout. Check that it opens the right page.
