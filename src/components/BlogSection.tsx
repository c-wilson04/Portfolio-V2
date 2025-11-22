import "./BlogSection.css"
import { useBlogIndex } from "../hooks/useBlogIndex"

export default function BlogSection() {
  const posts = useBlogIndex()

  return (
    <section className="blog" id="Blog_">
      <div className="blog-heading">
        <p className="subtitle">Writes & Notes</p>
        <h2>Thoughts on data, art, and live experiences</h2>
        <p>
          Short reflections and process notes that keep me learning how to blend
          sculpture, code, and storytelling in the browser.
        </p>
      </div>
      <div className="blog-grid">
        {posts.map((post) => (
          <article key={post.title}>
            <p className="meta">{post.date}</p>
            <h3>{post.title}</h3>
            <p>{post.excerpt}</p>
            <div className="topic-row">
              {post.topics.map((topic) => (
                <span key={topic}>{topic}</span>
              ))}
            </div>
            <a className="blog-btn" href={`/blog-post.html?slug=${post.slug}`}>
              <span>Read Post</span>
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
      <div className="blog-cta">
        <a className="hero-link" href="/blog.html">
          View full blog
        </a>
      </div>
    </section>
  )
}

