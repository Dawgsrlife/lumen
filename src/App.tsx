import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import ErrorBoundary from './components/ui/ErrorBoundary';
import { LoadingSpinner } from './components/ui';
import { AppProvider } from './context/AppContext';
import { FlowProvider } from './context/FlowProvider';
import { useAppContext, useFlow } from './context/hooks';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import LoginRedirectHandler from './components/auth/LoginRedirectHandler';
import { Header, Footer } from './components/layout';
import AuthSync from './components/auth/AuthSync';

// Lazy load pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const About = lazy(() => import('./pages/About'));
const Features = lazy(() => import('./pages/Features'));
const Contact = lazy(() => import('./pages/Contact'));
const SignInPage = lazy(() => import('./pages/SignInPage'));
const WelcomePage = lazy(() => import('./pages/WelcomePage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const FlowPage = lazy(() => import('./pages/FlowPage'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const Profile = lazy(() => import('./pages/Profile'));
const Analytics = lazy(() => import('./pages/Analytics'));
const CheckIns = lazy(() => import('./pages/CheckIns'));
const Chat = lazy(() => import('./pages/Chat'));

// Enhanced Conditional Layout Component
const ConditionalLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state: appState } = useAppContext();
  const { state: flowState } = useFlow();
  const location = window.location.pathname;
  
  // Determine if header/footer should be shown
  // Show header/footer for dashboard, analytics, check-ins, chat, profile (main navigation pages)
  // Hide header/footer for all other pages (flow, welcome, etc.)
  const shouldShowHeader = 
    location === '/dashboard' || location === '/analytics' || location === '/check-ins' || location === '/chat' || location === '/profile';
  
  console.log('ConditionalLayout: State', {
    pathname: location,
    flowStep: flowState.currentStep,
    shouldShowHeader,
    user: appState.user
  });
  
  if (shouldShowHeader) {
    console.log('ConditionalLayout: Showing header and footer');
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    );
  }
  
  // No header/footer for other pages
  console.log('ConditionalLayout: No header/footer for page:', location);
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
};

// Clerk Provider Wrapper
const ClerkProviderWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  
  return (
    <ClerkProvider
      publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || ''}
      routerPush={(to) => navigate(to)}
      routerReplace={(to) => navigate(to, { replace: true })}
    >
      {children}
    </ClerkProvider>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <ClerkProviderWrapper>
          <AuthSync />
          <AppProvider>
            <FlowProvider>
              <Routes>
                {/* Root redirect based on auth status */}
                <Route path="/" element={<LoginRedirectHandler />} />
                
                {/* Public Routes - No Header/Footer */}
                <Route path="/landing" element={<LandingPage />} />
                <Route path="/about" element={<About />} />
                <Route path="/features" element={<Features />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/sign-in" element={
                  <Suspense fallback={
                    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
                      <div className="text-center">
                        <LoadingSpinner size="lg" />
                        <div className="mb-4"></div>
                        <p className="text-gray-600">Loading sign-in page...</p>
                      </div>
                    </div>
                  }>
                    <SignInPage />
                  </Suspense>
                } />

                {/* Protected Routes - Conditional Header/Footer */}
                <Route 
                  path="/welcome" 
                  element={
                    <Suspense fallback={
                      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
                        <div className="text-center">
                          <LoadingSpinner size="lg" />
                          <div className="mb-4"></div>
                          <p className="text-gray-600">Loading welcome page...</p>
                        </div>
                      </div>
                    }>
                      <ProtectedRoute>
                        <ConditionalLayout>
                          <WelcomePage />
                        </ConditionalLayout>
                      </ProtectedRoute>
                    </Suspense>
                  } 
                />
                <Route 
                  path="/flow" 
                  element={
                    <Suspense fallback={
                      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
                        <div className="text-center">
                          <LoadingSpinner size="lg" />
                          <div className="mb-4"></div>
                          <p className="text-gray-600">Loading flow...</p>
                        </div>
                      </div>
                    }>
                      <ProtectedRoute>
                        <FlowPage />
                      </ProtectedRoute>
                    </Suspense>
                  } 
                />
                <Route 
                  path="/onboarding" 
                  element={
                    <Suspense fallback={
                      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
                        <div className="text-center">
                          <LoadingSpinner size="lg" />
                          <div className="mb-4"></div>
                          <p className="text-gray-600">Loading onboarding...</p>
                        </div>
                      </div>
                    }>
                      <ProtectedRoute>
                        <ConditionalLayout>
                          <Onboarding />
                        </ConditionalLayout>
                      </ProtectedRoute>
                    </Suspense>
                  } 
                />
                <Route 
                  path="/dashboard" 
                  element={
                    <Suspense fallback={
                      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
                        <div className="text-center">
                          <LoadingSpinner size="lg" />
                          <div className="mb-4"></div>
                          <p className="text-gray-600">Loading dashboard...</p>
                        </div>
                      </div>
                    }>
                      <ProtectedRoute>
                        <ConditionalLayout>
                          <Dashboard />
                        </ConditionalLayout>
                      </ProtectedRoute>
                    </Suspense>
                  } 
                />
                <Route 
                  path="/analytics" 
                  element={
                    <Suspense fallback={
                      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
                        <div className="text-center">
                          <LoadingSpinner size="lg" />
                          <div className="mb-4"></div>
                          <p className="text-gray-600">Loading analytics...</p>
                        </div>
                      </div>
                    }>
                      <ProtectedRoute>
                        <ConditionalLayout>
                          <Analytics />
                        </ConditionalLayout>
                      </ProtectedRoute>
                    </Suspense>
                  } 
                />
                <Route 
                  path="/check-ins" 
                  element={
                    <Suspense fallback={
                      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
                        <div className="text-center">
                          <LoadingSpinner size="lg" />
                          <div className="mb-4"></div>
                          <p className="text-gray-600">Loading check-ins...</p>
                        </div>
                      </div>
                    }>
                      <ProtectedRoute>
                        <ConditionalLayout>
                          <CheckIns />
                        </ConditionalLayout>
                      </ProtectedRoute>
                    </Suspense>
                  } 
                />
                <Route 
                  path="/chat" 
                  element={
                    <Suspense fallback={
                      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
                        <div className="text-center">
                          <LoadingSpinner size="lg" />
                          <div className="mb-4"></div>
                          <p className="text-gray-600">Loading chat...</p>
                        </div>
                      </div>
                    }>
                      <ProtectedRoute>
                        <ConditionalLayout>
                          <Chat />
                        </ConditionalLayout>
                      </ProtectedRoute>
                    </Suspense>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <Suspense fallback={
                      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
                        <div className="text-center">
                          <LoadingSpinner size="lg" />
                          <div className="mb-4"></div>
                          <p className="text-gray-600">Loading profile...</p>
                        </div>
                      </div>
                    }>
                      <ProtectedRoute>
                        <ConditionalLayout>
                          <Profile />
                        </ConditionalLayout>
                      </ProtectedRoute>
                    </Suspense>
                  } 
                />
                
                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </FlowProvider>
          </AppProvider>
        </ClerkProviderWrapper>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
