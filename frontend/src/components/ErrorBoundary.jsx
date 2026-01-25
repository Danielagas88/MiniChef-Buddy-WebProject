import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
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

            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
                <summary className="cursor-pointer font-bold text-red-700 dark:text-red-400 mb-2">
                  Error Details (Development Only)
                </summary>
                <pre className="text-xs overflow-auto text-red-800 dark:text-red-300">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <div className="flex gap-4 justify-center">
              <button
                onClick={this.handleReset}
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

    return this.props.children;
  }
}

export default ErrorBoundary;
