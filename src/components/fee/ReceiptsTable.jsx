import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Download, Loader2, X } from "lucide-react";
import { feeApi } from "../../data/feeApi.js";
import { rupees } from "../../utils/format.js";

export default function ReceiptsTable({ studentId, open, onClose }) {
  const [state, setState] = useState({ status: "idle", rows: [], message: "" });

  useEffect(() => {
    if (!open || !studentId) return;
    let cancelled = false;
    setState({ status: "loading", rows: [], message: "" });
    feeApi
      .receipts(studentId)
      .then((result) => {
        if (cancelled) return;
        setState(
          result.ok
            ? { status: "ready", rows: result.rows, message: "" }
            : { status: "error", rows: [], message: result.message }
        );
      })
      .catch((error) => !cancelled && setState({ status: "error", rows: [], message: error.message }));
    return () => {
      cancelled = true;
    };
  }, [open, studentId]);

  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.section
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 0.61, 0.36, 1] }}
          className="overflow-hidden border border-line-strong bg-surface"
          aria-label="Fee receipts"
        >
          <div className="flex items-center justify-between gap-4 border-b border-line px-6 py-4">
            <h3 className="font-display text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-ink">
              Fee receipts
            </h3>
            <button type="button" onClick={onClose} className="inline-flex items-center gap-1.5 text-[0.75rem] font-bold uppercase tracking-[0.1em] text-muted hover:text-ink">
              Hide <X size={14} />
            </button>
          </div>

          {state.status === "loading" && (
            <p className="flex items-center gap-2.5 px-6 py-8 text-[0.875rem] text-muted">
              <Loader2 size={15} className="animate-spin" /> Loading receipts…
            </p>
          )}

          {state.status === "error" && (
            <p role="alert" className="px-6 py-8 text-[0.875rem] text-danger">
              {state.message}
            </p>
          )}

          {state.status === "ready" && state.rows.length === 0 && (
            <p className="px-6 py-8 text-[0.875rem] text-muted">No receipts recorded for this student yet.</p>
          )}

          {state.status === "ready" && state.rows.length > 0 && (
            <div className="min-w-0 overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Receipt No</th>
                    <th>Paid for Month</th>
                    <th>Fee Paid</th>
                    <th>Paid On</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {state.rows.map((row) => (
                    <tr key={row.receiptNo}>
                      <td className="whitespace-nowrap font-semibold text-ink">{row.receiptNo}</td>
                      <td>{row.months}</td>
                      <td className="whitespace-nowrap">{rupees(row.amount)}</td>
                      <td className="whitespace-nowrap">{row.paidOn}</td>
                      <td className="text-right">
                        <a
                          href={row.downloadUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-full border border-line-strong px-3.5 py-1.5 font-display text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-ink transition-colors hover:bg-elevated hover:text-ink"
                        >
                          <Download size={12} /> Receipt
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.section>
      )}
    </AnimatePresence>
  );
}
