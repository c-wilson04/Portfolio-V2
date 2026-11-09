import { profile } from "../data/profile";
import "./About.css";

export default function About() {
  return (
    <section className="section" id="about" aria-labelledby="about-title">
      <div className="container">
        <div className="section-head">
          <div>
            <p className="label">
              <b>04</b> About
            </p>
            <h2 id="about-title">A bit about me</h2>
          </div>
        </div>
        <div className="about">
          <div className="about__bio">
            {profile.about.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="about__side">
            <div>
              <h3 className="label">Background</h3>
              <ol className="background">
                {profile.background.map((item) => (
                  <li key={`${item.when}-${item.what}`}>
                    <span className="background__when">{item.when}</span>
                    <span>
                      <span className="background__what">{item.what}</span>
                      <span className="background__where">{item.where}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <h3 className="label">Toolkit</h3>
              <dl className="toolkit">
                {profile.toolkit.map((row) => (
                  <div key={row.group}>
                    <dt>{row.group}</dt>
                    <dd>{row.items.join(", ")}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
