import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Navbar from "../components/Navbar";
import { getBlogPostBySlug } from "../data/blogPosts";
import { navLinks } from "../data/navLinks";
import { useFontAwesomeKit } from "../hooks/useFontAwesomeKit";
import { fetchBlogPost } from "../services/blogAPI";
import type { RemoteBlogPost } from "../services/blogAPI";
import "./BlogPostPage.css";

function getSlugFromSearch() {
  if (typeof window === "undefined") {
    return null;
  }
  const params = new URLSearchParams(window.location.search);
  console.log(params.get("slug"));
  return params.get("slug");
}

export default function BlogPostPage() {
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);
  useFontAwesomeKit();

  const [remotePost, setRemotePost] = useState<RemoteBlogPost | null>(null);
  const slug = getSlugFromSearch();
  const fallbackPost = slug ? getBlogPostBySlug(slug) : null;

  const closeBurger = () => setIsBurgerOpen(false);
  const toggleBurger = () => setIsBurgerOpen((prev) => !prev);

  useEffect(() => {
    if (!slug) {
      return;
    }
    fetchBlogPost(slug)
      .then((post) => setRemotePost(post))
      .catch(() => setRemotePost(null));
  }, [slug]);

  return (
    <>
      <Navbar
        links={navLinks}
        isBurgerOpen={isBurgerOpen}
        toggleMenu={toggleBurger}
        onLinkClick={closeBurger}
      />
      <main className="blog-post-page">
      <p>{remotePost?.meta.title}</p>
        {remotePost || fallbackPost ? (
          <article>
            {remotePost?.meta.hero && (
              <div
                className="hero-image"
                style={{ backgroundImage: `url(${remotePost.meta.hero})` }}
              />
            )}
            <div className="post-meta">
              <p className="meta">
                {remotePost ? remotePost.meta.date : fallbackPost?.date}
              </p>
              <div className="topic-row">
                {(remotePost
                  ? remotePost.meta.topics
                  : fallbackPost?.topics ?? []
                ).map((topic) => (
                  <span key={topic}>{topic}</span>
                ))}
              </div>
            </div>
            <h1>{remotePost ? remotePost.meta.title : fallbackPost?.title}</h1>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              className="markdown-body"
            >
              {remotePost
                ? remotePost.content
                : fallbackPost
                ? fallbackPost.content.join("\n\n")
                : ""}
            </ReactMarkdown>
          </article>
        ) : (
          <div className="post-missing">
            <p>We couldn’t find that post.</p>
            <a className="hero-link" href="/Portfolio-V2/blog.html">
              Return to blog index
            </a>
          </div>
        )}
      </main>
    </>
  );
}
