import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AcropolisNav from "./components/AcropolisNav";

createRoot(document.getElementById("nav")!).render(
  <StrictMode>
    <AcropolisNav />
  </StrictMode>
);
