export const fakeUser = {
  id: "child-1",
  email: "liam@example.com",
  password: "123456",
  childName: "Liam",
  childAge: 9,
  parentName: "Alex",
  parentEmail: "alex@example.com",
  stats: {
    completedRecipes: 3,
    stars: 12,
    chefLevel: "Junior Chef",
    badges: ["First Recipe", "Safety Star", "Veggie Lover"],
  },
};

export const recipes = [
  {
    id: 1,
    title: "Happy Pancakes",
    level: "Easy",
    time: "15 min",
    image:
      "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=400",
    tags: ["Sweet", "Breakfast"],
    ingredients: ["egg", "milk", "flour", "sugar", "oil"],
    steps: [
      "Crack an egg into a bowl (with an adult nearby).",
      "Add milk, flour and sugar, then mix until smooth.",
      "Ask an adult to heat a pan with a little oil.",
      "Pour a small amount of batter and wait for bubbles to appear.",
      "Carefully flip the pancake and cook the other side. Enjoy!",
    ],
    safetyTips: [
      "Do not touch a hot pan without an adult.",
      "Keep ingredients away from the edge of the counter.",
    ],
  },
  {
    id: 2,
    title: "Rainbow Salad",
    level: "Easy",
    time: "10 min",
    image:
      "https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?auto=compress&cs=tinysrgb&w=400",
    tags: ["Healthy", "Lunch"],

    ingredients: [
      "tomato",
      "cucumber",
      "carrot",
      "corn",
      "olive oil",
      "lemon",
      "salt",
    ],
    steps: [
      "Wash colorful vegetables like tomato, cucumber, carrot and corn.",
      "Use a kid-safe knife or ask an adult to help with cutting.",
      "Place all ingredients in a large bowl.",
      "Add olive oil, lemon juice and a pinch of salt.",
      "Mix everything together and serve your rainbow salad!",
    ],
    safetyTips: [
      "Always cut on a cutting board.",
      "Use sharp knives only with an adult.",
    ],
  },
  {
    id: 3,
    title: "Choco Banana Shake",
    level: "Easy",
    time: "5 min",
    image:
      "https://thebakersalmanac.com/wp-content/uploads/2023/03/chocolate-banana-smoothie.jpg",
    tags: ["Drink", "Sweet"],

    ingredients: ["banana", "milk", "cocoa"],
    steps: [
      "Peel a banana and cut it into small pieces.",
      "Add milk, banana pieces and a spoon of cocoa powder into a blender.",
      "Close the blender lid tightly.",
      "Ask an adult to help you turn on the blender.",
      "Pour into a glass and add a fun straw!",
    ],
    safetyTips: [
      "Never open the blender while it is still running.",
      "Keep your hands away from the blades.",
    ],
  },
];

export const games = [
  {
    id: 1,
    title: "What’s Dangerous?",
    description:
      "Drag dangerous items (knife, fire) into the 'Do not touch' zone.",
    level: "Easy",
  },
  {
    id: 2,
    title: "Ingredient Match",
    description: "Match each ingredient to the correct recipe.",
    level: "Easy",
  },
  {
    id: 3,
    title: "Recipe Order",
    description: "Put the cooking steps in the right order.",
    level: "Medium",
  },
];

export const parentReportTemplate = {
  totalTimeThisWeek: "45 min",
  safetyNotes: [
    "The child always asks for help when using the stove.",
    "Still needs reminders about sharp knives.",
  ],
};
