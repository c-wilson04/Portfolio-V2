export type WorkItem = {
  id: string;
  name: string;
  when: string;
  /** Only set when the owner has said where it stands. */
  status?: "Wrapped" | "Archived" | "Active";
  role: string;
  summary: string;
  what: string;
  did: string[];
  learned: string;
  link?: { href: string; label: string };
};

const BASE = "/Portfolio-V2/";

// Ordered oldest to newest, so the timeline reads left to right.
// Anything in [PLACEHOLDER: ...] is waiting on the owner; nothing is guessed.
export const workItems: WorkItem[] = [
  {
    id: "qwrld",
    name: "Qwrld Visuals",
    when: "[PLACEHOLDER: YYYY – YYYY]",
    status: "Archived",
    role: "Artist: concept, 3D, and direction.",
    summary:
      "My personal art practice: immersive visual storytelling about identity, feeling, and narrative.",
    what: "My personal art practice, where emotional intelligence meets immersive visual storytelling. Every piece explored identity, feeling, and narrative, and aimed to be thoughtful, atmospheric, and deeply personal.",
    did: ["[PLACEHOLDER: pieces, tools, shows or posts worth naming]"],
    learned: "[PLACEHOLDER: one honest lesson]",
    link: {
      href: "https://www.instagram.com/qwrldvisuals/",
      label: "See the archive on Instagram",
    },
  },
  {
    id: "badgeup",
    name: "BadgeUp",
    when: "[PLACEHOLDER: YYYY – YYYY]",
    status: "Wrapped",
    role: "[PLACEHOLDER: your role]",
    summary:
      "A behavior-driven fitness app that turned consistent habits into a playful game.",
    what: "A behavior-driven fitness app built to make movement feel good. BadgeUp turned consistent habits into a playful game, rewarding small wins, shaping long-term progress, and keeping every level of user motivated with a sustainable feedback loop.",
    did: ["[PLACEHOLDER: what you built or decided: features, stack, design, users]"],
    learned: "[PLACEHOLDER: one honest lesson]",
    link: {
      href: "https://badgeupbetasite.vercel.app/",
      label: "Visit the beta site",
    },
  },
  {
    id: "blender-rag",
    name: "Blender Geometry Nodes + AI RAG Addon",
    when: "May 2025 – [PLACEHOLDER: end]",
    role: "Sole developer.",
    summary:
      "A Blender addon that gives context-aware AI suggestions for procedural 3D modeling.",
    what: "A Python-based Blender addon using a Retrieval-Augmented Generation (RAG) system to assist in procedural 3D modeling workflows.",
    did: [
      "Used ChromaDB for vector embeddings so suggestions come from relevant context.",
      "Put intelligent, inline modeling guidance directly in Blender's UI.",
    ],
    learned: "[PLACEHOLDER: one honest lesson]",
  },
  {
    id: "riva",
    name: "Rivers Intelligence: Riva Platform",
    when: "Aug 2025 – [PLACEHOLDER: end]",
    status: "Wrapped",
    role: "CTO.",
    summary:
      "An automation agent that acted as a dedicated assistant for a business.",
    what: "Riva was an automation agent that acted like a dedicated assistant for a business. It answered calls, followed up in real time, and reactivated leads with a human touch. Rivers Intelligence was a startup offering agentic AI solutions to businesses.",
    did: [
      "Led technical strategy and product development.",
      "Built and maintained a Next.js + TypeScript web application backed by Supabase, including a client-facing dashboard visualizing agent usage and task execution.",
      "Used Cursor and GitHub for version control and continuous delivery across teams.",
    ],
    learned: "[PLACEHOLDER: one honest lesson]",
    link: { href: "https://riversintelligence.com/", label: "Visit Rivers Intelligence" },
  },
  {
    id: "protein-ml",
    name: "Protein–Nucleic Acid Interaction Prediction",
    when: "Sept 2025 – Nov 2025",
    role: "Machine learning developer (course project).",
    summary:
      "Ensemble models that classify whether a protein binds DNA, RNA, both, or neither.",
    what: "Machine learning models that classify protein interactions with DNA, RNA, both (DRNA), or neither, trained on 8,795 protein sequences.",
    did: [
      "Extracted features from raw biological data with Biopython.",
      "Addressed class imbalance with oversampling and compared SVM, KNN, Gradient Boosting and MLP using 5-fold cross-validation (MCC, sensitivity, specificity, accuracy).",
      "Built voting and stacking ensembles that placed in the top 5 overall by average MCC and multi-class accuracy, and wrote a technical report.",
    ],
    learned: "[PLACEHOLDER: one honest lesson]",
  },
  {
    id: "capstone",
    name: "Multi-Sensor Object Detection & Tracking",
    when: "Sept 2025 – [PLACEHOLDER: end]",
    role: "Team member, senior capstone, under faculty supervision.",
    summary:
      "Detecting and tracking objects by fusing Doppler radar with RGB-D camera data.",
    what: "A multi-modal object detection system that integrates Doppler radar spectrograms with RGB-D camera data.",
    did: [
      "Extracted velocity and spatiotemporal features using the Doppler effect.",
      "Explored feature extraction, sensor fusion strategies and dataset generation, including real versus synthetic data for testing.",
      "Applied machine learning to target classification and tracking, working on system design, data analysis and experimental evaluation.",
    ],
    learned: "[PLACEHOLDER: one honest lesson]",
  },
  {
    id: "living-diary",
    name: "Living Diary",
    when: "2026 – now",
    status: "Active",
    role: "Solo: design, engineering, shaders.",
    summary:
      "A journal where writing drives a fullscreen procedural world, built in Rust and WGSL.",
    what: "A journal where writing drives a fullscreen procedural world. It is not an image generator: every frame is math and simulation, and the world only ever sees numbers, never your words.",
    did: [
      "Built a diary engine and a local voice engine (whisper.cpp), joined to a shader world only by signals.",
      "Wrote Babel, a theme where a tower rises as you write.",
    ],
    learned:
      "Keep input logic and world logic apart, and never let a signal the world reads step.",
    link: { href: `${BASE}blog-post.html?slug=babel`, label: "Read the Babel write-up" },
  },
];
