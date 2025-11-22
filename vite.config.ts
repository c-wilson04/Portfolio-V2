import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  base: '/Portfolio-V2/', // ← Add this (your repo name)
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        blog: './blog.html',
        blogPost: './blog-post.html',
      },
    },
  },
})
