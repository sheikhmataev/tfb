/**
 * The reduced mark: five petals, nothing else. Measured on the supplied
 * artwork, the heart outline is an 18px stroke and the filigree 3px on a
 * 979px canvas, so the full mark only holds a device pixel from about 56px
 * and full fidelity from 320px. Below 96px this is what ships.
 * currentColor, so it inherits ink on paper and paper on ink.
 */

/**
 * The petal geometry, exported rather than kept private, so that every
 * ornament on the site is cut from the association's own mark instead of
 * from a second visual language invented beside it. Ornament.tsx is the
 * only other consumer.
 */
export const MARK_VIEWBOX = "-100 -112 200 150";

export const MARK_PETALS: readonly { rotate: number; d: string }[] = [
  { rotate: -100, d: "M0 0Q44 -45 0 -82Q-44 -45 0 0Z" },
  { rotate: 100, d: "M0 0Q44 -45 0 -82Q-44 -45 0 0Z" },
  { rotate: -52, d: "M0 0Q40 -48 0 -88Q-40 -48 0 0Z" },
  { rotate: 52, d: "M0 0Q40 -48 0 -88Q-40 -48 0 0Z" },
  { rotate: 0, d: "M0 0Q42 -55 0 -100Q-42 -55 0 0Z" },
];

export function Mark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox={MARK_VIEWBOX}
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <g fill="currentColor">
        {MARK_PETALS.map((p, i) => (
          <path key={i} d={p.d} transform={p.rotate === 0 ? undefined : `rotate(${p.rotate})`} />
        ))}
      </g>
    </svg>
  );
}
