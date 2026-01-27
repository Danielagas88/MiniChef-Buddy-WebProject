/**
 * ErrorBoundary
 *
 * Catches JavaScript errors in child components and displays a fallback UI
 * instead of crashing. Uses react-error-boundary (functional API).
 * Used to wrap the app and major route trees.
 *
 * @component
 */
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";

/**
 * Fallback UI shown when an error is caught.
 * @param {Object} props
 * @param {Error} props.error - The thrown error
 * @param {Function} props.resetErrorBoundary - Call to reset (e.g. try again)
 */
function ErrorFallback({ error, resetErrorBoundary }) {
  const isDev = import.meta.env.DEV;

  return (
    <div className="min-h-screen bg-(--bg-current) flex items-center justify-center p-4">
      <div className="bg-(--card-surface) backdrop-blur-md rounded-3xl shadow-lg border border-(--card-surface-border) p-8 max-w-2xl w-full space-y-6">
        <div className="text-center space-y-4">
          <div className="text-6xl">😕</div>
          <h1 className="text-3xl font-extrabold text-(--text-primary)">
            Oops! Something went wrong
          </h1>
          <p className="text-(--text-secondary)">
            We're sorry, but something unexpected happened. Don't worry, your data is safe!
          </p>
        </div>

        {isDev && error && (
          <details className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
            <summary className="cursor-pointer font-bold text-red-700 dark:text-red-400 mb-2">
              Error Details (Development Only)
            </summary>
            <pre className="text-xs overflow-auto text-red-800 dark:text-red-300">
              {error.toString()}
            </pre>
          </details>
        )}

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => {
              resetErrorBoundary();
              window.location.href = "/";
            }}
            className="bg-emerald-500 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-emerald-600 transition-all hover:scale-105"
          >
            Go to Home
          </button>
          <button
            onClick={() => window.location.reload()}
            className="bg-(--card-bg) text-(--text-primary) px-6 py-3 rounded-full font-bold shadow-md border border-(--border-color) hover:bg-(--card-surface) transition-all"
          >
            Reload Page
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Wrapper that uses react-error-boundary. All your code stays functional.
 */
export default function ErrorBoundary({ children }) {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {}}
      onError={(error) => {
        if (import.meta.env.DEV) {
          console.error("ErrorBoundary caught an error:", error);
        }
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}
