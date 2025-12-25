import { NavLink } from "react-router-dom";

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `pb-0.5 ${
          isActive
            ? "font-semibold text-pink-700 border-b-2 border-pink-500"
            : "text-gray-700 hover:text-pink-600"
        }`
      }
    >
      {children}
    </NavLink>
  );
}

export default function TopNav() {
  return (
    <nav className="hidden md:flex gap-4 text-sm">
      <NavItem to="/">Home</NavItem>
      <NavItem to="/recipes">Recipes</NavItem>
      <NavItem to="/favorites">My Favorites</NavItem>
      <NavItem to="/games">Learning Games</NavItem>
      <NavItem to="/progress">My Profile</NavItem>
    </nav>
  );
}
