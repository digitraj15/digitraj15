import Link from "next/link";
import { site, whatsappLink } from "@/config/site";
import { getAllCaseStudies } from "@/lib/work";
import { LeadForm } from "@/components/LeadForm";
import { WorkCard } from "@/components/WorkCard";

export default function Home() {
  const work = getAllCaseStudies().slice(0, 3);
  const { hero, stats, clients, services, pricing, testimonials, faqs, contact } = site;

  return (
    <>
      <section className="hero">
        <div className="container hero__inner">
          <p className="eyebrow">{hero.eyebrow}</p>
          <h1>{hero.title}</h1>
          <p className="lead">{hero.subtitle}</p>
          <div className="cta-row">
            <Link className="btn" href={hero.primaryCta.href}>
              {hero.primaryCta.label}
            </Link>
            <Link className="btn btn--ghost" href={hero.secondaryCta.href}>
              {hero.secondaryCta.label}
            </Link>
          </div>
        </div>
      </section>

      {stats.length > 0 && (
        <section className="stats" aria-label="Numbers">
          <div className="container stats__grid">
            {stats.map((s) => (
              <div key={s.label} className="stat">
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {clients.length > 0 && (
        <section className="clients" aria-label="Clients">
          <div className="container">
            <p className="clients__label">Work for</p>
            <ul className="clients__list">
              {clients.map((c) => (
                <li key={c.name}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {c.logo ? <img src={c.logo} alt={c.name} height={32} /> : <span>{c.name}</span>}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section id="services" className="section">
        <div className="container">
          <div className="section__head">
            <p className="eyebrow">Services</p>
            <h2>What we do</h2>
          </div>
          <div className="grid grid--3">
            {services.map((s) => (
              <article key={s.title} className="card">
                <h3>{s.title}</h3>
                <p>{s.description}</p>
                <ul className="ticks">
                  {s.includes.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {work.length > 0 && (
        <section id="work" className="section section--alt">
          <div className="container">
            <div className="section__head section__head--row">
              <div>
                <p className="eyebrow">Work</p>
                <h2>Recent projects</h2>
              </div>
              <Link href="/work" className="link-arrow">
                All projects →
              </Link>
            </div>
            <div className="grid grid--3">
              {work.map((w) => (
                <WorkCard key={w.slug} work={w} />
              ))}
            </div>
          </div>
        </section>
      )}

      {pricing.plans.length > 0 && (
        <section id="pricing" className="section">
          <div className="container">
            <div className="section__head">
              <p className="eyebrow">Pricing</p>
              <h2>Simple prices</h2>
              <p>{pricing.note}</p>
            </div>
            <div className="grid grid--3">
              {pricing.plans.map((p) => (
                <article key={p.name} className={`card plan${p.highlighted ? " plan--hl" : ""}`}>
                  {p.highlighted && <span className="plan__badge">Most picked</span>}
                  <h3>{p.name}</h3>
                  <p className="plan__price">
                    {p.price}
                    {p.period && <small> {p.period}</small>}
                  </p>
                  <p>{p.description}</p>
                  <ul className="ticks">
                    {p.features.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                  <Link href="#contact" className={`btn btn--block${p.highlighted ? "" : " btn--ghost"}`}>
                    Get started
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {testimonials.length > 0 && (
        <section className="section section--alt">
          <div className="container">
            <div className="section__head">
              <p className="eyebrow">Clients</p>
              <h2>What they say</h2>
            </div>
            <div className="grid grid--3">
              {testimonials.map((t) => (
                <figure key={t.name + t.quote} className="card quote">
                  <blockquote>“{t.quote}”</blockquote>
                  <figcaption>
                    <strong>{t.name}</strong>
                    <span>{t.role}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {faqs.length > 0 && (
        <section id="faq" className="section">
          <div className="container narrow">
            <div className="section__head">
              <p className="eyebrow">FAQ</p>
              <h2>Common questions</h2>
            </div>
            <div className="faq">
              {faqs.map((f) => (
                <details key={f.q}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="contact" className="section section--contact">
        <div className="container contact">
          <div>
            <p className="eyebrow">Contact</p>
            <h2>Tell us what you need</h2>
            <p>Fill in the form and we&apos;ll reply within one working day. Or message us directly.</p>
            <ul className="contact__list">
              <li>
                <span>Email</span>
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </li>
              <li>
                <span>WhatsApp</span>
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                  Start a chat
                </a>
              </li>
              {contact.phone && (
                <li>
                  <span>Phone</span>
                  <a href={`tel:${contact.phone}`}>{contact.phone}</a>
                </li>
              )}
              <li>
                <span>Hours</span>
                {contact.hours}
              </li>
            </ul>
          </div>
          <LeadForm />
        </div>
      </section>
    </>
  );
}
