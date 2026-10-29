// Checks the fee maths against the published fixtures.
//   node scripts/check-fee.mjs

import {
  normaliseFeePayload,
  defaultSelectedQuarters,
  expandSelection,
  sumQuarters,
  feeApi,
} from "../src/data/feeApi.js";
import { fixtureApi } from "../src/data/feeFixtures.js";

let failures = 0;
const check = (label, actual, expected) => {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) failures += 1;
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}: ${JSON.stringify(actual)}${ok ? "" : ` (expected ${JSON.stringify(expected)})`}`);
};

console.log(`adapter mode: ${feeApi.mode}\n`);

const withArrears = normaliseFeePayload(fixtureApi.studentPaymentDetails({ admission: 24118 }).data);

check("student name", withArrears.student.name, "Aarav Sharma");
check("class", `${withArrears.student.className}-${withArrears.student.section}`, "VI-B");
check("quarter totals", withArrears.quarters.map((q) => q.total), [9285, 9285]);
check("arrears total", withArrears.outstanding.total, 9885);
check("arrears splits into base + late", withArrears.outstanding.base + withArrears.outstanding.lateFee, 9885);

const selected = defaultSelectedQuarters(withArrears.quarters, withArrears.applicableQuarter);
check("auto-selected quarters", selected, [0, 1]);
check(
  "auto total equals the server's netFeeAmountPayable",
  sumQuarters(withArrears.quarters, selected, withArrears.outstanding.total),
  withArrears.netPayable
);

check("deselecting the newest keeps the older", expandSelection(withArrears.quarters, 1, false), [0]);
check("selecting the newest pulls in all earlier", expandSelection(withArrears.quarters, 1, true), [0, 1]);
check(
  "one quarter + arrears",
  sumQuarters(withArrears.quarters, [0], withArrears.outstanding.total),
  19170
);

const clean = normaliseFeePayload(fixtureApi.studentPaymentDetails({ admission: 30462 }).data);
check("no arrears reported", clean.outstanding, null);
check(
  "transport-inclusive total",
  sumQuarters(clean.quarters, defaultSelectedQuarters(clean.quarters, clean.applicableQuarter), 0),
  clean.netPayable
);
check("bus fee is carried through", clean.quarters[0].components.find(([l]) => l === "Bus Fees")[1], 4500);

const otp = fixtureApi.requestOtp({ admission_number: "24118", mobile_number: "9876500000" });
check("otp is 4 digits", /^\d{4}$/.test(otp.data.otp), true);
check("wrong otp rejected", fixtureApi.verifyOtp({ admissionNumber: "24118", mobileNumber: "9876500000", otp: "0000" }).success, false);
check("right otp accepted", fixtureApi.verifyOtp({ admissionNumber: "24118", mobileNumber: "9876500000", otp: otp.data.otp }).success, true);
check("unknown admission fails closed", fixtureApi.requestOtp({ admission_number: "999999", mobile_number: "9876500000" }).success, false);

const gatewayGuard = await feeApi.paymentUrl(withArrears, [0]).then(() => "RESOLVED", (e) => e.message);
check("gateway refuses without a server", typeof gatewayGuard === "string" && /not connected/.test(gatewayGuard), true);

console.log(`\n${failures === 0 ? "All fee checks passed." : `${failures} check(s) failed.`}`);
process.exit(failures === 0 ? 0 : 1);
