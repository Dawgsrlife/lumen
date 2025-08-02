import React from 'react';
import { motion } from 'framer-motion';
import { Button, Card } from '../components/ui';

const LandingPage: React.FC = () => {
  const features = [
    {
      icon: '🧠',
      title: 'Emotion Tracking',
      description: 'Track your daily emotions with our intuitive mood interface. Understand your patterns and triggers.',
    },
    {
      icon: '🤖',
      title: 'AI-Powered Insights',
      description: 'Get personalized feedback and insights from our advanced AI system powered by Google Gemini.',
    },
    {
      icon: '🎮',
      title: 'Therapeutic Games',
      description: 'Engage with carefully designed mini-games that promote mental wellness and stress relief.',
    },
    {
      icon: '📊',
      title: 'Progress Analytics',
      description: 'Visualize your mental health journey with detailed charts and progress tracking.',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah M.',
      role: 'Student',
      content: 'Lumen has completely changed how I approach my mental health. The emotion tracking is so intuitive!',
      avatar: '👩‍🎓',
    },
    {
      name: 'David K.',
      role: 'Software Engineer',
      content: 'The AI insights are incredibly accurate. It feels like having a personal therapist available 24/7.',
      avatar: '👨‍💻',
    },
    {
      name: 'Emma L.',
      role: 'Teacher',
      content: 'The therapeutic games are perfect for unwinding after a stressful day. Highly recommend!',
      avatar: '👩‍🏫',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-lumen-light via-white to-lumen-primary/5">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-12 h-12 bg-lumen-primary rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">L</span>
                </div>
                <span className="text-2xl font-bold text-lumen-dark">Lumen</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-lumen-dark leading-tight">
                Your Journey to
                <span className="text-lumen-primary block">Mental Wellness</span>
                Starts Here
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                Track emotions, get AI-powered insights, and discover therapeutic mini-games 
                designed to support your mental health journey.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={() => window.location.href = '/register'}
                  className="text-lg px-8 py-4"
                >
                  Start Your Journey
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => window.location.href = '/login'}
                  className="text-lg px-8 py-4"
                >
                  Sign In
                </Button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-lumen-primary/20 rounded-full flex items-center justify-center">
                      <span className="text-lumen-primary text-lg">😊</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lumen-dark">Today&apos;s Mood</h3>
                      <p className="text-sm text-gray-500">How are you feeling?</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-5 gap-2">
                    {['😢', '😕', '😐', '🙂', '😊'].map((emoji, index) => (
                      <button
                        key={index}
                        className="p-3 rounded-lg hover:bg-lumen-primary/10 transition-colors text-2xl"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                  
                  <div className="bg-lumen-primary/5 rounded-lg p-4">
                    <p className="text-sm text-lumen-dark">
                      &quot;Your emotions are valid. Take a moment to acknowledge how you&apos;re feeling.&quot;
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-lumen-dark mb-4">
              Everything You Need for Mental Wellness
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive platform combines cutting-edge technology with proven therapeutic 
              approaches to support your mental health journey.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center h-full">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-lumen-dark mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-lumen-dark text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Join our community of users who have transformed their mental health journey with Lumen.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-gray-800 border-gray-700 h-full">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="text-3xl">{testimonial.avatar}</div>
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-gray-400 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-300">
                    &quot;{testimonial.content}&quot;
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-lumen-primary to-lumen-secondary text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-6">
              Ready to Start Your Mental Health Journey?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of users who have already transformed their mental wellness with Lumen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="secondary"
                size="lg"
                onClick={() => window.location.href = '/register'}
                className="text-lg px-8 py-4"
              >
                Get Started Free
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => window.location.href = '/login'}
                className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-lumen-primary"
              >
                Sign In
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage; 