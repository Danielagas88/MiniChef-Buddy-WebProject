import { Brain, Trophy, Layers, ChefHat } from "lucide-react";
import { useState, useEffect } from "react";

import TriviaGame from "./trivia/TriviaGame";
import MemoryGame from "./memory/MemoryGame";
import FoodSorter from "./foodsorter/FoodSorter";
import Leaderboard from "./common/LeaderBoard";
import GameButton from "./common/GameButton";

export default function GamesPage() {
  const [activeGame, setActiveGame] = useState(null);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:3000/api/auth/leaderboard",
      );
      if (response.ok) {
        const data = await response.json();
        setPlayers(data);
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const handleBackToArcade = () => {
    setActiveGame(null);
    fetchLeaderboard();
  };

  // --- Render Active Game View ---
  if (activeGame) {
    return (
      <div className="min-h-screen pb-10">
        <div className="max-w-4xl mx-auto px-4 py-4 md:px-6 md:py-6">
          <GameButton
            label="Back to Arcade"
            onClick={handleBackToArcade}
            variant="outline"
            className=" !bg-white/40 dark:!bg-white/10 !text-emerald-600 dark:!text-emerald-400 !border-emerald-500/20 h-14 text-base font-black shadow-lg  "
          />
        </div>

        <div className="animate-fade-in px-4 md:px-0">
          {activeGame === "trivia" && (
            <TriviaGame onBack={handleBackToArcade} />
          )}
          {activeGame === "memory" && (
            <MemoryGame onBack={handleBackToArcade} />
          )}
          {activeGame === "sorter" && (
            <FoodSorter onBack={handleBackToArcade} />
          )}
        </div>
      </div>
    );
  }

  // --- Render Menu View (The Arcade) ---
  return (
    <div className="min-h-screen px-4 py-6 md:px-6 md:py-8 max-w-6xl mx-auto space-y-8">
      {/* 1. Hero Section (Compact Version) */}
      <header className="relative text-center space-y-3">
        <div className="inline-block animate-float">
          <div className="bg-linear-to-tr from-emerald-400 to-teal-500 text-white p-3 md:p-4 rounded-3xl shadow-lg shadow-emerald-200 rotate-3">
            <ChefHat size={32} className="md:w-10 md:h-10" strokeWidth={2.5} />
          </div>
        </div>

        <h1 className="text-3xl md:text-5xl font-black text-(--text-primary) tracking-tight leading-tigh">
          Culinary{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-500 to-teal-600">
            Arcade
          </span>
        </h1>
        <p className="text-sm md:text-lg text-(--text-secondary) font-medium max-w-xl mx-auto leading-relaxed px-2">
          Train your brain & become a Master Chef! 🍳
        </p>
      </header>

      {/* 2. Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
        {/* === Card 1: Trivia === */}
        <div
          onClick={() => setActiveGame("trivia")}
          className="group relative bg-emerald-500/10 dark:bg-emerald-500/5 backdrop-blur-md rounded-4xl p-6 cursor-pointer transition-all duration-300 border-2 border-emerald-500/20 border-b-[6px] border-b-emerald-500/40 hover:-translate-y-1 active:translate-y-0 shadow-sm"
        >
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-white dark:bg-white/10 text-emerald-600 dark:text-emerald-400 p-3 rounded-2xl shadow-sm backdrop-blur-sm border border-transparent dark:border-white/10 group-hover:rotate-6 transition-transform">
                <Trophy size={24} strokeWidth={2.5} />
              </div>
              <span className="bg-emerald-200 text-emerald-800 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider">
                Popular
              </span>
            </div>
            <h3 className="text-2xl font-black text-emerald-900 mb-1">
              Chef Battle
            </h3>
            <p className="text-emerald-800/70 text-sm font-medium leading-snug mb-4">
              Ultimate food trivia quiz!
            </p>
            <div className="w-full bg-white dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold py-2.5 rounded-xl text-center text-sm shadow-sm group-hover:bg-emerald-500 group-hover:text-white transition-all border border-transparent dark:border-emerald-500/20">
              Play Now
            </div>
          </div>
        </div>

        {/* === Card 2: Food Sorter === */}
        <div
          onClick={() => setActiveGame("sorter")}
          className="group relative bg-orange-500/10 dark:bg-orange-500/5 backdrop-blur-md rounded-4xl p-6 cursor-pointer transition-all duration-300 border-2 border-orange-500/20 border-b-[6px] border-b-orange-500/40 hover:-translate-y-1 active:translate-y-0 shadow-sm"
        >
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-white dark:bg-white/10 text-orange-500 dark:text-orange-400 p-3 rounded-2xl shadow-sm backdrop-blur-sm border border-transparent dark:border-white/10 group-hover:-rotate-6 transition-transform">
                <Layers size={24} strokeWidth={2.5} />
              </div>
              <span className="bg-orange-200 text-orange-800 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider">
                Speed
              </span>
            </div>
            <h3 className="text-2xl font-black text-orange-900 mb-1">
              Food Sorter
            </h3>
            <p className="text-orange-800/70 text-sm font-medium leading-snug mb-4">
              Sort ingredients fast!
            </p>
            <div className="w-full bg-white dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 font-bold py-2.5 rounded-xl text-center text-sm shadow-sm group-hover:bg-orange-500 group-hover:text-white transition-all border border-transparent dark:border-orange-500/20">
              Start Sorting
            </div>
          </div>
        </div>

        {/* === Card 3: Memory Match === */}
        <div
          onClick={() => setActiveGame("memory")}
          className="group relative bg-violet-500/10 dark:bg-violet-500/5 backdrop-blur-md rounded-4xl p-6 cursor-pointer transition-all duration-300 border-2 border-violet-500/20 border-b-[6px] border-b-violet-500/40 hover:-translate-y-1 active:translate-y-0 shadow-sm"
        >
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-white dark:bg-white/10 text-violet-600 dark:text-violet-400 p-3 rounded-2xl shadow-sm backdrop-blur-sm border border-transparent dark:border-white/10 group-hover:scale-110 transition-transform">
                <Brain size={24} strokeWidth={2.5} />
              </div>
              <span className="bg-violet-200 text-violet-800 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider">
                Focus
              </span>
            </div>
            <h3 className="text-2xl font-black text-violet-900 mb-1">
              Memory Match
            </h3>
            <p className="text-violet-800/70 text-sm font-medium leading-snug mb-4">
              Find matching tools!
            </p>
            <div className="w-full bg-white dark:bg-violet-500/20 text-violet-600 dark:text-violet-400 font-bold py-2.5 rounded-xl text-center text-sm shadow-sm group-hover:bg-violet-500 group-hover:text-white transition-all border border-transparent dark:border-violet-500/20">
              Train Memory
            </div>
          </div>
        </div>
      </div>

      {/* 3. Leaderboard Section */}
      <section className="animate-slide-up pb-10">
        <Leaderboard players={players} isLoading={loading} />
      </section>
    </div>
  );
}
