import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AlertTriangle, Check, ChevronDown, Loader2, Lock, Receipt, Wallet } from "lucide-react";
import { rupees, quarterLabel } from "../../utils/format.js";

function StudentCard({ student }) {
  return (
    <div className="border border-line-strong bg-elevated p-7 text-ink">
      <p className="eyebrow text-accent">Student</p>
      <h2 className="mt-2.5 text-[1.625rem] text-ink">{student.name}</h2>
      <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 text-[0.8125rem] sm:grid-cols-4">
        {[
          ["Admission No.", student.admissionNo],
          ["Class", `${student.className} – ${student.section}`],
          ["Father's Name", student.fatherName || "—"],
          ["Session", student.session],
        ].map(([label, value]) => (
          <div key={label}>
            <dt className="text-[0.625rem] uppercase tracking-[0.14em] text-muted">{label}</dt>
            <dd className="mt-1.5 font-display font-bold text-ink">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function Panel({ title, tone = "default", rows, children }) {
  const tones = {
    default: "border-line bg-surface",
    alert: "border-danger/30 bg-danger-deep",
    calm: "border-line bg-elevated",
  };
  return (
    <section className={`border ${tones[tone]} p-6`}>
      <h3
        className={`font-display text-[0.6875rem] font-bold uppercase tracking-[0.16em] ${
          tone === "alert" ? "text-danger" : "text-ink"
        }`}
      >
        {title}
      </h3>
      {rows && (
        <dl className="mt-5 space-y-2.5">
          {rows.map(([label, value]) => (
            <div key={label} className="flex items-baseline justify-between gap-6 border-b border-dashed border-line pb-2.5 last:border-0">
              <dt className="text-[0.8125rem] text-muted">{label}</dt>
              <dd className="font-display text-[0.875rem] font-bold text-ink">{value}</dd>
            </div>
          ))}
        </dl>
      )}
      {children}
    </section>
  );
}

function QuarterCard({ quarter, checked, onToggle, index, expanded, onExpand }) {
  return (
    <div className={`border transition-colors ${checked ? "border-line-strong bg-surface" : "border-line bg-elevated"}`}>
      <div className="flex items-center gap-4 p-5">
        <label className="flex flex-1 cursor-pointer items-center gap-3.5">
          <span className="relative flex h-5 w-5 shrink-0 items-center justify-center">
            <input
              type="checkbox"
              checked={checked}
              onChange={() => onToggle(index, !checked)}
              className="peer h-5 w-5 appearance-none border border-line-strong bg-surface transition-colors checked:border-ink checked:bg-elevated"
              aria-label={`Pay dues for ${quarterLabel(quarter.months)} ${quarter.year}`}
            />
            <Check
              size={13}
              className="pointer-events-none absolute text-ink opacity-0 transition-opacity peer-checked:opacity-100"
            />
          </span>
          <span>
            <strong className="block font-display text-[0.9375rem] font-bold text-ink">
              {quarterLabel(quarter.months)} {quarter.year}
            </strong>
            <small className="mt-0.5 block text-[0.75rem] text-muted">
              Class {quarter.className} – {quarter.section} · months {quarter.monthsLabel ?? quarter.months}
              {quarter.isOutstanding && " · arrears"}
            </small>
          </span>
        </label>
        <span className="font-display text-[1.0625rem] font-extrabold text-ink">{rupees(quarter.total)}</span>
        <button
          type="button"
          onClick={onExpand}
          aria-expanded={expanded}
          aria-label={`Show fee components for ${quarterLabel(quarter.months)}`}
          className="p-2 text-muted transition-colors hover:text-ink"
        >
          <ChevronDown size={17} className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
        </button>
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.22, 0.61, 0.36, 1] }}
            className="overflow-hidden border-t border-line"
          >
            <ul className="grid gap-x-8 gap-y-2 p-5 sm:grid-cols-2">
              {quarter.components.map(([label, value]) => (
                <li key={label} className="flex items-baseline justify-between gap-4 border-b border-dashed border-line pb-1.5">
                  <span className="text-[0.8125rem] text-muted">{label}</span>
                  <span className={`font-display text-[0.8125rem] font-bold ${value < 0 ? "text-ok" : "text-ink"}`}>
                    {value < 0 ? `– ${rupees(Math.abs(value))}` : rupees(value)}
                  </span>
                </li>
              ))}
            </ul>
            {quarter.concession.type && (
              <p className="border-t border-line px-5 py-3 text-[0.75rem] text-muted">
                Concession: {quarter.concession.type}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FeeBreakdown({ details, selected, onToggleQuarter, total, onProceed, onShowReceipts, proceeding, gatewayError }) {
  const [expanded, setExpanded] = useState(null);
  const { student, lastPaid, outstanding, quarters } = details;

  return (
    <div className="space-y-5">
      <StudentCard student={student} />

      <div className="grid gap-5 md:grid-cols-2">
        <Panel
          title="Last fee paid"
          tone="calm"
          rows={
            lastPaid
              ? [
                  ["Fees for months", lastPaid.months],
                  ["Date of payment", lastPaid.date],
                  ["Amount paid", rupees(lastPaid.amount)],
                  ["Period", lastPaid.period],
                  ["Class", `${lastPaid.className} · ${lastPaid.year}`],
                  ["Late fee", rupees(lastPaid.lateFee)],
                  ["Pending before this payment", rupees(lastPaid.pendingBefore)],
                  ["Remarks", lastPaid.remarks || "—"],
                ]
              : null
          }
        >
          {!lastPaid && <p className="mt-4 text-[0.8125rem] text-muted">No previous fee details available.</p>}
        </Panel>

        {outstanding ? (
          <Panel
            title="Outstanding fee due"
            tone="alert"
            rows={[
              ["Fees for months", outstanding.months],
              ["Outstanding amount", rupees(outstanding.base)],
              ["Late fee applied", rupees(outstanding.lateFee)],
            ]}
          >
            <div className="mt-5 flex items-center justify-between border-t border-danger/25 pt-4">
              <span className="flex items-center gap-2 font-display text-[0.75rem] font-bold uppercase tracking-[0.12em] text-danger">
                <AlertTriangle size={14} /> Total due
              </span>
              <span className="font-display text-[1.25rem] font-extrabold text-danger">{rupees(outstanding.total)}</span>
            </div>
          </Panel>
        ) : (
          <Panel title="Outstanding fee due" tone="calm">
            <p className="mt-4 flex items-center gap-2 text-[0.8125rem] text-ok">
              <Check size={15} /> No arrears on this account.
            </p>
          </Panel>
        )}
      </div>

      <section>
        <h3 className="font-display text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-ink">
          Current fees due
        </h3>
        <p className="mt-2 text-[0.8125rem] text-muted">
          Selecting a quarter settles every earlier one with it — dues are cleared oldest first.
        </p>
        <div className="mt-5 space-y-3">
          {quarters.map((quarter, index) => (
            <QuarterCard
              key={`${quarter.months}-${quarter.year}`}
              quarter={quarter}
              index={index}
              checked={selected.includes(index)}
              onToggle={onToggleQuarter}
              expanded={expanded === index}
              onExpand={() => setExpanded((v) => (v === index ? null : index))}
            />
          ))}
          {quarters.length === 0 && (
            <p className="border border-line bg-elevated p-6 text-[0.875rem] text-muted">
              No current fee demand is open for this student.
            </p>
          )}
        </div>
      </section>

      <section className="border border-line-strong bg-elevated p-7 text-ink">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span className="flex items-center gap-3">
            <Wallet size={19} className="text-accent" />
            <span className="font-display text-[0.75rem] font-bold uppercase tracking-[0.16em] text-muted">
              Total payable{outstanding ? " including arrears" : ""}
            </span>
          </span>
          <motion.span
            key={total}
            initial={{ opacity: 0.4, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22 }}
            className="font-display text-[1.75rem] font-extrabold text-ink"
          >
            {rupees(total)}
          </motion.span>
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onProceed}
            disabled={proceeding || total <= 0}
            className="btn btn-primary disabled:opacity-40"
          >
            {proceeding ? <Loader2 size={15} className="animate-spin" /> : <Lock size={15} />}
            {proceeding ? "Fetching payment URL…" : "Proceed to Payment"}
          </button>
          <button type="button" onClick={onShowReceipts} className="btn btn-ghost border-line-strong text-ink hover:bg-surface hover:text-ink">
            <Receipt size={15} /> View Fee Receipts
          </button>
        </div>

        {gatewayError && (
          <p role="alert" className="mt-5 border-l-2 border-accent bg-ink/10 p-4 text-[0.8125rem] leading-relaxed text-muted">
            {gatewayError}
          </p>
        )}
        {!proceeding && total <= 0 && (
          <p className="mt-5 text-[0.8125rem] text-muted">Select at least one quarter to raise a payment.</p>
        )}
      </section>
    </div>
  );
}
