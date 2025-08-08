import { useContext } from "react";
import { AnalyticsContext } from "../context/AnalyticsContext";
import type { AnalyticsContextType } from "../context/AnalyticsContext";

export const useAnalytics = (): AnalyticsContextType => {
  const context = useContext(AnalyticsContext);

  if (context === undefined) {
    throw new Error("useAnalytics must be used within an AnalyticsProvider");
  }
  return context as AnalyticsContextType;
};
