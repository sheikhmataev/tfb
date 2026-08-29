# Thai Foreningen Bergen

Trilingual static site for Thai Foreningen Bergen (org.nr 996 630 307) and the
food-safety courses run by Thai Restaurantvirksomhet Kurs (org.nr 924 409 509).

Next.js 16 static export, Tailwind v4, TypeScript. Deployed to GitHub Pages at
<https://sheikhmataev.github.io/tfb/> by `.github/workflows/deploy.yml` on every
push to `main`.

```bash
npm run dev            # local development, no base path
npm run build          # static export to out/
npm run build:pages    # export exactly as CI does, with the /tfb base path
npm run preview:pages  # serve out/ under /tfb, the way GitHub Pages will
```

## Deploying to a subpath

GitHub Pages serves this repo from `/tfb`, not from the root. Three things follow.

`NEXT_PUBLIC_BASE_PATH=/tfb` sets `basePath` and `assetPrefix`. `next/link`,
`next/font` and the router apply it automatically. Anything written by hand does
not: the root meta refresh, the hreflang set, and image `src` values all take it
explicitly through `src/lib/site.ts`. Images need it because `images.unoptimized`
skips the loader, and the loader is what would normally add the prefix.

`public/.nojekyll` must exist. GitHub Pages runs Jekyll by default, and Jekyll
drops every path beginning with an underscore, which would delete all of
`_next/` and serve the site with no CSS or JS. The workflow asserts the file
survived into `out/`.

There is no server, so there is no redirect from `/`. `out/index.html` is a real
language-chooser page carrying a meta refresh to `/tfb/en/`, and it works with no
JavaScript.

To move to a custom domain later, clear `NEXT_PUBLIC_BASE_PATH` and set
`NEXT_PUBLIC_SITE_URL` to the new origin in the workflow. Nothing else changes.

`public/_redirects` and `public/_headers` are Cloudflare Pages files. They are
inert on GitHub Pages and are kept only so a move back to Cloudflare is a
one-line change.

## Two legal entities

The association and the course provider are separate registered entities with
separate bank accounts. Course fees are not association funds. Anywhere money or
personal data changes hands the interface names the entity involved, and course
income never appears on `/about/finances`.

## Content

Everything editable lives in `content/` as locale-keyed JSON. Every translatable
field is `{ en, no, th }`, never a bare string, and every collection item carries
an immutable `id` alongside its `slug`.

`src/lib/content.ts` is the only module that knows where content comes from. The
admin panel planned for later writes these same shapes into D1, and swapping the
accessor is then the whole migration.

## Conventions worth keeping

- Thai is set in Sarabun at 1.18em with 1.85 line-height and zero letter-spacing.
  Thai has no inter-word spaces, so tracking destroys word boundaries.
- `--lotus` measures 4.26:1 on `--paper`, below AA for normal text. Use it for
  display type 24px and up only. Links and small text use `--lotus-deep`.
- Scroll reveals never gate content: markup ships visible and only hides once an
  inline script proves JS is running.
- Never render a fabricated date, price, or account number. An unset field gets
  a designed empty state or does not render.
