import { SignIn } from '@clerk/clerk-react';
import { useNavigate, useLocation } from 'react-router-dom';

export const SignInForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  return (
    <div className="min-h-screen bg-lumen-light flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-lumen-dark mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to continue your mental health journey</p>
        </div>
        
        <SignIn 
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "shadow-none",
              headerTitle: "text-2xl font-bold text-lumen-dark",
              headerSubtitle: "text-gray-600",
              formButtonPrimary: "bg-lumen-primary hover:bg-lumen-primary/90 text-white",
              footerActionLink: "text-lumen-secondary hover:text-lumen-secondary/80",
              formFieldInput: "border-gray-300 focus:border-lumen-primary focus:ring-lumen-primary",
              formFieldLabel: "text-gray-700",
            }
          }}
          redirectUrl={from}
          afterSignInUrl={from}
        />
        
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <button 
              onClick={() => navigate('/register')}
              className="text-lumen-secondary hover:text-lumen-secondary/80 font-semibold"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}; 