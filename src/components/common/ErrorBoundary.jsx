import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-darkbg p-4">
          <div className="max-w-md w-full bg-white dark:bg-secondary-dark-bg p-8 rounded-2xl shadow-xl border border-red-100 dark:border-red-900/30">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Something went wrong</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                The application encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="w-full px-6 py-3 bg-primary-orange text-white rounded-xl font-bold shadow-lg shadow-primary-orange/20 hover:brightness-110 active:scale-[0.98] transition-all"
              >
                Refresh Page
              </button>
              {process.env.NODE_ENV === 'development' && (
                  <div className="mt-8 text-left w-full">
                      <p className="text-xs font-mono text-red-500 bg-red-50 dark:bg-red-900/10 p-3 rounded-lg overflow-auto max-h-40">
                          {this.state.error && this.state.error.toString()}
                      </p>
                  </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
