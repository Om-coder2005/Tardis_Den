import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
          <div className="max-w-md w-full bg-slate-900 border border-red-500/30 rounded-xl p-8 shadow-2xl">
            <h1 className="text-2xl font-mono text-red-400 mb-4 uppercase tracking-widest">System Malfunction</h1>
            <p className="text-slate-300 mb-6 font-mono text-sm">
              The TARDIS translation matrix has encountered a critical error.
            </p>
            <div className="bg-black/50 p-4 rounded text-left overflow-auto text-xs font-mono text-red-300 mb-6">
              {this.state.error?.message || 'Unknown error'}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-mono text-sm uppercase tracking-wider rounded transition-colors"
            >
              Reboot System
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
