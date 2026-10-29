import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { feePath } from "../data/navigation.js";

export default function NotFound() {
  return (
    <section className="shell grid min-h-[60vh] place-items-center py-20">
      <div className="max-w-md text-center">
        <p className="eyebrow">404</p>
        <h1 className="mt-4 text-[clamp(2rem,5vw,3rem)]">That page has moved</h1>
        <p className="lead mt-5">
          The page you asked for isn't part of this site. The school's own website may still hold it.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link to="/" className="btn btn-primary">
            <ArrowLeft size={15} /> Back home
          </Link>
          <Link to={feePath} className="btn btn-ghost">
            Fee payment
          </Link>
        </div>
      </div>
    </section>
  );
}
