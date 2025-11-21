import { useState } from "react";
import Navbar from "../components/Navbar";
import { navLinks } from "../data/navLinks";
import { useBlogIndex } from "../hooks/useBlogIndex";
import { useFontAwesomeKit } from "../hooks/useFontAwesomeKit";
import "./BlogPage.css";

export default function BlogPage() {
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);
  useFontAwesomeKit();
  const posts = useBlogIndex();

  const closeBurger = () => setIsBurgerOpen(false);
  const toggleBurger = () => setIsBurgerOpen((prev) => !prev);

  return (
    <>
      <Navbar
        links={navLinks}
        isBurgerOpen={isBurgerOpen}
        toggleMenu={toggleBurger}
        onLinkClick={closeBurger}
      />
      <div className="blog-page">
        <header>
          <p className="subtitle">Blog</p>
          <h1>Dispatches from Q.Wrld</h1>
          <p>
            Thought pieces, experiments, and write-ups from the cross-section of
            art, data, and real-time experiences.
          </p>
        </header>
        <section className="blog-list">
          {posts.map((post) => (
            <article key={post.title}>
              <div className="blog-card-header">
                <p className="meta">{post.date}</p>
                <div className="topic-row">
                  {post.topics.map((topic) => (
                    <span key={topic}>{topic}</span>
                  ))}
                </div>
              </div>
              <h2>{post.title}</h2>
              <p>{post.excerpt}</p>
              <a
                className="read-link"
                href={`/blog-post.html?slug=${post.slug}`}
              >
                Continue reading →
              </a>
            </article>
          ))}
        </section>
      </div>
    </>
  );
}
