import { profile } from "../data/profile";
import "./Now.css";

const BASE = import.meta.env.BASE_URL;

export default function Now() {
  return (
    <section className="section" id="now" aria-labelledby="now-title">
      <div className="container">
        <div className="section-head">
          <div>
            <p className="label">
              <b>01</b> Now
            </p>
            <h2 id="now-title">What I'm up to</h2>
          </div>
          <p className="label">Updated {profile.nowUpdated}</p>
        </div>
        <dl className="now-list">
          {profile.now.map((item) => (
            <div key={item.term} className="now-list__row">
              <dt>{item.term}</dt>
              <dd>
                {item.text}
                {"link" in item && item.link && (
                  <>
                    {" "}
                    <a href={`${BASE}${item.link.href}`}>{item.link.label}</a>.
                  </>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
