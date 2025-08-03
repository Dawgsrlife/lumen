import React from 'react';
import { motion } from 'framer-motion';

interface FlowErrorFallbackProps {
  error: Error;
  onRetry?: () => void;
}

const FlowErrorFallback: React.FC<FlowErrorFallbackProps> = ({ error, onRetry }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      <motion.div
        className="text-center max-w-md mx-auto p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-6xl mb-6">⚠️</div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Something went wrong
        </h2>
        <p className="text-gray-600 mb-6">
          We encountered an unexpected error while setting up your experience.
        </p>
        
        {process.env.NODE_ENV === 'development' && (
          <details className="mb-6 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 mb-2">
              Error details (development only)
            </summary>
            <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto max-h-32">
              {error.message}
              {'\n'}
              {error.stack}
            </pre>
          </details>
        )}
        
        <div className="space-y-3">
          {onRetry && (
            <button
              onClick={onRetry}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 font-medium"
            >
              Try Again
            </button>
          )}
          
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="w-full px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300 font-medium"
          >
            Go to Dashboard
          </button>
        </div>
      </motion.div>
    </div>
  );
};

interface FlowErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<FlowErrorFallbackProps>;
}

interface FlowErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class FlowErrorBoundary extends React.Component<
  FlowErrorBoundaryProps,
  FlowErrorBoundaryState
> {
  constructor(props: FlowErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): FlowErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Flow error:', error, errorInfo);
    // TODO: Log to your error tracking service (e.g., Sentry)
    // logErrorToService(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || FlowErrorFallback;
      return (
        <FallbackComponent 
          error={this.state.error!} 
          onRetry={this.handleRetry}
        />
      );
    }

    return this.props.children;
  }
}

export default FlowErrorBoundary; 