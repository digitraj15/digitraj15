import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const WORK_DIR = path.join(process.cwd(), "content", "work");

export type CaseStudyMeta = {
  slug: string;
  title: string;
  client: string;
  summary: string;
  services: string[];
  year: string;
  cover?: string;
  results?: { value: string; label: string }[];
  order?: number;
};

export type CaseStudy = CaseStudyMeta & { body: string };

function slugs() {
  if (!fs.existsSync(WORK_DIR)) return [];
  return fs
    .readdirSync(WORK_DIR)
    .filter((f) => f.endsWith(".mdx") && !f.startsWith("_"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getCaseStudy(slug: string): CaseStudy | null {
  const file = path.join(WORK_DIR, `${slug}.mdx`);
  if (!/^[a-z0-9-]+$/.test(slug) || !fs.existsSync(file)) return null;
  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  return { ...(data as Omit<CaseStudyMeta, "slug">), slug, body: content };
}

export function getAllCaseStudies(): CaseStudyMeta[] {
  return slugs()
    .map((slug) => getCaseStudy(slug)!)
    .map(({ body: _body, ...meta }) => meta)
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
}
