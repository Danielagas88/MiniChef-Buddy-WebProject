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
    <div className="animate-fade-in relative min-h-[500px]">
      {parent.gate.isUnlocked && (
        <ParentDashboard token={user?.token} limit={10} />
      )}

      {!parent.gate.isUnlocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10">
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
