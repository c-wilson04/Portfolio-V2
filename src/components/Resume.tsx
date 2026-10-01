import "./Resume.css";

// [PLACEHOLDER] replace with real entries once supplied
const timeline = [
  { years: "[PLACEHOLDER: YYYY–YYYY]", role: "[PLACEHOLDER: Role, Company]", line: "[PLACEHOLDER: one line]" },
  { years: "[PLACEHOLDER: YYYY–YYYY]", role: "[PLACEHOLDER: Role, Company]", line: "[PLACEHOLDER: one line]" },
  { years: "[PLACEHOLDER: YYYY–YYYY]", role: "[PLACEHOLDER: Role, Company]", line: "[PLACEHOLDER: one line]" },
];

export default function Resume() {
  return (
    <section className="resume" id="Resume_">
      <p className="subtitle">Resume</p>
      <ol className="timeline">
        {timeline.map((item, i) => (
          <li key={i}>
            <span className="years">{item.years}</span>
            <span className="role">{item.role}</span>
            <span className="line">{item.line}</span>
          </li>
        ))}
      </ol>
      <a
        className="project-btn resume-btn"
        href={`${import.meta.env.BASE_URL}resume.pdf`}
        download
      >
        <span>Download PDF</span>
      </a>
    </section>
  );
}
