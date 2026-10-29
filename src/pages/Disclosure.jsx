import PageHeader, { SectionHeading } from "../components/PageHeader.jsx";
import Reveal from "../components/Reveal.jsx";
import { disclosures, salaryDetails } from "../data/school.js";
import { disclosureInfo } from "../data/school.js";
import { FileText } from "lucide-react";

const documentTitles = disclosures.map((item) => item.title);

export default function Disclosure() {
  const byTitle = new Map(disclosures.map((item) => [item.title, item.file]));

  return (
    <>
      <PageHeader
        eyebrow="CBSE requirement"
        title="Mandatory Public Disclosure"
        intro="General information, statutory certificates, academics and staff strength as published by the school."
      />

      <section className="shell py-16 lg:py-20">
        <SectionHeading eyebrow="A" title="General information" />
        <div className="mt-10 grid gap-x-14 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["Name of the school", disclosureInfo.name],
            ["Affiliation No.", disclosureInfo.affiliationNo],
            ["School code", disclosureInfo.schoolCode],
            ["Address with PIN code", disclosureInfo.address],
            ["Principal", `${disclosureInfo.principal} (${disclosureInfo.principalQualification})`],
            ["School email / contact", `${disclosureInfo.email} · ${disclosureInfo.contact}`],
          ].map(([label, value], index) => (
            <Reveal key={label} delay={index * 0.04}>
              <div className="border-t border-line pt-4">
                <dt className="text-[0.6875rem] uppercase tracking-[0.14em] text-muted">{label}</dt>
                <dd className="mt-2 text-[0.9375rem] font-semibold leading-snug text-ink">{value}</dd>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-sunken">
        <div className="shell py-16 lg:py-20">
          <SectionHeading eyebrow="D" title="Teaching staff" />
          <div className="mt-10 grid gap-x-14 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {disclosureInfo.staff.map(([label, value], index) => (
              <Reveal key={label} delay={index * 0.04}>
                <div className="flex items-baseline justify-between gap-5 border-b border-dashed border-line-strong pb-3">
                  <span className="text-[0.875rem] text-muted">{label}</span>
                  <span className="text-right font-display text-[0.875rem] font-bold text-ink">{value}</span>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.12}>
            <div className="mt-12 min-w-0 overflow-x-auto rounded-[28px] border border-line-strong bg-surface">
              <table className="data-table min-w-[38rem]">
                <thead>
                  <tr>
                    <th>Designation</th>
                    <th>Scale</th>
                    <th>Grade Pay</th>
                    <th>% of DA</th>
                    <th>EPF</th>
                  </tr>
                </thead>
                <tbody>
                  {salaryDetails.map((row) => (
                    <tr key={row.designation}>
                      <td className="font-semibold text-ink">{row.designation}</td>
                      <td>{row.scale}</td>
                      <td>{row.gradePay}</td>
                      <td>{row.da}</td>
                      <td>{row.epf}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="shell py-16 lg:py-20">
        <SectionHeading
          eyebrow="B & C"
          title="Documents and academic records"
          body="Each certificate is the school's own published scan, served from the school's site."
        />
        <ul className="mt-10 grid gap-px border border-line bg-line-soft sm:grid-cols-2 lg:grid-cols-3">
          {documentTitles.map((title, index) => (
            <Reveal as="li" key={title} delay={index * 0.03} className="bg-surface">
              <a
                href={byTitle.get(title)}
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-3.5 rounded-[24px] p-5 transition-colors hover:bg-elevated"
              >
                <FileText size={16} className="mt-0.5 shrink-0 text-accent" />
                <span className="font-display text-[0.8125rem] font-bold leading-snug text-ink">{title}</span>
              </a>
            </Reveal>
          ))}
        </ul>
      </section>
    </>
  );
}
