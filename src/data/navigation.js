export const navigation = [
  { label: "Home", to: "/" },
  {
    label: "About Us",
    to: "/about",
    children: [
      { label: "Managing Committee", to: "/managing-committee" },
      { label: "Salary Details", to: "/salary-details" },
      { label: "School Data Sheet", to: "/school-data-sheet" },
    ],
  },
  { label: "Academics", to: "/academics" },
  { label: "Infrastructure", to: "/infrastructure" },
  { label: "Admissions", to: "/admissions" },
  { label: "Gallery", to: "/gallery" },
  { label: "Achievements", to: "/achievements" },
  {
    label: "Records",
    to: "/transfer-certificate",
    // sits near the right end of the pill; centring it here drifts the
    // panel under FEE PAYMENT so it looks like that item's submenu
    align: "end",
    children: [
      { label: "School Leaving Certificate", to: "/transfer-certificate" },
      { label: "List of Books", to: "/books-list" },
      { label: "Mandatory Public Disclosure", to: "/mandatory-public-disclosure" },
    ],
  },
];

export const feePath = "/pay-fees";

export const footerLinks = [
  { label: "News", to: "/news" },
  { label: "Calendar", to: "/calendar" },
  { label: "Contact", to: "/contact" },
  { label: "Fee Payment", to: feePath },
];

// Flat list of every implemented internal route.
export const allRoutes = [
  ...navigation.flatMap((item) => (item.children ? item.children.map((c) => c.to) : [item.to])),
  feePath,
  ...footerLinks.map((link) => link.to),
];
