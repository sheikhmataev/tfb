# Brand assets

| File | What it is | Size |
|---|---|---|
| `logo-mark.svg` | The lotus mark alone, vector. Two layers: lotus in `--lotus` `#E31375`, filigree/TFB in `--paper` `#FAF7F5`. | 939×767 viewBox |
| `logo-mark.png` | Same, raster. Trimmed to the ink bounds, no dead canvas. | 939×767 |
| `logo-lockup.svg` | Mark above THAI / FORENINGEN BERGEN with the two magenta rules, vector. Wordmark in `--ink` `#14100F`. For paper grounds. | 420×562 viewBox |
| `logo-lockup.png` | Same, raster. | 420×562 |
| `logo-lockup-inverse.svg` | Lockup with the wordmark in `--paper`. Lotus and rules stay magenta. For ink grounds. | 420×562 viewBox |
| `logo-lockup-inverse.png` | Same, raster. | 420×562 |
| `banner.jpg` | The Bergen harbour banner with the lockup centred. | 1983×793 |

Prefer the SVGs everywhere. The PNGs are the traced-from source and exist only as a
fallback; the mark appears in the header, the footer, the favicon and the OG image,
and the raster is visibly soft on a retina screen at any size above about 120px.

## Notes on the artwork

The mark is **landscape, not square** — 939×767, aspect 1.224. A 36px-tall header slot
is 44px wide, not 36. Size on height and let width follow, or the mark shrinks.

The favicon needs its own square export with its own optical padding; do not letterbox
`logo-mark.svg` into a square box and call it done.

Both lockups carry the wordmark as filled outlines traced from the supplied raster,
not live type. Do not attempt to edit the wording. If the wording changes, the lockup
must be reset in Marcellus and re-traced.

The reduced mark used at small sizes is authored as inline SVG in `../index.html`
and is not a file. See section 01 of the design system for when each is used.

## Provenance

Everything here derives from two supplied rasters, `lotus.png` (the mark on white) and
`lotus_big.png` (the banner). Backgrounds were keyed out, the lockup was cropped from
the banner, and the vectors were traced with potrace. There is no original vector
source. If one surfaces, it should replace all six logo files.
