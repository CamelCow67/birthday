# Her Birthday Site

Three files, no build tools, no dependencies:

```
index.html   - structure/content
style.css    - all styling
script.js    - petals, gallery, envelope, confetti, saving
images/      - put her real photos here (see images/README.txt)
```

## 1. Customize it

- **Her name** — open `index.html`, search for `HER NAME`, replace it.
- **The letter** — either edit the text inside `<div id="letter-text">` in
  `index.html` directly, or just open the page in a browser, click the
  envelope open, click into the letter, and type — it edits in place.
  Change the `— yours, always` sign-off too.
- **Captions** — edit the six strings in the `captions` array near the top
  of `script.js`, or edit them live on the page the same way as the letter.
- **Photos** — add real image files to the `images/` folder named `1.jpg`
  through `6.jpg` (see `images/README.txt`). This is the part that matters
  most for sharing a link: photos uploaded through the "add a photo" button
  only save in *your own* browser, so she won't see them unless the actual
  files are committed to the repo. Once you drop in `images/1.jpg` etc. and
  push, everyone who opens the link sees them.

## 2. Preview it locally

Just double-click `index.html`, or in a terminal:

```
cd site
python3 -m http.server 8000
```

then open `http://localhost:8000`.

## 3. Put it on GitHub Pages

```
git init
git add .
git commit -m "birthday site"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

Then on GitHub: **Settings → Pages → Source → Deploy from a branch →
main / (root) → Save**. After a minute or two your site is live at:

```
https://<your-username>.github.io/<repo-name>/
```

That's the link you send her.

## Notes

- Works on mobile, respects reduced-motion settings, no external JS
  dependencies — only Google Fonts is loaded from a CDN.
- If you'd rather not deal with `images/1.jpg` naming, you can also just
  swap the placeholder `<img>` tags in the gallery loop in `script.js` for
  hardcoded `<img src="images/whatever-you-named-it.jpg">` — up to you.
