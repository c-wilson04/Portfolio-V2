import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Footer from "../components/Footer";
import { ArrowLeftIcon, ArrowRightIcon } from "../components/Icons";
import Navbar from "../components/Navbar";
import { getBlogPostBySlug } from "../data/blogPosts";
import { profile } from "../data/profile";
import { formatPostDate } from "../lib/dates";
import { fetchBlogPost, type RemoteBlogPost } from "../services/blogAPI";
import "./BlogPostPage.css";

const BASE = import.meta.env.BASE_URL;

type Status = "loading" | "ready" | "missing";

function slugFromUrl() {
  return new URLSearchParams(window.location.search).get("slug");
}

export default function BlogPostPage() {
  const [slug] = useState(slugFromUrl);
  const local = slug ? getBlogPostBySlug(slug) : undefined;
  const [remote, setRemote] = useState<RemoteBlogPost | null>(null);
  const [status, setStatus] = useState<Status>(local ? "ready" : slug ? "loading" : "missing");
  const [showHero, setShowHero] = useState(true);

  // Posts with their own page (like the Acropolis article) live there.
  useEffect(() => {
    if (local?.href) window.location.replace(local.href);
  }, [local]);

  useEffect(() => {
    if (!slug || local) return;
    let cancelled = false;
    fetchBlogPost(slug)
      .then((post) => {
        if (cancelled) return;
        setRemote(post);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("missing");
      });
    return () => {
      cancelled = true;
    };
  }, [slug, local]);

  const title = local?.title ?? remote?.meta.title;
  const date = local?.date ?? remote?.meta.date;
  // Bundled posts carry their hero inside the markdown; remote ones don't.
  const hero = local ? undefined : remote?.meta.hero;
  const content = local ? local.content.join("\n\n") : remote?.content ?? "";

  useEffect(() => {
    if (title) document.title = `${title} · ${profile.name}`;
    else if (status === "missing") document.title = `Post not found · ${profile.name}`;
  }, [title, status]);

  return (
    <>
      <Navbar />
      <main id="main" className="post">
        <div className="post__inner container">
          <a className="post__back" href={`${BASE}blog.html`}>
            <ArrowLeftIcon />
            All writing
          </a>

          {status === "loading" && <p className="post__status label">Loading…</p>}

          {status === "missing" && (
            <div className="post__missing">
              <h1>That post isn't here.</h1>
              <p>It may have moved. Everything I've written is on the writing page.</p>
              <a className="btn btn--ghost" href={`${BASE}blog.html`}>
                Go to all writing
              </a>
            </div>
          )}

          {status === "ready" && title && (
            <article>
              <header className="post__head">
                {date && <time className="label">{formatPostDate(date)}</time>}
                <h1>{title}</h1>
              </header>
              {hero && showHero && (
                <img className="post__hero" src={hero} alt="" decoding="async" onError={() => setShowHero(false)} />
              )}
              <div className="prose">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    img: ({ src, alt, title: imgTitle }) => (
                      <img src={src} alt={alt ?? ""} title={imgTitle} loading="lazy" decoding="async" />
                    ),
                  }}
                >
                  {content}
                </ReactMarkdown>
              </div>
              <footer className="post__end">
                <p>
                  Thanks for reading. If this sparked something,{" "}
                  <a href={`mailto:${profile.email}`}>say hello</a>.
                </p>
                <a className="arrow-link" href={`${BASE}blog.html`}>
                  More writing
                  <ArrowRightIcon />
                </a>
              </footer>
            </article>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
