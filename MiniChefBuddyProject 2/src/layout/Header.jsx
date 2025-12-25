import { useNavigate } from "react-router-dom";
import Brand from "./Brand.jsx";
import TopNav from "./TopNav.jsx";
import AuthArea from "./AuthArea.jsx";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="bg-white bg-opacity-70 backdrop-blur shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Brand onClick={() => navigate("/")} />
        <TopNav />
        <AuthArea />
      </div>
    </header>
  );
}
