import { useRef } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Now from "./components/Now";
import Projects from "./components/Projects";
import Visuals from "./components/Visuals";
import BlogSection from "./components/BlogSection";
import About from "./components/About";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";

function App() {
  // Easter egg: every 5 taps on the logo shifts the accent colour
  // (orange -> green -> violet -> orange).
  const taps = useRef(0);
  const onLogoTap = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    taps.current += 1;
    if (taps.current % 5 === 0) {
      const root = document.documentElement;
      const next = (Number(root.dataset.accent ?? 0) + 1) % 3;
      if (next === 0) delete root.dataset.accent;
      else root.dataset.accent = String(next);
    }
  };

  return (
    <>
      <Navbar onLogoTap={onLogoTap} />
      <main id="main">
        <Hero />
        <Now />
        <Visuals />
        <Projects />
        <BlogSection />
        <About />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}

export default App;
