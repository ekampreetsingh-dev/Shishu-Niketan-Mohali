import PageHeader, { SectionHeading } from "../components/PageHeader.jsx";
import Reveal from "../components/Reveal.jsx";
import LightboxGallery from "../components/LightboxGallery.jsx";
import { news } from "../data/school.js";
import { images } from "../data/assets.js";
import { OFFICIAL_SITE } from "../config.js";

const newsPhotos = Array.from({ length: 8 }, (_, i) => images[`news_news${i + 1}`]).filter(Boolean);

export default function News() {
  return (
    <>
      <PageHeader eyebrow="School magazine" title="In The News" intro="Results and events recorded by the school." />

      <section className="shell py-16 lg:py-20">
        <SectionHeading eyebrow="Verified entry" title="What is on record" />
        <ul className="mt-10 space-y-px border border-line bg-line-soft">
          {news.map((item, index) => (
            <Reveal as="li" key={item.title} delay={index * 0.06} className="bg-surface">
              <article className="grid gap-6 p-7 sm:grid-cols-[1fr_0.45fr] sm:items-start">
                <div>
                  <p className="eyebrow">{item.date}</p>
                  <h3 className="mt-3 text-[1.25rem]">{item.title}</h3>
                  <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted">{item.body}</p>
                  <p className="mt-3 text-[0.875rem] leading-relaxed text-muted">{item.detail}</p>
                </div>
                <img
                  src={item.cover}
                  alt={item.title}
                  loading="lazy"
                  className="aspect-3/4 w-full rounded-full object-cover"
                />
              </article>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={0.1}>
          <p className="mt-8 max-w-3xl border-l-2 border-accent bg-elevated p-5 text-[0.8125rem] leading-relaxed text-muted">
            Further news items are published only on the official site, without captions for each photograph. Newer entries
            appear at{" "}
            <a href={`${OFFICIAL_SITE}/news`} target="_blank" rel="noreferrer" className="font-semibold text-ink underline">
              shishuniketanmohali.org.in/news
            </a>
            .
          </p>
        </Reveal>
      </section>

      <section className="border-t border-line bg-sunken">
        <div className="shell py-16 lg:py-20">
          <SectionHeading eyebrow="Photographs" title="From the news archive" />
          <div className="mt-12">
            <LightboxGallery images={newsPhotos} altPrefix="School news photograph" className="lg:grid-cols-4" />
          </div>
        </div>
      </section>
    </>
  );
}
