import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllCaseStudies, getCaseStudy } from "@/lib/work";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllCaseStudies().map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const work = getCaseStudy((await params).slug);
  if (!work) return {};
  return {
    title: work.title,
    description: work.summary,
    alternates: { canonical: `/work/${work.slug}` },
    openGraph: { title: work.title, description: work.summary, images: work.cover ? [work.cover] : undefined },
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const work = getCaseStudy((await params).slug);
  if (!work) notFound();

  return (
    <article className="section">
      <div className="container narrow">
        <Link href="/work" className="link-arrow">
          ← All projects
        </Link>
        <header className="case__head">
          <p className="eyebrow">
            {work.client} · {work.year}
          </p>
          <h1>{work.title}</h1>
          <p className="lead">{work.summary}</p>
          <ul className="tags">
            {work.services.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </header>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        {work.cover && <img src={work.cover} alt="" className="case__cover" />}

        {work.results && work.results.length > 0 && (
          <div className="stats__grid case__results">
            {work.results.map((r) => (
              <div key={r.label} className="stat">
                <strong>{r.value}</strong>
                <span>{r.label}</span>
              </div>
            ))}
          </div>
        )}

        <div className="prose">
          <MDXRemote source={work.body} />
        </div>

        <div className="case__cta card">
          <h2>Want something like this?</h2>
          <p>Tell us about your project and we&apos;ll reply within one working day.</p>
          <Link href="/#contact" className="btn">
            Get a quote
          </Link>
        </div>
      </div>
    </article>
  );
}
