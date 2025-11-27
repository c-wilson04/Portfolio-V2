import { BLOG_INDEX_URL } from "../config/blogSource"
import { blogPosts } from "../data/blogPosts"

export type BlogMeta = {
  slug: string
  title: string
  date: string
  excerpt: string
  hero?: string
  topics: string[]
}

export type RemoteBlogPost = {
  meta: BlogMeta
  body: string
}

const fallbackMeta: BlogMeta[] = blogPosts.map((post) => ({
  slug: post.slug,
  title: post.title,
  date: post.date,
  excerpt: post.excerpt,
  hero: post.hero,
  topics: post.topics,
}))

export async function fetchBlogIndex(): Promise<BlogMeta[]> {
  const response = await fetch(BLOG_INDEX_URL)
  if (!response.ok) {
    throw new Error("Unable to download blog index")
  }
  const data = await response.json()
  return Array.isArray(data) ? data : fallbackMeta
}

export async function fetchBlogPost(slug: string): Promise<RemoteBlogPost> {
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
    content: post.content,
  }
}

export { fallbackMeta }

