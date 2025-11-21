import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import BlogPostPage from "./pages/BlogPostPage";
import "./blog.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BlogPostPage />
  </StrictMode>
);

