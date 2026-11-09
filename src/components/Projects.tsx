import { featuredWork, workItems } from "../data/work";
import { githubProfile, githubRepos } from "../data/repos";
import { ArrowRightIcon, ArrowUpRightIcon } from "./Icons";
import "./Projects.css";

const BASE = import.meta.env.BASE_URL;

export default function Projects() {
  const others = workItems.filter((item) => item.id !== featuredWork.id);

  return (
    <section className="section" id="projects" aria-labelledby="projects-title">
      <div className="container">
        <div className="section-head">
          <div>
            <p className="label">
              <b>02</b> Projects
            </p>
            <h2 id="projects-title">Things I've built</h2>
          </div>
          <a className="arrow-link" href={`${BASE}work.html`}>
            Full project notes
            <ArrowRightIcon />
          </a>
        </div>

        <article className="feature">
          {featuredWork.image && (
            <a className="feature__media" href={`${BASE}work.html#${featuredWork.id}`} tabIndex={-1} aria-hidden="true">
              <img
                src={featuredWork.image.src}
                alt=""
                width="1200"
                height="1200"
                loading="lazy"
                decoding="async"
              />
            </a>
          )}
          <div className="feature__body">
            <p className="label">
              {[featuredWork.year, featuredWork.roleShort, featuredWork.status].filter(Boolean).join(" · ")}
            </p>
            <h3>{featuredWork.name}</h3>
            <p>{featuredWork.what}</p>
            {featuredWork.stack && (
              <ul className="tags" aria-label="Built with">
                {featuredWork.stack.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            )}
            <div className="feature__links">
              {featuredWork.links?.map((link) => (
                <a key={link.href} className="arrow-link" href={link.href}>
                  {link.label}
                  <ArrowRightIcon />
                </a>
              ))}
            </div>
          </div>
        </article>

        <ul className="rows" aria-label="More projects">
          {others.map((item) => (
            <li key={item.id}>
              <a className="row" href={`${BASE}work.html#${item.id}`}>
                <span className="row__year">{item.year}</span>
                <span className="row__main">
                  <span className="row__title">{item.name}</span>
                  <span className="row__summary">{item.summary}</span>
                </span>
                <span className="row__role">{item.roleShort ?? ""}</span>
                <ArrowRightIcon className="row__arrow" />
              </a>
            </li>
          ))}
        </ul>

        <div className="repos">
          <div className="repos__head">
            <p className="label">Small things on GitHub</p>
            <a className="arrow-link" href={githubProfile} target="_blank" rel="noreferrer">
              All repositories
              <ArrowUpRightIcon />
            </a>
          </div>
          <ul className="repos__list">
            {githubRepos.map((repo) => (
              <li key={repo.link}>
                <a href={repo.link} target="_blank" rel="noreferrer">
                  {repo.title}
                </a>
                <span>{repo.description}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
