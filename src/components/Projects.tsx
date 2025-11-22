import "./Projects.css";

const projectData = [
  {
    title: "BadgeUp",
    description:
      "A behavior-driven fitness app built to make movement feel good. BadgeUp turns consistent habits into a playful game—rewarding small wins, shaping long-term progress, and keeping every level of user motivated with a sustainable, feel-good feedback loop.",
    link: "https://badgeupbetasite.vercel.app/", // Add your project link here
  },
  {
    title: "Rivers Intelligence - Riva Platform",
    description:
      "Riva is an advanced automation agent that acts like a dedicated assistant for your business. It answers calls, follows up in real time, and speaks with an uncannily human touch—reactivating leads, surfacing opportunities, and opening new conversations without missing a beat..",
    link: "https://riversintelligence.com/", // Add your project link here
  },
  {
    title: "Qwrld Visuals",
    description:
      "My personal art practice, where emotional intelligence meets immersive visual storytelling. Every piece explores identity, feeling, and narrative—resulting in work that's thoughtful, atmospheric, and deeply personal.",
    link: "https://www.instagram.com/qwrldvisuals/", // Add your project link here
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
      <div className="project-grid">
        {projectData.map((project) => (
          <article key={project.title}>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <a href={project.link} target="_blank" className="project-btn">
              <span>Explore Project</span>
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
