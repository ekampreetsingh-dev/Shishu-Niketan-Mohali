import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { images } from "../data/assets.js";
import { useSpotlight } from "../hooks/useSpotlight.js";

// On a 360px stage the nowrap pills at 38% reach pushed ~15px past the panel,
// so the ring tightens and the pills shrink below the sm breakpoint.
function useNarrow(maxPx = 639) {
  const [narrow, setNarrow] = useState(() => window.matchMedia(`(max-width:${maxPx}px)`).matches);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width:${maxPx}px)`);
    const onChange = (event) => setNarrow(event.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [maxPx]);
  return narrow;
}

const RADIUS_WIDE = 38;
const RADIUS_NARROW = 37;
const CORE_EDGE_WIDE = 17;
const CORE_EDGE_NARROW = 14;

// Nodes sit on a circle in a 0–100 space that matches the square stage, so the
// SVG wires can share the exact same coordinates.
const place = (index, count, radius) => {
  const angle = (index / count) * Math.PI * 2 - Math.PI / 2;
  return { x: 50 + Math.cos(angle) * radius, y: 50 + Math.sin(angle) * radius, angle };
};

function OrbitRing({ inset, duration, reverse }) {
  return (
    <div
      className="absolute rounded-full border border-dashed border-line-soft"
      style={{
        left: `${inset}%`,
        top: `${inset}%`,
        width: `${100 - inset * 2}%`,
        height: `${100 - inset * 2}%`,
        animation: `spin ${duration}s linear infinite${reverse ? " reverse" : ""}`,
      }}
    />
  );
}

export default function ConstellationSphere({ nodes, caption }) {
  const reduced = useReducedMotion();
  const narrow = useNarrow();
  const [ready, setReady] = useState(false);
  const onPointerMove = useSpotlight();

  const CORE_EDGE = narrow ? CORE_EDGE_NARROW : CORE_EDGE_WIDE;
  const radiusFor = (i) => {
    if (!narrow) return RADIUS_WIDE;
    // push every other node inward so neighbours clear each other
    return i % 2 === 0 ? RADIUS_NARROW : RADIUS_NARROW - 9;
  };
  const points = nodes.map((_, i) => place(i, nodes.length, radiusFor(i)));

  return (
    <div className="glass-panel spotlight p-4 sm:p-9" onPointerMove={onPointerMove}>
      <div className="relative z-[3] flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="eyebrow">The whole school</p>
          <h2 className="mt-3 max-w-md text-[clamp(1.5rem,3vw,2.125rem)]">
            Every part of the school, <em className="not-italic text-accent">in one orbit</em>
          </h2>
        </div>
        <p className="hidden max-w-[15rem] text-right text-[0.6875rem] leading-[1.9] text-faint sm:block">{caption}</p>
      </div>

      <div
        ref={(el) => el && !ready && requestAnimationFrame(() => setReady(true))}
        className="relative mx-auto mt-6 aspect-square w-full max-w-[500px]"
      >
        {/* Ambient core light */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[64%] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "radial-gradient(circle, rgb(242 179 61 / 0.2) 0%, rgb(242 179 61 / 0.06) 42%, transparent 68%)" }}
        />

        <OrbitRing inset={8} duration={90} />
        <OrbitRing inset={22} duration={64} reverse />
        <OrbitRing inset={34} duration={44} />

        {/* Wires from the core to each node. Plain strokes read as lines; the
            flowing dashes are reserved for the live ones. */}
        <svg viewBox="0 0 100 100" className="pointer-events-none absolute inset-0 z-[1] h-full w-full overflow-visible">
          {points.map((point, index) => {
            const from = place(index, nodes.length, CORE_EDGE);
            const to = place(index, nodes.length, radiusFor(index) - (narrow ? 4 : 5));
            const active = index % 3 === 1;
            return (
              <line
                key={index}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={active ? "rgb(242 179 61 / 0.6)" : "rgb(244 239 233 / 0.18)"}
                strokeWidth="0.4"
                strokeLinecap="round"
                strokeDasharray={active ? "4 4" : undefined}
                style={active && !reduced ? { animation: "wire-flow 1.3s linear infinite" } : undefined}
              />
            );
          })}
        </svg>

        {/* Core sphere */}
        <div className="absolute left-1/2 top-1/2 z-[3] -translate-x-1/2 -translate-y-1/2">
          <span
            className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[196%] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background: "radial-gradient(circle, rgb(242 179 61 / 0.28), transparent 66%)",
              animation: reduced ? undefined : "core-pulse 6.5s var(--ease-editorial) infinite",
            }}
          />
          <div
            className={`relative grid place-items-center rounded-full ${narrow ? "h-[72px] w-[72px]" : "h-[104px] w-[104px]"}`}
            style={{
              background:
                "radial-gradient(circle at 36% 28%, #ffe0b0 0%, #f7c566 26%, #f2b33d 58%, #9a6410 100%)",
              boxShadow:
                "0 0 0 7px rgb(242 179 61 / 0.06), 0 24px 60px -18px rgb(242 179 61 / 0.6), inset 0 -10px 22px rgb(110 66 8 / 0.45), inset 0 1px 0 rgb(255 240 214 / 0.5)",
            }}
          >
            <span
              className="pointer-events-none absolute -inset-3.5 rounded-full border border-dashed border-accent/35"
              style={{ animation: reduced ? undefined : "spin 32s linear infinite" }}
            />
            <span className="pointer-events-none absolute -inset-1 rounded-full border border-white/15" />
            <img src={images.logo} alt="" className={`rounded-full object-cover opacity-95 ${narrow ? "h-[44px] w-[44px]" : "h-[62px] w-[62px]"}`} />
          </div>
        </div>

        {/* Nodes */}
        <div className="absolute inset-0 z-[4]">
          {nodes.map((node, index) => {
            const point = points[index];
            return (
              <motion.div
                key={node.label}
                initial={reduced ? false : { opacity: 0, scale: 0.82 }}
                animate={{ opacity: ready ? 1 : 0, scale: ready ? 1 : 0.82 }}
                transition={{ duration: 0.45, delay: reduced ? 0 : index * 0.055, ease: [0.2, 0.7, 0.2, 1] }}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${point.x}%`, top: `${point.y}%` }}
              >
                <div
                  className={`flex items-center rounded-full border border-line bg-abyss/85 shadow-lift backdrop-blur-sm ${
                    narrow ? "gap-1 py-0.5 pl-0.5 pr-1.5" : "gap-2 py-1 pl-1.5 pr-3"
                  }`}
                  style={{ height: narrow ? 22 : 30 }}
                >
                  <span
                    className={`grid shrink-0 place-items-center rounded-full bg-accent/15 font-display font-bold text-accent ${
                      narrow ? "h-[14px] w-[14px] text-[6.5px]" : "h-[18px] w-[18px] text-[8px]"
                    }`}
                    style={{
                      animation: reduced ? undefined : `node-float ${6 + (index % 3)}s ease-in-out infinite alternate`,
                      animationDelay: `${index * -0.47}s`,
                    }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="whitespace-nowrap font-display text-[8px] font-bold uppercase tracking-[0.04em] text-ink sm:text-[10px] sm:tracking-[0.1em]">
                    {node.label}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
