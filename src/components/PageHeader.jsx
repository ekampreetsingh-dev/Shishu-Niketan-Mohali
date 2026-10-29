import Reveal from "./Reveal.jsx";

export function SectionHeading({ eyebrow, title, body, align = "left", className = "" }) {
  const centered = align === "center";
  return (
    <Reveal className={`${centered ? "mx-auto text-center" : ""} max-w-2xl ${className}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="mt-3 text-[clamp(1.625rem,3vw,2.375rem)]">{title}</h2>
      <span className={`rule mt-5 ${centered ? "mx-auto" : ""}`} />
      {body && <p className="lead mt-5">{body}</p>}
    </Reveal>
  );
}

export default function PageHeader({ eyebrow, title, intro, image, action }) {
  return (
    <section className="border-b border-line bg-elevated">
      <div className="shell grid items-center gap-10 py-14 lg:grid-cols-[1.15fr_0.85fr] lg:py-20">
        <div>
          <Reveal>
            <p className="eyebrow">{eyebrow}</p>
            <h1 className="mt-4 text-[clamp(2rem,4.4vw,3.25rem)]">{title}</h1>
            <span className="rule mt-6" />
            {intro && <p className="lead mt-6">{intro}</p>}
            {action && <div className="mt-8 flex flex-wrap gap-3">{action}</div>}
          </Reveal>
        </div>
        {image && (
          <Reveal delay={0.12} y={24}>
            <img
              src={image}
              alt=""
              loading="eager"
              className="aspect-4/3 w-full rounded-full object-cover shadow-plate"
            />
          </Reveal>
        )}
      </div>
    </section>
  );
}
