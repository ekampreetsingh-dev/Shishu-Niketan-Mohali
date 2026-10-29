import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "motion/react";
import { CircleDot, Info, Loader2, TriangleAlert } from "lucide-react";
import PageHeader from "../components/PageHeader.jsx";
import Reveal from "../components/Reveal.jsx";
import { OtpRequest, OtpVerify } from "../components/fee/OtpForms.jsx";
import FeeBreakdown from "../components/fee/FeeBreakdown.jsx";
import ReceiptsTable from "../components/fee/ReceiptsTable.jsx";
import { feeApi, defaultSelectedQuarters, expandSelection, sumQuarters } from "../data/feeApi.js";
import { fixtureSampleAdmissions } from "../data/feeFixtures.js";
import { OFFICIAL_SITE } from "../config.js";
import { school, admissions } from "../data/school.js";
import { images } from "../data/assets.js";

const isMobile = (value) => /^[6-9]\d{9}$/.test(String(value).replace(/\D/g, ""));

export default function FeePayment() {
  const [stage, setStage] = useState("identify");
  const [credentials, setCredentials] = useState({ admissionNumber: "", mobileNumber: "" });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [details, setDetails] = useState(null);
  const [selected, setSelected] = useState([]);
  const [receiptsOpen, setReceiptsOpen] = useState(false);
  const [proceeding, setProceeding] = useState(false);
  const [gatewayError, setGatewayError] = useState("");
  const resultsRef = useRef(null);
  const [searchParams] = useSearchParams();

  const fixtures = feeApi.mode === "fixtures";

  const loadDetails = useCallback(async (admissionNumber) => {
    setPending(true);
    setError("");
    try {
      const result = await feeApi.feeDetails(admissionNumber);
      if (!result.ok) {
        setError(result.message);
        return false;
      }
      setDetails(result);
      setSelected(defaultSelectedQuarters(result.quarters, result.applicableQuarter));
      setStage("details");
      return true;
    } catch {
      setError("Could not reach the fee service. Please check your connection and try again.");
      return false;
    } finally {
      setPending(false);
    }
  }, []);

  // School-issued link: /pay-fees?admissionNumber=…&otp=…
  useEffect(() => {
    const admissionNumber = searchParams.get("admissionNumber");
    const otp = searchParams.get("otp");
    if (!admissionNumber || !otp) return;
    feeApi
      .verifyOtpForAdmin({ admissionNumber, otp })
      .then(async (response) => {
        if (response?.success) {
          setCredentials({ admissionNumber, mobileNumber: "" });
          setNotice("Identity confirmed through the school-issued link.");
          await loadDetails(admissionNumber);
        } else {
          setError(response?.message ?? "The link is no longer valid. Please request a new OTP.");
        }
      })
      .catch(() => setError("Could not verify the link. Please start again below."));
  }, [searchParams, loadDetails]);

  const requestOtp = async ({ admissionNumber, mobileNumber }) => {
    if (!admissionNumber || !mobileNumber) {
      setError("Enter both the admission number and the mobile number.");
      return;
    }
    if (!isMobile(mobileNumber)) {
      setError("Enter a valid 10-digit Indian mobile number.");
      return;
    }
    setPending(true);
    setError("");
    setNotice("");
    try {
      const response = await feeApi.requestOtp({ admissionNumber, mobileNumber });
      if (!response?.success) {
        setError(response?.message ?? "We could not send an OTP. Please try again.");
        return;
      }
      setCredentials({ admissionNumber, mobileNumber });
      setStage("verify");
      setNotice(
        fixtures
          ? `Demo data — no SMS is sent. Enter the code ${response.data?.otp ?? "————"}.`
          : `OTP sent to ${mobileNumber}.`
      );
    } catch {
      setError("We could not reach the fee service. Please try again in a moment.");
    } finally {
      setPending(false);
    }
  };

  const verify = async (otp) => {
    setPending(true);
    setError("");
    try {
      const response = await feeApi.verifyOtp({ ...credentials, otp });
      if (!response?.success) {
        setError(response?.message ?? "Invalid OTP. Please try again.");
        return;
      }
      await loadDetails(credentials.admissionNumber);
      requestAnimationFrame(() => resultsRef.current?.scrollIntoView({ block: "start" }));
    } catch {
      setError("We could not verify the OTP. Please request a new one.");
    } finally {
      setPending(false);
    }
  };

  const toggleQuarter = (index, checked) => {
    setSelected((current) => (checked ? expandSelection(details.quarters, index, true) : shrink(current, index)));
    setGatewayError("");
  };

  const shrink = (current, index) => current.filter((i) => i < index);

  const total = details ? sumQuarters(details.quarters, selected, details.outstanding?.total ?? 0) : 0;

  const proceed = async () => {
    setProceeding(true);
    setGatewayError("");
    try {
      const url = await feeApi.paymentUrl(details, selected);
      window.location.href = url;
    } catch (err) {
      setGatewayError(err.message);
    } finally {
      setProceeding(false);
    }
  };

  const startOver = () => {
    setStage("identify");
    setDetails(null);
    setSelected([]);
    setReceiptsOpen(false);
    setError("");
    setNotice("");
    setGatewayError("");
    setCredentials({ admissionNumber: "", mobileNumber: "" });
  };

  return (
    <>
      <PageHeader
        eyebrow="Parents & Guardians"
        title="Fee Payment"
        intro="Verify your identity with a one-time password, review the quarters due against your account, and pay online. Receipts remain downloadable from the same screen."
        image={images.model1}
        action={
          <a href={`tel:${school.phones[0]}`} className="btn btn-ghost">
            Call the fee counter · {admissions.depositTimings}
          </a>
        }
      />

      {fixtures && (
        <div className="border-b border-accent/30 bg-accent/10">
          <div className="shell flex flex-wrap items-center gap-x-3 gap-y-2 py-3 text-[0.8125rem] text-ink">
            <Info size={15} className="shrink-0 text-accent-deep" />
            <span>
              <strong className="font-semibold">Offline preview.</strong> This build has no school backend connected, so
              the flow runs on sample records and no payment can be taken.
            </span>
            <span className="flex flex-wrap gap-x-4 gap-y-1 text-[0.75rem] text-ink">
              {fixtureSampleAdmissions.map((sample) => (
                <span key={sample.admission} className="inline-flex items-center gap-1.5">
                  <CircleDot size={11} className="text-accent-deep" />
                  {sample.name} — admission {sample.admission}, mobile {sample.mobile}
                </span>
              ))}
            </span>
          </div>
        </div>
      )}

      <section ref={resultsRef} className="shell py-14 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.32fr] lg:items-start">
          <div className="space-y-5">
            <motion.ol className="flex flex-wrap items-center gap-x-4 gap-y-2 font-display text-[0.6875rem] font-bold uppercase tracking-[0.14em]">
              {[
                ["identify", "Identify"],
                ["verify", "Verify OTP"],
                ["details", "Review & pay"],
              ].map(([key, label], index) => {
                const order = ["identify", "verify", "details"];
                const active = order.indexOf(stage) >= index;
                return (
                  <li key={key} className="flex items-center gap-3">
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full border text-[0.6875rem] ${
                        active ? "border-ink bg-elevated text-ink" : "border-line-strong text-muted"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span className={active ? "text-ink" : "text-muted"}>{label}</span>
                    {index < 2 && <span className="hidden h-px w-8 bg-line sm:block" />}
                  </li>
                );
              })}
            </motion.ol>

            {stage === "identify" && (
              <OtpRequest onSubmit={requestOtp} pending={pending} error={error} notice={notice} />
            )}

            {stage === "verify" && (
              <OtpVerify
                admissionNumber={credentials.admissionNumber}
                onVerify={verify}
                onBack={() => {
                  setStage("identify");
                  setError("");
                }}
                pending={pending}
                error={error}
                notice={notice}
              />
            )}

            {stage === "details" && details && (
              <>
                <FeeBreakdown
                  details={details}
                  selected={selected}
                  onToggleQuarter={toggleQuarter}
                  total={total}
                  onProceed={proceed}
                  onShowReceipts={() => setReceiptsOpen((v) => !v)}
                  proceeding={proceeding}
                  gatewayError={gatewayError}
                />
                <ReceiptsTable studentId={details.student.studentId} open={receiptsOpen} onClose={() => setReceiptsOpen(false)} />
              </>
            )}

            {stage !== "identify" && (
              <button
                type="button"
                onClick={startOver}
                className="font-display text-[0.75rem] font-bold uppercase tracking-[0.12em] text-muted underline decoration-line-strong underline-offset-4 hover:text-ink"
              >
                Start again
              </button>
            )}
          </div>

          <Reveal delay={0.1} y={22}>
            <aside className="space-y-6 lg:sticky lg:top-32">
              <div className="border border-line bg-elevated p-6">
                <h2 className="font-display text-[0.9375rem] font-bold text-ink">How the portal works</h2>
                <ol className="mt-4 space-y-3 text-[0.8125rem] leading-relaxed text-muted">
                  <li>1. Enter the admission number and the mobile number on school records.</li>
                  <li>2. Enter the four-digit OTP sent to that number.</li>
                  <li>3. Review the quarters due — arrears are always included.</li>
                  <li>4. Proceed to payment on the school's gateway.</li>
                </ol>
              </div>

              <div className="border border-line p-6">
                <h2 className="font-display text-[0.9375rem] font-bold text-ink">Fee structure {admissions.feeStructure.session}</h2>
                <ul className="mt-4 space-y-2 text-[0.8125rem]">
                  {admissions.feeStructure.monthly.map((row) => (
                    <li key={row.label} className="flex items-baseline justify-between gap-3 border-b border-dashed border-line pb-2">
                      <span className="text-muted">{row.label}</span>
                      <span className="whitespace-nowrap font-display font-bold text-ink">
                        ₹ {row.amount} / month
                      </span>
                    </li>
                  ))}
                </ul>
                <a
                  href={OFFICIAL_SITE}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 block font-display text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-muted hover:text-accent"
                >
                  Full notice on the official site
                </a>
              </div>

              <div className="border border-line p-6">
                <h2 className="flex items-center gap-2 font-display text-[0.9375rem] font-bold text-ink">
                  <TriangleAlert size={15} className="text-accent" /> Trouble paying?
                </h2>
                <p className="mt-3 text-[0.8125rem] leading-relaxed text-muted">
                  Fee deposit is open {admissions.depositTimings} at the school counter. Call {school.phones.join(" / ")} if the
                  mobile number on your record has changed.
                </p>
                {pending && stage === "details" && (
                  <p className="mt-4 flex items-center gap-2 text-[0.75rem] text-muted">
                    <Loader2 size={13} className="animate-spin" /> Working…
                  </p>
                )}
              </div>
            </aside>
          </Reveal>
        </div>
      </section>
    </>
  );
}
