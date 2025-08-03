import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import { FlowProvider, useFlow } from './context/FlowProvider';
import { ClerkProvider } from './components/auth/ClerkProvider';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import LoginRedirectHandler from './components/auth/LoginRedirectHandler';
import { Header, Footer } from './components/layout';
import { ErrorBoundary, LoadingSpinner } from './components/ui';
import './App.css';

// Lazy load pages for better performance
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
const Games = lazy(() => import('./pages/Games'));

// Enhanced Conditional Layout Component
const ConditionalLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state: appState } = useAppContext();
  const { state: flowState } = useFlow();
  const location = window.location.pathname;
  
  // Determine if header/footer should be shown
  // Show header/footer ONLY for dashboard, analytics, games
  // Hide header/footer for all other pages
  const shouldShowHeader = 
    (location === '/dashboard' || location === '/analytics' || location === '/games') &&
    appState.showHeader;
  
  console.log('ConditionalLayout: State', {
    pathname: location,
    flowStep: flowState.currentStep,
    appShowHeader: appState.showHeader,
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

function App() {
  return (
    <ErrorBoundary>
      <ClerkProvider>
        <AppProvider>
          <FlowProvider>
            <Router>
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
                          <p className="text-gray-600">Loading flow page...</p>
                        </div>
                      </div>
                    }>
                      <ProtectedRoute>
                        <ConditionalLayout>
                          <FlowPage />
                        </ConditionalLayout>
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
                  path="/games" 
                  element={
                    <Suspense fallback={
                      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
                        <div className="text-center">
                          <LoadingSpinner size="lg" />
                          <div className="mb-4"></div>
                          <p className="text-gray-600">Loading games...</p>
                        </div>
                      </div>
                    }>
                      <ProtectedRoute>
                        <ConditionalLayout>
                          <Games />
                        </ConditionalLayout>
                      </ProtectedRoute>
                    </Suspense>
                  } 
                />
                
                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Router>
          </FlowProvider>
        </AppProvider>
      </ClerkProvider>
    </ErrorBoundary>
  );
}

export default App;
