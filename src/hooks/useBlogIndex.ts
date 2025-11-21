import { useEffect, useState } from "react"
import { fetchBlogIndex, fallbackMeta, BlogMeta } from "../services/blogAPI"

export function useBlogIndex() {
  const [posts, setPosts] = useState<BlogMeta[]>(fallbackMeta)

  useEffect(() => {
    fetchBlogIndex()
      .then((data) => setPosts(data))
      .catch(() => {
        // keep fallback data
      })
  }, [])

  return posts
}

