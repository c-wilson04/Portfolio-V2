export type Theme = "light" | "dark";

const KEY = "theme";

/** The theme the page is showing right now: the visitor's choice, else the system's. */
export function currentTheme(): Theme {
  const chosen = document.documentElement.getAttribute("data-theme");
  if (chosen === "light" || chosen === "dark") return chosen;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function setTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    // Private mode or blocked storage: the choice just won't be remembered.
  }
}
