import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// Only the navbar is React here; the article keeps its own styles.
import "./styles/fonts";
import "./styles/tokens.css";
import Navbar from "./components/Navbar";

createRoot(document.getElementById("nav")!).render(
  <StrictMode>
    <Navbar />
  </StrictMode>
);
