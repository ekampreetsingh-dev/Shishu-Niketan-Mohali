import { feeConfig } from "../config.js";
import { fixtureApi } from "./feeFixtures.js";

// Endpoints as published by the school's Django backend (observed on
// https://shishuniketanmohali.org.in/pay-fees/):
//
//   POST /pay-fees/                    admission_number, mobile_number, csrfmiddlewaretoken
//   GET  /verify-otp/                  admissionNumber, mobileNumber, otp
//   GET  /verify-otp-for-admin/        admissionNumber, otp
//   GET  /student-payment-details/     admission
//   GET  /get-fee-receipts/            year, studentId
//   GET  /generate-payment-url/        admission_no, student_id, amount, yearlyAggregatedDetails

const QUARTER_ORDER = ["4,5,6", "7,8,9", "10,11,12", "1,2,3"];

const url = (path) => `${feeConfig.base}${path}`;

async function getCsrf() {
  const match = document.cookie.match(/(?:^|;\s*)csrftoken=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : "";
}

async function getJson(path, params) {
  const query = new URLSearchParams(params);
  const res = await fetch(`${url(path)}?${query}`, { credentials: "include", headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`${path} responded ${res.status}`);
  return res.json();
}

async function postForm(path, values) {
  const body = new FormData();
  Object.entries(values).forEach(([key, value]) => body.append(key, value));
  const csrf = await getCsrf();
  if (csrf) body.append("csrfmiddlewaretoken", csrf);
  const res = await fetch(url(path), {
    method: "POST",
    body,
    credentials: "include",
    headers: csrf ? { "X-CSRFToken": csrf } : undefined,
  });
  if (!res.ok) throw new Error(`${path} responded ${res.status}`);
  return res.json();
}

// Upstream uses inconsistent month strings ("4, 5, 6" vs "4,5,6").
export const normaliseQuarter = (months) => (months ? String(months).replace(/\s+/g, "") : "");

export const quarterRank = (months) => QUARTER_ORDER.indexOf(normaliseQuarter(months));

export function currentQuarterMonths(now = new Date()) {
  const month = now.getMonth() + 1;
  if (month >= 4 && month <= 6) return "4,5,6";
  if (month >= 7 && month <= 9) return "7,8,9";
  if (month >= 10 && month <= 12) return "10,11,12";
  return "1,2,3";
}

const money = (value) => (value == null || value === "" ? null : Number(value) || 0);

// Turns a raw backend payload into the shape the React tree consumes.
export function normaliseFeePayload(raw) {
  const student = raw.studentDetails?.[0];
  const outstanding = raw.lastOustandingPaymentDetails;

  const quarters = (raw.currentPaymentDetails ?? []).map((payment) => ({
    months: normaliseQuarter(payment.fees_for_months),
    monthsLabel: payment.fees_for_months,
    className: payment.class_no,
    section: payment.section,
    year: payment.year,
    lateFee: money(payment.late_fee),
    isOutstanding: Boolean(payment.isOutstandingFee),
    concession: {
      type: payment.concession_type || null,
      applied: money(payment.concession_applied),
    },
    components: [
      ["Annual Fees", money(payment.annual_fees)],
      ["Tuition Fees", money(payment.tuition_fees)],
      ["Funds Fees", money(payment.funds_fees)],
      ["Sports Fees", money(payment.sports_fees)],
      ["Activity Fees", money(payment.activity_fees)],
      ["Admission Fees", money(payment.admission_fees)],
      ["Dayboarding Fees", money(payment.dayboarding_fees)],
      ["Bus Fees", payment.bus_fees ? money(payment.bus_fees) : null],
      ["Miscellaneous Fees", money(payment.miscellaneous_fees)],
      ["Late Fees", money(payment.late_fee)],
      ...(money(payment.concession_applied) ? [["Concession Applied", -money(payment.concession_applied)]] : []),
    ],
    total: money(payment.total_fee),
  }));

  return {
    student: student
      ? {
          studentId: student.student_id,
          admissionNo: student.addmission_no,
          name: student.student_name,
          fatherName: student.father_name || "",
          className: student.class_no,
          section: student.section,
          year: student.year,
          session: student.session,
          concessionId: student.concession_id ?? null,
        }
      : null,
    lastPaid: raw.lastPaymentDetails?.amount_paid
      ? {
          months: raw.lastPaymentDetails.fees_for_months,
          date: raw.lastPaymentDetails.date_payment,
          amount: money(raw.lastPaymentDetails.amount_paid),
          period: raw.lastPaymentDetails.fees_period_month,
          className: `${raw.lastPaymentDetails.student_class} - ${raw.lastPaymentDetails.student_section}`,
          year: raw.lastPaymentDetails.year,
          lateFee: money(raw.lastPaymentDetails.late_fee),
          remarks: raw.lastPaymentDetails.remarks,
          pendingBefore: money(raw.lastPaymentDetails.prev_pending_amount),
        }
      : null,
    outstanding: outstanding?.total_fee
      ? {
          months: outstanding.fees_for_months,
          lateFee: money(outstanding.late_fee),
          total: money(outstanding.total_fee),
          base: Math.round(money(outstanding.total_fee) - money(outstanding.late_fee)),
        }
      : null,
    quarters,
    applicableQuarter: normaliseQuarter(raw.applicable_quarter) || currentQuarterMonths(),
    netPayable: money(raw.netFeeAmountPayable),
    yearlyAggregatedDetails: raw.yearlyAggregatedDetails ?? [],
    // Kept verbatim: the gateway is sent the backend's own field names.
    rawQuarters: raw.currentPaymentDetails ?? [],
    rawOutstanding: outstanding?.total_fee ? outstanding : null,
  };
}

// Quarters already invoiced for this session are settled now or in arrears — the
// school's own rule is current quarter plus anything unpaid from earlier periods.
export function defaultSelectedQuarters(quarters, applicableQuarter, now = new Date()) {
  const current = quarterRank(applicableQuarter || currentQuarterMonths(now));
  const calendarYear = now.getFullYear();
  return quarters.reduce((selected, quarter, index) => {
    const rank = quarterRank(quarter.months);
    const year = parseInt(quarter.year, 10);
    const isArrears = quarter.isOutstanding || (!Number.isNaN(year) && year < calendarYear);
    if (isArrears || (!Number.isNaN(rank) && rank <= current)) selected.push(index);
    return selected;
  }, []);
}

// Selecting a quarter implies every earlier one: dues are paid oldest-first.
export function expandSelection(quarters, index, checked) {
  const upto = quarters.map((_, i) => i);
  return checked ? upto.slice(0, index + 1) : upto.slice(0, index);
}

export const sumQuarters = (quarters, selectedIndexes, outstandingTotal = 0) =>
  Math.round(
    selectedIndexes.reduce((sum, i) => sum + (quarters[i]?.total ?? 0), outstandingTotal)
  );

export const feeApi = {
  mode: feeConfig.live ? "live" : "fixtures",

  async requestOtp({ admissionNumber, mobileNumber }) {
    if (!feeConfig.live) return fixtureApi.requestOtp({ admission_number: admissionNumber, mobile_number: mobileNumber });
    return postForm("/pay-fees/", { admission_number: admissionNumber, mobile_number: mobileNumber });
  },

  async verifyOtp({ admissionNumber, mobileNumber, otp }) {
    if (!feeConfig.live) return fixtureApi.verifyOtp({ admissionNumber, mobileNumber, otp });
    return getJson("/verify-otp/", { admissionNumber, mobileNumber, otp });
  },

  // School-issued link flow: /pay-fees?admissionNumber=..&otp=..
  async verifyOtpForAdmin({ admissionNumber, otp }) {
    if (!feeConfig.live) return fixtureApi.verifyOtp({ admissionNumber, mobileNumber: "", otp });
    return getJson("/verify-otp-for-admin/", { admissionNumber, otp });
  },

  async feeDetails(admissionNumber) {
    const raw = feeConfig.live
      ? await getJson("/student-payment-details/", { admission: admissionNumber })
      : fixtureApi.studentPaymentDetails({ admission: admissionNumber });
    if (!raw?.success || !raw.data) return { ok: false, message: raw?.message || "Unable to load fee details. Please try again or contact the school." };
    return { ok: true, ...normaliseFeePayload(raw.data) };
  },

  async receipts(studentId) {
    const raw = feeConfig.live
      ? await getJson("/get-fee-receipts/", { year: "all", studentId })
      : fixtureApi.feeReceipts({ studentId });
    if (!raw?.success) return { ok: false, message: raw?.message || "No receipts available." };
    return {
      ok: true,
      rows: (raw.data ?? []).map((item) => ({
        receiptNo: item.recpNo,
        months: item.paidForMonths,
        amount: money(item.feePaid),
        paidOn: item.paidOn,
        downloadUrl: item.receipt_url,
      })),
    };
  },

  // Returns the gateway URL the backend builds for the selected dues.
  // The backend's `yearlyAggregatedDetails` parameter actually carries the
  // selected raw quarter records, with any outstanding record first.
  async paymentUrl(details, selectedIndexes) {
    const payload = selectedIndexes.map((i) => details.rawQuarters[i]).filter(Boolean);
    if (details.rawOutstanding) payload.unshift(details.rawOutstanding);

    if (!feeConfig.live) {
      throw new Error("Payment gateway is not connected — this build has no school backend configured.");
    }
    const raw = await getJson("/generate-payment-url/", {
      admission_no: details.student.admissionNo,
      student_id: details.student.studentId,
      amount: sumQuarters(details.quarters, selectedIndexes, details.outstanding?.total ?? 0),
      yearlyAggregatedDetails: JSON.stringify(payload),
    });
    if (!raw?.success || !raw.url) throw new Error(raw?.message || "Payment URL not found.");
    return raw.url;
  },
};
