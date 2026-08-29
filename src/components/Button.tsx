import Link from "next/link";

export function ButtonPrimary({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-block rounded-[2px] border border-ink bg-ink px-6 py-3 text-base font-semibold text-paper no-underline transition-colors duration-150 hover:bg-[#2c2523]"
    >
      {children}
    </Link>
  );
}

export function ButtonText({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-block border-b-2 border-lotus pb-0.5 text-base font-semibold text-ink no-underline"
    >
      {children}
    </Link>
  );
}
