import { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { apiService } from '../../services/api';

const AuthSync = () => {
  const { isLoaded, isSignedIn, getToken, sessionId } = useAuth();

  useEffect(() => {
    const sync = async () => {
      if (!isLoaded || !isSignedIn) return;
      try {
        const token = await getToken();
        if (token) {
          apiService.setToken(token);
          localStorage.setItem('lumen_token', token);
        }
        if (sessionId) {
          apiService.setSessionId(sessionId);
          localStorage.setItem('lumen_session_id', sessionId);
        }
      } catch (err) {
        console.warn('Failed to sync Clerk auth to API service', err);
      }
    };
    sync();
  }, [isLoaded, isSignedIn, getToken, sessionId]);

  return null;
};

export default AuthSync;
