import { MARK_PETALS, MARK_VIEWBOX } from "@/components/Mark";

/**
 * Two ornaments, both cut from the association's own mark. Nothing here is a
 * new visual language: SectionOpener and QuietLotus both draw MARK_PETALS,
 * so the page is marked with the logo's geometry rather than decorated with
 * imported shapes.
 *
 * Colours are set through the theme custom properties in a scoped inline
 * style rather than through fill-* utilities, because globals.css belongs to
 * another file and a graphic that silently renders black if a utility is not
 * generated is not worth the saving.
 *
 * Neither ornament is a box: no border, no background, no aspect-ratio
 * container. A decorative shape that is not framed cannot read as an empty
 * image placeholder.
 */

/**
 * A 1px hairline drawn as SVG rather than as a border on an empty span, so
 * the rule is a graphic and not a frame around nothing. preserveAspectRatio
 * "none" lets the single unit-high rect stretch to whatever width the flex
 * row gives it while the element's own 1px height keeps the line hairline.
 */
function Hairline({ className }: { className: string }) {
  return (
    <svg
      className={`h-px ${className}`}
      viewBox="0 0 24 1"
      preserveAspectRatio="none"
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <rect width="24" height="1" style={{ fill: "var(--color-rule)" }} />
    </svg>
  );
}

/**
 * The band opener: a hairline that the lotus interrupts a short way in, then
 * runs on to the full measure. It replaces nothing and claims nothing, it
 * only says where a section begins, which is the job a plain 1px rule was
 * already doing less legibly. Used identically on every band of the
 * homepage, so it reads as structure rather than as five separate flourishes.
 *
 * The mark renders 24px tall, which is the floor at which #E31375 is
 * permitted; below that the lotus family drops to lotus-deep, and a graphic
 * this quiet does not need the darker tone.
 */
export function SectionOpener({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`} aria-hidden="true">
      <Hairline className="w-10 shrink-0" />
      <svg
        viewBox={MARK_VIEWBOX}
        className="h-6 w-8 shrink-0"
        style={{ fill: "var(--color-lotus)" }}
        role="presentation"
        aria-hidden="true"
        focusable="false"
      >
        {MARK_PETALS.map((p, i) => (
          <path key={i} d={p.d} transform={p.rotate === 0 ? undefined : `rotate(${p.rotate})`} />
        ))}
      </svg>
      <Hairline className="flex-1" />
    </div>
  );
}

/**
 * The mark at full column width, drawn as a pale petal fill under a rule
 * hairline. It carries no information and is hidden from assistive
 * technology: it is the watermark on a document, not a picture of anything,
 * which is the only kind of large graphic this page can honestly hold while
 * the association has no photographs of its own events.
 *
 * non-scaling-stroke keeps the contour at one device-independent pixel at
 * every size, so the outline matches the hairlines everywhere else.
 */
export function QuietLotus({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox={MARK_VIEWBOX}
      className={className}
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      {MARK_PETALS.map((p, i) => (
        <path
          key={i}
          d={p.d}
          transform={p.rotate === 0 ? undefined : `rotate(${p.rotate})`}
          vectorEffect="non-scaling-stroke"
          style={{
            fill: "var(--color-petal)",
            stroke: "var(--color-rule)",
            strokeWidth: 1,
          }}
        />
      ))}
    </svg>
  );
}
