import Header from "./Header.jsx";

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-yellow-50 to-orange-100 font-sans">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">{children}</main>
    </div>
  );
}
