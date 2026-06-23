import { Component } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from './Button.jsx';

/**
 * ErrorBoundary — Editorial Modern Redesign
 *
 * Class component that catches render errors anywhere in its children
 * and shows a clean fallback UI. Same API as before:
 *   - getDerivedStateFromError(error) → sets state
 *   - componentDidCatch(error, errorInfo) → logs to console
 *   - handleReset() → clears error state
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
          <div className="text-center max-w-md w-full">
            {/* Icon */}
            <div className="w-14 h-14 bg-surface-100 dark:bg-surface-800 rounded-xl flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-7 h-7 text-amber-500" strokeWidth={2} />
            </div>

            {/* Heading */}
            <h2 className="text-xl font-semibold text-surface-900 dark:text-white mb-2 font-display tracking-tight">
              Something went wrong
            </h2>

            {/* Description */}
            <p className="text-sm text-surface-500 dark:text-surface-400 mb-6 leading-relaxed">
              An unexpected error occurred. Please try refreshing the page, or return home to continue shopping.
            </p>

            {/* Error message (if available) */}
            {this.state.error?.message && (
              <div className="text-left mb-6">
                <p className="text-[11px] font-medium text-surface-500 uppercase tracking-wider mb-1.5">Error details</p>
                <p className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-lg p-3 font-mono break-all leading-relaxed">
                  {this.state.error.message}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2.5 justify-center">
              <Button variant="primary" icon={RefreshCw} onClick={this.handleReset}>
                Try Again
              </Button>
              <Link to="/" className="no-underline">
                <Button variant="secondary" icon={Home}>Go Home</Button>
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;