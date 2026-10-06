import { useState } from "react";
import Navbar from "./Navbar";
import { navLinks } from "../data/navLinks";
import { useFontAwesomeKit } from "../hooks/useFontAwesomeKit";

// The Acropolis article is static HTML in acropolis/index.html; only the
// shared site navbar is rendered by React.
export default function AcropolisNav() {
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);
  useFontAwesomeKit();

  return (
    <Navbar
      links={navLinks}
      isBurgerOpen={isBurgerOpen}
      toggleMenu={() => setIsBurgerOpen((prev) => !prev)}
      onLinkClick={() => setIsBurgerOpen(false)}
    />
  );
}
