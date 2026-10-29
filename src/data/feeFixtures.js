// Fixture payloads that mirror the school backend responses field-for-field,
// including the upstream key spellings ("addmission_no", "lastOustandingPaymentDetails",
// "recpNo") so the same normaliser runs against fixtures and the live API.
//
// These are SAMPLE records for layout and flow testing. They are not real students.

const tuition = (o) => ({
  annual_fees: 1000,
  tuition_fees: 6585,
  funds_fees: 500,
  sports_fees: 500,
  activity_fees: 700,
  admission_fees: 0,
  dayboarding_fees: 0,
  bus_fees: null,
  concession_type: null,
  concession_applied: 0,
  late_fee: 0,
  miscellaneous_fees: 0,
  isOutstandingFee: false,
  ...o,
});

const totals = (q) => ({
  ...q,
  total_fee:
    q.annual_fees +
    q.tuition_fees +
    q.funds_fees +
    q.sports_fees +
    q.activity_fees +
    q.admission_fees +
    q.dayboarding_fees +
    (q.bus_fees || 0) +
    q.miscellaneous_fees +
    q.late_fee -
    (q.concession_applied || 0),
});

const students = {
  24118: {
    paymentDetails: {
      success: true,
      data: {
        applicable_quarter: "10,11,12",
        netFeeAmountPayable: 28455,
        studentDetails: [
          {
            student_id: 4812,
            addmission_no: "24118",
            student_name: "Aarav Sharma",
            father_name: "Rajesh Sharma",
            class_no: "VI",
            section: "B",
            year: "2026",
            session: "2026-2027",
            concession_id: null,
          },
        ],
        lastPaymentDetails: {
          fees_for_months: "1,2,3",
          date_payment: "08 Jan 2026",
          amount_paid: 9285,
          fees_period_month: "Quarter IV",
          student_class: "VI",
          student_section: "B",
          year: "2026",
          late_fee: 0,
          remarks: "Quarterly fee — paid online",
          prev_pending_amount: 0,
        },
        lastOustandingPaymentDetails: {
          fees_for_months: "4,5,6",
          total_fee: 9885,
          late_fee: 600,
        },
        currentPaymentDetails: [
          totals(tuition({ fees_for_months: "7,8,9", class_no: "VI", section: "B", year: "2026" })),
          totals(tuition({ fees_for_months: "10,11,12", class_no: "VI", section: "B", year: "2026" })),
        ],
        yearlyAggregatedDetails: [{ year: "2026", total_fee: 18570, quarters: ["7,8,9", "10,11,12"] }],
      },
    },
    receipts: {
      success: true,
      data: [
        { recpNo: "SNPS-2025-114882", paidForMonths: "10,11,12", feePaid: 9285, paidOn: "12 Dec 2025", receipt_url: "/images/school.jpg" },
        { recpNo: "SNPS-2025-091204", paidForMonths: "7,8,9", feePaid: 9285, paidOn: "09 Sep 2025", receipt_url: "/images/school.jpg" },
        { recpNo: "SNPS-2025-070419", paidForMonths: "4,5,6", feePaid: 9285, paidOn: "05 Jun 2025", receipt_url: "/images/school.jpg" },
      ],
    },
  },
  30462: {
    paymentDetails: {
      success: true,
      data: {
        applicable_quarter: "10,11,12",
        netFeeAmountPayable: 15510,
        studentDetails: [
          {
            student_id: 7719,
            addmission_no: "30462",
            student_name: "Ishita Verma",
            father_name: "Manpreet Verma",
            class_no: "XI",
            section: "A",
            year: "2026",
            session: "2026-2027",
            concession_id: null,
          },
        ],
        lastPaymentDetails: {
          fees_for_months: "7,8,9",
          date_payment: "14 Sep 2026",
          amount_paid: 15510,
          fees_period_month: "Quarter II",
          student_class: "XI",
          student_section: "A",
          year: "2026",
          late_fee: 0,
          remarks: "Quarterly fee with transport",
          prev_pending_amount: 0,
        },
        lastOustandingPaymentDetails: null,
        currentPaymentDetails: [
          totals(
            tuition({
              fees_for_months: "10,11,12",
              class_no: "XI",
              section: "A",
              year: "2026",
              tuition_fees: 8010,
              funds_fees: 600,
              activity_fees: 900,
              bus_fees: 4500,
            })
          ),
        ],
        yearlyAggregatedDetails: [{ year: "2026", total_fee: 15510, quarters: ["10,11,12"] }],
      },
    },
    receipts: {
      success: true,
      data: [
        { recpNo: "SNPS-2026-004118", paidForMonths: "7,8,9", feePaid: 15510, paidOn: "14 Sep 2026", receipt_url: "/images/school.jpg" },
      ],
    },
  },
};

const otps = {};

export const fixtureApi = {
  requestOtp: ({ admission_number, mobile_number }) => {
    const record = students[String(admission_number).trim()];
    if (!record) {
      return { success: false, message: "No student found for this admission number. Please contact the school office." };
    }
    const otp = String(1000 + (Number(admission_number) % 9000));
    otps[admission_number] = { otp, mobile_number };
    // The live endpoint returns the OTP in the JSON body; the school site relies on it.
    return { success: true, message: `OTP sent to ${mobile_number}`, data: { otp } };
  },

  verifyOtp: ({ admissionNumber, mobileNumber, otp }) => {
    const held = otps[String(admissionNumber).trim()];
    if (!held) return { success: false, message: "Please request an OTP first." };
    if (held.otp !== String(otp).trim() || held.mobile_number !== String(mobileNumber).trim()) {
      return { success: false, message: "Invalid OTP. Please try again." };
    }
    return { success: true, message: "OTP verified successfully." };
  },

  studentPaymentDetails: ({ admission }) => students[String(admission).trim()]?.paymentDetails ?? { success: false },

  feeReceipts: ({ studentId }) => {
    const record = Object.values(students).find((s) => s.paymentDetails.data.studentDetails[0].student_id === Number(studentId));
    return record?.receipts ?? { success: false, data: [] };
  },
};

export const fixtureSampleAdmissions = Object.keys(students).map((admission, i) => ({
  admission,
  mobile: ["9876500000", "9876500001"][i] ?? "9876500000",
  name: students[admission].paymentDetails.data.studentDetails[0].student_name,
}));
