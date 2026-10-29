import PageHeader from "../components/PageHeader.jsx";
import Reveal from "../components/Reveal.jsx";
import { images } from "../data/assets.js";

export default function BooksList() {
  return (
    <>
      <PageHeader eyebrow="Session 2026 – 2027" title="List of Books" intro="The prescribed book list published by the school." />

      <section className="shell py-16 lg:py-20">
        <Reveal>
          <figure className="border border-line bg-surface p-4 sm:p-6">
            <img
              src={images.Books_List_2026_2027}
              alt="Prescribed book list for session 2026–2027"
              loading="lazy"
              className="w-full object-contain"
            />
            <figcaption className="mt-4 border-t border-line pt-4 text-[0.8125rem] text-muted">
              As published by the school. Confirm any change with the office before buying.
            </figcaption>
          </figure>
        </Reveal>
      </section>
    </>
  );
}
