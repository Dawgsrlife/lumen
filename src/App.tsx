import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { AppProvider } from './context/AppContext';
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
const WelcomePage = lazy(() => import('./pages/WelcomePage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const Profile = lazy(() => import('./pages/Profile'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Games = lazy(() => import('./pages/Games'));

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
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/sign-up" element={<SignUp />} />
              
              {/* Protected Routes - With Header/Footer */}
              <Route 
                path="/welcome" 
                element={
                  <div className="min-h-screen flex flex-col">
                    <Header />
                    <main className="flex-1">
                      <Suspense fallback={<LoadingSpinner size="lg" className="mt-20" />}>
                        <ProtectedRoute>
                          <WelcomePage />
                        </ProtectedRoute>
                      </Suspense>
                    </main>
                    <Footer />
                  </div>
                } 
              />
              <Route 
                path="/onboarding" 
                element={
                  <div className="min-h-screen flex flex-col">
                    <Header />
                    <main className="flex-1">
                      <Suspense fallback={<LoadingSpinner size="lg" className="mt-20" />}>
                        <ProtectedRoute>
                          <Onboarding />
                        </ProtectedRoute>
                      </Suspense>
                    </main>
                    <Footer />
                  </div>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <div className="min-h-screen flex flex-col">
                    <Header />
                    <main className="flex-1">
                      <Suspense fallback={<LoadingSpinner size="lg" className="mt-20" />}>
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      </Suspense>
                    </main>
                    <Footer />
                  </div>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <div className="min-h-screen flex flex-col">
                    <Header />
                    <main className="flex-1">
                      <Suspense fallback={<LoadingSpinner size="lg" className="mt-20" />}>
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      </Suspense>
                    </main>
                    <Footer />
                  </div>
                } 
              />
              <Route 
                path="/analytics" 
                element={
                  <div className="min-h-screen flex flex-col">
                    <Header />
                    <main className="flex-1">
                      <Suspense fallback={<LoadingSpinner size="lg" className="mt-20" />}>
                        <ProtectedRoute>
                          <Analytics />
                        </ProtectedRoute>
                      </Suspense>
                    </main>
                    <Footer />
                  </div>
                } 
              />
              <Route 
                path="/games" 
                element={
                  <div className="min-h-screen flex flex-col">
                    <Header />
                    <main className="flex-1">
                      <Suspense fallback={<LoadingSpinner size="lg" className="mt-20" />}>
                        <ProtectedRoute>
                          <Games />
                        </ProtectedRoute>
                      </Suspense>
                    </main>
                    <Footer />
                  </div>
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
