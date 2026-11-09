import { useEffect, useId, useState } from "react";
import { BASE, navLinks } from "../data/navLinks";
import { CloseIcon, MenuIcon } from "./Icons";
import ThemeToggle from "./ThemeToggle";
import "./Navbar.css";

type NavbarProps = {
  /** Called when the logo is clicked on the home page (scroll to top + easter egg). */
  onLogoTap?: () => void;
};

export default function Navbar({ onLogoTap }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="nav">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="nav__inner">
        <a
          className="nav__logo"
          href={BASE}
          aria-label="Q.Wrld, home"
          onClick={(event) => {
            if (!onLogoTap) return;
            event.preventDefault();
            onLogoTap();
          }}
        >
          <span className="nav__slash">/</span>Q.Wrld
        </a>

        <nav className="nav__links" aria-label="Main">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="nav__tools">
          <ThemeToggle />
          <button
            type="button"
            className="icon-btn nav__menu-btn"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      <nav
        id={menuId}
        className={`nav__sheet${open ? " is-open" : ""}`}
        aria-label="Main"
        hidden={!open}
      >
        <ul>
          {navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
