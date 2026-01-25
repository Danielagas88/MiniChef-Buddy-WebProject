/**
 * Safety analysis utilities for cooking steps
 */

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const SHORT_PRAISES = [
  "Great job!",
  "Awesome!",
  "Well done!",
  "You're doing great!",
  "Next step!",
  "Keep it up!",
];

const SAFETY_OVEN = [
  "Wait! The oven is very hot. Please ask an adult to help.",
  "Stop! Oven alert. Do not touch it without an adult.",
  "Hot zone! Let a grown-up handle the oven.",
];

const SAFETY_HEAT = [
  "Careful with the heat! Make sure an adult is watching.",
  "It's getting hot! Step back and ask for help.",
  "Boiling water is dangerous. Ask for help!",
];

const SAFETY_KNIFE = [
  "Sharp object alert! Watch your fingers.",
  "Wait! Knives are sharp. Ask an adult to cut.",
  "Cutting time! Please let an adult handle the knife.",
];

/**
 * Analyzes current step text for safety keywords
 * @param {string} stepText - The cooking step text to analyze
 * @returns {{type: 'safety' | 'normal', text: string}} Analysis result
 */
export function analyzeStep(stepText) {
  const text = stepText.toLowerCase();
  
  if (
    text.includes("oven") ||
    text.includes("bake") ||
    text.includes("roast")
  ) {
    return { type: "safety", text: getRandom(SAFETY_OVEN) };
  }
  
  if (
    text.includes("boil") ||
    text.includes("hot water") ||
    text.includes("stove") ||
    text.includes("fry")
  ) {
    return { type: "safety", text: getRandom(SAFETY_HEAT) };
  }
  
  if (
    text.includes("knife") ||
    text.includes("chop") ||
    text.includes("slice") ||
    text.includes("cut")
  ) {
    return { type: "safety", text: getRandom(SAFETY_KNIFE) };
  }
  
  return { type: "normal", text: "" };
}

/**
 * Generates speech text based on step analysis
 * @param {number} currentStepIndex - Current step index
 * @param {string} stepText - Current step text
 * @param {Object} analysis - Result from analyzeStep
 * @returns {string} Speech text to speak
 */
export function generateSpeechText(currentStepIndex, stepText, analysis) {
  if (currentStepIndex === 0) {
    return `Hi, I am ChefBot! Lets start cooking together ... ${stepText}`;
  }
  
  if (analysis.type === "safety") {
    return `${analysis.text} ... ... ${stepText}`;
  }
  
  return `${getRandom(SHORT_PRAISES)} ... ${stepText}`;
}
