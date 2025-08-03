import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import { ClerkProvider } from './components/auth/ClerkProvider';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Header, Footer } from './components/layout';
import { ErrorBoundary, LoadingSpinner } from './components/ui';
import RootRedirect from './components/auth/RootRedirect';
import './App.css';

// Lazy load pages for better performance
const LandingPage = lazy(() => import('./pages/LandingPage'));
const About = lazy(() => import('./pages/About'));
const Features = lazy(() => import('./pages/Features'));
const Contact = lazy(() => import('./pages/Contact'));
const SignInPage = lazy(() => import('./pages/SignInPage'));

const WelcomePage = lazy(() => import('./pages/WelcomePage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const Profile = lazy(() => import('./pages/Profile'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Games = lazy(() => import('./pages/Games'));
const Chat = lazy(() => import('./pages/Chat'));

// Conditional Layout Component
const ConditionalLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state } = useAppContext();
  const location = useLocation();
  
  // Always show header for main app pages (dashboard, chat, analytics, profile, games)
  const mainAppPages = ['/dashboard', '/chat', '/analytics', '/profile', '/games'];
  const isMainAppPage = mainAppPages.includes(location.pathname);
  
  // Show header if in main app pages OR if emotion flow is complete
  const shouldShowHeader = isMainAppPage || state.showHeader;
  
  console.log('ConditionalLayout: State', {
    showHeader: state.showHeader,
    currentView: state.currentView,
    user: state.user,
    pathname: location.pathname,
    isMainAppPage,
    shouldShowHeader
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
  
  // No header/footer for pre-emotion selection screens
  console.log('ConditionalLayout: No header/footer');
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
          <Router>
            <Routes>
              {/* Root redirect based on auth status */}
              <Route path="/" element={<RootRedirect />} />
              
              {/* Public Routes - No Header/Footer */}
              <Route path="/landing" element={<LandingPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/features" element={<Features />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/sign-in" element={
                <Suspense fallback={<LoadingSpinner size="lg" className="mt-20" />}>
                  <SignInPage />
                </Suspense>
              } />

              
              {/* Protected Routes - Conditional Header/Footer */}
              <Route 
                path="/welcome" 
                element={
                  <Suspense fallback={<LoadingSpinner size="lg" className="mt-20" />}>
                    <ProtectedRoute>
                      <ConditionalLayout>
                        <WelcomePage />
                      </ConditionalLayout>
                    </ProtectedRoute>
                  </Suspense>
                } 
              />
              <Route 
                path="/onboarding" 
                element={
                  <Suspense fallback={<LoadingSpinner size="lg" className="mt-20" />}>
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
                  <Suspense fallback={<LoadingSpinner size="lg" className="mt-20" />}>
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
                  <Suspense fallback={<LoadingSpinner size="lg" className="mt-20" />}>
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
                  <Suspense fallback={<LoadingSpinner size="lg" className="mt-20" />}>
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
                  <Suspense fallback={<LoadingSpinner size="lg" className="mt-20" />}>
                    <ProtectedRoute>
                      <ConditionalLayout>
                        <Games />
                      </ConditionalLayout>
                    </ProtectedRoute>
                  </Suspense>
                } 
              />
              <Route 
                path="/chat" 
                element={
                  <Suspense fallback={<LoadingSpinner size="lg" className="mt-20" />}>
                    <ProtectedRoute>
                      <ConditionalLayout>
                        <Chat />
                      </ConditionalLayout>
                    </ProtectedRoute>
                  </Suspense>
                } 
              />
              
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </AppProvider>
      </ClerkProvider>
    </ErrorBoundary>
  );
}

export default App;
