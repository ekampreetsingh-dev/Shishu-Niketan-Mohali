# Shishu Niketan Public School — Sector 66, Mohali

A rebuild of the public site at <https://shishuniketanmohali.org.in/> as a React + Vite app.
Content, photographs and documents come from the school's own published pages.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production bundle in dist/
```

## Tabs

| Route | Page |
| --- | --- |
| `/` | Home — hero, orbit sphere, academics and campus previews, noticeboard, fee call-to-action |
| `/about` | About the school |
| `/managing-committee` | Managing Committee |
| `/salary-details` | Salary details |
| `/school-data-sheet` | School data sheet |
| `/academics` | Playway → Senior Secondary, one pill per stage with its own photographs |
| `/infrastructure` | The nine campus photographs, plus a facility picker |
| `/admissions` | Admission requirements and the 2026–27 fee structure |
| `/gallery` | All twelve albums, filterable, with a keyboard-accessible lightbox |
| `/achievements` | Achievement records and album photography |
| `/transfer-certificate` | School Leaving Certificates |
| `/books-list` | Prescribed books for 2026–27 |
| `/mandatory-public-disclosure` | Disclosure tables and the statutory PDFs |
| `/news` | Published news items |
| `/calendar` | Academic calendar |
| `/contact` | Contact details |
| `/pay-fees` | Fee payment portal |

Every internal link resolves to one of these routes. Nothing is a dead placeholder.

## Fee payment

`src/data/feeApi.js` mirrors the school's real Django endpoints, field names and all:

| Call | Endpoint |
| --- | --- |
| `feeApi.requestOtp` | `POST /pay-fees/` — `admission_number`, `mobile_number`, `csrfmiddlewaretoken` |
| `feeApi.verifyOtp` | `GET /verify-otp/?admissionNumber=&mobileNumber=&otp=` |
| `feeApi.verifyOtpForAdmin` | `GET /verify-otp-for-admin/?admissionNumber=&otp=` (the school-issued link flow) |
| `feeApi.feeDetails` | `GET /student-payment-details/?admission=` |
| `feeApi.receipts` | `GET /get-fee-receipts/?year=&studentId=` |
| `feeApi.paymentUrl` | `GET /generate-payment-url/?admission_no=&student_id=&amount=&yearlyAggregatedDetails=` |

Upstream key spellings are preserved at the boundary — `addmission_no`, `lastOustandingPaymentDetails`,
`recpNo` — and normalised into clean names for the React tree, so the same code path runs against
fixtures and the live API.

### Turning on the real backend

Right now there is no server, so the portal runs on two sample students and says so on screen.
Pick one:

```bash
# 1. Local backend, proxied by the dev server
FEE_API_TARGET=http://localhost:8000 npm run dev

# 2. A deployed backend — set at build time
VITE_FEE_API_BASE=https://shishuniketanmohali.org.in npm run build
```

Either switch flips `feeConfig.live` and no component changes. Until then **Proceed to Payment
refuses and explains itself** — it never fakes a successful transaction.

Check the maths and the flow:

```bash
node scripts/check-fee.mjs     # 18 assertions on dues, quarters, arrears, OTP, gateway guard
node scripts/fee-flow.mjs      # drives the whole portal in a real browser
```

## Assets

`public/images/` holds 171 photographs downloaded from the school's `/static/images/` tree, and
`public/pdfs/` holds the 14 published documents.

- `scripts/build-assets.mjs` regenerates `src/data/assets.js` from whatever is actually on disk,
  so no component can reference a missing file. Run it after adding or removing images.
- `scripts/upscale-images.py` resamples the school's smallest assets (`photo-*.jpg` and
  `achievement-*.jpg` ship at 250×130, `logo.jpg` at 82×82) with Lanczos plus unsharp. Originals
  stay in `public/images/_originals/`.
- `src/data/sections.js` is the single place that decides which photographs belong to which
  academic stage and which facility.

## Design

Dark, high-contrast layout after <https://www.ash.nl/> and two portfolio references: true black,
a grey ladder, one amber accent taken from the school crest, 100–150px arch radii on imagery,
pill controls throughout, and a back-out easing curve (`cubic-bezier(0.175, 0.885, 0.32, 1.15)`).

`prefers-reduced-motion` is honoured — but it swaps travel for a plain fade rather than hiding
content, so sections still arrive instead of reading as broken.

## Verifying

```bash
node scripts/verify.mjs home pay-fees infrastructure   # screenshots + overflow/broken-image/console audit
```

Passes a bare route name, not a `/path` — Git Bash rewrites those into Windows paths.

## Not included

The school's admin tools, fee-management backend, login, database and payment gateway are
server-side and were never reachable. This is a frontend rebuild of the public pages. Confirm
rights before republishing the school's branding, photographs or content.
