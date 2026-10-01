import "./Projects.css";

const projectData = [
  {
    id: "badgeup",
    title: "BadgeUp",
    status: "Wrapped",
    role: "CEO",
    description:
      "A behavior-driven fitness app that turned consistent habits into a playful game, rewarding small wins and keeping every level of user motivated.",
  },
  {
    id: "riva",
    title: "Rivers Intelligence - Riva Platform",
    status: "Wrapped",
    role: "CTO",
    description:
      "An automation agent that acted like a dedicated assistant for a business: answering calls, following up in real time, and reactivating leads with a human touch.",
  },
  {
    id: "qwrld",
    title: "Qwrld Visuals",
    status: "Archived",
    role: "Artist",
    description:
      "My personal art practice: immersive visual storytelling about identity, feeling, and narrative, atmospheric and deeply personal.",
  },
];

const githubFeatured = {
  title: "Living Diary",
  description:
    "A Rust/wgpu journal where your writing drives a procedural WGSL world.",
  // The noat repo is private, so link the public write-up instead.
  link: "/Portfolio-V2/blog-post.html?slug=babel",
};

// Public repos only. Private ones (noat, BadgeUp, Global-Economy-Sim) would 404 for visitors.
const githubRepos = [
  {
    title: "callgraph",
    description: "Dynamic runtime call graph tracer for Python.",
    link: "https://github.com/c-wilson04/callgraph",
  },
  {
    title: "Music-Analysis-Project",
    description:
      "Uses your own music to work out what kind of listener you actually are.",
    link: "https://github.com/c-wilson04/Music-Analysis-Project",
  },
  {
    title: "Cloud-Security-Breach-Simulator",
    description:
      "Simulates and analyzes cloud security breaches to help businesses strengthen their defenses.",
    link: "https://github.com/c-wilson04/Cloud-Security-Breach-Simulator",
  },
  {
    title: "AI-Recipe-Web",
    description:
      "A Django recipe book with MongoDB storage and AI-powered recommendations.",
    link: "https://github.com/c-wilson04/AI-Recipe-Web",
  },
];

export default function Projects() {
  return (
    <section className="projects" id="Projects_">
      <div className="section-heading">
        <p className="subtitle">Selected Projects</p>
        <h2>Experimental work where data, art, and technology collide</h2>
        <p>
          I explore the space where emotion, design, and technology meet—and
          build experiences that live in that in-between.
        </p>
      </div>
      <article className="github-card">
        <p className="subtitle">New / On GitHub</p>
        <h3>{githubFeatured.title}</h3>
        <p>{githubFeatured.description}</p>
        {githubRepos.length > 0 && (
          <ul className="github-repos">
            {githubRepos.map((repo) => (
              <li key={repo.link}>
                <a href={repo.link} target="_blank" rel="noreferrer">
                  {repo.title}
                </a>{" "}
                {repo.description}
              </li>
            ))}
          </ul>
        )}
        <div className="github-actions">
          <a
            href={githubFeatured.link}
            className="project-btn"
          >
            <span>Read the Babel write-up</span>
          </a>
          <a
            href="https://github.com/c-wilson04?tab=repositories"
            target="_blank"
            rel="noreferrer"
            className="hero-link"
          >
            All my repos
          </a>
        </div>
      </article>
      <div className="project-grid">
        {projectData.map((project) => (
          <article key={project.title}>
            <p className="project-status">{project.status}</p>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <p className="project-role">My role: {project.role}</p>
            <a
              href={`${import.meta.env.BASE_URL}work.html#${project.id}`}
              className="project-btn"
            >
              <span>See the full story</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 8H15M15 8L8 1M15 8L8 15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
