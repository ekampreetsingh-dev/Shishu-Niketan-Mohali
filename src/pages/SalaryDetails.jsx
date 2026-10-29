import PageHeader from "../components/PageHeader.jsx";
import Reveal from "../components/Reveal.jsx";
import { salaryDetails } from "../data/school.js";

export default function SalaryDetails() {
  return (
    <>
      <PageHeader eyebrow="Public Disclosure" title="Salary Details" intro="Pay scale and allowances for teaching and support positions." />

      <section className="shell py-16 lg:py-20">
        <Reveal>
          <div className="min-w-0 overflow-x-auto rounded-[28px] border border-line">
            <table className="data-table min-w-[42rem]">
              <thead>
                <tr>
                  <th>Designation</th>
                  <th>Scale</th>
                  <th>Grade Pay</th>
                  <th>% of DA</th>
                  <th>HRA</th>
                  <th>EPF Contribution</th>
                </tr>
              </thead>
              <tbody>
                {salaryDetails.map((row) => (
                  <tr key={row.designation} className="transition-colors hover:bg-elevated">
                    <td className="font-semibold text-ink">{row.designation}</td>
                    <td>{row.scale}</td>
                    <td>{row.gradePay}</td>
                    <td>{row.da}</td>
                    <td>{row.hra}</td>
                    <td>{row.epf}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </section>
    </>
  );
}
