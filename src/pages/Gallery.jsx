import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import PageHeader from "../components/PageHeader.jsx";
import LightboxGallery from "../components/LightboxGallery.jsx";
import Reveal from "../components/Reveal.jsx";
import { gallery, allGalleryImages } from "../data/gallery.js";

export default function Gallery() {
  const [active, setActive] = useState("all");
  const album = gallery.find((item) => item.slug === active);
  const images = active === "all" ? allGalleryImages : album?.images ?? [];

  return (
    <>
      <PageHeader
        eyebrow="Photographs"
        title="Gallery"
        intro="Events, classes and campus life, published by the school."
// A distinct shot: the "All" grid opens with the first UMANG frame, so
        // reusing it here showed the same photograph twice on one screen.
        image={gallery.find((a) => a.slug === "annualdaysenior")?.images[0]}
      />

      <section className="shell py-16 lg:py-20">
        <Reveal>
          <ul className="flex flex-wrap gap-2" role="tablist" aria-label="Gallery albums">
            {[{ slug: "all", title: `All · ${allGalleryImages.length}` }, ...gallery].map((item) => {
              const isActive = active === item.slug;
              return (
                <li key={item.slug}>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActive(item.slug)}
                    className={`rounded-full border px-4 py-2.5 font-display text-[0.6875rem] font-bold uppercase tracking-[0.12em] transition-colors ${
                      isActive
                        ? "border-ink bg-elevated text-ink"
                        : "border-line-strong text-muted hover:border-ink hover:text-ink"
                    }`}
                  >
                    {item.title}
                  </button>
                </li>
              );
            })}
          </ul>
        </Reveal>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="mt-12"
          >
            {images.length > 0 ? (
              <LightboxGallery images={images} altPrefix={active === "all" ? "School" : album.title} className="lg:grid-cols-4" />
            ) : (
              <p className="border border-line bg-elevated p-10 text-center text-[0.9375rem] text-muted">
                No photographs available for this album yet.
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </section>
    </>
  );
}
