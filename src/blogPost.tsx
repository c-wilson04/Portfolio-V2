import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/fonts";
import "./styles/tokens.css";
import "./styles/base.css";
import BlogPostPage from "./pages/BlogPostPage";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BlogPostPage />
  </StrictMode>
);
