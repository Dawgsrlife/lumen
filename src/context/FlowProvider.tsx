import React, { createContext, useReducer, type ReactNode } from "react";

// Flow states - Removed onboarding, simplified flow
export type FlowStep =
  | "welcome"
  | "emotion-selection"
  | "game-prompt"
  | "game"
  | "game-completion"
  | "feedback"
  | "journaling"
  | "dashboard";

// Flow state interface
export interface FlowState {
  currentStep: FlowStep;
  selectedEmotion: string | null;
  gameData: Record<string, unknown> | null;
  journalEntry: string;
  hasCompletedToday: boolean;
  isLoading: boolean;
  error: string | null;
}

// Flow actions
export type FlowAction =
  | { type: "SET_CURRENT_STEP"; payload: FlowStep }
  | { type: "SET_SELECTED_EMOTION"; payload: string }
  | { type: "SET_GAME_DATA"; payload: Record<string, unknown> }
  | { type: "SET_JOURNAL_ENTRY"; payload: string }
  | { type: "SET_COMPLETED_TODAY"; payload: boolean }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "RESET_FLOW" }
  | { type: "COMPLETE_FLOW" }
  | { type: "NEXT_STEP" }
  | { type: "PREVIOUS_STEP" }
  | { type: "SKIP_TO_EMOTION_SELECTION" }
  | { type: "SKIP_TO_DASHBOARD" };

// Initial state
const initialState: FlowState = {
  currentStep: "welcome",
  selectedEmotion: null,
  gameData: null,
  journalEntry: "",
  hasCompletedToday: false,
  isLoading: false,
  error: null,
};

// Flow reducer
const flowReducer = (state: FlowState, action: FlowAction): FlowState => {
  switch (action.type) {
    case "SET_CURRENT_STEP":
      return { ...state, currentStep: action.payload };

    case "SET_SELECTED_EMOTION":
      return { ...state, selectedEmotion: action.payload };

    case "SET_GAME_DATA":
      return { ...state, gameData: action.payload };

    case "SET_JOURNAL_ENTRY":
      return { ...state, journalEntry: action.payload };

    case "SET_COMPLETED_TODAY":
      return { ...state, hasCompletedToday: action.payload };

    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload };

    case "RESET_FLOW":
      return {
        ...initialState,
        hasCompletedToday: state.hasCompletedToday,
      };

    case "COMPLETE_FLOW":
      return { ...state, hasCompletedToday: true };

    case "NEXT_STEP": {
      const nextSteps: Record<FlowStep, FlowStep> = {
        welcome: "emotion-selection",
        "emotion-selection": "game-prompt",
        "game-prompt": "game",
        game: "game-completion",
        "game-completion": "feedback",
        feedback: "journaling",
        journaling: "dashboard",
        dashboard: "dashboard",
      };
      return { ...state, currentStep: nextSteps[state.currentStep] };
    }

    case "PREVIOUS_STEP": {
      const prevSteps: Record<FlowStep, FlowStep> = {
        welcome: "welcome",
        "emotion-selection": "welcome",
        "game-prompt": "emotion-selection",
        game: "game-prompt",
        "game-completion": "game",
        feedback: "game-completion",
        journaling: "feedback",
        dashboard: "journaling",
      };
      return { ...state, currentStep: prevSteps[state.currentStep] };
    }

    case "SKIP_TO_EMOTION_SELECTION":
      return { ...state, currentStep: "emotion-selection" };

    case "SKIP_TO_DASHBOARD":
      return { ...state, currentStep: "dashboard" };

    default:
      return state;
  }
};

// Flow context
export interface FlowContextType {
  state: FlowState;
  dispatch: React.Dispatch<FlowAction>;
  nextStep: () => void;
  previousStep: () => void;
  resetFlow: () => void;
  completeFlow: () => void;
  setEmotion: (emotion: string) => void;
  setGameData: (data: Record<string, unknown>) => void;
  setJournalEntry: (entry: string) => void;
  skipToJournaling: () => void;
  skipToDashboard: () => void;
  skipToEmotionSelection: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const FlowContext = createContext<FlowContextType | undefined>(
  undefined
);

// Flow provider component
interface FlowProviderProps {
  children: ReactNode;
}

export const FlowProvider: React.FC<FlowProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(flowReducer, initialState);

  const nextStep = () => {
    dispatch({ type: "NEXT_STEP" });
  };

  const previousStep = () => {
    dispatch({ type: "PREVIOUS_STEP" });
  };

  const resetFlow = () => {
    dispatch({ type: "RESET_FLOW" });
  };

  const completeFlow = () => {
    dispatch({ type: "COMPLETE_FLOW" });
  };

  const setEmotion = (emotion: string) => {
    dispatch({ type: "SET_SELECTED_EMOTION", payload: emotion });
  };

  const setGameData = (data: Record<string, unknown>) => {
    dispatch({ type: "SET_GAME_DATA", payload: data });
  };

  const setJournalEntry = (entry: string) => {
    dispatch({ type: "SET_JOURNAL_ENTRY", payload: entry });
  };

  const skipToJournaling = () => {
    dispatch({ type: "SET_CURRENT_STEP", payload: "journaling" });
  };

  const skipToDashboard = () => {
    dispatch({ type: "SKIP_TO_DASHBOARD" });
  };

  const skipToEmotionSelection = () => {
    dispatch({ type: "SKIP_TO_EMOTION_SELECTION" });
  };

  const value: FlowContextType = {
    state,
    dispatch,
    nextStep,
    previousStep,
    resetFlow,
    completeFlow,
    setEmotion,
    setGameData,
    setJournalEntry,
    skipToJournaling,
    skipToDashboard,
    skipToEmotionSelection,
  };

  return <FlowContext.Provider value={value}>{children}</FlowContext.Provider>;
};
