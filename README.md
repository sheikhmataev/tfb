# Thai Foreningen Bergen

Trilingual static site for Thai Foreningen Bergen (org.nr 996 630 307) and the
food-safety courses run by Thai Restaurantvirksomhet Kurs (org.nr 924 409 509).

Next.js 16 static export, Tailwind v4, TypeScript, deployed to Cloudflare Pages.

```bash
npm run dev      # local development
npm run build    # static export to out/
npm run deploy   # build and push to Cloudflare Pages
```

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
