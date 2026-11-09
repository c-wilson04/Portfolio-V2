import { profile } from "../data/profile";
import { ArrowUpRightIcon } from "./Icons";
import LoopVideo from "./LoopVideo";
import "./Visuals.css";

const BASE = import.meta.env.BASE_URL;

export default function Visuals() {
  const { heading, text, piece } = profile.visuals;
  const instagram = profile.socials.find((social) => social.icon === "instagram");

  return (
    <section className="section" id="visuals" aria-labelledby="visuals-title">
      <div className="container visuals">
        <div className="visuals__copy">
          <p className="label">
            <b>03</b> Visuals
          </p>
          <h2 id="visuals-title">{heading}</h2>
          <p className="visuals__text">{text}</p>
          <div className="visuals__piece">
            <h3>{piece.title}</h3>
            <p className="label">
              {piece.tools} · {piece.year}
            </p>
            <blockquote className="visuals__statement">
              <p>{piece.statement}</p>
            </blockquote>
          </div>
          {instagram && (
            <a className="arrow-link" href={instagram.href} target="_blank" rel="noreferrer">
              More on Instagram
              <ArrowUpRightIcon />
            </a>
          )}
        </div>
        <figure className="visuals__figure">
          <LoopVideo src={`${BASE}${piece.video}`} poster={`${BASE}${piece.poster}`} label={piece.alt} />
          <figcaption className="label">
            <b>Fig. 2</b> {piece.title} · {piece.year}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
