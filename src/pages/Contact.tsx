import React from "react";
import { motion } from "framer-motion";
import { AnimatedBackground, LumenMascot, LumenIcon } from "../components/ui";

const Contact: React.FC = () => {
  const teamMembers = [
    {
      name: "Alex Meng",
      role: "Project Manager & Lead Developer",
      email: "alex.meng@mail.utoronto.ca",
    },
    {
      name: "Nathan Espejo",
      role: "Game Developer",
      email: "hasnate618@gmail.com",
    },
    {
      name: "Zikora Chinedu",
      role: "Full Stack Developer",
      email: "zikora.chinedu@yahoo.com",
    },
    {
      name: "Vishnu Sai",
      role: "Backend Architecture",
      email: "vishnukishan123@gmail.com",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative">
      {/* Animated background */}
      <AnimatedBackground />

      {/* Additional floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="absolute top-32 right-20 w-28 h-28 rounded-full opacity-5"
          style={{ background: "var(--lumen-primary)" }}
        ></div>
        <div
          className="absolute bottom-40 left-16 w-20 h-20 rounded-full opacity-5"
          style={{ background: "var(--lumen-secondary)" }}
        ></div>
        <div
          className="absolute top-2/3 right-1/4 w-16 h-16 rounded-full opacity-5"
          style={{ background: "var(--lumen-primary)" }}
        ></div>
        <div
          className="absolute top-1/4 left-1/3 w-24 h-24 rounded-full opacity-5"
          style={{ background: "var(--lumen-secondary)" }}
        ></div>
      </div>

      {/* Cute Mascot */}
      <LumenMascot currentPage="/contact" />

      {/* Header */}
      <nav className="relative z-10 flex justify-between items-center p-8 w-full">
        <a
          href="/"
          className="flex items-center space-x-2 hover:opacity-80 transition-opacity cursor-pointer"
        >
          <LumenIcon size="sm" />
          <span className="text-xl font-bold text-gray-900">Lumen</span>
        </a>

        <div className="hidden md:flex space-x-8">
          <a
            href="/"
            className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
          >
            HOME
          </a>
          <a
            href="/about"
            className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
          >
            ABOUT
          </a>
          <a
            href="/features"
            className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
          >
            FEATURES
          </a>
          <a
            href="/contact"
            className="text-sm font-semibold text-gray-900 hover:text-gray-600 transition-colors"
          >
            CONTACT
          </a>
        </div>
      </nav>

      {/* Full Width Content - Properly Centered */}
      <div className="relative z-10 w-full px-6 sm:px-10 py-24 sm:py-32 lg:py-40">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-12 max-w-5xl mx-auto px-4"
        >
          <div className="space-y-16">
            <h1
              className="text-5xl md:text-6xl font-bold text-gray-900 mx-auto"
              style={{ fontFamily: "Playfair Display, Georgia, serif" }}
            >
              Contact
            </h1>
            <div className="mb-8"></div>
            {/* Description */}
            <div className="space-y-8 max-w-3xl mx-auto px-4 sm:px-6">
              <p className="text-xl text-gray-700 leading-relaxed font-medium">
                Built by a passionate team of developers and designers.
              </p>
            </div>
          </div>

          {/* Team Grid */}
          <motion.div
            className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.email}
                className="bg-white/50 rounded-xl p-8 backdrop-blur-sm border border-white/20 hover:bg-white/70 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                whileHover={{ y: -2 }}
              >
                <div className="text-center space-y-3">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {member.name}
                  </h3>
                  <p className="text-gray-600 font-medium">{member.role}</p>
                  <a
                    href={`mailto:${member.email}`}
                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors inline-block mt-2"
                  >
                    {member.email}
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="pt-8"
          >
            <motion.a
              href="/sign-in"
              className="inline-flex items-center px-6 py-3 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 transition-all duration-200 shadow-sm"
              whileHover={{
                scale: 1.01,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              }}
              whileTap={{ scale: 0.99 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              Try Lumen
              <svg
                className="ml-2 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
