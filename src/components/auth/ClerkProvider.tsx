import { ClerkProvider as BaseClerkProvider } from '@clerk/clerk-react';
import type { ReactNode } from 'react';

interface ClerkProviderProps {
  children: ReactNode;
}

export const ClerkProvider: React.FC<ClerkProviderProps> = ({ children }) => {
  const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  const isDevelopment = import.meta.env.DEV;

  // In development mode, allow the app to run without Clerk key
  if (!publishableKey && isDevelopment) {
    console.warn('Clerk publishable key not found. Running in development mode without authentication.');
    return <>{children}</>;
  }

  if (!publishableKey) {
    console.warn('Clerk publishable key not found. Please add VITE_CLERK_PUBLISHABLE_KEY to your .env file.');
    return <div>Authentication not configured</div>;
  }

  return (
    <BaseClerkProvider publishableKey={publishableKey}>
      {children}
    </BaseClerkProvider>
  );
}; 