import PageHeader, { SectionHeading } from "../components/PageHeader.jsx";
import Reveal from "../components/Reveal.jsx";
import LightboxGallery from "../components/LightboxGallery.jsx";
import { achievements, missingAlbums } from "../data/gallery.js";
import { images } from "../data/assets.js";

const records = [
  { src: images.achievement_1, title: "Cyber Olympiad" },
  { src: images.achievement_2, title: "Football trophy" },
  { src: images.achievement_3, title: "Taekwondo" },
  { src: images.achievement_4, title: "Honours" },
  { src: images.achievement_5, title: "Academic results" },
  { src: images.achievement_6, title: "Inter-school events" },
  { src: images.achievement_7, title: "Sports meet" },
  { src: images.achievement_8, title: "Cultural events" },
];

export default function Achievements() {
  return (
    <>
      <PageHeader
        eyebrow="Results"
        title="Achievements"
        intro="Olympiad placements, the inter-school football trophy and national-level taekwondo — published by the school on its own noticeboard."
        image={images.achievement_2}
      />

      <section className="shell py-16 lg:py-20">
        <SectionHeading eyebrow="Noticeboard" title="Published achievement records" />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {records.map((record, index) => (
            <Reveal key={record.src} delay={index * 0.05} y={20}>
              <figure className="group border border-line bg-surface">
                <div className="overflow-hidden bg-sunken">
                  <img
                    src={record.src}
                    alt={record.title}
                    loading="lazy"
                    className="aspect-2/1 w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:scale-[1.035]"
                  />
                </div>
                <figcaption className="border-t border-line px-4 py-3 font-display text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-ink">
                  {record.title}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {achievements.length > 0 && (
        <section className="border-t border-line bg-sunken">
          <div className="shell py-16 lg:py-20">
            <SectionHeading eyebrow="Albums" title="From the school archives" />
            <div className="mt-12 space-y-14">
              {achievements.map((album, index) => (
                <Reveal key={album.slug} delay={index * 0.06}>
                  <div>
                    <h3 className="font-display text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-ink">
                      {album.title} · {album.images.length} {album.images.length === 1 ? "photograph" : "photographs"}
                    </h3>
                    <div className="mt-6">
                      <LightboxGallery
                        images={album.images}
                        altPrefix={album.title}
                        className={album.images.length < 4 ? "max-w-3xl lg:grid-cols-1" : "lg:grid-cols-4"}
                      />
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {missingAlbums.length > 0 && (
        <section className="shell py-12">
          <p className="border-l-2 border-accent bg-elevated p-5 text-[0.8125rem] leading-relaxed text-muted">
            No images could be retrieved for: {missingAlbums.join(", ")}. Those albums are listed on the official site only.
          </p>
        </section>
      )}
    </>
  );
}
