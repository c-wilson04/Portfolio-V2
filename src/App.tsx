import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Projects from "./components/Projects";
import BlogSection from "./components/BlogSection";
import ContactSection from "./components/ContactSection";
import { navLinks } from "./data/navLinks";
import { useFontAwesomeKit } from "./hooks/useFontAwesomeKit";

const mediaLinks = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/charles-wilson-71773725b/",
    icon: "fa-brands fa-linkedin",
  },
  {
    label: "GitHub",
    href: "https://github.com/c-wilson04",
    icon: "fa-brands fa-github",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/qwrldvisuals/",
    icon: "fa-brands fa-instagram",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@yeadattq", // Add your YouTube channel URL
    icon: "fa-brands fa-youtube",
  },
];

function App() {
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);

  useFontAwesomeKit();

  const closeBurger = () => setIsBurgerOpen(false);
  const toggleBurger = () => setIsBurgerOpen((prev) => !prev);

  return (
    <div className="app-shell">
      <Navbar
        links={navLinks}
        isBurgerOpen={isBurgerOpen}
        toggleMenu={toggleBurger}
        onLinkClick={closeBurger}
      />
      <main>
        <Hero />
        <Projects />
        <BlogSection />
        <ContactSection mediaLinks={mediaLinks} />
      </main>
    </div>
  );
}

export default App;
