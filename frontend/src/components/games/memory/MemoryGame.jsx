import React, { useState, useEffect, useCallback } from "react";
// Data
import { memoryCards } from "../../../data/memoryCards";

// Common Components
import GameButton from "../common/GameButton";
import GameHeader from "../common/GameHeader";
import { SCORING, calculateMemoryScore } from "../common/ScoreSystem";

// Icons
import { Brain } from "lucide-react";

// Internal Components
import MemoryCard from "./MemoryCard";

export default function MemoryGame({ onBack }) {
  // --- States ---
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState("START");
  const [shakingCards, setShakingCards] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);

  // --- Logic ---

  const initializeGame = () => {
    // Duplicate cards to create pairs and shuffle them
    const duplicated = [...memoryCards, ...memoryCards]
      .map((card, index) => ({
        ...card,
        uniqueId: index, // Unique ID for React rendering
        isFlipped: false,
        isMatched: false,
      }))
      .sort(() => Math.random() - 0.5);

    setCards(duplicated);
    setFlipped([]);
    setMatched([]);
    setShakingCards([]);
    setMoves(0);
    setScore(0);
    setTimeLeft(300);
    setGameState("PLAYING");
    setIsProcessing(false);
  };

  const handleCardClick = (clickedCard) => {
    // Prevent interaction if processing, game not active, or card already handled
    if (
      isProcessing ||
      gameState !== "PLAYING" ||
      flipped.length === 2 ||
      flipped.find((c) => c.uniqueId === clickedCard.uniqueId) ||
      matched.includes(clickedCard.id)
    ) {
      return;
    }

    // Flip the clicked card visually
    const newCards = cards.map((c) =>
      c.uniqueId === clickedCard.uniqueId ? { ...c, isFlipped: true } : c,
    );
    setCards(newCards);

    const newFlipped = [...flipped, clickedCard];
    setFlipped(newFlipped);

    // Check for match if 2 cards are now flipped
    if (newFlipped.length === 2) {
      setMoves((prev) => prev + 1);
      setIsProcessing(true); // Lock the board

      if (newFlipped[0].id === newFlipped[1].id) {
        // --- MATCH FOUND ---
        setMatched((prev) => [...prev, newFlipped[0].id]);

        // Mark cards as matched
        const matchedCards = newCards.map((c) =>
          c.id === newFlipped[0].id
            ? { ...c, isMatched: true, isFlipped: true }
            : c,
        );
        setCards(matchedCards);

        setFlipped([]);
        setIsProcessing(false); // Unlock immediately
      } else {
        // --- NO MATCH ---
        // Trigger shake animation
        setShakingCards([newFlipped[0].uniqueId, newFlipped[1].uniqueId]);

        setTimeout(() => {
          // Flip cards back after delay
          const resetCards = newCards.map((c) =>
            c.uniqueId === newFlipped[0].uniqueId ||
            c.uniqueId === newFlipped[1].uniqueId
              ? { ...c, isFlipped: false }
              : c,
          );
          setCards(resetCards);
          setFlipped([]);
          setShakingCards([]);
          setIsProcessing(false); // Unlock after animation
        }, 1000);
      }
    }
  };

  // --- Finish Game Logic (Wrapped in useCallback to avoid useEffect dependency issues) ---
  const finishGame = useCallback(
    async (isVictory) => {
      setGameState("END");

      let finalScore = 0;
      if (isVictory) {
        finalScore = calculateMemoryScore(moves);
        setScore(finalScore);
      }

      // --- SERVER SYNC IMPLEMENTATION ---
      if (finalScore > 0) {
        try {
          const token = localStorage.getItem("token") || "";
          const API_URL = "http://localhost:3000/api/auth/score";

          const res = await fetch(API_URL, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ points: finalScore }),
          });

          if (!res.ok) {
            console.error("Failed to save score to server");
          }
        } catch (error) {
          console.error("Error saving score:", error);
        }
      }
    },
    [moves],
  );

  // --- Effects ---

  // Check for Win Condition (All pairs matched)
  useEffect(() => {
    if (matched.length === memoryCards.length && memoryCards.length > 0) {
      const timer = setTimeout(() => finishGame(true), 500);
      return () => clearTimeout(timer);
    }
  }, [matched, finishGame]);

  // Timer: Decrease time every second
  useEffect(() => {
    if (gameState !== "PLAYING") return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  // Timer: Check if time ran out
  useEffect(() => {
    if (gameState === "PLAYING" && timeLeft === 0) {
      const timeoutId = setTimeout(() => {
        finishGame(false);
      }, 0);

      return () => clearTimeout(timeoutId);
    }
  }, [timeLeft, gameState, finishGame]);

  // --- Styles for Animation ---
  const styleTag = (
    <style>{`
      .perspective-1000 { perspective: 1000px; }
      .transform-style-3d { transform-style: preserve-3d; }
      .backface-hidden { backface-visibility: hidden; }
      .rotate-y-180 { transform: rotateY(180deg); }
      
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-10px); }
        40% { transform: translateX(10px); }
        60% { transform: translateX(-5px); }
        80% { transform: translateX(5px); }
      }
      .shake-animation { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
    `}</style>
  );

  // --- Render Views ---

  // VIEW: Start Screen
  if (gameState === "START") {
    return (
      <div className="flex flex-col items-center justify-center py-12 animate-fade-in text-center space-y-6">
        <div className="bg-indigo-100 p-6 rounded-full text-indigo-600 shadow-inner mb-4 transform hover:scale-110 transition-transform">
          <Brain size={64} strokeWidth={1.5} />
        </div>
        <h2 className="text-4xl font-black text-slate-800">Memory Match</h2>
        <p className="text-slate-500 font-medium text-lg max-w-xs">
          Train your brain! Find all the matching kitchen pairs before time runs
          out.
        </p>
        <GameButton
          label="Start Game"
          onClick={initializeGame}
          variant="primary"
          className="bg-indigo-600 border-indigo-800 hover:bg-indigo-500 text-white px-10 py-4 text-xl"
        />
      </div>
    );
  }

  // VIEW: End Screen
  if (gameState === "END") {
    return (
      <div className="text-center py-10 space-y-8 animate-fade-in max-w-md mx-auto">
        <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border-b-8 border-indigo-100">
          <div className="text-7xl flex justify-center mb-6">
            {score > 0 ? "🏆" : "⏰"}
          </div>
          <h2 className="text-3xl font-black text-slate-800 mb-2">
            {score > 0 ? "Well Done!" : "Time's Up!"}
          </h2>

          <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100 mb-8 space-y-2">
            <div className="flex justify-between text-indigo-800/70 font-bold uppercase text-xs tracking-widest">
              <span>Moves</span>
              <span>Score</span>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-2xl font-black text-slate-600">
                {moves}
              </span>
              <span className="text-6xl font-black text-indigo-600">
                {score}
              </span>
            </div>
          </div>

          <GameButton
            label="Play Again"
            onClick={initializeGame}
            variant="primary"
            className="w-full bg-violet-600 text-white border-none hover:bg-violet-700 h-14 rounded-full text-lg font-bold shadow-md transition-all"
          />

          <GameButton
            label="Exit to Menu"
            onClick={onBack}
            variant="secondary"
            className="w-full bg-slate-100 text-slate-600 border-none hover:bg-slate-200 h-14 rounded-full text-lg font-bold"
          />
        </div>
      </div>
    );
  }

  // VIEW: Game Board
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 animate-fade-in">
      {styleTag}

      <GameHeader
        score={score}
        timeLeft={timeLeft}
        totalTime={60}
        progressCurrent={matched.length}
        progressTotal={memoryCards.length}
        progressLabel="Pairs"
        theme="purple"
        extraInfo={`Moves: ${moves}`}
      />

      <div className="grid grid-cols-4 gap-3 md:gap-4 max-w-md mx-auto">
        {cards.map((card) => (
          <MemoryCard
            key={card.uniqueId}
            card={card}
            onClick={handleCardClick}
            disabled={isProcessing}
            isShaking={shakingCards.includes(card.uniqueId)}
          />
        ))}
      </div>
    </div>
  );
}
