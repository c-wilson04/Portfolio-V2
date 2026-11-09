import babelMd from "./posts/babel.md?raw"

export type BlogPost = {
  slug: string
  title: string
  date: string
  excerpt: string
  hero?: string
  topics: string[]
  content: string[]
  /** Always listed, even when the remote blog index loads. */
  featured?: boolean
  /** A standalone page to link to instead of blog-post.html. */
  href?: string
}

const BASE = import.meta.env.BASE_URL

// Posts that live in this repo. Others come from the blog repo's index
// (see config/blogSource.ts) and are merged in when it loads.
export const blogPosts: BlogPost[] = [
  {
    slug: "acropolis",
    title: "An Acropolis of Words",
    date: "October 2026",
    excerpt:
      "I talk, and a temple goes up. A step, then a column, then a roof. What building Living Diary has given me, and what it's for.",
    hero: `${BASE}acropolis/img/acropolis-finished.webp`,
    topics: ["Living Diary"],
    featured: true,
    href: `${BASE}acropolis/`,
    content: [],
  },
  {
    slug: "babel",
    title: "Babel: a tower made of words",
    date: "2026-09-28",
    excerpt:
      "A black-and-white theme for Living Diary where a tower rises as you write and comes down as you delete. Nothing is stored; every frame is worked out again from the word count and a seed.",
    hero: `${BASE}babel/hero.webp`,
    topics: ["Living Diary"],
    featured: true,
    content: [babelMd],
  },
]

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug)
}
