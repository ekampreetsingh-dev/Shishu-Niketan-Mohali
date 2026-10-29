import { albums } from "./assets.js";
import { images } from "./assets.js";

// Which school photographs belong to which part of the site. Every path here
// comes from the generated manifest, so nothing can point at a missing file.
const byFolder = new Map(Object.values(albums).map((album) => [album.folder, album.images]));

const album = (folder, limit = Infinity) => (byFolder.get(folder) ?? []).slice(0, limit);

// Several facilities share one album, so taking the first N would show the same
// photographs over and over. Space the picks across the album instead.
const pick = (list, count, offset = 0) => {
  if (list.length === 0) return [];
  const stride = Math.max(1, Math.floor(list.length / count));
  const out = [];
  for (let i = 0; i < count; i += 1) {
    out.push(list[(offset * stride + i * stride) % list.length]);
  }
  return [...new Set(out)];
};

export const academicsContent = [
  {
    stage: "Playway & Nursery",
    short: "Playway",
    eyebrow: "Montessori method",
    detail:
      "The philosophy of the Montessori method is followed. Students are encouraged to learn by doing and not by rote, and the Phonetic Method is used for teaching English pronunciation.",
    ages: ["Playway — 2½ to 3 years", "Pre-Nursery — more than 3 years", "Nursery — more than 4 years", "KG — more than 5 years"],
    gallery: ["KidsWorld", "CelebrationTime"],
  },
  {
    stage: "Primary School",
    short: "Primary",
    eyebrow: "Classes I – V",
    detail:
      "Language, mathematics and environmental studies, with art and classroom activity carried through the week.",
    gallery: ["ArtsandCraft", "SchoolActivities"],
  },
  {
    stage: "Middle School",
    short: "Middle",
    eyebrow: "Classes VI – VIII",
    detail:
      "The middle years introduce the science and computer laboratories and the school's competitive teams.",
    gallery: ["SchoolFacilities", "FairandExhibition"],
  },
  {
    stage: "Secondary",
    short: "Secondary",
    eyebrow: "Classes IX – X",
    detail: "CBSE secondary curriculum leading to the Class 10 board examination.",
    gallery: ["Annualday-Seniors", "SportsPics"],
  },
  {
    stage: "Senior Secondary",
    short: "Sr. Secondary",
    eyebrow: "Classes XI – XII",
    detail:
      "Medical, Non-Medical, Commerce and Arts streams are available for 10+1 and 10+2. The school also provides Bio-Technology and Computer Science as 5th subject options, in addition to Physical Education.",
    streams: ["Medical", "Non-Medical", "Commerce", "Arts"],
    electives: ["Bio-Technology", "Computer Science", "Physical Education"],
    gallery: ["StaffandStudents", "Sayonara"],
  },
].map((stage, index) => ({
  ...stage,
  images: [...new Set(stage.gallery.flatMap((folder) => pick(album(folder), 4, index)))],
}));

// Each facility names the albums it actually appears in. SportsPics is a small
// set, so the ball-game pills stagger their picks rather than all showing img01.
export const campusPills = [
  { label: "Laboratories", folders: ["SchoolFacilities"], infra: [1, 2], note: "Science laboratories for the senior classes." },
  { label: "Computer Lab", folders: ["SchoolActivities"], infra: [3], note: "Computer instruction alongside the CBSE curriculum." },
  { label: "Library", folders: ["ArtsandCraft"], infra: [4], note: "Reference and reading collection for all sections." },
  { label: "Basketball", folders: ["SportsPics"], infra: [5], note: "Court and team practice." },
  { label: "Football", folders: ["SportsPics"], infra: [6], note: "Home of the Shishu Niketan Football Trophy." },
  { label: "Cricket", folders: ["SportsPics"], infra: [7], note: "Net and field practice." },
  { label: "Tennis", folders: ["SportsPics"], infra: [8], note: "Coached on campus." },
  { label: "Skating", folders: ["SchoolActivities"], infra: [9], note: "Track and gear guidance." },
  { label: "Taekwondo", folders: ["TaekwondoAchievers", "SportsPics"], infra: [2], note: "Certified achievers trained here." },
  { label: "Indoor Games", folders: ["SchoolFacilities"], infra: [3], note: "Listed on the published school data sheet." },
  { label: "Dance Rooms", folders: ["CelebrationTime"], infra: [5], note: "Listed on the published school data sheet." },
  { label: "Medical Check-up", folders: ["SchoolFacilities"], infra: [6], note: "Health and medical check-up facility." },
].map((item, index) => ({
  ...item,
  images: [
    ...item.infra.map((n) => images[`infra_pics_infrasture${n}`]).filter(Boolean),
    ...new Set(item.folders.flatMap((folder) => pick(album(folder), 3, index))),
  ].filter(Boolean),
}));

export const heroImages = [images.school, images.photo_1, images.photo_4];

// The nine campus photographs the school publishes on its Infrastructure page.
export const campusPhotos = Array.from({ length: 9 }, (_, i) => images[`infra_pics_infrasture${i + 1}`]).filter(Boolean);
