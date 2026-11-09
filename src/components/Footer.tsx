import { profile } from "../data/profile";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p>
          © {new Date().getFullYear()} {profile.name} · {profile.alias}
        </p>
        <p>
          Built with React and Three.js ·{" "}
          <a href={profile.repo} target="_blank" rel="noreferrer">
            Source
          </a>
        </p>
      </div>
    </footer>
  );
}
