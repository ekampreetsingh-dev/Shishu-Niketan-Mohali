import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, ChevronDown, X } from "lucide-react";
import { navigation, feePath } from "../data/navigation.js";
import { school } from "../data/school.js";
import { images } from "../data/assets.js";

const POP = { type: "spring", stiffness: 420, damping: 22, mass: 0.9 };

function useScrolled(offset = 40) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > offset);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [offset]);
  return scrolled;
}

// inline-flex matters: a plain inline <a> wrapping a flex span splits into
// anonymous blocks and inflates the pill from ~29px to ~71px tall.
const linkClass = ({ isActive }) =>
  `inline-flex items-center rounded-full px-2.5 py-1 font-display text-[0.625rem] font-bold uppercase tracking-[0.1em] transition-colors duration-300 ${
    isActive ? "bg-line text-ink" : "text-faint hover:text-ink"
  }`;

function DesktopItem({ item }) {
  const [open, setOpen] = useState(false);
  const timer = useRef();

  if (!item.children) {
    return (
      <NavLink to={item.to} className={linkClass}>
        {item.label}
      </NavLink>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => {
        clearTimeout(timer.current);
        setOpen(true);
      }}
      onMouseLeave={() => {
        timer.current = setTimeout(() => setOpen(false), 120);
      }}
    >
      <NavLink to={item.to} className={linkClass}>
        <span className="flex items-center gap-1">
          {item.label}
          <ChevronDown size={11} className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
        </span>
      </NavLink>
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.175, 0.885, 0.32, 1.15] }}
            className={`absolute top-full z-40 mt-2 min-w-[15rem] rounded-[26px] border border-line bg-elevated p-1.5 shadow-plate ${
              item.align === "end" ? "right-0" : "left-1/2 -translate-x-1/2"
            }`}
          >
            {item.children.map((child) => (
              <li key={child.to}>
                <NavLink
                  to={child.to}
                  className={({ isActive }) =>
                    `block rounded-full px-4 py-2 text-[0.78rem] font-semibold transition-colors ${
                      isActive ? "bg-line text-ink" : "text-muted hover:bg-line hover:text-ink"
                    }`
                  }
                >
                  {child.label}
                </NavLink>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * The crest and wordmark pop in once when the site is opened. With
 * reduce-motion they fade instead of springing — the lockup still arrives,
 * it just stops travelling.
 */
function BrandLockup({ compact }) {
  const reduced = useReducedMotion();
  const words = ["Shishu", "Niketan"];

  return (
    <Link to="/" className="flex shrink-0 items-center gap-2 pl-0.5" aria-label={`${school.fullName} — home`}>
      <motion.img
        src={images.logo}
        alt=""
        width={44}
        height={44}
        initial={reduced ? { opacity: 0 } : { scale: 0, rotate: -140, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={reduced ? { duration: 0.3 } : { ...POP, delay: 0.05 }}
        className={`rounded-full object-cover transition-[height,width] duration-300 ${compact ? "h-7 w-7" : "h-8 w-8"}`}
      />
      <span className="flex items-baseline gap-1.5 leading-none">
        {words.map((word, index) => (
          <motion.span
            key={word}
            initial={reduced ? { opacity: 0 } : { scale: 0.4, y: 8, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={reduced ? { duration: 0.3, delay: index * 0.06 } : { ...POP, delay: 0.22 + index * 0.09 }}
            className="font-display text-[0.8125rem] font-extrabold tracking-[-0.02em] text-ink"
          >
            {word}
          </motion.span>
        ))}
        <motion.small
          initial={reduced ? { opacity: 0 } : { opacity: 0, x: -6 }}
          animate={{ opacity: compact ? 0 : 1, x: 0 }}
          transition={{ duration: 0.25, delay: reduced ? 0 : 0.45 }}
          className="hidden text-[0.5625rem] uppercase tracking-[0.16em] text-faint sm:inline"
        >
          Sector 66
        </motion.small>
      </span>
    </Link>
  );
}

export default function Navbar() {
  const scrolled = useScrolled();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState(null);
  const toggleRef = useRef(null);
  const { pathname } = useLocation();

  useEffect(() => setMobileOpen(false), [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  const mobileGroups = navigation.filter((item) => item.to !== "/");

  return (
    <>
      <div className={`sticky top-0 z-50 transition-[padding] duration-300 ${scrolled ? "pt-1.5" : "pt-2.5"}`}>
        <div className="shell flex items-center justify-between gap-3">
          {/* Pill 1 — the school's crest and name. */}
          <motion.div
            initial={{ y: -22, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className={`rounded-full border shadow-plate backdrop-blur-xl transition-colors duration-300 ${
              scrolled ? "border-line bg-surface/95 py-0.5 pl-0.5 pr-3.5" : "border-line bg-surface/85 py-1 pl-1 pr-4"
            }`}
          >
            <BrandLockup compact={scrolled} />
          </motion.div>

          <div className="flex items-center gap-2">
            {/* Pill 2 (desktop) — the navigation. */}
            <motion.nav
              aria-label="Main"
              initial={{ y: -22, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 380, damping: 28, delay: 0.05 }}
              className={`hidden items-center rounded-full border shadow-plate backdrop-blur-xl transition-colors duration-300 lg:flex ${
                scrolled ? "border-line bg-surface/95 px-1 py-0.5" : "border-line bg-surface/85 px-1.5 py-1"
              }`}
            >
              {navigation.map((item) => (
                <DesktopItem key={item.label} item={item} />
              ))}
              <NavLink to={feePath} className={linkClass}>
                <span className="flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-accent" />
                  Fee Payment
                </span>
              </NavLink>
            </motion.nav>

            {/* Pill 2 (mobile) — three lines, opens the menu. */}
            <motion.button
              ref={toggleRef}
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              aria-label="Open menu"
              initial={{ y: -22, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 380, damping: 28, delay: 0.05 }}
              whileTap={{ scale: 0.92 }}
              className="flex items-center gap-2 rounded-full border border-line bg-surface/85 px-4 py-2.5 shadow-plate backdrop-blur-xl lg:hidden"
            >
              <span className="flex flex-col gap-[4px]">
                <span className="block h-[1.5px] w-5 rounded-full bg-ink" />
                <span className="block h-[1.5px] w-5 rounded-full bg-ink" />
                <span className="block h-[1.5px] w-5 rounded-full bg-ink" />
              </span>
            </motion.button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24 }}
            className="fixed inset-0 z-[60] flex flex-col bg-void lg:hidden"
          >
            <div className="shell flex h-16 shrink-0 items-center justify-between">
              <span className="font-display text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-faint">
                {school.locality}
              </span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="grid h-11 w-11 place-items-center rounded-full border border-line text-ink"
              >
                <X size={18} />
              </button>
            </div>

            <nav aria-label="Main" className="flex-1 overflow-y-auto">
              <ul className="shell space-y-1.5 pb-6">
                {mobileGroups.map((item, index) => (
                  <motion.li
                    key={item.label}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.05 + index * 0.045, ease: [0.175, 0.885, 0.32, 1.15] }}
                    className="rounded-full border border-line bg-surface"
                  >
                    <div className="flex items-center justify-between gap-3 py-1 pl-4">
                      <NavLink to={item.to} className="block flex-1 py-2 font-display text-[0.9375rem] font-extrabold tracking-[-0.02em] text-ink">
                        {item.label}
                      </NavLink>
                      {item.children && (
                        <button
                          type="button"
                          onClick={() => setExpandedGroup((v) => (v === item.label ? null : item.label))}
                          aria-expanded={expandedGroup === item.label}
                          aria-label={`Show ${item.label} links`}
                          className="mr-1 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-line text-muted"
                        >
                          <ChevronDown size={15} className={`transition-transform ${expandedGroup === item.label ? "rotate-180" : ""}`} />
                        </button>
                      )}
                    </div>
                    <AnimatePresence initial={false}>
                      {item.children && expandedGroup === item.label && (
                        <motion.ul
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.24 }}
                          className="overflow-hidden px-3 pb-3"
                        >
                          {item.children.map((child) => (
                            <li key={child.to}>
                              <NavLink
                                to={child.to}
                                className="block rounded-full px-4 py-2 text-[0.75rem] font-semibold text-muted transition-colors hover:bg-elevated hover:text-ink"
                              >
                                {child.label}
                              </NavLink>
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </motion.li>
                ))}

                <motion.li
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.05 + mobileGroups.length * 0.045, ease: [0.175, 0.885, 0.32, 1.15] }}
                  className="pt-2"
                >
                  <NavLink
                    to={feePath}
                    className="flex items-center justify-between gap-3 rounded-full bg-accent px-5 py-3 font-display text-[0.875rem] font-extrabold text-void"
                  >
                    Fee Payment <ArrowUpRight size={18} />
                  </NavLink>
                </motion.li>

                {/* Contact lives in the list as pills, not as a strip pinned to
                    the bottom of the screen. */}
                <motion.li
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.12 + mobileGroups.length * 0.045, ease: [0.175, 0.885, 0.32, 1.15] }}
                  className="flex flex-wrap gap-2 pt-3"
                >
                  <a href={`tel:${school.phones[0]}`} className="chip">
                    {school.phones[0]}
                  </a>
                  <a href={`mailto:${school.email}`} className="chip">
                    {school.email}
                  </a>
                </motion.li>
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
