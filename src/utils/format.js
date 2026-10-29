const inr = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

export const rupees = (value) =>
  value == null || Number.isNaN(Number(value)) ? "—" : `₹ ${inr.format(Math.round(Number(value)))}`;

export const plainAmount = (value) => (value == null ? "—" : inr.format(Math.round(Number(value))));

// Month lists arrive as "4,5,6" — show them as the quarter the school bills.
const QUARTER_LABELS = {
  "4,5,6": "Apr – Jun",
  "7,8,9": "Jul – Sep",
  "10,11,12": "Oct – Dec",
  "1,2,3": "Jan – Mar",
};

export const quarterLabel = (months) => QUARTER_LABELS[months] ?? (months ? `Months ${months}` : "—");
