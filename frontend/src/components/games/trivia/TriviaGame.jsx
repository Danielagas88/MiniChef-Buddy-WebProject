import { useState, useEffect, useCallback, useRef } from "react";
import { socket } from "../../../services/socket";
import { triviaQuestions } from "../../../data/triviaQuestions";
import { ChefHat, Trophy, Users } from "lucide-react";

import { SCORING } from "../common/ScoreSystem";
import GameHeader from "../common/GameHeader";
import GameEndScreen from "../common/GameEndScreen";

import TriviaStartScreen from "./TriviaStartScreen";
import WaitingRoom from "./WaitingRoom";
import TriviaQuestionCard from "./TriviaQuestionCard";
import TriviaFeedback from "./TriviaFeedback";

export default function TriviaGame({ onBack }) {
  const [gameQuestions, setGameQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState("START"); // START, PLAYING, END
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const [opponentScore, setOpponentScore] = useState(0);
  const [opponentName, setOpponentName] = useState("");
  const [roomId, setRoomId] = useState(null);
  const [battleMessage, setBattleMessage] = useState("");
  const [isWaitingForNext, setIsWaitingForNext] = useState(false);
  const [battleIsCorrect, setBattleIsCorrect] = useState(false);
  const [technicalWin, setTechnicalWin] = useState(false);
  const [countdown, setCountdown] = useState(null);

  const isBattle = !!roomId;

  const scoreRef = useRef(0);
  const questionsRef = useRef([]);
  const isFinishedRef = useRef(false);

  const startActualGame = (multiplayerData = null) => {
    setCurrentIndex(0);
    setScore(0);
    setTimeLeft(20);
    setSelectedAnswer(null);
    setShowFeedback(false);

    setOpponentScore(0);
    setIsWaitingForNext(false);
    setBattleMessage("");
    setBattleIsCorrect(false);
    setTechnicalWin(false);

    if (multiplayerData && multiplayerData.questions) {
      setGameQuestions(multiplayerData.questions);
      setRoomId(multiplayerData.roomId);

      const myName = localStorage.getItem("username");
      const oppName =
        multiplayerData.opponents.find((n) => n !== myName) || "Chef Opponent";
      setOpponentName(oppName);

      setGameState("MATCH_FOUND");
      setTimeout(() => {
        setGameState("COUNTDOWN");
        setCountdown(3);
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              setGameState("PLAYING");
              return null;
            }
            return prev - 1;
          });
        }, 1000);
      }, 2500);
    } else {
      const shuffled = [...triviaQuestions]
        .sort(() => 0.5 - Math.random())
        .slice(0, 5);
      setGameQuestions(shuffled);
      setRoomId(null);
      setGameState("PLAYING");
    }
  };

  const nextQuestion = useCallback(() => {
    setCurrentIndex((prev) => {
      const nextIdx = prev + 1;
      if (nextIdx < gameQuestions.length) {
        setSelectedAnswer(null);
        setShowFeedback(false);
        setTimeLeft(20);
        return nextIdx;
      }
      setGameState("END");
      return prev;
    });
  }, [gameQuestions.length]);

  const handleAnswerClick = useCallback(
    (option) => {
      if (showFeedback || (isBattle && isWaitingForNext)) return;

      setSelectedAnswer(option);
      const currentQ = gameQuestions[currentIndex];
      const isCorrect = option === currentQ?.correctAnswer;

      const pointsToAdd = isCorrect ? SCORING.TRIVIA.CORRECT_ANSWER : 0;
      const newTotalScore = scoreRef.current + pointsToAdd;
      setScore(newTotalScore);
      scoreRef.current = newTotalScore;

      if (isBattle) {
        setIsWaitingForNext(true);

        socket.emit("submit_answer", {
          roomId,
          isCorrect,
          score: newTotalScore,
          username: localStorage.getItem("username") || "Chef",
        });
      } else {
        setShowFeedback(true);
      }
    },
    [
      currentIndex,
      gameQuestions,
      isBattle,
      isWaitingForNext,
      roomId,
      showFeedback,
    ],
  );

  /**
   * Ends the game and saves the final score to the server.
   * Uses scoreRef to ensure we have the most up-to-date score in socket callbacks.
   */
  const finishGame = useCallback(
    async (isTechWin = false) => {
      if (isFinishedRef.current) return;
      isFinishedRef.current = true;

      const isActualTechWin = isTechWin || technicalWin;
      let finalTotal = scoreRef.current;

      if (isBattle) {
        if (isActualTechWin || scoreRef.current > opponentScore) {
          finalTotal += SCORING.TRIVIA.ONLINE_WIN_BONUS;
          setScore(finalTotal);
          scoreRef.current = finalTotal;
        }
      }

      setGameState("END");

      if (finalTotal > 0) {
        try {
          const token = localStorage.getItem("token");
          await fetch("http://localhost:3000/api/auth/score", {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ points: finalTotal }),
          });
          console.log("Score saved!");
        } catch (e) {
          console.error("Save failed", e);
        }
      }
    },
    [isBattle, technicalWin, opponentScore],
  );

  const handleExit = () => {
    if (isBattle && roomId) {
      socket.emit("leave_room", { roomId });
    }
    onBack();
  };
  /**
   * Solo Timer Logic: Runs every second when playing.
   * Automatically submits a 'null' answer when time runs out.
   */
  useEffect(() => {
    if (gameState !== "PLAYING" || showFeedback || isBattle) return;

    const timerId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerId);
          handleAnswerClick(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [gameState, showFeedback, isBattle, handleAnswerClick]);

  useEffect(() => {
    if (!isBattle) return;

    socket.on("battle_feedback", (data) => {
      setBattleMessage(data.message);
      setBattleIsCorrect(data.isCorrect);
      setShowFeedback(true);
      setIsWaitingForNext(false);

      if (data.type === "OPPONENT" || data.type === "OPPONENT_BONUS") {
        setOpponentScore(data.newScore);
      }

      if (data.type === "PLAYER_BONUS") {
        setScore(data.newScore);
        scoreRef.current = data.newScore;
      }
    });

    socket.on("opponent_left", (data) => {
      console.log("Opponent left the kitchen!");
      setTechnicalWin(true);
      setBattleMessage(data.message || "The other chef left the kitchen...");
      finishGame(true);
    });

    socket.on("move_to_next_question", () => {
      setCurrentIndex((prev) => {
        const nextIdx = prev + 1;
        if (nextIdx < questionsRef.current.length) {
          setSelectedAnswer(null);
          setShowFeedback(false);
          setIsWaitingForNext(false);
          setBattleMessage("");
          setTimeLeft(20);
          return nextIdx;
        }
        finishGame();
        return prev;
      });
    });

    return () => {
      socket.off("battle_feedback");
      socket.off("move_to_next_question");
      socket.off("opponent_left");
    };
  }, [isBattle, finishGame]);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  useEffect(() => {
    questionsRef.current = gameQuestions;
  }, [gameQuestions]);

  useEffect(() => {
    return () => {
      if (isBattle && roomId) {
        console.log("Leaving room before unmount...");
        socket.emit("leave_room", { roomId });
      }
    };
  }, [isBattle, roomId]); // ירוץ כשהמשחק נסגר

  if (gameState === "WAITING") {
    return (
      <WaitingRoom
        onCancel={() => setGameState("START")}
        onStartGame={startActualGame}
      />
    );
  }
  if (gameState === "MATCH_FOUND") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center animate-fade-in">
        <div className="bg-emerald-500 p-6 rounded-full mb-6 shadow-lg animate-bounce text-white">
          <ChefHat size={64} />
        </div>
        <h3 className="text-4xl font-black text-slate-800 italic mb-4 uppercase">
          Battle Ready!
        </h3>
        <div className="bg-white px-10 py-4 rounded-full shadow-xl border-4 border-emerald-50 font-black text-slate-700 text-2xl uppercase">
          VS {opponentName}
        </div>
      </div>
    );
  }

  if (gameState === "COUNTDOWN") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-2xl font-black text-slate-300 uppercase mb-4 italic tracking-widest animate-pulse">
          Get Ready...
        </h2>
        <div className="text-[12rem] font-black text-emerald-500 italic animate-ping leading-none drop-shadow-2xl">
          {countdown}
        </div>
      </div>
    );
  }

  if (gameState === "START") {
    return (
      <TriviaStartScreen
        onStartGame={(m) =>
          m === "SOLO" ? startActualGame() : setGameState("WAITING")
        }
      />
    );
  }
  if (gameState === "PLAYING") {
    const q = gameQuestions[currentIndex];

    return (
      <div className="w-full animate-fade-in pb-10">
        {isBattle ? (
          <div className="max-w-3xl mx-auto px-4 mb-8">
            <div className="bg-white/40 dark:bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-6 shadow-2xl border border-white/40 dark:border-white/10 flex justify-between items-center relative overflow-hidden transition-all">
              <div className="flex items-center gap-4 relative z-10">
                <div className="bg-emerald-500 p-3 rounded-2xl text-white shadow-lg shadow-emerald-500/20 ring-2 ring-white/20">
                  <Users size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase italic tracking-widest leading-none mb-1">
                    You
                  </p>
                  <p className="text-4xl font-black text-(--text-primary) leading-none tabular-nums">
                    {score}
                  </p>
                </div>
              </div>

              <div className="absolute left-1/2 -translate-x-1/2 bg-white/60 dark:bg-white/10 px-6 py-2 rounded-full font-black text-(--text-secondary) italic text-sm border border-white/40 dark:border-white/10 shadow-sm backdrop-blur-md">
                VS
              </div>

              <div className="flex items-center gap-4 text-right relative z-10">
                <div>
                  <p className="text-[11px] font-black text-orange-600 dark:text-orange-400 uppercase italic tracking-widest leading-none mb-1 truncate max-w-[100px] md:max-w-[140px]">
                    {opponentName}
                  </p>
                  <p className="text-4xl font-black text-(--text-primary) leading-none tabular-nums">
                    {opponentScore}
                  </p>
                </div>
                <div className="bg-orange-500 p-3 rounded-2xl text-white shadow-lg shadow-orange-500/20 ring-2 ring-white/20">
                  <Trophy size={24} />
                </div>
              </div>

              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-orange-500/5 pointer-events-none" />
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto px-4">
            <GameHeader
              score={score}
              timeLeft={timeLeft}
              totalTime={20}
              progressCurrent={currentIndex}
              progressTotal={gameQuestions.length}
              theme="green"
            />
          </div>
        )}

        <TriviaQuestionCard
          question={q?.question}
          options={q?.options}
          selectedAnswer={selectedAnswer}
          showFeedback={showFeedback}
          correctAnswer={q?.correctAnswer}
          onAnswerClick={handleAnswerClick}
        />

        {showFeedback && (
          <div className="max-w-3xl mx-auto px-4 mt-6">
            <TriviaFeedback
              isCorrect={
                isBattle ? battleIsCorrect : selectedAnswer === q?.correctAnswer
              }
              fact={isBattle ? battleMessage : q?.fact}
              onNext={nextQuestion}
              isLastQuestion={currentIndex === gameQuestions.length - 1}
              showNextButton={!isBattle}
              isBattle={isBattle}
            />
          </div>
        )}
      </div>
    );
  }

  if (gameState === "END") {
    return (
      <GameEndScreen
        score={score}
        isBattle={isBattle}
        opponentScore={opponentScore}
        opponentName={opponentName}
        technicalWin={technicalWin}
        winBonus={SCORING.TRIVIA.ONLINE_WIN_BONUS}
        onPlayAgain={() => {
          isFinishedRef.current = false;
          setGameState("START");
        }}
        onExit={handleExit}
        variant="emerald"
      />
    );
  }
}
