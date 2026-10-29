import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import PageHeader, { SectionHeading } from "../components/PageHeader.jsx";
import Reveal from "../components/Reveal.jsx";
import { admissions, school, academics } from "../data/school.js";
import { feePath } from "../data/navigation.js";
import { disclosures } from "../data/school.js";

const { feeStructure } = admissions;
const feePdf = disclosures.find((item) => item.title === "Fee Structure");

function FeeTable({ caption, rows, columns }) {
  return (
    <Reveal>
      <div className="overflow-x-auto border border-line">
        <table className="data-table min-w-[30rem]">
          <caption className="border-b border-line bg-elevated px-4 py-3 text-left font-display text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-ink">
            {caption}
          </caption>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="transition-colors hover:bg-elevated">
                <td className="text-muted">{row.label}</td>
                <td className="whitespace-nowrap font-display font-bold text-ink">₹ {row.amount}</td>
                {row.quarter && <td className="whitespace-nowrap font-display font-bold text-ink">₹ {row.quarter}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Reveal>
  );
}

export default function Admissions() {
  const monthlyColumns = ["Classes", "Per month", "Per quarter"];

  return (
    <>
      <PageHeader
        eyebrow={`Session ${feeStructure.session}`}
        title="Admissions"
        intro={`${school.fullName} admits students from Playway through Class 12 on the CBSE curriculum.`}
        action={
          <>
            <Link to={feePath} className="btn btn-primary">
              Pay fees online <ArrowRight size={15} />
            </Link>
            {feePdf && (
              <a href={feePdf.file} className="btn btn-ghost">
                Fee structure (PDF)
              </a>
            )}
          </>
        }
      />

      <section className="shell py-20 lg:py-24">
        <SectionHeading
          eyebrow="Fee structure"
          title={`Published for ${feeStructure.session}`}
          body="As advertised by the school. The counter remains the authoritative source for individual accounts."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <FeeTable caption="Payable at the time of admission" rows={feeStructure.payableAtAdmission} columns={["Item", "Amount"]} />
          <FeeTable caption="Annual fee" rows={feeStructure.annual} columns={["Classes", "Amount"]} />
        </div>

        <div className="mt-6">
          <FeeTable caption="Monthly fee" rows={feeStructure.monthly} columns={monthlyColumns} />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <FeeTable caption="Variable charges" rows={feeStructure.variable} columns={["Item", "Amount"]} />
          <Reveal>
            <div className="flex h-full flex-col justify-between border border-line bg-elevated p-7">
              <div>
                <h3 className="text-[1.125rem]">Fee deposit timings</h3>
                <p className="mt-3 text-[0.9375rem] text-muted">{admissions.depositTimings}</p>
                <p className="mt-2 text-[0.8125rem] text-muted">{feeStructure.note}</p>
              </div>
              <Link to={feePath} className="btn btn-primary mt-7 self-start">
                Pay online instead <ArrowRight size={15} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-line bg-sunken">
        <div className="shell grid gap-14 py-20 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="New admission" title="Documents to bring" />
            <Reveal delay={0.1}>
              <ul className="prose-school mt-9">
                {admissions.requirements.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Reveal>
          </div>
          <div>
            <SectionHeading eyebrow="Kindergarten" title="Age criteria" />
            <Reveal delay={0.1}>
              <ul className="mt-9 space-y-px border border-line bg-line-soft">
                {academics[0].ages.map((line) => {
                  const [stage, age] = line.split(" — ");
                  return (
                    <li key={line} className="flex items-baseline justify-between gap-6 bg-surface px-5 py-4">
                      <span className="font-display text-[0.9375rem] font-bold text-ink">{stage}</span>
                      <span className="text-[0.8125rem] text-muted">{age ?? line}</span>
                    </li>
                  );
                })}
              </ul>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-6 text-[0.875rem] leading-relaxed text-muted">{academics[0].detail}</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="shell py-20 lg:py-24">
        <SectionHeading eyebrow="Senior secondary" title="Streams and fifth subjects" />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {academics[3].streams.map((stream, index) => (
            <Reveal key={stream} delay={index * 0.06} y={20}>
              <div className="h-full border border-line-strong bg-surface p-7">
                <span className="font-display text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-accent">
                  10 + 1 · 10 + 2
                </span>
                <h3 className="mt-3 text-[1.25rem]">{stream}</h3>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.12}>
          <p className="lead mt-10">{academics[3].detail}</p>
        </Reveal>
      </section>

      <section className="shell pb-20 lg:pb-24">
        <Reveal className="border border-line-strong bg-elevated p-9 text-ink lg:p-12">
          <h2 className="text-[1.5rem] text-ink">Questions before applying?</h2>
          <p className="mt-4 max-w-2xl text-[0.9375rem] leading-relaxed text-muted">
            Call {school.admissionPhones.join(", ")} or write to {school.email}. The admissions desk answers during school
            hours.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/contact" className="btn btn-primary">
              Contact the school
            </Link>
            <Link to="/achievements" className="btn btn-ghost border-line-strong text-ink hover:bg-surface hover:text-ink">
              See what students do
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
