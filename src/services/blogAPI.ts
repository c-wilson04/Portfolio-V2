import { BLOG_INDEX_URL } from "../config/blogSource"
import { blogPosts } from "../data/blogPosts"

export type BlogMeta = {
  slug: string
  title: string
  date: string
  excerpt: string
  hero?: string
  topics: string[]
  content?: string
}

export type RemoteBlogPost = {
  meta: BlogMeta
  body: string
  content: string
}

const fallbackMeta: BlogMeta[] = blogPosts.map((post) => ({
  slug: post.slug,
  title: post.title,
  date: post.date,
  excerpt: post.excerpt,
  hero: post.hero,
  topics: post.topics,
}))

const featuredMeta: BlogMeta[] = blogPosts
  .filter((post) => post.featured)
  .map(({ slug, title, date, excerpt, hero, topics }) => ({
    slug,
    title,
    date,
    excerpt,
    hero,
    topics,
  }))

export async function fetchBlogIndex(): Promise<BlogMeta[]> {
  const response = await fetch(BLOG_INDEX_URL)
  if (!response.ok) {
    throw new Error("Unable to download blog index")
  }
  const data = await response.json()
  if (!Array.isArray(data)) return fallbackMeta
  // Posts that live in this repo are always listed alongside the remote ones.
  const featured = featuredMeta.filter(
    (post) => !data.some((remote: BlogMeta) => remote.slug === post.slug)
  )
  return [...featured, ...data]
}

export async function fetchBlogPost(slug: string): Promise<RemoteBlogPost> {
  // Posts bundled in this repo render from local data, not the remote index.
  if (featuredMeta.some((post) => post.slug === slug)) {
    throw new Error("Post is bundled locally")
  }
  // Fetch the index to get metadata
  const index = await fetchBlogIndex()
  const post = index.find((p) => p.slug === slug)

  if (!post) {
    throw new Error("Post not found in index")
  }
  
  // Return the metadata from index.json with excerpt as body
  return {
    meta: post,
    body: post.excerpt,
    content: post.content ?? "",
  }
}

export { fallbackMeta }

