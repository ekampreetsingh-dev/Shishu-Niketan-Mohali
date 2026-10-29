import PageHeader from "../components/PageHeader.jsx";
import Reveal from "../components/Reveal.jsx";
import { leavingCertificates } from "../data/school.js";
import { OFFICIAL_SITE } from "../config.js";
import { FileDown } from "lucide-react";

export default function LeavingCertificate() {
  return (
    <>
      <PageHeader
        eyebrow="Records"
        title="School Leaving Certificate"
        intro="Certificates issued by the school. New requests are handled at the office counter."
      />

      <section className="shell py-16 lg:py-20">
        <Reveal>
          <div className="min-w-0 overflow-x-auto rounded-[28px] border border-line">
            <table className="data-table min-w-[34rem]">
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>Student Name</th>
                  <th>Admission No.</th>
                  <th className="text-right">Download File</th>
                </tr>
              </thead>
              <tbody>
                {leavingCertificates.map((item) => (
                  <tr key={item.sno} className="transition-colors hover:bg-elevated">
                    <td className="font-display font-bold text-ink">{item.sno}</td>
                    <td className="font-semibold text-ink">{item.name}</td>
                    <td>{item.admissionNo}</td>
                    <td className="text-right">
                      <a
                        href={item.file}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-line-strong px-4 py-2 font-display text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-ink transition-colors hover:bg-elevated hover:text-ink"
                      >
                        <FileDown size={13} /> PDF
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-8 max-w-2xl border-l-2 border-accent bg-elevated p-5 text-[0.8125rem] leading-relaxed text-muted">
            Only the certificates the school has published are listed here. For any other record, contact the school
            office on {OFFICIAL_SITE.replace("https://", "")}.
          </p>
        </Reveal>
      </section>
    </>
  );
}
