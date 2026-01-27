/**
 * ErrorAlert
 *
 * Simple error message banner. Renders nothing when message is empty.
 * Used in ParentDashboard for load errors.
 *
 * @param {Object} props
 * @param {string} [props.message] - Error message to show
 *
 * @component
 */
export default function ErrorAlert({ message }) {
  if (!message) return null;

  return (
    <div className="rounded-2xl border-2 border-red-100 bg-red-50 p-4 text-sm font-bold text-red-600 flex items-center gap-3">
      <span>⚠️</span> {message}
    </div>
  );
}
