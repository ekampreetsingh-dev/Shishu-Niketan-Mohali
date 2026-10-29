import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Reveal from "../components/Reveal.jsx";
import { SectionHeading } from "../components/PageHeader.jsx";
import LightboxGallery from "../components/LightboxGallery.jsx";
import { school } from "../data/school.js";
import { images } from "../data/assets.js";
import { campusPills } from "../data/sections.js";
import { useSpotlight } from "../hooks/useSpotlight.js";

// The nine photographs the school itself publishes on its Infrastructure page.
const campus = Array.from({ length: 9 }, (_, i) => images[`infra_pics_infrasture${i + 1}`]).filter(Boolean);

// The school's campus shots are 700x464, so every tile is sized to that ratio —
// a taller frame would make object-cover slice off the building.
// Two tiles take a 2x2 slot, the rest 1x1: 2(4) + 7(1) + the stat tile = 16
// cells, which fills a four-column grid exactly with no holes.
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
          <div className="pill-img border border-line bg-sunken">
            <img
              src={campus[0]}
              alt="Shishu Niketan Public School building, Sector-66 Mohali"
              width={700}
              height={464}
              className="aspect-4/3 w-full object-cover lg:aspect-3/2"
            />
          </div>
        </Reveal>
      </section>

      {/* The nine campus photographs */}
      <section className="shell py-12 lg:py-16">
        <SectionHeading eyebrow="Photographs" title="The campus, in the school's own frames" />
        <div className="mt-10 grid auto-rows-[110px] grid-cols-2 gap-3 sm:auto-rows-[190px] sm:grid-cols-4">
          {campus.map((src, index) => (
            <Reveal
              key={src}
              delay={index * 0.05}
              y={20}
              className={`${SPANS[index % SPANS.length]} border border-line bg-sunken`}
            >
              <motion.img
                src={src}
                alt={`School campus photograph ${index + 1}`}
                loading={index < 2 ? "eager" : "lazy"}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.7, ease: [0.175, 0.885, 0.32, 1.15] }}
                className="h-full w-full object-cover"
              />
            </Reveal>
          ))}

          {/* Nine frames leave a two-column hole on the last row; the campus
              figures close it without inventing a tenth photograph. */}
          <Reveal
            delay={0.5}
            y={20}
            className="flex flex-col justify-end rounded-[32px] border border-line bg-surface p-5"
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

      {/* Facilities — pill selector with its own photography */}
      <section className="mt-8 border-y border-line bg-sunken">
        <div className="shell py-16 lg:py-20">
          <SectionHeading eyebrow="Facilities" title="What the students use" />

          <Reveal delay={0.08} className="mt-9">
            <ul className="flex flex-wrap gap-2">
              {campusPills.map((item, index) => {
                const isActive = facility === index;
                return (
                  <li key={item.label}>
                    <button
                      type="button"
                      onClick={() => setFacility(index)}
                      data-cursor="Show"
                      aria-pressed={isActive}
                      className={`relative isolate flex items-center gap-2.5 rounded-full border py-1.5 pl-1.5 pr-5 transition-colors duration-300 ${
                        isActive ? "border-accent text-void" : "border-line text-muted hover:border-line-strong hover:text-ink"
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="facility-active"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                          className="absolute inset-0 -z-10 rounded-full bg-accent"
                        />
                      )}
                      <img
                        src={item.images[0]}
                        alt=""
                        loading="lazy"
                        className="h-8 w-8 rounded-full border border-line object-cover"
                      />
                      <span className="font-display text-[0.8125rem] font-bold">{item.label}</span>
                    </button>
                  </li>
                );
              })}
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
              <div onPointerMove={onPointerMove} className="spotlight rounded-[32px] border border-line bg-surface p-7">
                <h3 className="text-[1.5rem]">{active.label}</h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">{active.note}</p>
                <p className="mt-6 text-[0.75rem] uppercase tracking-[0.14em] text-faint">
                  {active.images.length} photographs on record
                </p>
              </div>
              <LightboxGallery images={active.images} altPrefix={active.label} className="lg:grid-cols-2" />
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Everything else on campus */}
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
