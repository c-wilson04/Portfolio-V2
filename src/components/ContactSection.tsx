import { useState } from "react";
import { profile } from "../data/profile";
import { CheckIcon, CopyIcon } from "./Icons";
import SocialLinks from "./SocialLinks";
import Terminal from "./Terminal";
import "./ContactSection.css";

export default function ContactSection() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked: the address is still on screen to select.
    }
  };

  return (
    <section className="section contact" id="contact" aria-labelledby="contact-title">
      <div className="container">
        <p className="label">
          <b>06</b> Contact
        </p>
        <h2 id="contact-title" className="contact__title">
          Say hello.
        </h2>
        <p className="contact__lede">
          I'm based in {profile.location}. Reach out about any of these, or just to talk about
          what you're building.
        </p>

        <ul className="help" id="help" aria-label="What you can reach out about">
          {profile.helpWith.map((item) => (
            <li key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </li>
          ))}
        </ul>

        <div className="contact__email">
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
          <button type="button" className="icon-btn" onClick={copy} aria-label="Copy email address">
            {copied ? <CheckIcon /> : <CopyIcon />}
          </button>
          <span className="visually-hidden" aria-live="polite">
            {copied ? "Email address copied" : ""}
          </span>
        </div>

        <SocialLinks className="contact__socials" />

        <div className="contact__terminal">
          <p className="label">Or, if you're curious</p>
          <Terminal />
        </div>
      </div>
    </section>
  );
}
