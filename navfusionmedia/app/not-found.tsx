import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section">
      <div className="container narrow">
        <h1>Page not found</h1>
        <p>This page doesn&apos;t exist or was moved.</p>
        <Link href="/" className="btn">
          Go to the home page
        </Link>
      </div>
    </section>
  );
}
