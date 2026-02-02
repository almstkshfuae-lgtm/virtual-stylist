import React from 'react';

type ErrorBoundaryProps = {
  children: React.ReactNode;
};

type ErrorBoundaryState = {
  error: Error | null;
};

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Uncaught UI error:', error, info);
  }

  private handleReload = () => {
    if (typeof window === 'undefined') return;
    window.location.reload();
  };

  render() {
    if (!this.state.error) {
      return this.props.children;
    }

    const isDev = typeof import.meta !== 'undefined' && (import.meta as any).env?.DEV;
    const message =
      this.state.error?.message ||
      'The app hit an unexpected error. Please reload and try again.';

    return (
      <div className="min-h-screen bg-gray-100 dark:bg-slate-900 p-6">
        <div className="mx-auto max-w-2xl rounded-2xl border border-red-200/70 bg-white p-6 shadow-xl dark:border-red-500/30 dark:bg-slate-900">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Something went wrong</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            If you were generating outfits and saw a proxy error, the server may be missing the Gemini API key
            (`API_KEY`) or the proxy is down.
          </p>
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-200">
            {message}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={this.handleReload}
              className="rounded-full bg-pink-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-pink-700"
            >
              Reload
            </button>
          </div>
          {isDev && (
            <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
              Dev note: check the browser console for the full stack trace.
            </p>
          )}
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;

