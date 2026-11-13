import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { classifyPageType, buildMlFeatureVector } from "../services/sessionTracker";
import { predictPurchaseIntention } from "../services/api";

const SessionContext = createContext();

export function SessionProvider({ children }) {
  const [sessionId] = useState(() => "sess_" + Math.random().toString(36).substr(2, 9));
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [currentPage, setCurrentPage] = useState("/");

  // Page Category Counts & Durations
  const [adminViews, setAdminViews] = useState(0);
  const [adminDuration, setAdminDuration] = useState(0.0);
  const [infoViews, setInfoViews] = useState(0);
  const [infoDuration, setInfoDuration] = useState(0.0);
  const [productViews, setProductViews] = useState(0); // Product views start at 0
  const [productDuration, setProductDuration] = useState(0.0);

  // Behavior Counters
  const [searchCount, setSearchCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [cartInteractionCount, setCartInteractionCount] = useState(0);
  const [exitCount, setExitCount] = useState(0);
  const [isNewVisitor] = useState(true);

  // Prediction state for UI & History tracking
  const [predictionResult, setPredictionResult] = useState(null);
  const [predictionHistory, setPredictionHistory] = useState([]);
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictionError, setPredictionError] = useState(null);

  const activePageRef = useRef("/");
  const lastTimeRef = useRef(Date.now());

  // Timer ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);

      // Accumulate active duration to current page category
      const currentCategory = classifyPageType(activePageRef.current);
      if (currentCategory === "Administrative") {
        setAdminDuration((prev) => prev + 1.0);
      } else if (currentCategory === "Informational") {
        setInfoDuration((prev) => prev + 1.0);
      } else {
        setProductDuration((prev) => prev + 1.0);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Track page navigation
  const recordPageView = (newPath) => {
    activePageRef.current = newPath;
    setCurrentPage(newPath);

    // Visiting or returning to Home page ("/") does not increment page view counters
    if (newPath === "/") {
      return;
    }

    const category = classifyPageType(newPath);
    if (category === "Administrative") {
      setAdminViews((prev) => prev + 1);
    } else if (category === "Informational") {
      setInfoViews((prev) => prev + 1);
    } else {
      setProductViews((prev) => prev + 1);
    }
  };

  const recordSearch = () => setSearchCount((prev) => prev + 1);
  const recordCategoryFilter = () => setCategoryCount((prev) => prev + 1);
  const recordCartAction = () => setCartInteractionCount((prev) => prev + 1);
  const recordExit = () => setExitCount((prev) => prev + 1);

  const totalPagesViewed = adminViews + infoViews + productViews;

  // Manual or automatic predict runner
  const fetchPrediction = async (cartItems = []) => {
    setIsPredicting(true);
    setPredictionError(null);

    const sessionState = {
      elapsedSeconds,
      totalPagesViewed,
      adminViews,
      adminDuration,
      infoViews,
      infoDuration,
      productViews,
      productDuration,
      searchCount,
      categoryCount,
      cartInteractionCount,
      exitCount,
      isNewVisitor,
      currentPage,
    };

    const mlFeatures = buildMlFeatureVector(sessionState, cartItems);

    try {
      const result = await predictPurchaseIntention(mlFeatures);
      setPredictionResult(result);

      // Append to session prediction history
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setPredictionHistory((prev) => [
        ...prev,
        {
          timestamp: timeStr,
          probability: result.conversion_probability,
          probPercent: result.conversion_probability_percent,
          prediction: result.prediction,
          label: result.label,
        },
      ]);

      return result;
    } catch (err) {
      setPredictionError("Unable to analyze the current session. Please try again.");
      return null;
    } finally {
      setIsPredicting(false);
    }
  };

  return (
    <SessionContext.Provider
      value={{
        sessionId,
        elapsedSeconds,
        currentPage,
        adminViews,
        adminDuration,
        infoViews,
        infoDuration,
        productViews,
        productDuration,
        searchCount,
        categoryCount,
        cartInteractionCount,
        totalPagesViewed,
        recordPageView,
        recordSearch,
        recordCategoryFilter,
        recordCartAction,
        recordExit,
        predictionResult,
        predictionHistory,
        isPredicting,
        predictionError,
        fetchPrediction,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
