/**
 * The reduced mark: five petals, nothing else. Measured on the supplied
 * artwork, the heart outline is an 18px stroke and the filigree 3px on a
 * 979px canvas, so the full mark only holds a device pixel from about 56px
 * and full fidelity from 320px. Below 96px this is what ships.
 * currentColor, so it inherits ink on paper and paper on ink.
 */
export function Mark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="-100 -112 200 150"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <g fill="currentColor">
        <g transform="rotate(-100)">
          <path d="M0 0Q44 -45 0 -82Q-44 -45 0 0Z" />
        </g>
        <g transform="rotate(100)">
          <path d="M0 0Q44 -45 0 -82Q-44 -45 0 0Z" />
        </g>
        <g transform="rotate(-52)">
          <path d="M0 0Q40 -48 0 -88Q-40 -48 0 0Z" />
        </g>
        <g transform="rotate(52)">
          <path d="M0 0Q40 -48 0 -88Q-40 -48 0 0Z" />
        </g>
        <path d="M0 0Q42 -55 0 -100Q-42 -55 0 0Z" />
      </g>
    </svg>
  );
}
