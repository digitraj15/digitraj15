import Link from "next/link";
import { site, whatsappLink } from "@/config/site";
import { Logo } from "./Logo";
import { SocialLinks } from "./SocialLinks";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div>
          <Logo />
          <p className="footer__tag">{site.tagline}</p>
          <SocialLinks />
        </div>
        <div>
          <h3>Pages</h3>
          <ul>
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Contact</h3>
          <ul>
            <li>
              <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
            </li>
            <li>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            </li>
            {site.contact.phone && (
              <li>
                <a href={`tel:${site.contact.phone}`}>{site.contact.phone}</a>
              </li>
            )}
            <li>{site.contact.hours}</li>
          </ul>
        </div>
      </div>
      <div className="container footer__bottom">
        <p>
          © {new Date().getFullYear()} {site.name}. {site.contact.city}.
        </p>
      </div>
    </footer>
  );
}
