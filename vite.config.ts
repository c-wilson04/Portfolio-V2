import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  base: '/Portfolio-V2/', // GitHub Pages serves the site from /<repo name>/
  build: {
    // three.js (~590 kB) is its own chunk, loaded lazily after the page paints.
    chunkSizeWarningLimit: 650,
    rollupOptions: {
      input: {
        main: './index.html',
        blog: './blog.html',
        blogPost: './blog-post.html',
        work: './work.html',
        acropolis: './acropolis/index.html',
      },
    },
  },
})
