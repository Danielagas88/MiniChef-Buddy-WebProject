# Mini Chef Buddy

A kid-friendly cooking web app where children discover recipes, follow step-by-step sessions with an AI ChefBot, play food-themed games, and track progress. Parents get a separate dashboard behind a PIN.

# Features
- Auth — Register / login; optional 4-digit parent PIN and cooking level
- Home — Pantry helper: enter ingredients, match “any” or “all”, see suggested recipes from [TheMealDB](https://www.themealdb.com/)
- Recipes — Browse by category/level, filter by allergens; favorites (saved per user)
- Cooking session — Step-by-step instructions, ingredients list, ChefBot chat (Gemini), voice control, photo upload at finish → saved to history & profile gallery
- Games — Trivia (multiplayer via Socket.io), Memory, Food Sorter; global leaderboard
- Child profile — Achievements/badges, cooked history, gallery; update cooking level
- Parent dashboard — Summary stats and recent cooked recipes (unlocked with PIN)

# Installation
 Clone and install dependencies

```bash
git clone <your-repo-url>
cd MiniChef-Buddy-WebProject

# Backend
cd backend
npm install
cd ..

# Frontend
cd frontend
npm install
cd ..
```
# Running the app

Terminal 1 — Backend
```bash
cd backend
npm run dev
```

Terminal 2 — Frontend
```bash
cd frontend
npm run dev
```
