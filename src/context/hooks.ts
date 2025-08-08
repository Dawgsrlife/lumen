import { useContext } from 'react';
import { AppContext } from './AppContext';
import { FlowContext, type FlowContextType } from './FlowProvider';

// Hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// Hook to use flow context
export const useFlow = (): FlowContextType => {
  const context = useContext(FlowContext);
  if (context === undefined) {
    throw new Error('useFlow must be used within a FlowProvider');
  }
  return context;
};

// Convenience hooks
export const useUser = () => useAppContext().state.user;
export const useError = () => useAppContext().state.error;