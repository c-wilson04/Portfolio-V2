import "./Navbar.css";

type NavLink = {
  label: string;
  href: string;
};

type NavbarProps = {
  links: NavLink[];
  isBurgerOpen: boolean;
  toggleMenu: () => void;
  onLinkClick: () => void;
};

export default function Navbar({
  links,
  isBurgerOpen,
  toggleMenu,
  onLinkClick,
}: NavbarProps) {
  return (
    <>
      <header className="navbar">
        <a className="title" href="/">
          /Q.Wrld
        </a>
        <div className="items">
          {links.map((link) => (
            <a key={link.href} href={link.href} onClick={onLinkClick}>
              {link.label}
            </a>
          ))}
        </div>
        <button
          type="button"
          aria-label="Toggle navigation"
          className="burger-menu-btn"
          onClick={toggleMenu}
        >
          <i className="fa-solid fa-bars" />
        </button>
      </header>
      <nav className={`burger-menu ${isBurgerOpen ? "open" : ""}`}>
        <ul>
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} onClick={onLinkClick}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}

