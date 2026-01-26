/**
 * Score System
 * 
 * Centralized scoring configuration for all games.
 * This allows easy adjustment of points without hunting through component code.
 * 
 * @module components/games/common/ScoreSystem
 */

/**
 * Scoring configuration object
 * 
 * Contains point values for all game types:
 * - TRIVIA: Points for correct answers and win bonuses
 * - FOOD_SORTER: Points for correct sorting
 * - MEMORY: Points for game completion and perfect game bonuses
 * 
 * @type {Object}
 * @property {Object} TRIVIA - Trivia game scoring
 * @property {number} TRIVIA.CORRECT_ANSWER - Points for correct answer (10)
 * @property {number} TRIVIA.ONLINE_WIN_BONUS - Bonus for winning multiplayer (30)
 * @property {Object} FOOD_SORTER - Food sorter game scoring
 * @property {number} FOOD_SORTER.CORRECT_SORT - Points per correct sort (5)
 * @property {Object} MEMORY - Memory game scoring
 * @property {number} MEMORY.GAME_COMPLETION - Base points for completing game (50)
 * @property {number} MEMORY.PERFECT_GAME_BONUS - Bonus for perfect game (50)
 * @property {number} MEMORY.MOVES_THRESHOLD - Move threshold for perfect game (10)
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
 * Calculate total score for Memory Game
 * 
 * Calculates score based on number of moves taken.
 * Awards bonus points for completing with few moves (perfect game).
 * 
 * @param {number} moves - Total number of moves taken to complete the game
 * @returns {number} Total calculated score
 * 
 * @example
 * const score = calculateMemoryScore(8); // Returns 100 (50 base + 50 bonus)
 */
export const calculateMemoryScore = (moves) => {
  let score = SCORING.MEMORY.GAME_COMPLETION;
  if (moves <= SCORING.MEMORY.MOVES_THRESHOLD) {
    score += SCORING.MEMORY.PERFECT_GAME_BONUS;
  }
  return score;
};
