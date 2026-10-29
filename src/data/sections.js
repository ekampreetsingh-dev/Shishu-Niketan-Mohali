import { images } from "./assets.js";

// Every path below was checked against the photograph itself, not the album
// name it happened to live in. Several albums are misnamed upstream — the
// school's "TaekwondoAchievers" folder holds a student's portrait, and
// "SchoolFacilities" is mostly a karate class and two musicians — so the
// album folders are not used as a source of truth anywhere in this file.
//
// A facility with no genuine photograph gets `images: []` and renders as a
// labelled tile. Inventing a plausible-looking substitute is worse than an
// empty slot.

const p = (...parts) => `/images/${parts.join("/")}`;

const INFRA = (n) => p("infra_pics", `infrasture${n}.jpg`);
const gallery = (folder, file) => p("Gallery", folder, file);
const achievement = (folder) => p("Achievements", folder, "img1.jpg");

export const heroImages = [
  images.school, // 750x498 — the school facade, "Come to learn Go to serve"
  gallery("KidsWorld", "img010.jpg"), // infants seated on the lawn with their bags
  gallery("SchoolActivities", "img011.jpg"), // children holding tricolour flags
];

export const academicsContent = [
  {
    stage: "Playway & Nursery",
    short: "Playway",
    eyebrow: "Montessori method",
    detail:
      "The philosophy of the Montessori method is followed. Students are encouraged to learn by doing and not by rote, and the Phonetic Method is used for teaching English pronunciation.",
    ages: ["Playway — 2½ to 3 years", "Pre-Nursery — more than 3 years", "Nursery — more than 4 years", "KG — more than 5 years"],
    images: [
      gallery("KidsWorld", "img010.jpg"),
      gallery("KidsWorld", "img011.jpg"),
      gallery("KidsWorld", "img013.jpg"),
      gallery("KidsWorld", "img04.jpg"),
      gallery("SchoolActivities", "img018.jpg"),
      gallery("SchoolActivities", "img028.jpg"),
    ],
  },
  {
    stage: "Primary School",
    short: "Primary",
    eyebrow: "Classes I – V",
    detail: "Language, mathematics and environmental studies, carried through art, model-making and classroom display work.",
    images: [
      gallery("KidsWorld", "img01.jpg"),
      gallery("ArtsandCraft", "img01.jpg"),
      gallery("ArtsandCraft", "img010.jpg"),
      gallery("ArtsandCraft", "img011.jpg"),
      gallery("FairandExhibition", "img04.jpg"),
    ],
  },
  {
    stage: "Middle School",
    short: "Middle",
    eyebrow: "Classes VI – VIII",
    detail: "The middle years introduce the science laboratories and the library, alongside the school's teams and exhibitions.",
    images: [
      INFRA(5), // microscope work
      INFRA(7), // reading room
      INFRA(9), // library stacks
      gallery("FairandExhibition", "img01.jpg"), // solar-system model exhibit
    ],
  },
  {
    stage: "Secondary",
    short: "Secondary",
    eyebrow: "Classes IX – X",
    detail: "CBSE secondary curriculum leading to the Class 10 board examination.",
    images: [INFRA(3), INFRA(4), gallery("SchoolFacilities", "img01.jpg"), gallery("SportsPics", "img07.jpg")],
  },
  {
    stage: "Senior Secondary",
    short: "Sr. Secondary",
    eyebrow: "Classes XI – XII",
    detail:
      "Medical, Non-Medical, Commerce and Arts streams are available for 10+1 and 10+2. The school also provides Bio-Technology and Computer Science as 5th subject options, in addition to Physical Education.",
    streams: ["Medical", "Non-Medical", "Commerce", "Arts"],
    electives: ["Bio-Technology", "Computer Science", "Physical Education"],
    // Sayonara is the Class 12 farewell, so its stage-skit photographs belong here.
    images: [
      gallery("StaffandStudents", "img04.jpg"),
      gallery("StaffandStudents", "img031.jpg"),
      gallery("Sayonara", "img01.jpg"),
      gallery("Sayonara", "img04.jpg"),
    ],
  },
];

// Facilities exactly as the school publishes them. An empty `images` means the
// site lists the facility but no photograph of it exists in the school's own
// galleries, so the tile shows the name and note only.
export const campusPills = [
  {
    label: "Laboratories",
    note: "Science laboratories used by the senior classes.",
    images: [INFRA(3), INFRA(4), INFRA(5), gallery("SchoolFacilities", "img01.jpg")],
  },
  {
    label: "Library",
    note: "Reading room and open stacks for all sections.",
    images: [INFRA(6), INFRA(7), INFRA(9)],
  },
  {
    label: "Computer Lab",
    note: "Workstations used for computer instruction.",
    images: [images.photo_3],
  },
  {
    label: "Basketball",
    note: "Court practice on the outdoor court.",
    images: [gallery("SportsPics", "img07.jpg"), gallery("SportsPics", "img08.jpg")],
  },
  { label: "Football", note: "Home of the Shishu Niketan Football Trophy.", images: [achievement("FootballTrophy")] },
  { label: "Cricket", note: "Published by the school; no photograph of it exists in the gallery.", images: [] },
  { label: "Tennis", note: "Published by the school; no photograph of it exists in the gallery.", images: [] },
  { label: "Skating", note: "Published by the school; no photograph of it exists in the gallery.", images: [] },
  {
    label: "Taekwondo",
    note: "Coached on campus — the team and the graded batch.",
    images: [gallery("SportsPics", "img01.jpg"), gallery("SchoolFacilities", "img010.jpg"), gallery("SchoolFacilities", "img011.jpg")],
  },
  {
    label: "Playground",
    note: "2,416 sq. m of play area on the 3.82-acre campus.",
    images: [gallery("SchoolFacilities", "img013.jpg"), gallery("SportsPics", "img04.jpg"), INFRA(8)],
  },
  { label: "Indoor Games", note: "On the school data sheet; no photograph of it exists in the gallery.", images: [] },
  {
    label: "Dance",
    note: "Performed at the annual day and the Class 12 farewell.",
    images: [gallery("Annualday-Seniors", "img01.jpg"), gallery("Annualday-Seniors", "img04.jpg")],
  },
  {
    label: "Medical Check-up",
    note: "Health check for the infants and the senior classes.",
    images: [gallery("KidsWorld", "img07.jpg")],
  },
];

// The nine campus photographs the school publishes on its Infrastructure page,
// ordered so the two near-identical facade shots are not placed side by side.
export const campusPhotos = [
  { src: INFRA(1), caption: "Main academic block" },
  { src: INFRA(3), caption: "Science laboratory" },
  { src: INFRA(5), caption: "Microscope work" },
  { src: INFRA(9), caption: "Library stacks" },
  { src: INFRA(7), caption: "Reading room" },
  { src: INFRA(4), caption: "Laboratory bench" },
  { src: INFRA(8), caption: "Courtyard" },
  { src: INFRA(2), caption: "Academic block, second elevation" },
  { src: INFRA(6), caption: "Study period" },
];

export const campusPhotosOrdered = campusPhotos.map((item) => item.src);
