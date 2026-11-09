import { useEffect, useState } from "react"
import { fetchBlogIndex, localMeta, type BlogMeta } from "../services/blogAPI"

/** Local posts right away; remote posts are added when the blog index loads. */
export function useBlogIndex() {
  const [posts, setPosts] = useState<BlogMeta[]>(localMeta)

  useEffect(() => {
    let cancelled = false
    fetchBlogIndex()
      .then((data) => {
        if (!cancelled) setPosts(data)
      })
      .catch(() => {
        // Keep the local posts.
      })
    return () => {
      cancelled = true
    }
  }, [])

  return posts
}
