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
          {/* Animated background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-red-200 via-orange-200 to-yellow-200 dark:from-red-900 dark:via-orange-900 dark:to-yellow-900"></div>
          </div>
          
          <div className="relative text-center z-10 max-w-2xl mx-auto p-6">
            <div className="relative mb-8">
              {/* Error glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
              
              {/* Error icon */}
              <div className="relative bg-gradient-to-br from-white/90 to-white/80 dark:from-white/25 dark:to-white/10 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl border-2 border-red-200 dark:border-orange-400/50">
                <div className="bg-gradient-to-br from-red-400 via-orange-500 to-yellow-400 p-6 rounded-2xl shadow-inner">
                  <AlertTriangle className="w-16 h-16 text-white mx-auto mb-2" />
                  <div className="text-2xl font-black text-white drop-shadow-2xl">Oops!</div>
                </div>
              </div>
            </div>
            
            <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4">
              <span className="bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 dark:from-red-100 dark:via-orange-100 dark:to-yellow-100 bg-clip-text text-transparent">
                Something went wrong
              </span>
            </h1>
            
            <div className="bg-gradient-to-r from-white/90 to-white/80 dark:from-white/25 dark:to-white/10 backdrop-blur-xl rounded-2xl border border-red-200 dark:border-orange-400/30 p-6 mb-6">
              <div className="flex items-center justify-center mb-3">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
                <span className="text-red-700 dark:text-red-300 font-semibold">Application Error</span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
                SparkSupport encountered an unexpected error. This is usually temporary.
              </p>
              
              {/* Error details for development */}
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
            
            {/* Action buttons */}
            <div className="space-y-3">
              <button
                onClick={this.handleReset}
                className="w-full inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Try Again</span>
              </button>
              
              <button
                onClick={this.handleReload}
                className="w-full inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 hover:scale-105"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Reload SparkSupport</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}