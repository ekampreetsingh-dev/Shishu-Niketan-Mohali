import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import PageHeader from "../components/PageHeader.jsx";
import PillTabs from "../components/PillTabs.jsx";
import LightboxGallery from "../components/LightboxGallery.jsx";
import Reveal from "../components/Reveal.jsx";
import { academicsContent } from "../data/sections.js";
import { school } from "../data/school.js";

export default function Academics() {
  const [active, setActive] = useState(0);
  const stage = academicsContent[active];

  return (
    <>
      <PageHeader
        eyebrow="Curriculum"
        title="Academics"
        intro={`Playway through Class 12 on the CBSE curriculum, at ${school.locality}. Pick a stage to see what it covers.`}
        image={stage.images[0]}
      />

      <section className="shell py-16 lg:py-20">
        <PillTabs id="academics" items={academicsContent.map((item) => ({ label: item.short }))} active={active} onChange={setActive} />

        <AnimatePresence mode="wait">
          <motion.div
            key={stage.stage}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.34, ease: [0.2, 0.7, 0.2, 1] }}
            className="mt-10 grid gap-10 lg:grid-cols-[0.45fr_0.55fr]"
          >
            <div>
              <p className="eyebrow">{stage.eyebrow}</p>
              <h2 className="mt-4 text-[clamp(1.75rem,3.4vw,2.5rem)]">{stage.stage}</h2>
              <span className="rule mt-5" />
              <p className="mt-6 text-[0.9375rem] leading-relaxed text-muted">{stage.detail}</p>

              {stage.ages && (
                <ul className="mt-7 flex flex-wrap gap-2">
                  {stage.ages.map((line) => (
                    <li key={line} className="chip">
                      {line}
                    </li>
                  ))}
                </ul>
              )}

              {stage.streams && (
                <>
                  <h3 className="mt-8 font-display text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-faint">
                    Streams
                  </h3>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {stage.streams.map((stream) => (
                      <li key={stream} className="rounded-full border border-accent/30 bg-accent/10 px-4 py-2 font-display text-[0.75rem] font-bold text-accent">
                        {stream}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {stage.electives && (
                <>
                  <h3 className="mt-7 font-display text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-faint">
                    Fifth subject options
                  </h3>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {stage.electives.map((item) => (
                      <li key={item} className="chip">
                        {item}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            <div>
              {stage.images.length > 0 ? (
                <LightboxGallery images={stage.images} altPrefix={`${stage.stage} at ${school.name}`} className="lg:grid-cols-2" />
              ) : (
                <p className="border border-line bg-surface p-8 text-[0.875rem] text-muted">
                  No photographs are published for this stage yet.
                </p>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      <section className="border-t border-line bg-sunken">
        <div className="shell py-16">
          <Reveal>
            <h2 className="text-[1.25rem]">All stages</h2>
          </Reveal>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {academicsContent.map((item, index) => (
              <Reveal key={item.stage} delay={index * 0.05}>
                <button
                  type="button"
                  onClick={() => {
                    setActive(index);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="spotlight h-full w-full rounded-[28px] border border-line bg-surface p-5 text-left transition-colors hover:border-accent/40"
                >
                  <span className="font-display text-[0.625rem] font-bold uppercase tracking-[0.16em] text-accent">
                    {item.eyebrow}
                  </span>
                  <span className="mt-2.5 block font-display text-[0.9375rem] font-bold text-ink">{item.stage}</span>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
