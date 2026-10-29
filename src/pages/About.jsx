import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import PageHeader, { SectionHeading } from "../components/PageHeader.jsx";
import Reveal from "../components/Reveal.jsx";
import { school, intro } from "../data/school.js";
import { images } from "../data/assets.js";
import { feePath } from "../data/navigation.js";

export default function About() {
  return (
    <>
      <PageHeader
        eyebrow={`Established ${school.established}`}
        title="About the school"
        intro={intro.body}
        image={images.shishu_niketan_school_staff}
      />

      <section className="shell grid gap-14 py-20 lg:grid-cols-[0.5fr_0.5fr] lg:py-24">
        <SectionHeading eyebrow="Affiliation & recognition" title="On the record" />
        <Reveal>
          <ul className="space-y-4">
            {intro.credentials.map((line) => (
              <li key={line} className="flex gap-4 border-b border-line pb-4 text-[0.9375rem] leading-relaxed text-muted">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-accent" />
                {line}
              </li>
            ))}
            <li className="flex gap-4 text-[0.9375rem] leading-relaxed text-muted">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-accent" />
              Area of school: {school.campusArea}
            </li>
          </ul>
        </Reveal>
      </section>

      <section className="border-y border-line bg-sunken">
        <div className="shell grid gap-10 py-20 md:grid-cols-3">
          {[
            { label: "The society", value: school.society },
            { label: "School manager", value: school.manager },
            { label: "The group", value: `${school.group.name}, established ${school.group.established} — ${school.group.branches} branches` },
          ].map((item, index) => (
            <Reveal key={item.label} delay={index * 0.08}>
              <p className="font-display text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-muted">
                {item.label}
              </p>
              <p className="mt-3 font-display text-[1.25rem] font-extrabold leading-snug text-ink">{item.value}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="shell py-20 lg:py-24">
        <Reveal className="grid gap-9 border border-line-strong bg-elevated p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:p-12">
          <div>
            <h2 className="text-[clamp(1.5rem,3vw,2.125rem)]">Classes, campus and what happens next</h2>
            <p className="lead mt-4">
              {school.classes} on the {school.medium}. Browse the infrastructure, read the admissions requirements, or pay
              fees online.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:flex-col lg:items-stretch">
            <Link to="/infrastructure" className="btn btn-primary">
              Infrastructure <ArrowRight size={15} />
            </Link>
            <Link to="/admissions" className="btn btn-ghost">
              Admissions
            </Link>
            <Link to={feePath} className="btn btn-ghost">
              Fee payment
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
