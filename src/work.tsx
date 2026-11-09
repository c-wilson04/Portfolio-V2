import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/fonts";
import "./styles/tokens.css";
import "./styles/base.css";
import WorkPage from "./pages/WorkPage";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WorkPage />
  </StrictMode>
);
