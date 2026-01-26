import React, { useEffect, useState } from "react";
import { socket } from "../../../services/socket";
import GameButton from "../common/GameButton";
import { Loader } from "lucide-react";

export default function WaitingRoom({ onCancel, onStartGame }) {
  const [playerCount, setPlayerCount] = useState(1);

  useEffect(() => {
    socket.connect();

    const userData = {
      username:
        localStorage.getItem("username") ||
        `Chef_${Math.floor(Math.random() * 1000)}`,
    };

    socket.emit("join_waiting_room", userData);

    socket.on("user_joined_room", () => {
      setPlayerCount((prev) => prev + 1);
    });

    socket.on("start_multiplayer_game", (gameData) => {
      onStartGame(gameData);
    });

    socket.on("no_opponents_found", () => {
      alert("No online chefs found right now. Switching to Solo Mode!");
      onStartGame({ questions: null, isSolo: true });
    });

    return () => {
      socket.off("user_joined_room");
      socket.off("start_multiplayer_game");
      socket.off("no_opponents_found");
    };
  }, [onStartGame]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-10 animate-fade-in text-center space-y-8">
      <div className="bg-white/40 dark:bg-white/5 backdrop-blur-xl p-10 rounded-[3rem] shadow-2xl border border-white/40 dark:border-white/10 max-w-sm w-full relative overflow-hidden transition-all">
        <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-emerald-300 to-teal-400"></div>

        <div className="mb-8 relative flex flex-col items-center justify-center">
          <div className="absolute w-24 h-24 bg-emerald-500/20 dark:bg-emerald-500/10 rounded-full blur-xl animate-pulse"></div>

          <Loader
            className="animate-spin text-emerald-500 relative z-10 mb-4"
            size={64}
            strokeWidth={1.5}
          />

          <div className="relative z-10 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border border-emerald-500/20 animate-bounce">
            {playerCount} {playerCount === 1 ? "Chef" : "Chefs"} Waiting
          </div>
        </div>

        <h2 className="text-3xl font-black text-(--text-primary) mb-3 italic tracking-tight leading-tight">
          Finding{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-500 to-teal-500">
            Opponent...
          </span>
        </h2>
        <p className="text-(--text-secondary) text-sm font-medium px-4 leading-relaxed mb-8">
          Preparing the kitchen for a Chef Battle! Hang tight.
        </p>

        <div className="mt-auto">
          <GameButton
            label="Cancel Search"
            onClick={onCancel}
            variant="outline"
            className="w-full bg-white/40! dark:bg-white/10! text-emerald-600! dark:text-emerald-400! border-emerald-500/20! h-14 text-base font-black shadow-lg hover:bg-rose-500! hover:text-white! hover:border-rose-500! transition-all active:scale-95"
          />
        </div>
      </div>

      <p className="text-[10px] text-emerald-500 dark:text-emerald-400 font-black uppercase tracking-[0.2em] animate-pulse">
        Connecting to Live Server...
      </p>
    </div>
  );
}
