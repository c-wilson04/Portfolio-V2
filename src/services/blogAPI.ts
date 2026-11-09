import { BLOG_INDEX_URL } from "../config/blogSource"
import { blogPosts } from "../data/blogPosts"
import { dateKey } from "../lib/dates"

export type BlogMeta = {
  slug: string
  title: string
  date: string
  excerpt: string
  hero?: string
  topics: string[]
  content?: string
  href?: string
}

export type RemoteBlogPost = {
  meta: BlogMeta
  body: string
  content: string
}

const byDateDesc = (a: BlogMeta, b: BlogMeta) => dateKey(b.date) - dateKey(a.date)

/** Posts bundled in this repo; shown immediately, before the remote index loads. */
export const localMeta: BlogMeta[] = blogPosts
  .map(({ slug, title, date, excerpt, hero, topics, href }) => ({
    slug,
    title,
    date,
    excerpt,
    hero,
    topics,
    href,
  }))
  .sort(byDateDesc)

export async function fetchBlogIndex(): Promise<BlogMeta[]> {
  const response = await fetch(BLOG_INDEX_URL)
  if (!response.ok) {
    throw new Error("Unable to download blog index")
  }
  const data: unknown = await response.json()
  if (!Array.isArray(data)) return localMeta
  const remote = data as BlogMeta[]
  // Local posts are always listed; a remote post with the same slug wins.
  const local = localMeta.filter((post) => !remote.some((r) => r.slug === post.slug))
  return [...local, ...remote].sort(byDateDesc)
}

export async function fetchBlogPost(slug: string): Promise<RemoteBlogPost> {
  // Posts bundled in this repo render from local data, not the remote index.
  if (localMeta.some((post) => post.slug === slug)) {
    throw new Error("Post is bundled locally")
  }
  const index = await fetchBlogIndex()
  const post = index.find((p) => p.slug === slug)
  if (!post) {
    throw new Error("Post not found in index")
  }
  return {
    meta: post,
    body: post.excerpt,
    content: post.content ?? "",
  }
}
