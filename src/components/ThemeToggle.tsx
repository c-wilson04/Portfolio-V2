import { useEffect, useState } from "react";
import { currentTheme, setTheme, type Theme } from "../lib/theme";
import { MoonIcon, SunIcon } from "./Icons";

export default function ThemeToggle() {
  const [theme, setThemeState] = useState<Theme>(() => currentTheme());

  // Follow the system setting until the visitor makes a choice.
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setThemeState(currentTheme());
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const next: Theme = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      className="icon-btn"
      onClick={() => {
        setTheme(next);
        setThemeState(next);
      }}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
