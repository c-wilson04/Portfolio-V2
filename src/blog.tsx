import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/fonts";
import "./styles/tokens.css";
import "./styles/base.css";
import BlogPage from "./pages/BlogPage";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BlogPage />
  </StrictMode>
);
