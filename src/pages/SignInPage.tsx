import React, { useEffect, useRef } from 'react';
import { SignIn } from '@clerk/clerk-react';
import { gsap } from 'gsap';
import { AnimatedBackground, LumenIcon } from '../components/ui';

const SignInPage: React.FC = () => {
  const formRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Clean entrance animations
    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set([navRef.current, headingRef.current, formRef.current], {
        opacity: 0,
        y: 30
      });

      // Animate in sequence
      const tl = gsap.timeline();
      
      tl.to(navRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out"
      })
      .to(headingRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.3")
      .to(formRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "back.out(1.7)"
      }, "-=0.4");
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative">
      {/* Animated background - same as landing page */}
      <AnimatedBackground />
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--lumen-gradient-start)]/3 via-white/40 to-[var(--lumen-gradient-end)]/3 z-5"></div>
      
      {/* Animated background elements - matching landing page */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-1">
        <div className="absolute top-20 left-20 w-32 h-32 rounded-full opacity-10" style={{ background: 'var(--lumen-primary)', filter: 'blur(2px)' }}></div>
        <div className="absolute bottom-32 right-16 w-24 h-24 rounded-full opacity-10" style={{ background: 'var(--lumen-secondary)', filter: 'blur(2px)' }}></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full opacity-10" style={{ background: 'var(--lumen-primary)', filter: 'blur(1px)' }}></div>
        <div className="absolute top-1/3 right-1/3 w-20 h-20 rounded-full opacity-10" style={{ background: 'var(--lumen-secondary)', filter: 'blur(1px)' }}></div>
      </div>

      {/* Header Navigation - exactly like landing page */}
      <nav ref={navRef} className="relative z-50 flex justify-between items-center p-8 max-w-7xl mx-auto">
        <a href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity cursor-pointer">
          <LumenIcon size="sm" />
          <span className="text-xl font-bold text-gray-900">Lumen</span>
        </a>
        
        <div className="hidden md:flex space-x-8">
          <a href="/" className="text-sm font-semibold text-gray-900 hover:text-gray-600 transition-colors">HOME</a>
          <a href="/about" className="text-sm font-semibold text-gray-900 hover:text-gray-600 transition-colors">ABOUT</a>
          <a href="/features" className="text-sm font-semibold text-gray-900 hover:text-gray-600 transition-colors">FEATURES</a>
          <a href="/contact" className="text-sm font-semibold text-gray-900 hover:text-gray-600 transition-colors">CONTACT</a>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-50 flex items-center justify-center min-h-[calc(100vh-120px)] px-8">
        <div className="w-full max-w-md">
          {/* Welcome Heading */}
          <div ref={headingRef} className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 space-y-400" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
              Welcome Back
            </h1>
            <div className="mb-4"></div>
            <p className="text-lg text-gray-600 leading-relaxed">
              Continue your journey towards mental wellness and growth.
            </p>
          </div>

          {/* Clean Form Container */}
          <div ref={formRef} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-8">
            <SignIn 
              appearance={{
                variables: {
                  colorPrimary: '#FBBF24',
                  colorBackground: 'transparent',
                  colorInputBackground: '#ffffff',
                  colorInputText: '#1f2937',
                  colorText: '#374151',
                  borderRadius: '12px',
                  fontFamily: 'Inter, system-ui, sans-serif',
                },
                elements: {
                  rootBox: 'w-full',
                  card: 'bg-transparent shadow-none border-none p-0',
                  
                  // Hide the default header since we have our own
                  headerTitle: 'hidden',
                  headerSubtitle: 'hidden',
                  
                  // Form elements with clean styling
                  formButtonPrimary: `
                    bg-gradient-to-r from-[#FBBF24] to-[#8B5CF6] 
                    hover:from-[#FBBF24]/90 hover:to-[#8B5CF6]/90
                    text-white font-semibold py-4 px-6 rounded-xl
                    transition-all duration-300 transform hover:scale-105
                    shadow-lg hover:shadow-xl border-none
                    w-full text-base
                  `,
                  
                  formFieldInput: `
                    border-2 border-gray-200/60 focus:border-[#FBBF24] 
                    focus:ring-2 focus:ring-[#FBBF24]/20
                    rounded-xl px-4 py-3 bg-white/90 backdrop-blur-sm
                    transition-all duration-300 w-full text-gray-900
                    placeholder:text-gray-500
                  `,
                  
                  formFieldLabel: 'text-gray-700 font-medium mb-2 text-sm',
                  
                  // Clean link styling
                  footerActionLink: `
                    text-[#8B5CF6] hover:text-[#8B5CF6]/80 
                    font-semibold transition-colors duration-200 text-sm
                  `,
                  
                  // Social buttons
                  socialButtonsBlockButton: `
                    border-2 border-gray-200/60 hover:border-[#FBBF24] 
                    rounded-xl py-3 px-4 bg-white/90 backdrop-blur-sm
                    transition-all duration-300 hover:bg-white
                    w-full font-medium text-gray-700
                  `,
                  
                  // Divider styling
                  dividerLine: 'bg-gray-200/60',
                  dividerText: 'text-gray-500 bg-white/90 px-4 text-sm',
                  
                  // REMOVE THE UGLY BLACK FOOTER
                  footer: 'hidden',
                  footerAction: 'hidden',
                  footerActionText: 'hidden',
                  
                  // Additional cleanup
                  formField: 'mb-4',
                  formFieldRow: 'space-y-4',
                  
                  // Error states
                  formFieldErrorText: 'text-red-500 text-sm mt-1',
                  formFieldSuccessText: 'text-green-500 text-sm mt-1',
                  
                  // Remove any unwanted clerk branding
                  footerPages: 'hidden',
                  footerPagesLink: 'hidden'
                }
              }}
              redirectUrl="/dashboard"
              afterSignInUrl="/dashboard"
            />
            
            {/* Clean custom footer */}
            <div className="text-center mt-8 pt-6 border-t border-gray-200/60">
              <p className="text-gray-600 text-sm">
                Don't have an account?{' '}
                <a 
                  href="/sign-up"
                  className="font-semibold text-[#8B5CF6] hover:text-[#8B5CF6]/80 transition-colors duration-200"
                >
                  Sign up
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;