import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import PageHeader from "../components/PageHeader.jsx";
import Reveal from "../components/Reveal.jsx";
import { school, admissions } from "../data/school.js";
import { feePath } from "../data/navigation.js";
import { OFFICIAL_SITE } from "../config.js";
import { disclosureInfo } from "../data/school.js";

const channels = [
  {
    label: "Telephone",
    icon: Phone,
    lines: [school.contactPhone, ...school.phones.map((n) => `+91 ${n}`)],
    href: `tel:${school.contactPhone.replace(/[^+\d]/g, "")}`,
  },
  {
    label: "Admissions",
    icon: Phone,
    lines: admissions.enquiries,
    href: `tel:${admissions.enquiries[0].replace(/[^+\d]/g, "")}`,
  },
  {
    label: "Email",
    icon: Mail,
    lines: [school.email, school.altEmail],
    href: `mailto:${school.email}`,
  },
];

export default function Contact() {
  const mapsQuery = encodeURIComponent(`${school.fullName}, ${disclosureInfo.address}`);

  return (
    <>
      <PageHeader
        eyebrow="Get in touch"
        title="Contact Us"
        intro="You can reach the school by any of the following means."
      />

      <section className="shell grid gap-6 py-16 lg:grid-cols-3 lg:py-20">
        {channels.map((channel, index) => {
          const Icon = channel.icon;
          return (
            <Reveal key={channel.label} delay={index * 0.07}>
              <div className="flex h-full flex-col border border-line p-7 transition-colors hover:border-line-strong">
                <span className="flex items-center gap-2.5 font-display text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-muted">
                  <Icon size={15} className="text-accent" /> {channel.label}
                </span>
                <ul className="mt-5 flex-1 space-y-2">
                  {channel.lines.map((line) => (
                    <li key={line} className="font-display text-[1rem] font-bold text-ink">
                      {line}
                    </li>
                  ))}
                </ul>
                <a
                  href={channel.href}
                  className="mt-6 inline-flex items-center gap-1.5 font-display text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-muted transition-colors hover:text-accent"
                >
                  Open <ArrowRight size={13} />
                </a>
              </div>
            </Reveal>
          );
        })}
      </section>

      <section className="border-y border-line bg-sunken">
        <div className="shell grid gap-12 py-16 lg:grid-cols-2 lg:py-20">
          <Reveal>
            <h2 className="text-[1.5rem]">Address</h2>
            <address className="mt-6 space-y-3 text-[1rem] not-italic leading-relaxed text-ink">
              <p className="flex items-start gap-3">
                <MapPin size={18} className="mt-1 shrink-0 text-accent" />
                <span>
                  <strong className="block font-display font-bold">{school.name}</strong>
                  {disclosureInfo.address}
                </span>
              </p>
            </address>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary"
              >
                Directions <ExternalLink size={15} />
              </a>
              <Link to={feePath} className="btn btn-ghost">
                Fee payment
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="text-[1.5rem]">Office hours</h2>
            <dl className="mt-6 space-y-3">
              {[
                ["Fee deposit", admissions.depositTimings],
                ["Principal", disclosureInfo.principal],
                ["School code", disclosureInfo.schoolCode],
                ["Branch", `${school.branch.label}`],
              ].map(([label, value]) => (
                <div key={label} className="flex items-baseline justify-between gap-6 border-b border-dashed border-line-strong pb-3">
                  <dt className="text-[0.875rem] text-muted">{label}</dt>
                  <dd className="text-right font-display text-[0.875rem] font-bold text-ink">
                    {label === "Branch" ? (
                      <a href={school.branch.url} target="_blank" rel="noreferrer" className="underline decoration-line-strong underline-offset-4 hover:text-accent">
                        Behlolpur campus
                      </a>
                    ) : (
                      value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 text-[0.8125rem] leading-relaxed text-muted">
              The school does not publish a web enquiry form. Write or call, or use the{" "}
              <a href={`${OFFICIAL_SITE}/contact-us`} target="_blank" rel="noreferrer" className="font-semibold text-ink underline">
                official contact page
              </a>
              .
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
