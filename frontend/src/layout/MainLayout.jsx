import Header from "./Header.jsx";

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-transparent text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-8">{children}</main>
    </div>
  );
}
