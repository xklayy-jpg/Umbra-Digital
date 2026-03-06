# Umbra Digital

Premium web design agency website — built for deployment on Vercel or GitHub Pages.

## Stack

- Pure HTML/CSS/JS — zero build step required
- [Bricolage Grotesque](https://fonts.google.com/specimen/Bricolage+Grotesque) + DM Mono via Google Fonts
- [Spline](https://spline.design/) for the 3D moon
- No frameworks, no dependencies

## Deploy to Vercel

**Option 1 — Vercel CLI**
```bash
npm i -g vercel
vercel
```

**Option 2 — Vercel Dashboard**
1. Push this repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import the repository
4. Framework preset: **Other**
5. Click Deploy

## Deploy to GitHub Pages

1. Push to a GitHub repository
2. Go to **Settings → Pages**
3. Source: **Deploy from a branch**
4. Branch: `main` / `root`
5. Save — your site will be live at `https://<username>.github.io/<repo>/`

## Local preview

No build step needed. Just open `index.html` in a browser, or use any static server:

```bash
# Python
python3 -m http.server 3000

# Node
npx serve .
```

## Customisation

| What               | Where                              |
|--------------------|-------------------------------------|
| Copy / text        | Directly in `index.html`            |
| Colors             | CSS variables at `:root` in `<style>` |
| Fonts              | Google Fonts `<link>` in `<head>`   |
| Spline scene       | `url=` attribute on `<spline-viewer>` |
| Contact email      | All `mailto:` href values           |

## License

All rights reserved © 2025 Umbra Digital.
