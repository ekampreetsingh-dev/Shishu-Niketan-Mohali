import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ArrowUpRight, CreditCard, Megaphone } from "lucide-react";
import Reveal from "../components/Reveal.jsx";
import { SectionHeading } from "../components/PageHeader.jsx";
import PillTabs from "../components/PillTabs.jsx";
import ConstellationSphere from "../components/ConstellationSphere.jsx";
import { useSpotlight } from "../hooks/useSpotlight.js";
import { school, intro, announcements } from "../data/school.js";
import { images } from "../data/assets.js";
import { gallery, albumCover } from "../data/gallery.js";
import { academicsContent, heroImages, campusPhotos } from "../data/sections.js";
import { feePath } from "../data/navigation.js";

const ORBIT_NODES = [
  { label: "Playway" },
  { label: "Kindergarten" },
  { label: "Primary" },
  { label: "Middle" },
  { label: "Secondary" },
  { label: "Sr. Secondary" },
  { label: "Labs & Library" },
  { label: "Sports" },
];

const NEXT_STOPS = [
  ["Admissions", "/admissions"],
  ["About the school", "/about"],
  ["List of Books", "/books-list"],
  ["Public Disclosure", "/mandatory-public-disclosure"],
  ["Contact", "/contact"],
];

export default function Home() {
  const onPointerMove = useSpotlight();
  const [stage, setStage] = useState(0);

  const activeStage = academicsContent[stage];
  const teaserAlbums = [gallery[0], gallery[3], gallery[8]].filter(Boolean);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="shell grid items-center gap-14 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 lg:py-24">
          <div>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="eyebrow">
              CBSE Affiliation No. {school.cbseAffiliation} · Est. {school.established}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.08, ease: [0.2, 0.7, 0.2, 1] }}
              className="mt-5 text-[clamp(2.25rem,6vw,4rem)] leading-[1.04]"
            >
              {intro.headline.lead} <em className="not-italic text-accent">{intro.headline.accent}</em>{" "}
              {intro.headline.tail}
            </motion.h1>

            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="rule mt-7 origin-left"
            />

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.34 }}
              className="lead mt-7"
            >
              {school.fullName} — {school.classes}, taught to the {school.medium}. One of four branches of the{" "}
              {school.group.name}, founded {school.group.established}.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.44 }}
              className="mt-10 flex flex-wrap gap-3"
            >
              <Link to="/admissions" className="btn btn-primary">
                Explore Admissions <ArrowRight size={15} />
              </Link>
              <Link to="/about" className="btn btn-ghost">
                Discover Our School
              </Link>
            </motion.div>
          </div>

          <Reveal delay={0.2} y={26} className="relative">
            <div className="relative ml-auto max-w-xl">
              <span className="absolute -left-5 -top-5 hidden h-24 w-24 rounded-tl-[28px] border-l-2 border-t-2 border-accent/60 sm:block" />
              <img
                src={heroImages[0]}
                alt="The campus of Shishu Niketan Public School, Sector-66 Mohali"
                width={750}
                height={498}
                className="aspect-3/2 w-full rounded-full border border-line object-cover shadow-plate"
              />
              <img
                src={heroImages[2]}
                alt="Students at school"
                loading="lazy"
                className="absolute -bottom-10 -left-8 hidden aspect-2/1 w-48 rounded-full border-4 border-void object-cover shadow-lift sm:block"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Orbit sphere */}
      <section className="shell pb-20 lg:pb-24">
        <Reveal y={26}>
          <ConstellationSphere
            caption="Every stage and facility the school publishes, drawn from its own admissions and campus pages."
            nodes={ORBIT_NODES}
          />
        </Reveal>
      </section>

      {/* Academics — pill tabs */}
      <section className="border-y border-line bg-sunken">
        <div className="shell py-20 lg:py-24">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow="Academics" title="Pick a stage" />
            <Reveal delay={0.1}>
              <Link to="/academics" className="btn btn-ghost">
                All about academics <ArrowRight size={15} />
              </Link>
            </Reveal>
          </div>

          <Reveal delay={0.08} className="mt-10">
            <PillTabs
              id="home-academics"
              items={academicsContent.map((item) => ({ label: item.short }))}
              active={stage}
              onChange={setStage}
            />
          </Reveal>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeStage.stage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
              className="mt-9 grid gap-8 lg:grid-cols-[0.55fr_0.45fr] lg:items-start"
            >
              <div className="rounded-[32px] border border-line bg-surface p-8">
                <p className="eyebrow">{activeStage.eyebrow}</p>
                <h3 className="mt-4 text-[1.75rem]">{activeStage.stage}</h3>
                <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted">{activeStage.detail}</p>
                {activeStage.ages && (
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {activeStage.ages.map((line) => (
                      <li key={line} className="chip">
                        {line}
                      </li>
                    ))}
                  </ul>
                )}
                {activeStage.streams && (
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {activeStage.streams.map((stream) => (
                      <li
                        key={stream}
                        className="rounded-full border border-accent/30 bg-accent/10 px-4 py-2 font-display text-[0.75rem] font-bold text-accent"
                      >
                        {stream}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {activeStage.images.slice(0, 4).map((src, index) => (
                  <img
                    key={src}
                    src={src}
                    alt={`${activeStage.stage} — school photograph ${index + 1}`}
                    loading="lazy"
                    className={`w-full rounded-full border border-line object-cover ${
                      index === 0 ? "col-span-2 aspect-3/2" : "aspect-3/2"
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Campus teaser — the interactive facility picker lives on its own tab */}
      <section className="shell py-20 lg:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="Campus" title={`${school.campusArea}, given to teaching`} />
          <Reveal delay={0.1}>
            <Link to="/infrastructure" className="btn btn-ghost">
              Explore every facility <ArrowRight size={15} />
            </Link>
          </Reveal>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[0, 1, 3].map((n, index) => (
            <Reveal key={campusPhotos[n].src} delay={index * 0.08} y={22} className="pill-img border border-line bg-sunken">
              <motion.img
                src={campusPhotos[n].src}
                alt={`${campusPhotos[n].caption} — Shishu Niketan Public School`}
                loading="lazy"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.7, ease: [0.175, 0.885, 0.32, 1.15] }}
                className="aspect-3/2 w-full object-cover"
              />
            </Reveal>
          ))}
        </div>
        <p className="mt-4 text-[0.75rem] text-faint">
          Main academic block · Science laboratory · Library stacks
        </p>
      </section>

      {/* Achievements teaser */}
      <section className="border-y border-line bg-elevated">
        <div className="shell py-20 lg:py-24">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow="Achievements" title="Where the work shows up" />
            <Reveal delay={0.1}>
              <Link to="/achievements" className="btn btn-ghost">
                All achievements <ArrowRight size={15} />
              </Link>
            </Reveal>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[images.achievement_1, images.achievement_4, images.achievement_6, images.achievement_8].map((src, index) => (
              <Reveal key={src} delay={index * 0.07} y={22}>
                <motion.img
                  src={src}
                  alt={`School achievement record ${index + 1}`}
                  loading="lazy"
                  whileHover={{ scale: 1.035 }}
                  transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
                  className="aspect-2/1 w-full rounded-full border border-line bg-surface object-cover"
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Announcements + fee */}
      <section className="shell grid gap-6 py-20 lg:grid-cols-[1.15fr_0.85fr] lg:py-24">
        <div>
          <SectionHeading eyebrow="Announcements" title="On the noticeboard" />
          <ul className="mt-9 space-y-3">
            {announcements.map((item, index) => (
              <Reveal as="li" key={item.title} delay={index * 0.08}>
                <Link
                  to={item.to}
                  onPointerMove={onPointerMove}
                  className="spotlight lift flex items-start gap-5 rounded-[30px] border border-line bg-surface p-6"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent/12 text-accent">
                    <Megaphone size={16} />
                  </span>
                  <span className="flex-1">
                    <strong className="block font-display text-[1rem] font-bold leading-snug text-ink">{item.title}</strong>
                    <span className="mt-2 block text-[0.875rem] leading-relaxed text-muted">{item.detail}</span>
                    <span className="mt-3 inline-flex items-center gap-1.5 font-display text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-accent">
                      {item.cta} <ArrowUpRight size={13} />
                    </span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>

        <Reveal delay={0.12} y={26}>
          <div
            onPointerMove={onPointerMove}
            className="spotlight lift flex h-full flex-col justify-between rounded-[32px] border border-line bg-surface p-8"
          >
            <div>
              <span className="grid h-11 w-11 place-items-center rounded-full bg-accent text-void">
                <CreditCard size={19} />
              </span>
              <h3 className="mt-6 text-[1.5rem]">Fee payment, without the queue</h3>
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted">
                Verify with your admission number and a one-time password, review the quarters due, and pay online.
                Receipts stay downloadable from the same screen.
              </p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {["OTP to registered mobile", "Quarter-wise dues", "Late fee shown", "Receipt history"].map((line) => (
                  <li key={line} className="chip">
                    {line}
                  </li>
                ))}
              </ul>
            </div>
            <Link to={feePath} className="btn btn-primary mt-8 w-full">
              Pay fees <ArrowRight size={15} />
            </Link>
          </div>
        </Reveal>
      </section>

      {/* Gallery teaser */}
      <section className="border-t border-line bg-sunken">
        <div className="shell py-20 lg:py-24">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow="Gallery" title="School life, photographed" />
            <Reveal delay={0.1}>
              <Link to="/gallery" className="btn btn-ghost">
                Open the gallery <ArrowRight size={15} />
              </Link>
            </Reveal>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {teaserAlbums.map((album, index) => (
              <Reveal key={album.slug} delay={index * 0.08} y={22}>
                <Link to="/gallery" className="lift block rounded-[30px] border border-line bg-surface p-3">
                  <div className="frame">
                    <motion.img
                      src={albumCover(album)}
                      alt={album.title}
                      loading="lazy"
                      whileHover={{ scale: 1.045 }}
                      transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
                      className="aspect-3/2 w-full object-cover"
                    />
                  </div>
                  <p className="mt-4 flex items-center justify-between px-1 pb-1 font-display text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-muted">
                    {album.title}
                    <span className="text-accent">{album.images.length}</span>
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Where next */}
      <section className="shell py-20 lg:py-24">
        <Reveal className="rounded-[36px] border border-line bg-elevated p-9 lg:p-14">
          <p className="eyebrow">Start anywhere</p>
          <h2 className="mt-4 max-w-2xl text-[clamp(1.625rem,3.4vw,2.5rem)]">
            {school.classes}, on the CBSE curriculum.
          </h2>
          <div className="mt-10 flex flex-wrap gap-3">
            {NEXT_STOPS.map(([label, to]) => (
              <Link key={to} to={to} className="btn btn-ghost">
                {label} <ArrowRight size={14} />
              </Link>
            ))}
          </div>
        </Reveal>
      </section>
    </>
  );
}
