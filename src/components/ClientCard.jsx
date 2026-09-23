import { Link } from "react-router-dom";
import { coverFor, posterSrcSet } from "../data/clients.js";
import { Kicker } from "./SectionHeading.jsx";

// Linked card for a client: cover image, category kicker, name.
export default function ClientCard({ client }) {
  const cover = coverFor(client);
  return (
    <Link to={`/work/${client.slug}`} className="group block">
      <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-mist">
        {cover && (
          <img
            src={cover}
            srcSet={cover === client.videos[0]?.poster ? posterSrcSet(client.videos[0]) : undefined}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            alt={`Still from ${client.name} video`}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        )}
      </div>
      <Kicker className="mt-4 text-ink/70">{client.category}</Kicker>
      <span className="mt-1 block font-heading text-xl font-bold tracking-tight underline decoration-transparent underline-offset-4 transition-colors group-hover:decoration-ink">
        {client.name}
      </span>
    </Link>
  );
}
