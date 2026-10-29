import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

function Tile({ src, alt, caption, onOpen, index }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <figure className="aspect-3/2 rounded-full border border-line bg-sunken">
        <figcaption className="flex h-full items-end p-3 text-[0.6875rem] text-muted">
          Image unavailable
        </figcaption>
      </figure>
    );
  }
  return (
    <figure>
      <button
        type="button"
        onClick={() => onOpen(index)}
        data-cursor="View"
        className="group block w-full overflow-hidden rounded-full bg-sunken text-left"
      >
        <motion.img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="aspect-3/2 w-full rounded-full object-cover"
          whileHover={{ scale: 1.035 }}
          transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
        />
        {caption && (
          <figcaption className="sr-only">{caption}</figcaption>
        )}
      </button>
    </figure>
  );
}

export default function LightboxGallery({ images, altPrefix = "School photograph", className = "" }) {
  const [openIndex, setOpenIndex] = useState(null);
  const closeRef = useRef(null);
  const restoreFocus = useRef(null);
  const list = useMemo(() => images ?? [], [images]);
  const count = list.length;

  const close = useCallback(() => {
    setOpenIndex(null);
    requestAnimationFrame(() => restoreFocus.current?.focus());
  }, []);

  const step = useCallback(
    (delta) => setOpenIndex((i) => (i === null ? i : (i + delta + count) % count)),
    [count]
  );

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (event) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [openIndex, close, step]);

  return (
    <>
      <div className={`grid grid-cols-2 gap-2.5 sm:gap-3.5 md:grid-cols-3 ${className}`}>
        {list.map((src, index) => (
          <Tile
            key={src}
            src={src}
            index={index}
            onOpen={(i) => {
              restoreFocus.current = document.activeElement;
              setOpenIndex(i);
            }}
            alt={`${altPrefix} ${index + 1} of ${count}`}
          />
        ))}
      </div>

      <AnimatePresence>
        {openIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-abyss/95 p-4 sm:p-8"
            role="dialog"
            aria-modal="true"
            aria-label={`${altPrefix} viewer, image ${openIndex + 1} of ${count}`}
            onClick={close}
          >
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label="Close image viewer"
              className="absolute right-4 top-4 inline-flex items-center gap-2 border border-line-strong px-3 py-2 font-display text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-ink transition-colors hover:bg-surface hover:text-ink"
            >
              Close <X size={15} />
            </button>

            <div onClick={(event) => event.stopPropagation()} className="flex w-full max-w-5xl flex-col items-center gap-4">
              <motion.img
                key={list[openIndex]}
                src={list[openIndex]}
                alt={`${altPrefix} ${openIndex + 1} of ${count}`}
                initial={{ opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.28, ease: [0.22, 0.61, 0.36, 1] }}
                className="max-h-[74vh] w-auto max-w-full object-contain"
              />
              <p className="text-[0.75rem] tracking-[0.14em] text-muted uppercase">
                {openIndex + 1} / {count}
              </p>
            </div>

            {count > 1 && (
              <>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    step(-1);
                  }}
                  aria-label="Previous image"
                  className="absolute left-3 top-1/2 -translate-y-1/2 border border-line-strong p-2.5 text-ink transition-colors hover:bg-surface hover:text-ink sm:left-6"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    step(1);
                  }}
                  aria-label="Next image"
                  className="absolute right-3 top-1/2 -translate-y-1/2 border border-line-strong p-2.5 text-ink transition-colors hover:bg-surface hover:text-ink sm:right-6"
                >
                  <ChevronRight size={22} />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
