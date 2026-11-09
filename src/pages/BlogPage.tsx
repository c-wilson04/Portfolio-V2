import { useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import PageHeader from "../components/PageHeader";
import { useBlogIndex } from "../hooks/useBlogIndex";
import { formatPostDate } from "../lib/dates";
import { postHref } from "../lib/posts";
import type { BlogMeta } from "../services/blogAPI";
import "./BlogPage.css";

const BASE = import.meta.env.BASE_URL;

function PostCard({ post }: { post: BlogMeta }) {
  // Some remote posts point at images that were never published; hide those.
  const [showImage, setShowImage] = useState(Boolean(post.hero));

  return (
    <li>
      <a className="post-card" href={postHref(post)}>
        <span className="post-card__media">
          {showImage && post.hero ? (
            <img src={post.hero} alt="" loading="lazy" decoding="async" onError={() => setShowImage(false)} />
          ) : (
            <span className="post-card__placeholder" aria-hidden="true">
              /Q
            </span>
          )}
        </span>
        <span className="post-card__body">
          <time className="label">{formatPostDate(post.date)}</time>
          <span className="post-card__title">{post.title}</span>
          <span className="post-card__excerpt">{post.excerpt}</span>
        </span>
      </a>
    </li>
  );
}

export default function BlogPage() {
  const posts = useBlogIndex();

  return (
    <>
      <Navbar />
      <main id="main">
        <PageHeader label="Writing" title="Notes and write-ups" back={{ href: `${BASE}#writing`, label: "Home" }}>
          <p>Write-ups of what I'm building, and notes on what I'm learning along the way.</p>
        </PageHeader>
        <div className="container">
          <ul className="post-grid">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </ul>
        </div>
      </main>
      <Footer />
    </>
  );
}
