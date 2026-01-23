// src/data/foodSorterData.js

export const CATEGORIES = [
  {
    id: "fruit_veg",
    label: "Fruits & Veggies",
    color: "bg-green-100 text-green-600 border-green-300",
  },
  {
    id: "dairy",
    label: "Dairy",
    color: "bg-blue-100 text-blue-600 border-blue-300",
  },
  {
    id: "protein",
    label: "Protein",
    color: "bg-red-100 text-red-600 border-red-300",
  },
  {
    id: "grains",
    label: "Grains & Bread",
    color: "bg-yellow-100 text-yellow-600 border-yellow-300",
  },
];

export const foodItems = [
  // Fruits & Veggies
  { id: 1, name: "Apple", emoji: "🍎", category: "fruit_veg" },
  { id: 2, name: "Broccoli", emoji: "🥦", category: "fruit_veg" },
  { id: 3, name: "Carrot", emoji: "🥕", category: "fruit_veg" },
  { id: 4, name: "Banana", emoji: "🍌", category: "fruit_veg" },
  { id: 5, name: "Grapes", emoji: "🍇", category: "fruit_veg" },
  { id: 6, name: "Corn", emoji: "🌽", category: "fruit_veg" },
  { id: 7, name: "Tomato", emoji: "🍅", category: "fruit_veg" },
  { id: 8, name: "Strawberry", emoji: "🍓", category: "fruit_veg" },

  // Dairy
  { id: 9, name: "Cheese", emoji: "🧀", category: "dairy" },
  { id: 10, name: "Milk", emoji: "🥛", category: "dairy" },
  { id: 11, name: "Yogurt", emoji: "🥣", category: "dairy" },
  { id: 12, name: "Butter", emoji: "🧈", category: "dairy" },
  { id: 13, name: "Ice Cream", emoji: "🍦", category: "dairy" },

  // Proteins
  { id: 14, name: "Chicken", emoji: "🍗", category: "protein" },
  { id: 15, name: "Steak", emoji: "🥩", category: "protein" },
  { id: 16, name: "Egg", emoji: "🥚", category: "protein" },
  { id: 17, name: "Fish", emoji: "🐟", category: "protein" },
  { id: 18, name: "Shrimp", emoji: "🍤", category: "protein" },

  // Grains / Carbs
  { id: 19, name: "Bread", emoji: "🍞", category: "grains" },
  { id: 20, name: "Croissant", emoji: "🥐", category: "grains" },
  { id: 21, name: "Rice", emoji: "🍚", category: "grains" },
  { id: 22, name: "Spaghetti", emoji: "🍝", category: "grains" },
  { id: 23, name: "Pretzel", emoji: "🥨", category: "grains" },
  { id: 24, name: "Bagel", emoji: "🥯", category: "grains" },
  { id: 25, name: "Pancakes", emoji: "🥞", category: "grains" },
  { id: 26, name: "Cookie", emoji: "🍪", category: "grains" },
  { id: 27, name: "Donut", emoji: "🍩", category: "grains" },
  { id: 28, name: "Pizza", emoji: "🍕", category: "grains" },
  { id: 29, name: "Sandwich", emoji: "🥪", category: "grains" },
  { id: 30, name: "Fries", emoji: "🍟", category: "grains" },
];
