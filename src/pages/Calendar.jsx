import PageHeader from "../components/PageHeader.jsx";
import Reveal from "../components/Reveal.jsx";
import { disclosures } from "../data/school.js";
import { OFFICIAL_SITE } from "../config.js";
import { CalendarDays, FileText } from "lucide-react";

const calendarPdf = disclosures.find((item) => item.title === "Annual Academic Calendar");

export default function Calendar() {
  return (
    <>
      <PageHeader
        eyebrow="Sessions"
        title="School Calendar"
        intro="The academic calendar the school currently publishes is the PDF notice below."
      />

      <section className="shell py-16 lg:py-20">
        <Reveal>
          <a
            href={calendarPdf?.file}
            target="_blank"
            rel="noreferrer"
            className="flex flex-col items-start gap-5 border border-line-strong bg-elevated p-8 transition-colors hover:border-ink sm:flex-row sm:items-center sm:p-10"
          >
            <span className="grid h-14 w-14 shrink-0 place-items-center bg-elevated text-ink">
              <FileText size={22} />
            </span>
            <span className="flex-1">
              <strong className="block font-display text-[1.125rem] font-bold text-ink">
                Annual Academic Calendar
              </strong>
              <small className="mt-2 block text-[0.875rem] text-muted">
                Published by the school as a PDF — the period-wise test table below is only what the old page retained.
              </small>
            </span>
            <span className="btn btn-primary">Open PDF</span>
          </a>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-12 border-l-2 border-accent bg-elevated p-6">
            <h2 className="flex items-center gap-2.5 font-display text-[1rem] font-bold text-ink">
              <CalendarDays size={17} className="text-accent" /> Dated notices still on the official page
            </h2>
            <ul className="mt-4 space-y-2 text-[0.875rem] leading-relaxed text-muted">
              <li>Periodic tests from 16 July 2018</li>
              <li>Half-yearly examination from mid September 2018</li>
              <li>The 3rd Tricity Inter-School Cyber Olympiad, early October 2018</li>
              <li>The Second Suchinta Khorana Memorial Football Trophy, early November 2018</li>
            </ul>
            <p className="mt-5 text-[0.8125rem] leading-relaxed text-muted">
              These entries are from the previous calendar pages and are shown for completeness only. Confirm current dates
              with the school office or at{" "}
              <a href={`${OFFICIAL_SITE}/calendar`} target="_blank" rel="noreferrer" className="font-semibold text-ink underline">
                the official calendar page
              </a>
              .
            </p>
          </div>
        </Reveal>
      </section>
    </>
  );
}
