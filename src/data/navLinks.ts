export const BASE = import.meta.env.BASE_URL; // "/Portfolio-V2/"

// Every item is a section of the home page; the full Projects and Writing
// pages are linked from those sections.
export const navLinks = [
  { label: "Now", href: `${BASE}#now` },
  { label: "Visuals", href: `${BASE}#visuals` },
  { label: "Projects", href: `${BASE}#projects` },
  { label: "Writing", href: `${BASE}#writing` },
  { label: "About", href: `${BASE}#about` },
  { label: "Contact", href: `${BASE}#contact` },
];
