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
              ? "text-amber-600 border-amber-500"
              : "text-emerald-600 border-emerald-500"
          }`;
        }

        const hoverColor = isParent
          ? "hover:text-amber-500 dark:hover:text-amber-400 hover:border-amber-200"
          : "hover:text-emerald-500 dark:hover:text-emerald-400 hover:border-emerald-200";

        return `${baseClasses} text-[var(--text-primary)] border-transparent ${hoverColor}`;
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

      <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1"></div>

      <NavItem to="/parent-dashboard" isParent>
        Parent Dashboard
      </NavItem>
    </nav>
  );
}
