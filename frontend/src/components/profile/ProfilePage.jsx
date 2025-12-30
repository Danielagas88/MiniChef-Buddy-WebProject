import { useAuth } from "../../hooks/useAuth.js";
import { useParentArea } from "../../hooks/useParentArea.js";
import ParentGateModal from "./ParentGateModal.jsx";
import ParentDashboard from "./ParentDashboard.jsx";
import ChildProfile from "./ChildProfile.jsx";

export default function ProgressPage() {
  const { user, viewMode } = useAuth();

  const parent = useParentArea({
    token: user?.token,
    viewMode,
  });

  if (!user) {
    return (
      <section className="bg-white bg-opacity-80 rounded-3xl shadow p-4 md:p-6 space-y-3">
        <h2 className="text-xl font-bold text-gray-800">My Profile</h2>
        <p className="text-sm text-gray-700">
          To view the personal area and the parent report, please log in.
        </p>
      </section>
    );
  }

  if (viewMode === "child") return <ChildProfile />;

  return (
    <>
      {parent.isParentUnlocked && <ParentDashboard {...parent} />}
      {parent.showParentGate && (
        <ParentGateModal
          pinMode={parent.pinMode}
          setPinMode={parent.setPinMode}
          pinInput={parent.pinInput}
          setPinInput={parent.setPinInput}
          pinConfirm={parent.pinConfirm}
          setPinConfirm={parent.setPinConfirm}
          pinError={parent.pinError}
          onClose={() => parent.setShowParentGate(false)}
          onSubmit={parent.submitPin}
        />
      )}
    </>
  );
}
