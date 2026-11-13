import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[Researcher Campus Workstation Error]:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
          <Card className="max-w-lg w-full bg-white border-slate-300 shadow-xl p-8 text-center space-y-5">
            <div className="w-14 h-14 bg-red-50 border border-red-200 rounded-full flex items-center justify-center mx-auto text-red-600">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-mono font-bold text-red-600 uppercase tracking-wider">
                Workstation Session Interrupted
              </span>
              <h1 className="text-xl font-bold text-slate-900">
                Application State Error
              </h1>
              <p className="text-xs text-slate-600 leading-relaxed">
                An unexpected interface exception occurred. Your saved proposals and manuscript drafts in MongoDB remain safe.
              </p>
            </div>

            {this.state.error && (
              <div className="bg-slate-900 text-slate-200 p-3 rounded text-left font-mono text-[11px] max-h-32 overflow-y-auto">
                {this.state.error.message || String(this.state.error)}
              </div>
            )}

            <div className="flex items-center justify-center space-x-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={this.handleReload}
                leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              >
                Reload Session
              </Button>
              <Button
                size="sm"
                onClick={this.handleReset}
                leftIcon={<Home className="w-3.5 h-3.5" />}
              >
                Return to Dashboard
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

