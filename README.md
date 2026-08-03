# anakostic.com

Personal blog. Plain static HTML and CSS — no build step, no dependencies, no
Jekyll. Served by GitHub Pages from the root of this repository
(`delphinusdelphis.github.io`) at the custom domain **anakostic.com**.

## Preview it locally

From this folder:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>. Use a server rather than opening the `.html`
files directly — every link and asset path in the site is root-relative
(`/assets/...`), which only resolves correctly over `http://`.

To stop the server, press <kbd>Ctrl</kbd>+<kbd>C</kbd>.

## Switching the style

The site ships with several complete looks. Everything visual is driven by CSS
custom properties, so switching one costs nothing.

| Style | Look |
| --- | --- |
| `observatory` | **Default.** Dark navy, built for looking at astrophotography |
| `academic` | Dark slate navbar, bold blue hero band, white body, justified text |
| `paper` | Warm light editorial, serif body, rust accent |
| `terminal` | Monospace, near-black, sharp corners, green accent |
| `zine` | Brutalist print look, thick borders, magenta accent |
| `auto` | Follows the visitor's light/dark system setting |

**As a visitor:** use the *Style* menu in the site header. The choice is
saved in `localStorage`, so it sticks on the next visit.

**To change the site-wide default**, edit two lines at the top of
[`assets/js/theme.js`](assets/js/theme.js) — the default itself, and the
version number next to it:

```js
const DEFAULT_THEME = 'observatory';
const STYLE_VERSION = 3;          // bump this every time you change the line above
```

The second line matters. A saved choice normally beats the default, so anyone
who has ever touched the Style menu — including you, while reviewing — would
otherwise keep seeing the old look forever and think the change had not
applied. Raising `STYLE_VERSION` retires those saved choices once; from then on
they are remembered again as normal.

**If a change to the CSS does not show up,** bump the `?v=` number on the
stylesheet and script tags in the `<head>` of each page:

```html
<link rel="stylesheet" href="/assets/css/base.css?v=6">
```

Browsers (and GitHub Pages' own caching) will otherwise happily serve the old
file. Changing the number makes it a new URL, so the new file is fetched.

**To preview a style without changing anything,** append `?theme=` to any URL:
<http://localhost:8000/?theme=zine>

**To add a new style:**

1. Copy any `[data-theme="..."]` block in
   [`assets/css/themes.css`](assets/css/themes.css), rename it, change the
   values. Each block defines colors, font stacks, sizes, spacing, corner radii
   and border weights.
2. Add one line to the `THEMES` array in `assets/js/theme.js` so it appears in
   the header menu.

Nothing else needs touching. `assets/css/base.css` contains no hard-coded
colors or fonts — it only reads the variables — so a new style never means
editing layout code. As well as color, each block sets the font stacks, base
size, reading measure, heading weight and case, corner radius, border weight,
and whether body text is justified.

## Page furniture

Every page shares three pieces of chrome, copied verbatim between files:

- a **sticky dark navbar** (`.site-header`) with the name, the nav links and the
  style menu;
- a **hero band** (`.banner`) in the accent color — `.banner--home` is centered
  and carries the intro card, `.banner--post` is left-aligned and carries a
  post's date, tags, title and standfirst;
- a **dark footer** (`.site-footer`).

Text in the reading column is justified with automatic hyphenation in the
`academic` style only, and falls back to ragged-right below 48rem so phones never get
rivers.

## Adding a post

1. Copy `posts/_template.html` to `posts/your-slug.html` and work through the
   `TODO` markers. The bottom of the template lists every ready-made building
   block (image grids, tables, callouts, stat rows, spec lists) with the markup
   to copy.
2. Put images in `assets/img/`, downloadable files in `files/`.
3. Add a card for the post to the `<ul class="posts">` list in `index.html` —
   copy an existing `<li>` and edit it.
4. Update the `post-nav` links at the foot of the neighboring posts.

Posts are listed newest first.

## Layout

```
index.html            post list
about.html
404.html
posts/                one file per post, plus _template.html
assets/css/base.css   structure and typography — no colors, no fonts
assets/css/themes.css every style, one CSS block each
assets/js/theme.js    the style switcher (and the default-style setting)
assets/img/           images used in posts
assets/favicon.svg
files/                PDFs offered for download
CNAME                 the custom domain, read by GitHub Pages
.nojekyll             tells GitHub Pages to serve the files as-is
```

## Deploying

Pushing to the default branch publishes the site. GitHub Pages needs to be
enabled for this repository under **Settings → Pages**, with the source set to
*Deploy from a branch* → the default branch, folder `/ (root)`.

### DNS at IONOS

`CNAME` already contains `anakostic.com`. On the IONOS side, point the domain at
GitHub Pages:

| Type | Name | Value |
| --- | --- | --- |
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| AAAA | `@` | `2606:50c0:8000::153` |
| AAAA | `@` | `2606:50c0:8001::153` |
| AAAA | `@` | `2606:50c0:8002::153` |
| AAAA | `@` | `2606:50c0:8003::153` |
| CNAME | `www` | `delphinusdelphis.github.io.` |

Remove any IONOS parking/redirect records for `@` and `www` first, or they will
win. Then in **Settings → Pages** set the custom domain to `anakostic.com` and,
once the check passes, tick **Enforce HTTPS**. DNS can take a few hours to
propagate, and the certificate is issued after that.

Verify the current addresses against
[GitHub's Pages DNS documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
before entering them — GitHub does change them occasionally.

## Sources

The three posts are written up from:

- `Segmentation_report_Ana_website.pdf` → `posts/cardiac-t1rho-mri.html`
- <https://github.com/delphinusdelphis/Tilted-filters>, `tilted-filters-poster.pdf`,
  `tilted-filters-photos.pdf` → `posts/tilted-filters.html`
- `mw-new.pdf` → `posts/milky-way-rhodes.html` (the version of the talk with a
  reference list; supersedes `mw-for-website.pdf`)

Figures were extracted from those PDFs into `assets/img/`.

---

© Ana Kostic. Text and images are mine; the code in this repository is free to
reuse.
