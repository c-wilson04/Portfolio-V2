import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import BlogPage from "./pages/BlogPage";
import "./blog.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BlogPage />
  </StrictMode>
);
