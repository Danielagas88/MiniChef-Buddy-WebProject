import { useAuth } from "../hooks/useAuth.js";

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

  // CHILD VIEW
  if (viewMode === "child") {
    return (
      <section className="space-y-4">
        {/* Child personal area */}
        <div className="bg-white bg-opacity-80 rounded-3xl shadow p-4 md:p-6 space-y-3">
          <h2 className="text-xl font-bold text-gray-800">My Chef Profile</h2>

          <div className="mt-3"></div>
        </div>

        {/* Child gallery */}
        <div className="bg-white bg-opacity-90 rounded-3xl shadow p-3 md:p-4 h-40 overflow-y-auto mt-4">
          <h3 className="text-sm md:text-base font-bold text-gray-800 mb-2">
            Cooking Gallery
          </h3>
          <p className="text-xs md:text-sm text-gray-500 mb-2"></p>
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
      </section>
    );
  }

  // PARENT VIEW
  if (viewMode === "parent") {
    return (
      <section className="space-y-4">
        <div className="bg-white bg-opacity-80 rounded-3xl shadow p-4 md:p-6 space-y-3">
          <h2 className="text-xl font-bold text-gray-800">Parent Area</h2>
          <p className="text-sm text-gray-700">
            This screen represents the parent area
          </p>
        </div>
      </section>
    );
  }

  return null;
}
