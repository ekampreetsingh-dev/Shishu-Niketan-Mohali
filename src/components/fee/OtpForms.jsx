import { useState } from "react";
import { Loader2, ShieldCheck } from "lucide-react";

export function OtpRequest({ onSubmit, pending, error, notice }) {
  const [admissionNumber, setAdmissionNumber] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({ admissionNumber: admissionNumber.trim(), mobileNumber: mobileNumber.trim() });
      }}
      className="card-flat p-7 sm:p-9"
      noValidate
    >
      <p className="eyebrow">Step 1 of 2</p>
      <h2 className="mt-3 text-[1.5rem]">Identify the student</h2>
      <p className="mt-3 text-[0.875rem] leading-relaxed text-muted">
        Enter the admission number and the mobile number held on school records. The one-time password is sent there.
      </p>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="font-display text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-ink">
            Admission Number
          </span>
          <input
            className="field mt-2"
            name="admission_number"
            inputMode="numeric"
            autoComplete="off"
            placeholder="Enter Admission Number"
            value={admissionNumber}
            onChange={(event) => setAdmissionNumber(event.target.value)}
            required
          />
        </label>
        <label className="block">
          <span className="font-display text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-ink">
            Mobile Number
          </span>
          <input
            className="field mt-2"
            name="mobile_number"
            inputMode="tel"
            autoComplete="tel"
            placeholder="Enter Mobile Number"
            value={mobileNumber}
            onChange={(event) => setMobileNumber(event.target.value)}
            required
          />
        </label>
      </div>

      {(error || notice) && (
        <p role={error ? "alert" : undefined} className={`mt-5 text-[0.8125rem] ${error ? "text-danger" : "text-muted"}`}>
          {error ?? notice}
        </p>
      )}

      <button type="submit" disabled={pending} className="btn btn-primary mt-7 w-full sm:w-auto">
        {pending ? <Loader2 size={15} className="animate-spin" /> : <ShieldCheck size={15} />}
        {pending ? "Sending OTP…" : "Get OTP"}
      </button>
    </form>
  );
}

export function OtpVerify({ admissionNumber, onVerify, onBack, pending, error, notice }) {
  const [digits, setDigits] = useState(["", "", "", ""]);

  const setDigit = (index, value) => {
    const clean = value.replace(/\D/g, "").slice(-1);
    setDigits((current) => current.map((digit, i) => (i === index ? clean : digit)));
    if (clean && index < 3) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
  };

  const otp = digits.join("");

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onVerify(otp);
      }}
      className="card-flat p-7 sm:p-9"
    >
      <p className="eyebrow">Step 2 of 2</p>
      <h2 className="mt-3 text-[1.5rem]">Enter the OTP</h2>
      <p className="mt-3 text-[0.875rem] leading-relaxed text-muted">
        Check your mobile for the four-digit code sent against admission number{" "}
        <strong className="font-semibold text-ink">{admissionNumber}</strong>.
      </p>

      {notice && !error && (
        <p className="mt-5 border-l-2 border-line-strong bg-sunken p-3.5 text-[0.8125rem] leading-relaxed text-ink">
          {notice}
        </p>
      )}

      <div className="mt-7 flex gap-3" role="group" aria-label="One-time password">
        {digits.map((digit, index) => (
          <input
            key={index}
            id={`otp-${index}`}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={1}
            value={digit}
            onChange={(event) => setDigit(index, event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Backspace" && !digit && index > 0) document.getElementById(`otp-${index - 1}`)?.focus();
            }}
            aria-label={`Digit ${index + 1}`}
            className="h-14 w-14 border border-line-strong bg-surface text-center font-display text-xl font-bold text-ink transition-colors focus:border-accent focus:outline-none focus:ring-[3px] focus:ring-accent/20"
          />
        ))}
      </div>

      {error && (
        <p role="alert" className="mt-4 text-[0.8125rem] text-danger">
          {error}
        </p>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button type="submit" disabled={pending || otp.length < 4} className="btn btn-primary">
          {pending && <Loader2 size={15} className="animate-spin" />}
          Verify OTP
        </button>
        <button type="button" onClick={onBack} className="font-display text-[0.75rem] font-bold uppercase tracking-[0.12em] text-muted underline decoration-line-strong underline-offset-4 hover:text-accent">
          Change details
        </button>
      </div>
    </form>
  );
}
