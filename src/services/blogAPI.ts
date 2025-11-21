import matter from "gray-matter"
import { BLOG_INDEX_URL, BLOG_POST_RAW_BASE } from "../config/blogSource"
import { blogPosts, BlogPost } from "../data/blogPosts"

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
  const response = await fetch(`${BLOG_POST_RAW_BASE}${slug}.md`)
  if (!response.ok) {
    throw new Error("Unable to download blog post")
  }
  const text = await response.text()
  const parsed = matter(text)
  const meta = {
    slug,
    title: parsed.data.title ?? slug,
    date: parsed.data.date ?? "",
    excerpt: parsed.data.excerpt ?? "",
    hero: parsed.data.hero ?? "",
    topics: Array.isArray(parsed.data.topics) ? parsed.data.topics : [],
  }
  return {
    meta,
    body: parsed.content,
  }
}

export { fallbackMeta }

