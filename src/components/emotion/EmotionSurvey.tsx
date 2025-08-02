import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, Button } from '../ui';

export interface SurveyQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'text' | 'scale';
  options?: string[];
  required: boolean;
}

export interface SurveyResponse {
  questionId: string;
  answer: string | number;
}

interface EmotionSurveyProps {
  emotion: string;
  intensity: number;
  onComplete: (responses: SurveyResponse[]) => void;
  onSkip: () => void;
  className?: string;
}

const EmotionSurvey: React.FC<EmotionSurveyProps> = ({
  emotion,
  onComplete,
  onSkip,
  className = '',
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState<string | number>('');

  // Generate contextual questions based on emotion
  const getQuestionsForEmotion = (emotion: string): SurveyQuestion[] => {
    const baseQuestions: SurveyQuestion[] = [
      {
        id: 'context',
        question: 'What happened today that might have influenced this feeling?',
        type: 'text',
        required: false,
      },
      {
        id: 'duration',
        question: 'How long have you been feeling this way?',
        type: 'multiple-choice',
        options: ['Just started', 'A few hours', 'Most of the day', 'Several days', 'A week or more'],
        required: true,
      },
    ];

    const emotionSpecificQuestions: Record<string, SurveyQuestion[]> = {
      '😢': [
        {
          id: 'support',
          question: 'Do you have someone you can talk to about this?',
          type: 'multiple-choice',
          options: ['Yes, I have good support', 'Somewhat, but I could use more', 'No, I feel alone', 'I prefer to handle it myself'],
          required: true,
        },
        {
          id: 'coping',
          question: 'What usually helps you when you feel this way?',
          type: 'text',
          required: false,
        },
      ],
      '😕': [
        {
          id: 'confusion',
          question: 'What feels most unclear to you right now?',
          type: 'text',
          required: false,
        },
        {
          id: 'clarity',
          question: 'What would help you feel more certain?',
          type: 'text',
          required: false,
        },
      ],
      '😐': [
        {
          id: 'energy',
          question: 'How would you rate your energy level?',
          type: 'scale',
          required: true,
        },
        {
          id: 'motivation',
          question: 'What would you like to accomplish today?',
          type: 'text',
          required: false,
        },
      ],
      '🙂': [
        {
          id: 'gratitude',
          question: 'What are you grateful for today?',
          type: 'text',
          required: false,
        },
        {
          id: 'sharing',
          question: 'Would you like to share this positive feeling with someone?',
          type: 'multiple-choice',
          options: ['Yes, I want to share it', 'I\'ll keep it to myself', 'Maybe later'],
          required: true,
        },
      ],
      '😊': [
        {
          id: 'joy',
          question: 'What brought you this joy today?',
          type: 'text',
          required: false,
        },
        {
          id: 'celebration',
          question: 'How would you like to celebrate this feeling?',
          type: 'text',
          required: false,
        },
      ],
    };

    const specificQuestions = emotionSpecificQuestions[emotion] || [];
    return [...baseQuestions, ...specificQuestions];
  };

  const questions = getQuestionsForEmotion(emotion);
  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerChange = (value: string | number) => {
    setCurrentAnswer(value);
  };

  const handleNext = () => {
    if (currentAnswer !== '') {
      const newResponses = [...responses, { questionId: currentQuestion.id, answer: currentAnswer }];
      setResponses(newResponses);
      setCurrentAnswer('');

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        onComplete(newResponses);
      }
    }
  };

  const handleSkip = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentAnswer('');
    } else {
      onComplete(responses);
    }
  };

  const renderQuestion = () => {
    switch (currentQuestion.type) {
      case 'multiple-choice':
        return (
          <div className="space-y-3">
            {currentQuestion.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerChange(option)}
                className={`w-full p-3 text-left rounded-lg border transition-all ${
                  currentAnswer === option
                    ? 'border-lumen-primary bg-lumen-primary/10 text-lumen-primary'
                    : 'border-gray-200 hover:border-lumen-primary/50'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        );

      case 'scale':
        return (
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Very Low</span>
              <span>Very High</span>
            </div>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                <button
                  key={value}
                  onClick={() => handleAnswerChange(value)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    currentAnswer === value
                      ? 'border-lumen-primary bg-lumen-primary text-white'
                      : 'border-gray-300 hover:border-lumen-primary/50'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        );

      case 'text':
        return (
          <textarea
            value={currentAnswer as string}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lumen-primary focus:border-transparent resize-none"
            rows={3}
          />
        );

      default:
        return null;
    }
  };

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={className}>
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-lumen-dark">
              Understanding Your Feelings
            </h3>
            <div className="text-sm text-gray-600">
              {currentQuestionIndex + 1} of {questions.length}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-lumen-primary h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="mb-6">
          <h4 className="text-lumen-dark font-medium mb-4">
            {currentQuestion.question}
          </h4>
          {renderQuestion()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={currentQuestion.required ? undefined : handleSkip}
            disabled={currentQuestion.required}
          >
            {currentQuestion.required ? 'Required' : 'Skip'}
          </Button>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onSkip}
            >
              Skip All
            </Button>
            <Button
              onClick={handleNext}
              disabled={currentAnswer === ''}
            >
              {currentQuestionIndex === questions.length - 1 ? 'Complete' : 'Next'}
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default EmotionSurvey; 