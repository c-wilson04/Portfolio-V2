# Q.Wrld

The personal site of Charles Wilson: what I'm working on, things I've built,
and writing. Live at <https://c-wilson04.github.io/Portfolio-V2/>.

Built with React, TypeScript and Vite. The hero is a three.js model,
loaded after the page so the text shows first.

## Updating the content

Most changes are a single file:

| What | Where |
| --- | --- |
| Intro, Now section, About, background, toolkit, links | `src/data/profile.ts` |
| Projects (home page list and the Projects page) | `src/data/work.ts` |
| Small GitHub repos | `src/data/repos.ts` |
| Posts bundled in this repo | `src/data/blogPosts.ts`, `src/data/posts/` |

Other posts come from the blog repo's index (`src/config/blogSource.ts`).
Leave a field out rather than filling it with a placeholder; empty fields
are not shown.

## Pages

- `index.html`: home (`src/App.tsx`)
- `work.html`: Projects (`src/pages/WorkPage.tsx`)
- `blog.html`: Writing (`src/pages/BlogPage.tsx`)
- `blog-post.html?slug=…`: a post (`src/pages/BlogPostPage.tsx`)
- `acropolis/`: the "An Acropolis of Words" article, static HTML

Light and dark themes share the tokens in `src/styles/tokens.css`.

## Commands

```sh
npm install
npm run dev      # local dev server
npm run build    # type-check and build to dist/
npm run lint
npm run deploy   # build and publish dist/ to the gh-pages branch
```

## Licence

Code: all rights reserved. Articles and their images: CC BY 4.0. See
[LICENSE](LICENSE).
