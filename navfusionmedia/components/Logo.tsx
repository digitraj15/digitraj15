import Link from "next/link";
import { site } from "@/config/site";

export function Logo() {
  return (
    <Link href="/" className="brand" aria-label={`${site.name} home`}>
      <svg viewBox="0 0 64 64" width="34" height="34" aria-hidden="true">
        <rect width="64" height="64" rx="14" fill="var(--ink)" />
        <path d="M16 46V18h6l14 18V18h6v28h-6L22 28v18z" fill="var(--accent)" />
        <circle cx="49" cy="18" r="4" fill="var(--gold)" />
      </svg>
      <span>
        Nav Fusion <b>Media</b>
      </span>
    </Link>
  );
}
