import { lazy, Suspense, useCallback, useState } from "react";
import { profile } from "../data/profile";
import { ArrowRightIcon } from "./Icons";
import "./Hero.css";

// three.js is large, so it loads after the page is already readable.
const ModelViewer = lazy(() => import("./ModelViewer"));

const BASE = import.meta.env.BASE_URL;

export default function Hero() {
  const [modelReady, setModelReady] = useState(false);
  const onReady = useCallback(() => setModelReady(true), []);

  return (
    <section className="hero container" aria-labelledby="hero-title">
      <div className="hero__copy">
        <p className="label">{profile.tagline}</p>
        <h1 id="hero-title" className="hero__name">
          {profile.name}
        </h1>
        <p className="hero__intro">{profile.intro}</p>
        <p className="hero__invite">{profile.invite}</p>
        <div className="hero__actions">
          <a className="btn btn--primary" href={`mailto:${profile.email}`}>
            Say hello
            <ArrowRightIcon />
          </a>
          <a className="btn btn--ghost" href="#now">
            What I'm up to
          </a>
        </div>
      </div>

      <figure className="hero__figure">
        <div className="hero__stage">
          <img
            className={`hero__poster${modelReady ? " is-hidden" : ""}`}
            src={`${BASE}models/graffiti-plant-poster.webp`}
            alt=""
            width="720"
            height="840"
            decoding="async"
          />
          <Suspense fallback={null}>
            <ModelViewer
              src={`${BASE}models/graffiti-plant.glb`}
              label="3D model of a concrete planter covered in graffiti stickers, holding a leafy plant. Drag to turn it."
              onReady={onReady}
            />
          </Suspense>
        </div>
        <figcaption className="label">
          <b>Fig. 1</b> Graffiti planter · drag to turn
        </figcaption>
      </figure>
    </section>
  );
}
