import { useBlogIndex } from "../hooks/useBlogIndex";
import { formatPostDate } from "../lib/dates";
import { postHref } from "../lib/posts";
import { ArrowRightIcon } from "./Icons";
import "./BlogSection.css";

const BASE = import.meta.env.BASE_URL;

export default function BlogSection() {
  const posts = useBlogIndex().slice(0, 3);

  return (
    <section className="section" id="writing" aria-labelledby="writing-title">
      <div className="container">
        <div className="section-head">
          <div>
            <p className="label">
              <b>03</b> Writing
            </p>
            <h2 id="writing-title">Notes and write-ups</h2>
          </div>
          <a className="arrow-link" href={`${BASE}blog.html`}>
            All writing
            <ArrowRightIcon />
          </a>
        </div>
        <ul className="posts">
          {posts.map((post) => (
            <li key={post.slug}>
              <a className="post-row" href={postHref(post)}>
                <time className="post-row__date">{formatPostDate(post.date)}</time>
                <span className="post-row__main">
                  <span className="post-row__title">{post.title}</span>
                  <span className="post-row__excerpt">{post.excerpt}</span>
                </span>
                <ArrowRightIcon className="post-row__arrow" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
