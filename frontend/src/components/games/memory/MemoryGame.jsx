import React, { useState, useEffect, useCallback } from "react";
// Data
import { memoryCards } from "../../../data/memoryCards";

// Common Components
import GameButton from "../common/GameButton";
import GameHeader from "../common/GameHeader";
import GameEndScreen from "../common/GameEndScreen";
import { calculateMemoryScore } from "../common/ScoreSystem";

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
      <div className="flex flex-col items-center justify-center py-12 animate-fade-in text-center space-y-8 px-4">
        <div className="bg-violet-500/10 dark:bg-violet-500/5 backdrop-blur-md p-8 rounded-full text-violet-600 dark:text-violet-400 shadow-inner border border-violet-500/20 transform hover:scale-110 transition-transform">
          <Brain size={64} strokeWidth={1.5} />
        </div>

        <div className="space-y-3">
          <h2 className="text-4xl font-black text-(--text-primary) tracking-tight">
            Memory Match
          </h2>
          <p className="text-(--text-secondary) font-medium text-lg max-w-xs mx-auto leading-relaxed">
            Train your brain! Find all matching kitchen pairs before time runs
            out.
          </p>
        </div>

        <GameButton
          label="Start Game"
          onClick={initializeGame}
          variant="primary"
          className="!bg-violet-600 !text-white px-12 py-4 text-xl font-black rounded-full shadow-xl shadow-violet-500/20 active:scale-95 transition-all"
        />
      </div>
    );
  }

  // VIEW: End Screen
  if (gameState === "END") {
    return (
      <GameEndScreen
        score={score}
        moves={moves}
        onPlayAgain={initializeGame}
        onExit={onBack}
        variant="violet"
      />
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
