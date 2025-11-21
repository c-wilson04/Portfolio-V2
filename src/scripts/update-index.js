#!/usr/bin/env node

import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"

const postsDir = path.resolve("/Users/CW/Library/Mobile Documents/iCloud~md~obsidian/Documents/Blogs")
const indexPath = path.join(postsDir, "index.json")

const files = fs
  .readdirSync(postsDir)
  .filter((file) => file.endsWith(".md"))

const index = files
  .map((file) => {
    const slug = path.basename(file, ".md")
    const raw = fs.readFileSync(path.join(postsDir, file), "utf-8")
    const { data } = matter(raw)

    return {
      slug,
      title: data.title ?? slug,
      date: data.date ?? new Date().toISOString(),
      excerpt: data.excerpt ?? "",
      hero: data.hero ?? "",
      topics: Array.isArray(data.topics) ? data.topics : [],
    }
  })
  .sort((a, b) => new Date(b.date) - new Date(a.date))

fs.writeFileSync(indexPath, JSON.stringify(index, null, 2))
console.log(`Rebuilt ${index.length} post entries`)
