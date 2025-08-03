import React, { useEffect, useRef } from 'react';
import { SignIn } from '@clerk/clerk-react';
import { gsap } from 'gsap';
import { AnimatedBackground, LumenIcon } from '../components/ui';

const SignInPage: React.FC = () => {
  const formRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([navRef.current, headingRef.current, formRef.current], {
        opacity: 0,
        y: 30
      });

      const tl = gsap.timeline();

      tl.to(navRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.3,
        ease: "power2.out"
      })
        .to(headingRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out"
        }, "-=0.1")
        .to(formRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out"
        }, "-=0.1");
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative">
      {/* Animated background */}
      <AnimatedBackground />

      {/* Subtle overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--lumen-gradient-start)]/3 via-white/40 to-[var(--lumen-gradient-end)]/3 z-5"></div>

      {/* Floating blur circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-1">
        <div className="absolute top-20 left-20 w-32 h-32 rounded-full opacity-10" style={{ background: 'var(--lumen-primary)', filter: 'blur(2px)' }}></div>
        <div className="absolute bottom-32 right-16 w-24 h-24 rounded-full opacity-10" style={{ background: 'var(--lumen-secondary)', filter: 'blur(2px)' }}></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full opacity-10" style={{ background: 'var(--lumen-primary)', filter: 'blur(1px)' }}></div>
        <div className="absolute top-1/3 right-1/3 w-20 h-20 rounded-full opacity-10" style={{ background: 'var(--lumen-secondary)', filter: 'blur(1px)' }}></div>
      </div>

      {/* Header */}
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

      {/* Main section */}
      <div className="relative z-50 flex items-center justify-center min-h-[calc(100vh-120px)] px-8 pb-16">
        <div className="w-full max-w-lg mx-auto">

          {/* Heading */}
          <div ref={headingRef} className="text-center">
            <div className="mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                Welcome Back
              </h1>
              <div className="mb-8"></div>
              <p className="text-lg text-gray-600 leading-relaxed text-center">
                Continue your journey towards mental wellness and growth.
              </p>
              <div className="w-32 h-1.5 mx-auto bg-gradient-to-r from-[#FBBF24] to-[#8B5CF6] rounded-full mt-8 opacity-80 hover:opacity-100 transition-opacity cursor-pointer" 
                   title="Your wellness journey starts here" />
            </div>
          </div>

          {/* Form container */}
          <div
            ref={formRef}
            className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl border border-white/20 px-8 py-10 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
          >
            <div className="flex justify-center">
              <SignIn
                redirectUrl="/dashboard"
                afterSignInUrl="/dashboard"
                appearance={{
                  elements: {
                    formButtonPrimary: "bg-black hover:bg-gray-800 transition-all",
                    card: "shadow-none bg-transparent",
                  }
                }}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SignInPage;
