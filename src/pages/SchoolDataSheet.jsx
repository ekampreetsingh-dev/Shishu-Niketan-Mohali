import PageHeader, { SectionHeading } from "../components/PageHeader.jsx";
import Reveal from "../components/Reveal.jsx";
import { dataSheet } from "../data/school.js";

export default function SchoolDataSheet() {
  return (
    <>
      <PageHeader eyebrow="Records" title="School Data Sheet" intro="The particulars the school publishes for CBSE records." />

      <section className="shell py-16 lg:py-20">
        <div className="grid gap-x-14 gap-y-10 lg:grid-cols-2">
          {[
            ["School name & address", dataSheet.schoolName],
            ["Year of establishment", dataSheet.established],
            ["NOC", dataSheet.noc],
            ["Recognition", dataSheet.recognition],
            ["Name of society", dataSheet.society],
            ["Manager", dataSheet.manager],
          ].map(([label, value], index) => (
            <Reveal key={label} delay={index * 0.05}>
              <div className="border-t border-line pt-5">
                <h2 className="font-display text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-muted">{label}</h2>
                <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink">{value}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-sunken">
        <div className="shell grid gap-14 py-16 lg:grid-cols-2 lg:py-20">
          <div>
            <SectionHeading eyebrow="Affiliation" title="With the Board" />
            <Reveal delay={0.1}>
              <dl className="mt-9 space-y-3">
                {[
                  ["Affiliation No.", dataSheet.affiliation.number],
                  ["Affiliated since", dataSheet.affiliation.since],
                  ["Extension stated here", dataSheet.affiliation.extension],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-baseline justify-between gap-6 border-b border-dashed border-line-strong pb-3">
                    <dt className="text-[0.875rem] text-muted">{label}</dt>
                    <dd className="font-display text-[0.9375rem] font-bold text-ink">{value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-5 text-[0.8125rem] leading-relaxed text-muted">{dataSheet.affiliation.note}</p>
            </Reveal>
          </div>

          <div>
            <SectionHeading eyebrow="Campus" title="Area" />
            <Reveal delay={0.1}>
              <dl className="mt-9 grid grid-cols-2 gap-x-8 gap-y-6">
                {dataSheet.campus.map(([label, value]) => (
                  <div key={label} className="border-t border-line-strong pt-4">
                    <dt className="text-[0.6875rem] uppercase tracking-[0.14em] text-muted">{label}</dt>
                    <dd className="mt-1.5 font-display text-[1.25rem] font-extrabold text-ink">{value}</dd>
                  </div>
                ))}
              </dl>
              <ul className="mt-8 flex flex-wrap gap-2">
                {dataSheet.otherFacilities.map((item) => (
                  <li key={item} className="border border-line-strong px-3 py-1.5 text-[0.75rem] font-semibold text-ink">
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
