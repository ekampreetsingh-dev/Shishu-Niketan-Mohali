import PageHeader from "../components/PageHeader.jsx";
import Reveal from "../components/Reveal.jsx";
import { managingCommittee, school } from "../data/school.js";
import { disclosures } from "../data/school.js";
import { FileText } from "lucide-react";

export default function ManagingCommittee() {
  const roster = disclosures.find((item) => item.title.includes("Management Committee"));

  return (
    <>
      <PageHeader
        eyebrow="Governance"
        title="Managing Committee"
        intro={`The members of the Managing Committee of ${school.fullName}.`}
      />

      <section className="shell py-16 lg:py-20">
        <Reveal>
          <div className="min-w-0 overflow-x-auto rounded-[28px] border border-line">
            <table className="data-table min-w-[46rem]">
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>Name</th>
                  <th>Address</th>
                  <th>Occupation</th>
                  <th>Qualification</th>
                </tr>
              </thead>
              <tbody>
                {managingCommittee.map((member) => (
                  <tr key={member.sno} className="transition-colors hover:bg-elevated">
                    <td className="font-display font-bold text-ink">{member.sno}</td>
                    <td className="font-semibold text-ink">{member.name}</td>
                    <td>{member.address || "—"}</td>
                    <td>{member.occupation || "—"}</td>
                    <td>{member.qualification || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="mt-8">
          <a
            href={roster?.file}
            className="inline-flex items-center gap-2.5 rounded-full border border-line-strong px-5 py-3 font-display text-[0.75rem] font-bold uppercase tracking-[0.12em] text-ink transition-colors hover:bg-elevated hover:text-ink"
          >
            <FileText size={15} /> List of members (PDF)
          </a>
        </Reveal>
      </section>
    </>
  );
}
