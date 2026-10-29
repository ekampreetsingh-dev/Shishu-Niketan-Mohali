import { Link } from "react-router-dom";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { navigation, footerLinks, feePath } from "../data/navigation.js";
import { school } from "../data/school.js";
import { images } from "../data/assets.js";
import { OFFICIAL_SITE } from "../config.js";

export default function Footer() {
  const secondary = navigation
    .filter((item) => item.to !== "/")
    .flatMap((item) => (item.children ? [{ label: item.label, to: item.to }, ...item.children] : [{ label: item.label, to: item.to }]))
    // A group and its first child can share a route; labels stay unique.
    .filter((item, index, list) => list.findIndex((other) => other.to === item.to) === index);
  const columns = [secondary.slice(0, 6), secondary.slice(6)];

  return (
    <footer className="text-muted">
      <div className="shell grid gap-12 pb-8 pt-14 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <div className="flex items-center gap-3">
            <img src={images.logo} alt="" className="h-12 w-12 bg-ink/95 p-1" />
            <p className="font-display text-[0.9375rem] font-extrabold leading-tight text-ink">
              Shishu Niketan
              <br />
              Public School
            </p>
          </div>
          <p className="mt-5 text-[0.8125rem] leading-relaxed text-muted">
            CBSE affiliated, established {school.established}, part of the {school.group.name} (estd {school.group.established}).
          </p>
          <address className="mt-6 space-y-2.5 text-[0.8125rem] not-italic">
            <span className="flex items-start gap-2.5">
              <MapPin size={15} className="mt-0.5 shrink-0 text-accent" />
              {school.address}
            </span>
            <span className="flex items-center gap-2.5">
              <Phone size={15} className="shrink-0 text-accent" />
              <a href={`tel:${school.contactPhone.replace(/\s/g, "")}`} className="hover:text-accent-soft">
                {school.contactPhone}
              </a>
            </span>
            <span className="flex items-center gap-2.5">
              <Mail size={15} className="shrink-0 text-accent" />
              <a href={`mailto:${school.email}`} className="break-all hover:text-accent-soft">
                {school.email}
              </a>
            </span>
          </address>
        </div>

        {columns.map((links, index) => (
          <nav key={index} aria-label={`Footer navigation ${index + 1}`}>
            <h3 className="font-display text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-accent">
              {index === 0 ? "The School" : "Records & Resources"}
            </h3>
            <ul className="mt-5 space-y-2.5">
              {links.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-[0.8125rem] text-muted transition-colors hover:text-ink">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div>
          <h3 className="font-display text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-accent">Parents</h3>
          <ul className="mt-5 space-y-2.5">
            <li>
              <Link
                to={feePath}
                className="inline-flex items-center gap-1.5 font-display text-[0.8125rem] font-bold text-ink transition-colors hover:text-accent-soft"
              >
                Fee Payment <ArrowUpRight size={14} />
              </Link>
            </li>
            {footerLinks
              .filter((link) => link.to !== feePath)
              .map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-[0.8125rem] text-muted transition-colors hover:text-ink">
                    {link.label}
                  </Link>
                </li>
              ))}
            <li>
              <a
                href={school.branch.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-[0.8125rem] text-muted transition-colors hover:text-ink"
              >
                {school.branch.label} <ArrowUpRight size={13} />
              </a>
            </li>
            <li>
              <a
                href={`${OFFICIAL_SITE}/privacypolicy_shishuniketanpublicschool`}
                target="_blank"
                rel="noreferrer"
                className="text-[0.8125rem] text-muted transition-colors hover:text-ink"
              >
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* No divider — the copyright continues the footer instead of sitting in
          its own band below it. */}
      <div className="shell flex flex-col items-center justify-between gap-2 pb-6 text-[0.75rem] text-faint sm:flex-row">
        <p>Copyright © {school.name}, Mohali — All Rights Reserved.</p>
        <a href={OFFICIAL_SITE} target="_blank" rel="noreferrer" className="hover:text-accent-soft">
          shishuniketanmohali.org.in
        </a>
      </div>
    </footer>
  );
}
