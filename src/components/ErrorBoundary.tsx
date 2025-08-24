import React, { Component, ErrorInfo, ReactNode } from 'react';
import { MessageSquare, AlertTriangle, RefreshCw } from 'lucide-react';
interface Props {
  children: ReactNode;
}
interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };
  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('React Error Boundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }
  private handleReload = () => {
    window.location.reload();
  };
  private handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };
  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:bg-slate-900">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="text-left text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 p-3 rounded border overflow-auto max-h-32">
                  <summary className="cursor-pointer font-medium text-red-600 dark:text-red-400 mb-2">
                    Error Details (Development Mode)
                  </summary>
                  <pre className="whitespace-pre-wrap">
                    {this.state.error.message}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}
            </div>
