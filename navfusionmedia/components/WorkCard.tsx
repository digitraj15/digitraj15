import Link from "next/link";
import type { CaseStudyMeta } from "@/lib/work";

export function WorkCard({ work }: { work: CaseStudyMeta }) {
  return (
    <Link href={`/work/${work.slug}`} className="card work-card">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {work.cover ? <img src={work.cover} alt="" className="work-card__cover" /> : <div className="work-card__cover work-card__cover--blank">{work.title}</div>}
      <p className="work-card__meta">
        {work.client} · {work.year}
      </p>
      <h3>{work.title}</h3>
      <p>{work.summary}</p>
      <span className="link-arrow">Read the case study →</span>
    </Link>
  );
}
