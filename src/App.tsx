import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy, useEffect } from 'react';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { AppProvider } from './context/AppContext';
import { ClerkProvider } from './components/auth/ClerkProvider';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Header, Footer } from './components/layout';
import { ErrorBoundary, LoadingSpinner } from './components/ui';
import { databaseService } from './services/database';
import './App.css';

// Lazy load pages for better performance
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const Profile = lazy(() => import('./pages/Profile'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Games = lazy(() => import('./pages/Games'));

function App() {
  useEffect(() => {
    // Initialize database connection
    databaseService.connect().catch(console.error);
    
    return () => {
      // Cleanup database connection
      databaseService.disconnect().catch(console.error);
    };
  }, []);

  return (
    <ErrorBoundary>
      <ClerkProvider>
        <AppProvider>
          <Router>
            <div className="App min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                <Suspense fallback={<LoadingSpinner size="lg" className="mt-20" />}>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/sign-in" element={<SignIn />} />
                    <Route path="/sign-up" element={<SignUp />} />
                    
                    {/* Protected Routes */}
                    <Route 
                      path="/onboarding" 
                      element={
                        <ProtectedRoute>
                          <Onboarding />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/dashboard" 
                      element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/profile" 
                      element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/analytics" 
                      element={
                        <ProtectedRoute>
                          <Analytics />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/games" 
                      element={
                        <ProtectedRoute>
                          <Games />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Suspense>
              </main>
              <Footer />
            </div>
          </Router>
        </AppProvider>
      </ClerkProvider>
    </ErrorBoundary>
  );
}

export default App;
