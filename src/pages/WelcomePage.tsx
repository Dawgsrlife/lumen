import React from "react";
import { useNavigate } from "react-router-dom";
import { useClerkUser } from "../hooks/useClerkUser";
import WelcomeScreen from "../components/WelcomeScreen";
import { apiService } from "../services/api";

const WelcomePage: React.FC = () => {
  const { user } = useClerkUser();
  const navigate = useNavigate();

  const displayName =
    user?.firstName ||
    user?.primaryEmailAddress?.emailAddress?.split("@")[0] ||
    "there";

  const handleWelcomeComplete = async () => {
    console.log(
      "WelcomePage: Welcome screen completed, checking daily status..."
    );

    try {
      // Check if user has logged today to determine where to redirect
      const response = await apiService.getTodayEmotion();
      const hasLoggedToday = response.hasLoggedToday;

      if (hasLoggedToday) {
        console.log(
          "WelcomePage: User has logged today, redirecting to dashboard"
        );
        navigate("/dashboard");
      } else {
        console.log(
          "WelcomePage: User has not logged today, redirecting to flow"
        );
        navigate("/flow");
      }
    } catch (error) {
      console.error("WelcomePage: Error checking daily status:", error);
      // On error, default to flow
      navigate("/flow");
    }
  };

  return (
    <WelcomeScreen username={displayName} onComplete={handleWelcomeComplete} />
  );
};

export default WelcomePage;
