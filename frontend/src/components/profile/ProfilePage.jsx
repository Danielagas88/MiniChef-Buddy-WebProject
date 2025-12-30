/**
 * ProfilePage.jsx
 * ----------------
 * Main "Profile" page entry.
 *
 * Responsibilities:
 * 1) Reads authentication state (user + viewMode) from Auth context.
 * 2) If user is NOT logged in -> render login prompt.
 * 3) If user is in "child" mode -> render ChildProfile.
 * 4) If user is in "parent" mode -> render:
 *    - ParentDashboard if parent is unlocked
 *    - ParentGateModal if parent gate is required
 *
 * The "parent area" behavior (PIN gate, sections, usage limits, weekly report)
 * is handled by a single hook: useParentArea() implemented with useReducer.
 */

import { useAuth } from "../../hooks/useAuth.js"; // your existing hook that reads AuthContext
import { useParentArea } from "./parent/useParentArea.js"; // reducer-based hook
import ParentGateModal from "./parent/ParentGateModal.jsx";
import ParentDashboard from "./parent/ParentDashboard.jsx";
import ChildProfile from "./child/ChildProfile.jsx";

export default function ProfilePage() {
  // 1) read auth data
  const { user, viewMode } = useAuth();

  // 2) initialize parent logic ONLY using token + viewMode
  //    token may be undefined if user is not logged in
  const parent = useParentArea({
    token: user?.token,
    viewMode,
  });

  // 3) user not logged in -> show prompt
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

  // 4) child mode -> render child profile
  if (viewMode === "child") return <ChildProfile />;

  // 5) parent mode -> render dashboard (if unlocked) + modal (if gate required)
  return (
    <>
      {parent.gate.isUnlocked && <ParentDashboard parent={parent} />}

      {parent.gate.show && (
        <ParentGateModal
          pin={parent.pin}
          setPinMode={parent.setPinMode}
          setPinInput={parent.setPinInput}
          setPinConfirm={parent.setPinConfirm}
          onClose={parent.hideGate}
          onSubmit={parent.submitPin}
        />
      )}
    </>
  );
}
