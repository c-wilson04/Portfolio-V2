import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { navLinks } from "../data/navLinks";
import { workItems } from "../data/work";
import { useFontAwesomeKit } from "../hooks/useFontAwesomeKit";
import "./WorkPage.css";

function idFromHash() {
  const id = window.location.hash.replace("#", "");
  return workItems.some((item) => item.id === id) ? id : workItems[workItems.length - 1].id;
}

export default function WorkPage() {
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);
  const [selected, setSelected] = useState(idFromHash);
  useFontAwesomeKit();

  useEffect(() => {
    const onHash = () => setSelected(idFromHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const pick = (id: string) => {
    setSelected(id);
    window.history.replaceState(null, "", `#${id}`);
  };

  const current = workItems.find((item) => item.id === selected) ?? workItems[0];

  return (
    <>
      <Navbar
        links={navLinks}
        isBurgerOpen={isBurgerOpen}
        toggleMenu={() => setIsBurgerOpen((prev) => !prev)}
        onLinkClick={() => setIsBurgerOpen(false)}
      />
      <div className="work-page">
        <header>
          <p className="subtitle">Work</p>
          <h1>What I built, and what I did on it</h1>
          <p>
            Pick a point on the timeline. Most of these are wrapped now, so this
            is the record: what each one was, my role, and what I took from it.
          </p>
        </header>

        <section className="work-card" aria-label="Timeline">
          <ol className="work-timeline">
            {workItems.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className={item.id === current.id ? "on" : ""}
                  aria-pressed={item.id === current.id}
                  onClick={() => pick(item.id)}
                >
                  <span className="dot" />
                  <span className="when">{item.when}</span>
                  <span className="name">{item.name}</span>
                </button>
              </li>
            ))}
          </ol>
        </section>

        <section className="work-card work-detail" aria-live="polite">
          <div className="work-meta">
            {current.status && <span className="chip">{current.status}</span>}
            <span className="when">{current.when}</span>
          </div>
          <h2>{current.name}</h2>
          <p className="what">{current.what}</p>
          {current.image && (
            <img
              className="work-image"
              src={current.image.src}
              alt={current.image.alt}
              loading="lazy"
            />
          )}
          <div className="work-grid">
            <div>
              <h3>My role</h3>
              <p>{current.role}</p>
            </div>
            <div>
              <h3>What I did</h3>
              <ul>
                {current.did.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3>What I took from it</h3>
              <p>{current.learned}</p>
            </div>
          </div>
          <div className="work-actions">
            {current.link && (
              <a className="project-btn" href={current.link.href}>
                <span>{current.link.label}</span>
              </a>
            )}
            <a className="hero-link" href="/Portfolio-V2/">
              Back home
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
