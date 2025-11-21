import "./ContactSection.css";

type MediaLink = {
  label: string;
  href: string;
  icon: string;
};

type ContactSectionProps = {
  mediaLinks: MediaLink[];
};

export default function ContactSection({ mediaLinks }: ContactSectionProps) {
  return (
    <section className="contact" id="Contact_">
      <div className="contact-container">
        <div className="contact-title">
          <p>Contact</p>
        </div>
        <div className="links">
          <div className="Media">
            <p className="subtitle">Mail:</p>
            <i className="fa-solid fa-envelope" />
            <a href="mailto:Charles.ikwilson@gmail.com">
              &nbsp;Charles.ikwilson@gmail.com
            </a>
          </div>
          <div className="Media">
            <p className="subtitle">Media:</p>
            <div className="link-items">
              {mediaLinks.map((media) => (
                <a
                  key={media.label}
                  href={media.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  <i className={media.icon} /> {media.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
