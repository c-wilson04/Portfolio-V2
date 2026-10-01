import "./Resume.css";

// From the 1-26 data resume. Phone number and street details stay off the site.
const timeline = [
  {
    years: "Aug 2025 – Present",
    role: "CTO, Rivers Intelligence",
    line: "Lead technical strategy and product for a startup offering agentic AI solutions. Built a Next.js + TypeScript + Supabase app with a client dashboard for agent usage.",
  },
  {
    years: "Jun 2025 – Sept 2025",
    role: "AI Research Intern, 4K2",
    line: "Researched practical and impractical AI use cases, built a local n8n pipeline for image generation, and documented MCP workflows.",
  },
  {
    years: "Jun 2024 – Present",
    role: "Software Engineering Intern, Serco",
    line: "Built an automated testing tool for military software with FlaUI and NUnit in C#, cutting manual testing time.",
  },
  {
    years: "Expected May 2026",
    role: "B.S. Computer Science, Virginia Commonwealth University",
    line: "GPA 3.5/4.0. Focus on data science and machine learning.",
  },
];

const skills = [
  "TypeScript",
  "Python",
  "C#",
  "SQL",
  "scikit-learn",
  "PyTorch",
  "Pandas",
  "NumPy",
  "Docker",
  "Azure",
  "Git/GitHub",
  "n8n",
  "NUnit / FlaUI",
];

export default function Resume() {
  return (
    <section className="resume" id="Resume_">
      <p className="subtitle">Resume</p>
      <p className="resume-summary">
        Data science and machine learning student with a foundation in Python,
        statistical modeling, and feature engineering. I build end-to-end ML
        pipelines on real datasets, from ensembles to sensor fusion.
      </p>
      <ol className="timeline">
        {timeline.map((item) => (
          <li key={item.role}>
            <span className="years">{item.years}</span>
            <span className="role">{item.role}</span>
            <span className="line">{item.line}</span>
          </li>
        ))}
      </ol>
      <ul className="skill-list" aria-label="Skills">
        {skills.map((skill) => (
          <li key={skill}>{skill}</li>
        ))}
      </ul>
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
