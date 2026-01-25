import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth.js";
import { useParentArea } from "./useParentArea.js";
import ParentGateModal from "./ParentGateModal.jsx";
import ParentDashboard from "./ParentDashboard.jsx";

export default function ParentMainPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const parent = useParentArea({
    token: user?.token,
    viewMode: "parent",
  });

  const handleClose = () => {
    navigate("/");
  };

  return (
    <div className="relative min-h-[60vh] flex items-center justify-center">
      {parent.gate.isUnlocked ? (
        <ParentDashboard token={user?.token} limit={10} />
      ) : (
        /* Overlay מעודכן - תואם ל-FinishModal */
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-fade-in transition-all duration-500">
          <ParentGateModal
            pin={parent.pin}
            setPinInput={parent.setPinInput}
            setPinConfirm={parent.setPinConfirm}
            onClose={handleClose}
            onSubmit={parent.submitPin}
            pinMode={parent.pinMode}
            onForgotPin={parent.handleForgotPin}
          />
        </div>
      )}
    </div>
  );
}
