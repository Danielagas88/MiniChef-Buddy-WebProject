/**
 * progressUtils
 *
 * Badge definitions and progress computation from recipe history.
 * Used in ChildProfile / AchievementsSection.
 *
 * @module utils/progressUtils
 */

export const BADGES = [
  { key: "first-dish", name: "First Dish", at: 1 },
  { key: "mini-chef", name: "Mini Chef", at: 15 },
  { key: "kitchen-star", name: "Kitchen Star", at: 30 },
  { key: "master-chef", name: "Master Chef", at: 50 },
];

export function computeProgress(historyItems = []) {
  const totalCooked = historyItems.length;

  const totalMinutes = historyItems.reduce(
    (sum, item) => sum + (Number(item.minutes) || 0),
    0
  );

  const earnedBadges = BADGES.filter((b) => totalCooked >= b.at);

  const progressToNext = totalCooked % 15;
  const progressPercent = Math.round((progressToNext / 15) * 100);

  // nice label for UI
  const nextMilestone =
    totalCooked < 15 ? 15 : totalCooked < 30 ? 30 : totalCooked < 45 ? 45 : 60;

  return {
    totalCooked,
    totalMinutes,
    earnedBadges,
    progressToNext,
    progressPercent,
    nextMilestone,
  };
}
