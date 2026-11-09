const BASE = import.meta.env.BASE_URL;

/** Where a post lives: its own page if it has one, else the post template. */
export const postHref = (post: { slug: string; href?: string }) =>
  post.href ?? `${BASE}blog-post.html?slug=${encodeURIComponent(post.slug)}`;
