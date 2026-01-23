// src/components/games/common/ScoreSystem.js

/**
 * Centralized scoring configuration for all games.
 * This allows easy adjustment of points without hunting through component code.
 */
export const SCORING = {
  TRIVIA: {
    CORRECT_ANSWER: 10,
    ONLINE_WIN_BONUS: 30,
  },
  FOOD_SORTER: {
    CORRECT_SORT: 5,
  },
  MEMORY: {
    GAME_COMPLETION: 50,
    PERFECT_GAME_BONUS: 50, // Bonus for finishing with few moves
    MOVES_THRESHOLD: 10, // The threshold for the "Perfect Game" bonus
  },
};

/**
 * Helper function to calculate total score for Memory Game
 * @param {number} moves - Total moves taken
 * @returns {number} - The calculated score
 */
export const calculateMemoryScore = (moves) => {
  let score = SCORING.MEMORY.GAME_COMPLETION;
  if (moves <= SCORING.MEMORY.MOVES_THRESHOLD) {
    score += SCORING.MEMORY.PERFECT_GAME_BONUS;
  }
  return score;
};
