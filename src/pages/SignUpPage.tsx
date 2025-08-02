import React from 'react';
import { SignUp } from '@clerk/clerk-react';
import { AnimatedBackground, LumenMascot, LumenIcon } from '../components/ui';

const SignUpPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative">
      {/* Animated background */}
      <AnimatedBackground />
      
      {/* Additional floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-24 right-20 w-28 h-28 rounded-full opacity-5" style={{ background: 'var(--lumen-primary)' }}></div>
        <div className="absolute bottom-40 left-16 w-20 h-20 rounded-full opacity-5" style={{ background: 'var(--lumen-secondary)' }}></div>
        <div className="absolute top-2/3 right-1/4 w-16 h-16 rounded-full opacity-5" style={{ background: 'var(--lumen-primary)' }}></div>
        <div className="absolute top-1/4 left-1/3 w-24 h-24 rounded-full opacity-5" style={{ background: 'var(--lumen-secondary)' }}></div>
      </div>
      
      {/* Cute Mascot */}
      <LumenMascot currentPage="/sign-up" />

      {/* Header with logo */}
      <nav className="relative z-10 flex justify-between items-center p-8 w-full">
        <a href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity cursor-pointer">
          <LumenIcon size="sm" />
          <span className="text-xl font-bold text-gray-900">Lumen</span>
        </a>
        
        <div className="hidden md:flex space-x-8">
          <a href="/" className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">HOME</a>
          <a href="/about" className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">ABOUT</a>
          <a href="/features" className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">FEATURES</a>
          <a href="/contact" className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">CONTACT</a>
        </div>
      </nav>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] px-6">
        <div className="w-full max-w-md">
          {/* Welcome message */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
              Begin Your Journey
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Join Lumen and start your path to better mental wellness.
            </p>
          </div>

          {/* Clerk SignUp with custom theming */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
            <SignUp 
              appearance={{
                variables: {
                  colorPrimary: '#FBBF24', // Lumen primary yellow
                  colorBackground: 'transparent',
                  colorInputBackground: '#f8fafc',
                  colorInputText: '#1f2937',
                  colorText: '#374151',
                  borderRadius: '12px',
                  fontFamily: 'Inter, system-ui, sans-serif',
                },
                elements: {
                  rootBox: 'w-full',
                  card: 'bg-transparent shadow-none border-none p-0',
                  headerTitle: 'text-2xl font-bold text-gray-900 mb-2',
                  headerSubtitle: 'text-gray-600 mb-6',
                  
                  // Form elements
                  formButtonPrimary: `
                    bg-gradient-to-r from-[var(--lumen-primary)] to-[var(--lumen-secondary)] 
                    hover:from-[var(--lumen-primary)]/90 hover:to-[var(--lumen-secondary)]/90
                    text-white font-semibold py-3 px-6 rounded-xl
                    transition-all duration-200 transform hover:scale-[1.02]
                    shadow-lg hover:shadow-xl
                  `,
                  
                  formFieldInput: `
                    border-2 border-gray-200 focus:border-[var(--lumen-primary)] 
                    focus:ring-2 focus:ring-[var(--lumen-primary)]/20
                    rounded-xl px-4 py-3 bg-white/50 backdrop-blur-sm
                    transition-all duration-200
                  `,
                  
                  formFieldLabel: 'text-gray-700 font-medium mb-2',
                  
                  // Links and secondary elements
                  footerActionLink: `
                    text-[var(--lumen-secondary)] hover:text-[var(--lumen-secondary)]/80 
                    font-medium transition-colors duration-200
                  `,
                  
                  // Social buttons
                  socialButtonsBlockButton: `
                    border-2 border-gray-200 hover:border-[var(--lumen-primary)] 
                    rounded-xl py-3 px-4 bg-white/50 backdrop-blur-sm
                    transition-all duration-200 hover:bg-white/80
                  `,
                  
                  // Divider
                  dividerLine: 'bg-gray-200',
                  dividerText: 'text-gray-500 bg-white/80 px-4',
                  
                  // Footer
                  footer: 'hidden', // Hide default footer since we have our own
                  
                  // Additional signup-specific elements
                  formFieldSuccessText: 'text-green-600 text-sm',
                  formFieldErrorText: 'text-red-600 text-sm',
                }
              }}
              redirectUrl="/welcome"
              afterSignUpUrl="/welcome"
            />
          </div>

          {/* Custom footer */}
          <div className="text-center mt-6">
            <p className="text-gray-600">
              Already have an account?{' '}
              <a 
                href="/sign-in"
                className="font-semibold transition-colors duration-200"
                style={{ color: 'var(--lumen-secondary)' }}
                onMouseEnter={(e) => e.target.style.color = 'var(--lumen-secondary)/80'}
                onMouseLeave={(e) => e.target.style.color = 'var(--lumen-secondary)'}
              >
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;