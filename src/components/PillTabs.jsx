import { motion } from "motion/react";

// Pill-shaped tab strip. The moving highlight is a shared layout element, so it
// glides between pills instead of blinking.
export default function PillTabs({ items, active, onChange, id = "pill-tabs", size = "md" }) {
  const pad = size === "sm" ? "px-4 py-2 text-[0.6875rem]" : "px-5 py-3 text-[0.8125rem]";

  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label={id}>
      {items.map((item, index) => {
        const isActive = active === index;
        return (
          <button
            key={item.label}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(index)}
            className={`relative isolate rounded-full border font-display font-bold uppercase tracking-[0.1em] transition-colors duration-300 ${pad} ${
              isActive ? "border-accent text-void" : "border-line text-muted hover:border-line-strong hover:text-ink"
            }`}
          >
            {isActive && (
              <motion.span
                layoutId={`${id}-active`}
                transition={{ type: "spring", stiffness: 420, damping: 34, mass: 0.7 }}
                className="absolute inset-0 -z-10 rounded-full bg-accent shadow-glow"
              />
            )}
            <span className="flex items-center gap-2">
              <span className={`text-[0.625rem] ${isActive ? "text-void/60" : "text-faint"}`}>
                {String(index + 1).padStart(2, "0")}
              </span>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
