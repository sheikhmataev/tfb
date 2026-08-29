"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Entrance: opacity plus 8px, 220ms, once.
 *
 * The markup is visible in the HTML. Hiding only happens once an inline script
 * has proved JS is running (html[data-js]), and an observer then reveals it.
 * A crawler, a failed observer, or JS switched off all get the finished state
 * rather than a blank page. On a site people reach for when they need help,
 * an animation must never be able to hide the content it decorates.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) {
      el.classList.add("is-in");
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "-10% 0px" },
    );
    io.observe(el);

    // Failsafe: nothing stays hidden for longer than a second and a half,
    // whatever the observer does.
    const t = window.setTimeout(() => el.classList.add("is-in"), 1500);

    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={delay ? ({ "--reveal-delay": `${delay}s` } as React.CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}
