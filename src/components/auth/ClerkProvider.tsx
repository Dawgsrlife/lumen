import { ClerkProvider as BaseClerkProvider } from '@clerk/clerk-react';
import type { ReactNode } from 'react';

interface ClerkProviderProps {
  children: ReactNode;
}

export const ClerkProvider: React.FC<ClerkProviderProps> = ({ children }) => {
  const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    console.error('Clerk publishable key not found. Please add VITE_CLERK_PUBLISHABLE_KEY to your .env file.');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h1>
          <p className="text-gray-600 mb-4">
            Please configure your Clerk authentication keys to use this application.
          </p>
          <p className="text-sm text-gray-500">
            Add VITE_CLERK_PUBLISHABLE_KEY to your .env file
          </p>
        </div>
      </div>
    );
  }

  return (
    <BaseClerkProvider publishableKey={publishableKey}>
      {children}
    </BaseClerkProvider>
  );
}; 