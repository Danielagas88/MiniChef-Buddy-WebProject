import { NavLink } from "react-router-dom";

function NavItem({ to, children, isParent }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `pb-0.5 text-sm font-bold transition-all duration-200 border-b-2 ${
          isActive
            ? isParent
              ? "text-purple-700 border-purple-500"
              : "text-pink-600 border-pink-500"
            : "text-gray-500 border-transparent hover:text-pink-400"
        }`
      }
    >
      {children}
    </NavLink>
  );
}

export default function TopNav() {
  return (
    <nav className="hidden md:flex items-center gap-6">
      <NavItem to="/">Home</NavItem>
      <NavItem to="/recipes">Recipes</NavItem>
      <NavItem to="/favorites">My Favorites</NavItem>
      <NavItem to="/games">Games</NavItem>
      <NavItem to="/progress">My Profile</NavItem>
      <div className="w-px h-4 bg-gray-300 mx-2"></div>
      <NavItem to="/parent-dashboard" isParent>
        Parent Dashboard
      </NavItem>
    </nav>
  );
}
