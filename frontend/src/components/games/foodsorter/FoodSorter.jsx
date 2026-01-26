import React, { useState, useEffect, useCallback } from "react";

// Data and Types
import { foodItems, CATEGORIES } from "../../../data/foodSorterData";
import { apiClient } from "../../../lib/apiClient.js";
import { API_ENDPOINTS } from "../../../constants/api/endpoints.js";

// Scoring System
import { SCORING } from "../common/ScoreSystem";

// Common Components
import GameHeader from "../common/GameHeader";
import GameEndScreen from "../common/GameEndScreen";

// Local Components
import FoodCard from "./FoodCard";
import CategoryBucket from "./CategoryBucket";

// Icons
import { Layers, RotateCcw } from "lucide-react";

// Constants - Extracted outside the component to prevent unnecessary re-renders
const POINTS_PER_CORRECT = SCORING?.FOOD_SORTER?.CORRECT_SORT || 5;
const ROUND_TIME = 5;

export default function FoodSorter({ onBack }) {
  // --- Game State Management ---
  const [gameState, setGameState] = useState("START"); // START, PLAYING, END
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);

  // --- Animation & UI Feedback States ---
  const [isShaking, setIsShaking] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Use ref to track score to avoid stale closures
  const scoreRef = React.useRef(0);

  // --- 1. Server Integration ---
  // Syncs the final score with the database upon game completion
  const syncScoreWithServer = useCallback(async (finalScore) => {
    if (finalScore <= 0 || isFinished) return;
    setIsFinished(true);
    
    try {
      const token = localStorage.getItem("token") || "";
      // Consume response body to prevent memory leaks
      await apiClient.patch(API_ENDPOINTS.AUTH.SCORE, { points: finalScore }, { token });
    } catch (error) {
      // Score save failed - game continues normally without interrupting user experience
    }
  }, [isFinished]);

  // --- 2. Game Flow Control ---
  // Handles logic for proceeding to the next item or finishing the game
  const nextItem = useCallback(() => {
    if (currentIndex + 1 >= queue.length) {
      // Last item - use the ref value which is always up-to-date
      const finalScore = scoreRef.current;
      setGameState("END");
      syncScoreWithServer(finalScore);
    } else {
      setCurrentIndex((prev) => prev + 1);
      setTimeLeft(ROUND_TIME);
      setIsProcessing(false);
      setIsShaking(false);
      setIsAnimatingOut(false);
    }
  }, [currentIndex, queue.length, syncScoreWithServer]);

  // Initializes the game, shuffles items, and resets all stats
  const startGame = () => {
    const shuffled = [...foodItems]
      .sort(() => Math.random() - 0.5)
      .slice(0, 10);

    setQueue(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setTimeLeft(ROUND_TIME);
    setIsProcessing(false);
    setIsShaking(false);
    setIsAnimatingOut(false);
    setGameState("PLAYING");
  };

  // Logic for user choice - updates score and triggers animations
  const handleChoice = (catId) => {
    if (isProcessing) return;

    const currentItem = queue[currentIndex];
    const isCorrect = currentItem && currentItem.category === catId;

    if (isCorrect) {
      setIsProcessing(true);
      // Update both state and ref to keep them in sync
      setScore((prev) => {
        const newScore = prev + POINTS_PER_CORRECT;
        scoreRef.current = newScore;
        return newScore;
      });
      setIsAnimatingOut(true);
      setTimeout(nextItem, 600);
    } else {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      // Incorrect choices don't advance the turn; allows the user to try again
    }
  };

  // Keep scoreRef in sync with score state
  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  // --- 3. Timer Logic (Async Safe Implementation) ---
  useEffect(() => {
    if (gameState !== "PLAYING" || isProcessing) return;

    if (timeLeft <= 0) {
      // Prevents "setState synchronously within an effect" error by deferring execution
      const timeoutId = setTimeout(() => {
        setIsProcessing(true);
        setIsShaking(true);
        setTimeout(nextItem, 600);
      }, 0);
      return () => clearTimeout(timeoutId);
    }

    const timerId = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timerId);
  }, [gameState, timeLeft, isProcessing, nextItem]);

  // --- 4. CSS-in-JS Animations ---
  const styleTag = (
    <style>{`
      @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-8px); } 75% { transform: translateX(8px); } }
      @keyframes flyOut { 0% { transform: scale(1) translateY(0); opacity: 1; } 100% { transform: scale(0.5) translateY(-60px); opacity: 0; } }
      .shake-anim { animation: shake 0.4s ease-in-out; }
      .fly-out-anim { animation: flyOut 0.6s ease-in forwards; }
    `}</style>
  );

  // --- Views ---

  // Screen 1: Start Menu
  if (gameState === "START") {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center space-y-6 animate-fade-in px-4">
        <div className="bg-orange-500/10 dark:bg-orange-500/5 backdrop-blur-md p-8 rounded-full text-orange-500 dark:text-orange-400 shadow-inner border border-orange-500/20">
          <Layers size={64} strokeWidth={1.5} />
        </div>

        <div className="space-y-2">
          <h2 className="text-4xl font-black text-(--text-primary) tracking-tight">
            Food Sorter
          </h2>
          <p className="text-(--text-secondary) font-medium text-lg max-w-xs mx-auto leading-relaxed">
            Sort 10 ingredients into the correct baskets before time runs out.
          </p>
        </div>

        <button
          onClick={startGame}
          className="bg-orange-500 text-white px-10 py-4 rounded-full font-black text-xl shadow-lg shadow-orange-500/20 hover:bg-orange-600 hover:scale-105 transition-all border-b-4 border-orange-700 active:translate-y-[2px] active:border-b-2"
        >
          Start Sorting
        </button>
      </div>
    );
  }

  // Screen 2: Results / Game Over
  if (gameState === "END") {
    return (
      <GameEndScreen
        score={score}
        onPlayAgain={startGame}
        onExit={onBack}
        variant="orange"
      />
    );
  }

  // Screen 3: Active Gameplay
  const currentItem = queue[currentIndex];

  return (
    <div className="w-full max-w-2xl mx-auto pt-6 px-4 pb-12 relative animate-fade-in">
      {styleTag}

      <GameHeader
        score={score}
        timeLeft={timeLeft}
        totalTime={ROUND_TIME}
        progressCurrent={currentIndex}
        progressTotal={queue.length || 10}
        progressLabel="Item"
        theme="orange"
      />

      <div className="max-w-md mx-auto mt-4">
        <FoodCard
          item={currentItem}
          isShaking={isShaking}
          isAnimatingOut={isAnimatingOut}
        />

        <div className="grid grid-cols-2 gap-4 px-2">
          {CATEGORIES.map((cat) => (
            <CategoryBucket
              key={cat.id}
              category={cat}
              onClick={handleChoice}
              disabled={isProcessing}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
