import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CameraOff } from "lucide-react";
import Reveal from "../components/Reveal.jsx";
import { SectionHeading } from "../components/PageHeader.jsx";
import LightboxGallery from "../components/LightboxGallery.jsx";
import { school } from "../data/school.js";
import { campusPills, campusPhotos } from "../data/sections.js";
import { useSpotlight } from "../hooks/useSpotlight.js";

// Two tiles take a 2x2 slot and the rest 1x1: 2(4) + 7(1) + the stat tile = 16
// cells, which fills the four-column grid exactly with no holes. Every tile is
// sized to the 700x464 source ratio so nothing is sliced.
const SPANS = [
  "sm:col-span-2 sm:row-span-2 pill-img",
  "pill-img",
  "pill-img",
  "pill-img",
  "pill-img",
  "sm:col-span-2 sm:row-span-2 pill-img",
  "pill-img",
  "pill-img",
  "pill-img",
];

function FacilityPill({ item, isActive, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      data-cursor={item.images.length ? "Show" : undefined}
      className={`relative isolate flex items-center gap-2.5 rounded-full border py-1.5 pr-5 transition-colors duration-300 ${
        item.images.length ? "pl-1.5" : "pl-4"
      } ${isActive ? "border-accent text-void" : "border-line text-muted hover:border-line-strong hover:text-ink"}`}
    >
      {isActive && (
        <motion.span
          layoutId="facility-active"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
          className="absolute inset-0 -z-10 rounded-full bg-accent"
        />
      )}
      {item.images.length > 0 ? (
        <img src={item.images[0]} alt="" loading="lazy" className="h-8 w-8 rounded-full border border-line object-cover" />
      ) : (
        <CameraOff size={15} className={isActive ? "text-void/60" : "text-faint"} aria-hidden="true" />
      )}
      <span className="font-display text-[0.8125rem] font-bold">{item.label}</span>
    </button>
  );
}

export default function Infrastructure() {
  const [facility, setFacility] = useState(0);
  const onPointerMove = useSpotlight();
  const active = campusPills[facility];

  return (
    <>
      {/* Hero */}
      <section className="shell grid items-end gap-10 pt-14 pb-10 lg:grid-cols-[0.95fr_1.05fr] lg:pt-20">
        <Reveal>
          <p className="eyebrow">Campus</p>
          <h1 className="mt-4 text-[clamp(2.25rem,5.5vw,4rem)] leading-[1.02]">Infrastructure</h1>
          <span className="rule mt-6" />
          <p className="lead mt-6">
            Teaching, laboratory and playing space across the {school.campusArea} campus in {school.locality}, with a
            built-up area of 7,263.8 sq. m and a 2,416 sq. m playground.
          </p>
        </Reveal>
        <Reveal delay={0.12} y={26}>
          <figure className="pill-img border border-line bg-sunken">
            <img
              src={campusPhotos[0].src}
              alt={`${campusPhotos[0].caption} — Shishu Niketan Public School`}
              width={700}
              height={464}
              className="aspect-4/3 w-full object-cover lg:aspect-3/2"
            />
            <figcaption className="sr-only">{campusPhotos[0].caption}</figcaption>
          </figure>
        </Reveal>
      </section>

      {/* The nine campus photographs */}
      <section className="shell py-12 lg:py-16">
        <SectionHeading eyebrow="Photographs" title="The campus, in the school's own frames" />
        <div className="mt-10 grid auto-rows-[110px] grid-cols-2 gap-3 sm:auto-rows-[190px] sm:grid-cols-4">
          {campusPhotos.map((photo, index) => (
            <Reveal
              key={photo.src}
              delay={index * 0.05}
              y={20}
              title={photo.caption}
              className={`${SPANS[index % SPANS.length]} group relative border border-line bg-sunken`}
            >
              <motion.img
                src={photo.src}
                alt={`${photo.caption} at ${school.name}, ${school.locality}`}
                loading={index < 2 ? "eager" : "lazy"}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.7, ease: [0.175, 0.885, 0.32, 1.15] }}
                className="h-full w-full object-cover"
              />
              <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 bg-abyss/85 px-3 py-2 text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-ink opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                {photo.caption}
              </span>
            </Reveal>
          ))}

          {/* Nine frames leave one cell; the published campus figures fill it
              rather than a tenth photograph that does not exist. */}
          <Reveal
            delay={0.5}
            y={20}
            className="col-span-2 row-span-2 flex flex-col justify-end rounded-[28px] border border-line bg-surface p-5 sm:col-span-1 sm:row-span-1 sm:rounded-[32px]"
          >
            <p className="eyebrow">On the data sheet</p>
            <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3">
              {[
                ["Campus", school.campusArea],
                ["Built-up", "7,263.8 sq. m"],
                ["Playground", "2,416 sq. m"],
                ["Established", school.established],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-[0.625rem] uppercase tracking-[0.14em] text-faint">{label}</dt>
                  <dd className="mt-1 font-display text-[1.0625rem] font-extrabold text-ink">{value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* Facilities */}
      <section className="mt-8 border-y border-line bg-sunken">
        <div className="shell py-16 lg:py-20">
          <SectionHeading eyebrow="Facilities" title="What the students use" />

          <Reveal delay={0.08} className="mt-9">
            <ul className="flex flex-wrap gap-2">
              {campusPills.map((item, index) => (
                <li key={item.label}>
                  <FacilityPill item={item} isActive={facility === index} onClick={() => setFacility(index)} />
                </li>
              ))}
            </ul>
          </Reveal>

          <AnimatePresence mode="wait">
            <motion.div
              key={active.label}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.34, ease: [0.175, 0.885, 0.32, 1.15] }}
              className="mt-9 grid gap-6 lg:grid-cols-[0.4fr_0.6fr] lg:items-start"
            >
              <div
                onPointerMove={onPointerMove}
                className="spotlight rounded-[32px] border border-line bg-surface p-7"
              >
                <h3 className="text-[1.5rem]">{active.label}</h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">{active.note}</p>
                <p className="mt-6 text-[0.6875rem] uppercase tracking-[0.14em] text-faint">
                  {active.images.length > 0
                    ? `${active.images.length} photograph${active.images.length === 1 ? "" : "s"} on record`
                    : "No photograph published"}
                </p>
              </div>

              {active.images.length > 0 ? (
                <LightboxGallery images={active.images} altPrefix={`${active.label} at ${school.name}`} className="lg:grid-cols-2" />
              ) : (
                <div className="flex flex-col items-start justify-center gap-3 rounded-[32px] border border-dashed border-line-strong bg-surface p-10">
                  <CameraOff size={22} className="text-faint" aria-hidden="true" />
                  <p className="max-w-sm text-[0.875rem] leading-relaxed text-muted">
                    The school lists this facility but has never photographed it. Rather than show an unrelated picture,
                    the tile is left empty — ask the office for details.
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Beyond the classrooms */}
      <section className="shell py-16 lg:py-20">
        <SectionHeading eyebrow="Also on the data sheet" title="Beyond the classrooms" />
        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {["Indoor Games", "Dance Rooms", "Health & Medical Check up", "Playground"].map((item, index) => (
            <Reveal as="li" key={item} delay={index * 0.06}>
              <div
                onPointerMove={onPointerMove}
                className="spotlight lift h-full rounded-[30px] border border-line bg-surface p-6"
              >
                <span className="font-display text-[0.625rem] font-bold uppercase tracking-[0.16em] text-accent">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <strong className="mt-3 block font-display text-[1.0625rem] font-bold text-ink">{item}</strong>
              </div>
            </Reveal>
          ))}
        </ul>
      </section>
    </>
  );
}
