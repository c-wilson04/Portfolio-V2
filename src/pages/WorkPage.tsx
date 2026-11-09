import Footer from "../components/Footer";
import { ArrowRightIcon } from "../components/Icons";
import Navbar from "../components/Navbar";
import PageHeader from "../components/PageHeader";
import { workItems } from "../data/work";
import "./WorkPage.css";

const BASE = import.meta.env.BASE_URL;

export default function WorkPage() {
  return (
    <>
      <Navbar />
      <main id="main">
        <PageHeader
          label="Projects"
          title="Things I've built"
          back={{ href: `${BASE}#projects`, label: "Home" }}
        >
          <p>What each project was, what I did on it, and what I took from it. Newest first.</p>
        </PageHeader>

        <div className="container">
          <nav className="work-index" aria-label="Projects on this page">
            {workItems.map((item) => (
              <a key={item.id} href={`#${item.id}`}>
                {item.name}
              </a>
            ))}
          </nav>

          {workItems.map((item) => (
            <article key={item.id} id={item.id} className="work-item" aria-labelledby={`${item.id}-title`}>
              <div className="work-item__meta">
                <p className="label">{item.period ?? item.year}</p>
                <p className="work-item__role">{item.role}</p>
                {item.status && <p className="label">{item.status}</p>}
              </div>

              <div className="work-item__body">
                <h2 id={`${item.id}-title`}>{item.name}</h2>
                <p className="work-item__what">{item.what}</p>

                {item.image && (
                  <img
                    className="work-item__image"
                    src={item.image.src}
                    alt={item.image.alt}
                    loading="lazy"
                    decoding="async"
                  />
                )}

                {item.did && item.did.length > 0 && (
                  <div className="work-item__block">
                    <h3 className="label">What I did</h3>
                    <ul>
                      {item.did.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {item.learned && (
                  <div className="work-item__block">
                    <h3 className="label">What I took from it</h3>
                    <p>{item.learned}</p>
                  </div>
                )}

                {item.stack && (
                  <ul className="tags" aria-label="Built with">
                    {item.stack.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                )}

                {item.links && (
                  <div className="work-item__links">
                    {item.links.map((link) => (
                      <a key={link.href} className="arrow-link" href={link.href}>
                        {link.label}
                        <ArrowRightIcon />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
