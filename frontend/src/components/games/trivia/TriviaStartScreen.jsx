import React from "react";
import { BookOpen, Swords, Trophy } from "lucide-react";
import battleImage from "../../../assets/trivia/chef_battle.png";
import chefImage from "../../../assets/trivia/chef.png";

export default function TriviaStartScreen({ onStartGame }) {
  return (
    <div className="w-full max-w-md mx-auto py-8 px-4 animate-fade-in space-y-8">
      {/* Header Bubble */}
      <div className="text-center flex flex-col items-center space-y-2">
        <div className="bg-emerald-500/10 dark:bg-emerald-500/5 backdrop-blur-md p-6 rounded-full text-emerald-600 dark:text-emerald-400 shadow-sm border border-emerald-500/20 transform hover:scale-110 transition-transform duration-300">
          <Trophy size={64} strokeWidth={1.5} />
        </div>
        <h2 className="text-4xl font-black text-(--text-primary) tracking-tight">
          Trivia Challenge
        </h2>
        <p className="text-(--text-secondary) font-medium text-lg">
          Choose your game mode
        </p>
      </div>

      {/* Menu Buttons */}
      <div className="space-y-6">
        {/* Solo Mode */}
        <button
          onClick={() => onStartGame("SOLO")}
          className="relative w-full h-36 rounded-[2.5rem] overflow-hidden group shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02] active:scale-95 border-4 border-white"
        >
          <img
            src={chefImage}
            alt="Solo"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/90 to-cyan-800/40" />

          <div className="absolute inset-0 flex items-center justify-between px-8 z-10">
            <div className="text-left text-white">
              <div className="flex items-center gap-2 mb-2 bg-black/20 w-fit px-3 py-1 rounded-full backdrop-blur-sm">
                <BookOpen size={16} className="text-cyan-300" />
                <span className="text-cyan-300 font-bold text-xs uppercase tracking-wider">
                  Solo Mode
                </span>
              </div>
              <h3 className="text-3xl font-black">Training</h3>
            </div>
            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white group-hover:bg-white group-hover:text-cyan-600 transition-colors shadow-lg">
              ➜
            </div>
          </div>
        </button>

        {/* Battle Mode */}
        <button
          onClick={() => onStartGame("ONLINE")}
          className="relative w-full h-36 rounded-[2.5rem] overflow-hidden group shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02] active:scale-95 border-4 border-white"
        >
          <img
            src={battleImage}
            alt="Battle"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-rose-900/90 to-rose-800/40" />

          <div className="absolute inset-0 flex items-center justify-between px-8 z-10">
            <div className="text-left text-white">
              <div className="flex items-center gap-2 mb-2 bg-black/20 w-fit px-3 py-1 rounded-full backdrop-blur-sm">
                <Swords size={16} className="text-rose-300" />
                <span className="text-rose-300 font-bold text-xs uppercase tracking-wider">
                  Multiplayer
                </span>
              </div>
              <h3 className="text-3xl font-black">Battle</h3>
            </div>
            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white group-hover:bg-white group-hover:text-rose-600 transition-colors shadow-lg">
              ➜
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
