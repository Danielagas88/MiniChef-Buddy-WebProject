import React, { useState, useEffect, useCallback } from "react";

// Data and Types
import { foodItems, CATEGORIES } from "../../../data/foodSorterData";

// Scoring System
import { SCORING } from "../common/ScoreSystem";

// Common Components
import GameHeader from "../common/GameHeader";
import GameButton from "../common/GameButton";

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

  // --- 1. Server Integration ---
  // Syncs the final score with the database upon game completion
  const syncScoreWithServer = useCallback(async (finalScore) => {
    if (finalScore <= 0) return;
    try {
      const token = localStorage.getItem("token") || "";
      await fetch("http://localhost:3000/api/auth/score", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ points: finalScore }),
      });
      console.log("Score successfully synced to server");
    } catch (error) {
      console.error("Critical: Server sync failed", error);
    }
  }, []);

  // --- 2. Game Flow Control ---
  // Handles logic for proceeding to the next item or finishing the game
  const nextItem = useCallback(() => {
    if (currentIndex + 1 >= queue.length) {
      setGameState("END");
      syncScoreWithServer(score);
    } else {
      setCurrentIndex((prev) => prev + 1);
      setTimeLeft(ROUND_TIME);
      setIsProcessing(false);
      setIsShaking(false);
      setIsAnimatingOut(false);
    }
  }, [currentIndex, queue.length, score, syncScoreWithServer]);

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
      setScore((prev) => prev + POINTS_PER_CORRECT);
      setIsAnimatingOut(true);
      setTimeout(nextItem, 600);
    } else {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      // Incorrect choices don't advance the turn; allows the user to try again
    }
  };

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
        <div className="bg-orange-100 p-8 rounded-full text-orange-500 shadow-inner">
          <Layers size={64} strokeWidth={1.5} />
        </div>

        <div className="space-y-2">
          <h2 className="text-4xl font-black text-slate-800 tracking-tight">
            Food Sorter
          </h2>
          <p className="text-slate-500 font-medium text-lg max-w-xs mx-auto leading-relaxed">
            Sort 10 ingredients into the correct baskets before time runs out.
          </p>
        </div>

        <button
          onClick={startGame}
          className="bg-orange-500 text-white px-10 py-4 rounded-full font-bold text-lg shadow-xl hover:bg-orange-600 hover:scale-105 transition-all border-b-4 border-orange-700"
        >
          Start Sorting
        </button>
      </div>
    );
  }

  // Screen 2: Results / Game Over
  if (gameState === "END") {
    return (
      <div className="text-center py-12 max-w-md mx-auto animate-fade-in px-4">
        <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border-b-8 border-orange-100">
          <div className="text-7xl mb-6">🏆</div>
          <h2 className="text-4xl font-black text-slate-800 mb-2 font-display">
            Well Done!
          </h2>

          <div className="bg-orange-50 p-6 rounded-3xl border border-orange-100 my-8">
            <p className="text-orange-600/60 font-black uppercase tracking-widest text-xs mb-1">
              Final Score
            </p>
            <p className="text-6xl font-black text-orange-500">{score}</p>
          </div>

          <div className="flex flex-col gap-3">
            <GameButton
              label="Play Again"
              onClick={startGame}
              variant="primary"
              className="w-full bg-orange-500 text-white border-none hover:bg-orange-600 h-14 rounded-full text-lg font-bold shadow-md"
            />

            <GameButton
              label="Exit to Menu"
              onClick={onBack}
              variant="secondary"
              className="w-full bg-slate-100 text-slate-600 border-none hover:bg-slate-200 h-14 rounded-full text-lg font-bold"
            />
          </div>
        </div>
      </div>
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
