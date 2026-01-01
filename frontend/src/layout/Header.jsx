import { useNavigate } from "react-router-dom";
import Brand from "./Brand.jsx";
import TopNav from "./TopNav.jsx";
import AuthArea from "./AuthArea.jsx";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-white bg-opacity-80 backdrop-blur-md shadow-sm border-b border-emerald-50 transition-all">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Brand onClick={() => navigate("/")} />
        <TopNav />
        <AuthArea />
      </div>
    </header>
  );
}
