import { Component, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  /** Called before clearing the error state — use to reset any cached data
   * (e.g. a React Query error) that would otherwise re-throw immediately. */
  onReset?: () => void;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  handleReset = () => {
    this.props.onReset?.();
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="py-12 text-center">
          <p className="text-gray-500 mb-4">Something went wrong loading this section.</p>
          <button
            onClick={this.handleReset}
            className="text-brand-emerald hover:underline font-medium"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
