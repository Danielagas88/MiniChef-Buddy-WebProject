/**
 * MainLayout
 *
 * App shell for authenticated routes: top Header and a main content area.
 * Wraps all in-app pages (home, recipes, session, games, etc.).
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Page content
 *
 * @component
 */
import Header from "./Header.jsx";

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-transparent text-inherit transition-colors duration-300">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-8">{children}</main>
    </div>
  );
}
