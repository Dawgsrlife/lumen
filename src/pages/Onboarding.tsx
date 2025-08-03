import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, Button, LoadingSpinner } from '../components/ui';
import { useClerkUser } from '../hooks/useClerkUser';

const Onboarding: React.FC = () => {
  const { user } = useClerkUser();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const steps = [
    {
      title: 'Welcome to Lumen!',
      subtitle: 'Your mental wellness journey starts here',
      content: (
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-lumen-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🌟</span>
          </div>
          <h2 className="text-2xl font-bold text-lumen-dark">
            Welcome, {user?.firstName || 'there'}!
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
            We&apos;re excited to help you on your mental health journey. Let&apos;s get you set up 
            with a personalized experience that works for you.
          </p>
        </div>
      ),
    },
    {
      title: 'How often do you want to check in?',
      subtitle: 'We&apos;ll remind you to track your emotions',
      content: (
        <div className="space-y-4">
          {[
            { label: 'Daily', description: 'Check in every day', icon: '📅' },
            { label: 'Every few days', description: 'Check in 2-3 times a week', icon: '📊' },
            { label: 'Weekly', description: 'Check in once a week', icon: '📈' },
            { label: 'No reminders', description: 'I&apos;ll check in when I remember', icon: '🔕' },
          ].map((option, index) => (
            <button
              key={index}
              className="w-full p-4 border border-gray-200 rounded-lg hover:border-lumen-primary hover:bg-lumen-primary/5 transition-all text-left"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{option.icon}</span>
                <div>
                  <div className="font-semibold text-lumen-dark">{option.label}</div>
                  <div className="text-sm text-gray-600">{option.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      ),
    },
    {
      title: 'What brings you to Lumen?',
      subtitle: 'This helps us personalize your experience',
      content: (
        <div className="space-y-4">
          {[
            { label: 'Stress Management', description: 'I want to better manage daily stress', icon: '🧘' },
            { label: 'Mood Tracking', description: 'I want to understand my emotional patterns', icon: '📊' },
            { label: 'Mental Health Support', description: 'I&apos;m looking for mental health resources', icon: '💙' },
            { label: 'Personal Growth', description: 'I want to improve my overall wellbeing', icon: '🌱' },
            { label: 'Just Exploring', description: 'I&apos;m curious about mental health apps', icon: '🔍' },
          ].map((option, index) => (
            <button
              key={index}
              className="w-full p-4 border border-gray-200 rounded-lg hover:border-lumen-primary hover:bg-lumen-primary/5 transition-all text-left"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{option.icon}</span>
                <div>
                  <div className="font-semibold text-lumen-dark">{option.label}</div>
                  <div className="text-sm text-gray-600">{option.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      ),
    },
    {
      title: 'Your privacy matters',
      subtitle: 'Choose how you want to share your data',
      content: (
        <div className="space-y-6">
          <div className="bg-lumen-primary/5 rounded-lg p-4">
            <h3 className="font-semibold text-lumen-dark mb-2">🔒 Your data is secure</h3>
            <p className="text-sm text-gray-600">
              We use industry-standard encryption and never share your personal information 
              with third parties without your explicit consent.
            </p>
          </div>
          
          <div className="space-y-4">
            {[
              { label: 'Private', description: 'Only I can see my data', icon: '🔐' },
              { label: 'Anonymous Research', description: 'Share anonymized data for research', icon: '📊' },
              { label: 'Community', description: 'Share insights with the community', icon: '👥' },
            ].map((option, index) => (
              <button
                key={index}
                className="w-full p-4 border border-gray-200 rounded-lg hover:border-lumen-primary hover:bg-lumen-primary/5 transition-all text-left"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{option.icon}</span>
                  <div>
                    <div className="font-semibold text-lumen-dark">{option.label}</div>
                    <div className="text-sm text-gray-600">{option.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: "You&apos;re all set!",
      subtitle: 'Welcome to your mental wellness journey',
      content: (
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-lumen-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🎉</span>
          </div>
          <h2 className="text-2xl font-bold text-lumen-dark">
            Welcome to Lumen!
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Your personalized mental wellness experience is ready. Start by checking in 
            with your emotions and explore the features that work best for you.
          </p>
          <div className="bg-lumen-primary/5 rounded-lg p-4">
            <p className="text-sm text-lumen-dark">
              💡 Tip: Try checking in with your emotions daily to build healthy habits!
            </p>
          </div>
        </div>
      ),
    },
  ];

  const handleNext = async () => {
    if (currentStep === steps.length - 1) {
      setIsLoading(true);
      // Simulate API call to complete onboarding
      await new Promise(resolve => setTimeout(resolve, 1500));
      navigate('/dashboard');
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const handleSkip = () => {
    navigate('/dashboard');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <div className="mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lumen-light via-white to-lumen-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="p-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">
                Step {currentStep + 1} of {steps.length}
              </span>
              <span className="text-sm text-lumen-primary font-medium">
                {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-lumen-primary h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-lumen-dark mb-2">
                  {steps[currentStep].title}
                </h1>
                <p className="text-gray-600">
                  {steps[currentStep].subtitle}
                </p>
              </div>
              
              <div className="min-h-[300px] flex items-center justify-center">
                {steps[currentStep].content}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              onClick={handleSkip}
              disabled={isLoading}
            >
              Skip
            </Button>
            
            <Button
              onClick={handleNext}
              loading={isLoading}
              size="lg"
            >
              {currentStep === steps.length - 1 ? 'Get Started' : 'Continue'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding; 