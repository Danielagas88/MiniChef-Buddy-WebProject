import { NavLink } from "react-router-dom";

function NavItem({ to, children, isParent }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => {
        const baseClasses =
          "pb-1 text-sm font-bold transition-all duration-300 border-b-2 flex-shrink-0";

        if (isActive) {
          return `${baseClasses} ${
            isParent
              ? "text-(--accent-amber) border-(--accent-amber)"
              : "text-(--accent-emerald) border-(--accent-emerald)"
          }`;
        }

        const hoverStyles = isParent
          ? "hover:text-(--accent-amber) hover:border-(--accent-amber)"
          : "hover:text-(--accent-emerald) hover:border-(--accent-emerald)";

        return `${baseClasses} text-(--text-primary) border-transparent ${hoverStyles}`;
      }}
    >
      {children}
    </NavLink>
  );
}

export default function TopNav() {
  return (
    <nav className="hidden lg:flex items-center gap-4">
      <NavItem to="/">Home</NavItem>
      <NavItem to="/recipes">Recipes</NavItem>
      <NavItem to="/favorites">My Favorites</NavItem>
      <NavItem to="/games">Games</NavItem>
      <NavItem to="/progress">My Profile</NavItem>

      <div className="w-px h-5 bg-(--border-color) mx-1" />

      <NavItem to="/parent-dashboard" isParent>
        Parent Dashboard
      </NavItem>
    </nav>
  );
}
