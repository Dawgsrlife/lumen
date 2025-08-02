import { ClerkProvider as BaseClerkProvider } from '@clerk/clerk-react';
import type { ReactNode } from 'react';

interface ClerkProviderProps {
  children: ReactNode;
}

export const ClerkProvider: React.FC<ClerkProviderProps> = ({ children }) => {
  const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    console.warn('Clerk publishable key not found. Running without authentication for development.');
    return <>{children}</>;
  }

  return (
    <BaseClerkProvider publishableKey={publishableKey}>
      {children}
    </BaseClerkProvider>
  );
}; 