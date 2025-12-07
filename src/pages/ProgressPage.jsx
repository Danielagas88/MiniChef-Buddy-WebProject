import { useAuth } from "../context/AuthContext.jsx";

export default function ProgressPage() {
  const { user, viewMode } = useAuth();

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

  const { stats, parentReport } = user;

  // CHILD VIEW
  if (viewMode === "child") {
    return (
      <section className="space-y-4">
        {/* Child personal area */}
        <div className="bg-white bg-opacity-80 rounded-3xl shadow p-4 md:p-6 space-y-3">
          <h2 className="text-xl font-bold text-gray-800">
            👧 My Chef Profile
          </h2>
          <p className="text-sm text-gray-700">
            This screen shows your personal cooking statistics: completed
            recipes, stars, badges and chef level.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div className="bg-green-50 rounded-2xl p-3 shadow-sm">
              <p className="text-xs text-gray-600">Completed Recipes</p>
              <p className="text-2xl font-bold text-green-700">
                {stats.completedRecipes}
              </p>
            </div>
            <div className="bg-blue-50 rounded-2xl p-3 shadow-sm">
              <p className="text-xs text-gray-600">Stars Collected</p>
              <p className="text-2xl font-bold text-blue-700">
                {stats.stars} ⭐
              </p>
            </div>
            <div className="bg-orange-50 rounded-2xl p-3 shadow-sm">
              <p className="text-xs text-gray-600">Chef Level</p>
              <p className="text-lg font-bold text-orange-700">
                {stats.chefLevel}
              </p>
            </div>
          </div>

          <div className="mt-3">
            <h3 className="text-sm font-semibold text-gray-800 mb-1">Badges</h3>
            <ul className="list-disc list-inside text-xs text-gray-700 space-y-1">
              {stats.badges.map((badge) => (
                <li key={badge}>{badge}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Child gallery */}
        <div className="bg-white bg-opacity-90 rounded-3xl shadow p-3 md:p-4 h-40 overflow-y-auto mt-4">
          <h3 className="text-sm md:text-base font-bold text-gray-800 mb-2">
            🍽 Cooking Gallery
          </h3>
          <p className="text-xs md:text-sm text-gray-500 mb-2">
            Kids can take a photo of their dish and save it here.
          </p>
          <div className="grid grid-cols-3 gap-1">
            <div className="w-full h-12 bg-pink-100 rounded-lg text-[10px] flex items-center justify-center">
              Photo 1
            </div>
            <div className="w-full h-12 bg-yellow-100 rounded-lg text-[10px] flex items-center justify-center">
              Photo 2
            </div>
            <div className="w-full h-12 bg-purple-100 rounded-lg text-[10px] flex items-center justify-center">
              Photo 3
            </div>
          </div>
        </div>

        {/* Parent report (how parents see the child) */}
        <div className="bg-white bg-opacity-80 rounded-3xl shadow p-4 md:p-6 space-y-3 border border-pink-200">
          <h2 className="text-lg font-bold text-gray-800">👨‍👩‍👧 Parent Report</h2>
          <p className="text-xs md:text-sm text-gray-700">
            This section shows the summary that parents can see about your
            activity: cooking time, recipes cooked and safety notes.
          </p>

          <table className="w-full text-xs text-left border-collapse mt-2">
            <thead>
              <tr className="bg-gray-50">
                <th className="border px-2 py-1">Child</th>
                <th className="border px-2 py-1">Total time this week</th>
                <th className="border px-2 py-1">Recipes cooked</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-2 py-1">{parentReport.childName}</td>
                <td className="border px-2 py-1">
                  {parentReport.totalTimeThisWeek}
                </td>
                <td className="border px-2 py-1">
                  {parentReport.recipesCookedThisWeek.join(", ")}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="mt-2">
            <h3 className="text-xs font-semibold text-gray-800 mb-1">
              Safety notes
            </h3>
            <ul className="list-disc list-inside text-[11px] text-gray-700 space-y-1">
              {parentReport.safetyNotes.map((note, index) => (
                <li key={index}>{note}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    );
  }

  // PARENT VIEW
  if (viewMode === "parent") {
    return (
      <section className="space-y-4">
        <div className="bg-white bg-opacity-80 rounded-3xl shadow p-4 md:p-6 space-y-3">
          <h2 className="text-xl font-bold text-gray-800">👨‍👩‍👧 Parent Report</h2>
          <p className="text-sm text-gray-700">
            This screen represents the parent area: a summary report of the
            child&apos;s activity in the cooking app.
          </p>

          <div className="text-sm text-gray-700 space-y-1">
            <p>
              <span className="font-semibold">Parent:</span>{" "}
              {parentReport.parentName}
            </p>
            <p>
              <span className="font-semibold">Child:</span>{" "}
              {parentReport.childName}
            </p>
          </div>

          <table className="w-full text-xs text-left border-collapse mt-3">
            <thead>
              <tr className="bg-gray-50">
                <th className="border px-2 py-1">Child</th>
                <th className="border px-2 py-1">Total time this week</th>
                <th className="border px-2 py-1">Recipes cooked</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-2 py-1">{parentReport.childName}</td>
                <td className="border px-2 py-1">
                  {parentReport.totalTimeThisWeek}
                </td>
                <td className="border px-2 py-1">
                  {parentReport.recipesCookedThisWeek.join(", ")}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="mt-3">
            <h3 className="text-sm font-semibold text-gray-800 mb-1">
              Safety notes
            </h3>
            <ul className="list-disc list-inside text-xs text-gray-700 space-y-1">
              {parentReport.safetyNotes.map((note, index) => (
                <li key={index}>{note}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    );
  }

  return null;
}
