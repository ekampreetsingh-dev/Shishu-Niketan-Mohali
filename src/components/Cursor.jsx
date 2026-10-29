import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

// Deliberately small: the reference's ring is a whisper, not a halo.
const RING = { idle: 22, link: 34, text: 8 };
// Label sits off the ring's shoulder, bottom-right.
const LABEL_OFFSET = { x: 18, y: 18 };

/**
 * Three layers, after the reference site:
 *  - an amber aura composited with mix-blend-mode: screen, so it adds light
 *    rather than covering anything;
 *  - a dot pinned to the pointer;
 *  - a ring that trails it, with a verb label at its bottom-right.
 * Only mounted on fine-pointer devices, and it stays visible under
 * reduce-motion — the trailing simply stops.
 */
export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);
  const auraRef = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return undefined;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { ...target };
    const aura = { ...target };
    let hovered = null;
    let visible = false;
    let frame = 0;

    document.body.classList.add("has-cursor");

    const labelFor = (el) => {
      if (!el) return "";
      if (el.dataset.cursor) return el.dataset.cursor;
      if (["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName)) return "";
      if (el.tagName === "A") {
        const external = /^https?:/.test(el.href) && el.host !== window.location.host;
        return external ? "Visit" : el.querySelector("img") ? "View" : "Open";
      }
      return el.querySelector("img") ? "View" : "Open";
    };

    /**
     * Re-resolves whatever is under the pointer. Called on pointermove *and*
     * scroll — without the scroll case, holding still while the page moves
     * underneath leaves the old verb stuck on screen.
     */
    const resolve = () => {
      const el = document.elementFromPoint(target.x, target.y);
      hovered = el?.closest("a, button, [role='button'], input, textarea, select, [data-cursor]") ?? null;
    };

    const reveal = () => {
      if (visible) return;
      visible = true;
      for (const node of [dotRef, ringRef, auraRef]) {
        if (node.current) node.current.style.opacity = "1";
      }
      auraRef.current?.classList.add("is-active");
    };

    const onMove = (event) => {
      target.x = event.clientX;
      target.y = event.clientY;
      reveal();
      resolve();
    };

    const onLeave = () => {
      visible = false;
      hovered = null;
      for (const node of [dotRef, ringRef]) {
        if (node.current) node.current.style.opacity = "0";
      }
      auraRef.current?.classList.remove("is-active");
    };

    const render = () => {
      const ease = reduced ? 1 : 0.16;
      ring.x += (target.x - ring.x) * ease;
      ring.y += (target.y - ring.y) * ease;
      aura.x += (target.x - aura.x) * (reduced ? 1 : 0.09);
      aura.y += (target.y - aura.y) * (reduced ? 1 : 0.09);

      const isField = hovered ? ["INPUT", "TEXTAREA", "SELECT"].includes(hovered.tagName) : false;
      const isLink = Boolean(hovered) && !isField;
      const size = isField ? RING.text : isLink ? RING.link : RING.idle;

      dotRef.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0) translate(-50%, -50%)`;
      ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)`;
      ringRef.current.style.width = `${size}px`;
      ringRef.current.style.height = `${size}px`;
      ringRef.current.classList.toggle("is-link", isLink);
      ringRef.current.classList.toggle("is-text", isField);

      const label = isLink ? labelFor(hovered) : "";
      labelRef.current.textContent = label;
      labelRef.current.classList.toggle("is-shown", Boolean(label));
      labelRef.current.style.transform = `translate3d(${ring.x + LABEL_OFFSET.x}px, ${ring.y + LABEL_OFFSET.y}px, 0)`;

      auraRef.current.style.background = `radial-gradient(340px circle at ${aura.x}px ${aura.y}px, rgb(242 179 61 / 0.2), rgb(255 122 47 / 0.08) 40%, transparent 68%)`;

      frame = requestAnimationFrame(render);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", resolve, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", resolve);
      document.removeEventListener("pointerleave", onLeave);
      document.body.classList.remove("has-cursor");
    };
  }, [reduced]);

  return (
    <div aria-hidden="true">
      <div ref={auraRef} className="aura-field" />
      <div className="cursor-layer">
        <div ref={ringRef} className="cursor-ring" />
        <div ref={dotRef} className="cursor-dot" />
        <div ref={labelRef} className="cursor-label" />
      </div>
    </div>
  );
}
