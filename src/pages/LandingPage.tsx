import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);
import { useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

import {
  LumenIntro,
  AnimatedBackground,
  LumenMascot,
  LumenIcon,
} from "../components/ui";

const LandingPage: React.FC = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const [showIntro, setShowIntro] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [isBeginLoading, setIsBeginLoading] = useState(false);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (showIntro) {
      const timer = setTimeout(() => {
        console.log("🎬 Starting landing page animations");
        setShowIntro(false);
        setShowContent(true);
        // Add a small delay to ensure DOM is ready
        setTimeout(() => {
          startLandingAnimations();
        }, 100);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showIntro]);

  // Simple redirect for signed-in users
  if (isLoaded && isSignedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  const startLandingAnimations = () => {
    console.log("🎨 Starting GSAP animations");
    // GSAP animations for hero text to make it pop sharply
    const ctx = gsap.context(() => {
      console.log("🎯 Setting initial states");

      // Set initial states for ALL elements - start invisible
      gsap.set("#hero-content", { opacity: 0 });
      gsap.set(navRef.current, { opacity: 0, y: -20 });
      gsap.set(".hero-line", {
        y: 100,
        opacity: 0,
        scale: 0.8,
        rotationX: 45,
        transformOrigin: "center bottom",
      });
      gsap.set(".hero-word", {
        y: 80,
        opacity: 0,
        scale: 0.7,
        rotationY: 90,
        transformOrigin: "center",
      });
      gsap.set(".hero-subtext", {
        y: 60,
        opacity: 0,
        scale: 0.9,
      });
      gsap.set(".hero-button", {
        y: 40,
        opacity: 0,
        scale: 0.8,
      });
      gsap.set(".text-sparkle", {
        opacity: 0,
        scale: 0.5,
      });
      gsap.set(".floating-particle", {
        opacity: 0,
        scale: 0.5,
      });
      gsap.set(".flying-element", {
        opacity: 0,
        scale: 0.5,
      });

      console.log("🎬 Creating timeline");
      // Create timeline for dramatic entrance
      const tl = gsap.timeline();

      // First, animate in the navigation IMMEDIATELY
      tl.to(navRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      })
        // Then fade in the hero content container
        .to(
          "#hero-content",
          {
            opacity: 1,
            duration: 0.3,
            ease: "power2.out",
          },
          "-=0.4"
        )

        // Hero headline container animation
        .to(".hero-line", {
          y: 0,
          opacity: 1,
          scale: 1,
          rotationX: 0,
          duration: 1.2,
          ease: "power3.out",
          stagger: 0.15,
          delay: 0.3,
        })
        // Word-by-word dramatic reveal
        .to(
          ".hero-word",
          {
            y: 0,
            opacity: 1,
            scale: 1,
            rotationY: 0,
            duration: 0.8,
            ease: "back.out(2.5)",
            stagger: 0.08,
          },
          "-=1"
        )

        // Subtitle with elastic bounce
        .to(
          ".hero-subtext",
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1.2,
            ease: "elastic.out(1, 0.6)",
          },
          "-=0.6"
        )
        // Button with satisfying pop
        .to(
          ".hero-button",
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "back.out(1.7)",
          },
          "-=0.4"
        )
        // Add sparkle burst effect
        .to(
          ".text-sparkle",
          {
            scale: 1.2,
            opacity: 1,
            duration: 0.6,
            ease: "back.out(1.7)",
            stagger: 0.1,
          },
          "-=0.8"
        );

      console.log("✨ Starting particle animations");
      // Floating particles animation - start after main content
      gsap.to(".floating-particle", {
        opacity: 1,
        scale: 1,
        y: -20,
        x: "random(-10, 10)",
        rotation: "random(-180, 180)",
        duration: "random(3, 6)",
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true,
        stagger: 0.2,
        delay: 2, // Start after main content
      });

      // Flying element animation
      gsap.to(".flying-element", {
        opacity: 1,
        scale: 1,
        x: "100vw",
        y: "random(-100, 100)",
        rotation: 360,
        duration: 8,
        ease: "power1.inOut",
        repeat: -1,
        delay: 3, // Start after particles
      });

      return () => ctx.revert();
    });
  };

  if (showIntro) {
    return <LumenIntro show={showIntro} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Mascot */}
      <LumenMascot currentPage="/" />

      {/* Header - Same as sign-in page */}
      <nav
        ref={navRef}
        className="relative z-50 flex justify-between items-center p-8 max-w-7xl mx-auto"
      >
        <a
          href="/"
          className="flex items-center space-x-2 hover:opacity-80 transition-all duration-300 hover:scale-105 cursor-pointer group"
        >
          <div className="group-hover:scale-110 transition-transform duration-300">
            <LumenIcon size="sm" />
          </div>
          <span className="text-xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors duration-300">
            Lumen
          </span>
        </a>

        <div className="hidden md:flex space-x-8">
          <a
            href="/"
            className="text-sm font-semibold text-gray-900 hover:text-gray-600 transition-all duration-300 hover:scale-105 cursor-pointer relative group"
          >
            HOME
            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-purple-600 transition-all duration-300 group-hover:w-full"></div>
          </a>
          <a
            href="/about"
            className="text-sm font-semibold text-gray-900 hover:text-gray-600 transition-all duration-300 hover:scale-105 cursor-pointer relative group"
          >
            ABOUT
            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-purple-600 transition-all duration-300 group-hover:w-full"></div>
          </a>
          <a
            href="/features"
            className="text-sm font-semibold text-gray-900 hover:text-gray-600 transition-all duration-300 hover:scale-105 cursor-pointer relative group"
          >
            FEATURES
            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-purple-600 transition-all duration-300 group-hover:w-full"></div>
          </a>
          <a
            href="/contact"
            className="text-sm font-semibold text-gray-900 hover:text-gray-600 transition-all duration-300 hover:scale-105 cursor-pointer relative group"
          >
            CONTACT
            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-purple-600 transition-all duration-300 group-hover:w-full"></div>
          </a>
        </div>
      </nav>

      {/* Main Content */}
      {showContent && (
        <>
          {/* Hero Section */}
          <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div
              id="hero-content"
              className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center opacity-0"
            >
              {/* Left Content */}
              <div className="space-y-24">
                {/* Main Headline */}
                <div className="space-y-16">
                  <div className="relative">
                    <h1
                      ref={headingRef}
                      className="text-5xl lg:text-6xl font-bold leading-tight text-gray-900 relative"
                      style={{ fontFamily: "Playfair Display, Georgia, serif" }}
                    >
                      <span className="block hero-line relative">
                        <span className="hero-word">Light</span>{" "}
                        <span className="hero-word">the</span>{" "}
                        <span className="hero-word">Mind.</span>
                        <span className="text-sparkle absolute -top-2 -right-2 text-2xl opacity-0">
                          ✨
                        </span>
                        <span className="text-sparkle absolute top-0 left-8 text-xl opacity-0">
                          ⭐
                        </span>
                      </span>
                      <span className="block hero-line relative">
                        <span className="hero-word">Feel,</span>{" "}
                        <span className="hero-word">Heal,</span>{" "}
                        <span className="hero-word">and</span>{" "}
                        <span className="hero-word">Grow.</span>
                        <span className="text-sparkle absolute -top-1 right-12 text-xl opacity-0">
                          💫
                        </span>
                        <span className="text-sparkle absolute bottom-2 -left-3 text-lg opacity-0">
                          ✨
                        </span>
                      </span>
                    </h1>
                  </div>

                  {/* Elevator Pitch */}
                  <p
                    ref={textRef}
                    className="text-xl leading-relaxed text-gray-600 max-w-lg hero-subtext"
                  >
                    Lumen listens when no one else does. It understands your
                    words and feelings, then gently guides you with calming
                    games and health insights tailored just for what you're
                    going through.
                  </p>
                </div>

                {/* CTA Button - INSANE ATTENTION-GRABBING MASTERPIECE */}
                <div ref={buttonRef}>
                  <button
                    onClick={() => {
                      setIsBeginLoading(true);
                      // Add a small delay to show loading state before navigation
                      setTimeout(() => {
                        window.location.href = "/sign-in";
                      }, 100); // Small delay to show loading
                    }}
                    disabled={isBeginLoading}
                    className={`hero-button relative overflow-hidden px-8 py-4 rounded-xl font-semibold text-white text-base tracking-normal transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl ${
                      isBeginLoading
                        ? "cursor-wait opacity-90"
                        : "cursor-pointer"
                    }`}
                    style={{
                      background:
                        "linear-gradient(135deg, #fbbf24 0%, #8b5cf6 100%)",
                      boxShadow: "0 4px 15px rgba(251, 191, 36, 0.3)",
                    }}
                  >
                    {/* Minimal shimmer effect - subtle and elegant */}
                    <div
                      className={`absolute inset-0 rounded-xl opacity-30 ${
                        isBeginLoading ? "animate-pulse" : ""
                      }`}
                      style={{
                        background:
                          "linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.4) 50%, transparent 70%)",
                        backgroundSize: "200% 200%",
                        animation: isBeginLoading
                          ? "shimmer 1s ease-in-out infinite"
                          : "shimmer 3s ease-in-out infinite",
                      }}
                    ></div>

                    {/* Clean, minimal button text with loading state */}
                    <span className="relative z-10 flex items-center gap-2">
                      {isBeginLoading ? (
                        <>
                          <svg
                            className="animate-spin h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Starting...
                        </>
                      ) : (
                        "Begin"
                      )}
                    </span>
                  </button>
                </div>
              </div>

              {/* Right Visual - Minimal Floating Elements */}
              <div
                ref={iconRef}
                className="relative flex items-center justify-center lg:justify-end"
              >
                {/* Clean visual space with floating particles */}
                <div className="relative w-80 h-80 flex items-center justify-center">
                  {/* Floating particles using GSAP - lower z-index */}
                  <div
                    className="floating-particle absolute top-16 right-20 w-6 h-6 rounded-full opacity-0 z-10"
                    style={{
                      background: "var(--lumen-primary)",
                      boxShadow: "0 0 20px rgba(251, 191, 36, 0.4)",
                    }}
                  ></div>
                  <div
                    className="floating-particle absolute bottom-20 left-16 w-5 h-5 rounded-full opacity-0 z-10"
                    style={{
                      background: "var(--lumen-secondary)",
                      boxShadow: "0 0 15px rgba(139, 92, 246, 0.4)",
                    }}
                  ></div>
                  <div
                    className="floating-particle absolute top-32 left-20 w-4 h-4 rounded-full opacity-0 z-10"
                    style={{
                      background: "var(--lumen-primary)",
                      boxShadow: "0 0 10px rgba(251, 191, 36, 0.3)",
                    }}
                  ></div>

                  {/* Central focus element */}
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--lumen-primary)]/20 to-[var(--lumen-secondary)]/20 backdrop-blur-sm border border-white/30"></div>
                </div>

                {/* Flying element that crosses screen */}
                <div
                  className="flying-element fixed top-1/3 -left-20 w-8 h-8 rounded-full opacity-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(45deg, var(--lumen-primary), var(--lumen-secondary))",
                    boxShadow:
                      "0 0 30px rgba(251, 191, 36, 0.6), 0 0 60px rgba(139, 92, 246, 0.4)",
                  }}
                ></div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Shimmer animation keyframes */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
