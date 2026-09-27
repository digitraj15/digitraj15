import type { Metadata } from "next";
import { getAllCaseStudies } from "@/lib/work";
import { WorkCard } from "@/components/WorkCard";

export const metadata: Metadata = {
  title: "Work",
  description: "Projects by Nav Fusion Media: podcasts, YouTube channels, thumbnails and books.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  const work = getAllCaseStudies();
  return (
    <section className="section">
      <div className="container">
        <div className="section__head">
          <p className="eyebrow">Work</p>
          <h1>Projects</h1>
          <p>What we made, how we made it, and what happened.</p>
        </div>
        <div className="grid grid--3">
          {work.map((w) => (
            <WorkCard key={w.slug} work={w} />
          ))}
        </div>
      </div>
    </section>
  );
}
