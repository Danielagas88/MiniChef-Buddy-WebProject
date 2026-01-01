import Header from "./Header.jsx";

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-teal-100 to-amber-100 font-sans text-slate-800">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-8">{children}</main>
    </div>
  );
}
