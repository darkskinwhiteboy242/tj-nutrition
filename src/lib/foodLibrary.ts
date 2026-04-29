import { Food } from './types';

export const FOOD_LIBRARY: Food[] = [
  // Morning Staples
  { id: 'almond-milk-latte-16oz', name: 'Almond Milk Latte 16oz', category: 'morning', defaultMealSection: 'breakfast', calories: 100, protein: 1, fiber: 0, defaultDaily: true },
  { id: 'sf-hazelnut-creamer-1tbsp', name: 'Sugar-Free Hazelnut Creamer 1tbsp', category: 'morning', defaultMealSection: 'breakfast', calories: 15, protein: 0, fiber: 0, defaultDaily: false },
  { id: 'green-juice', name: 'Green Juice (apple/celery/parsley/ginger/lemon)', category: 'morning', defaultMealSection: 'breakfast', calories: 70, protein: 1, fiber: 2, defaultDaily: true },
  { id: 'konsyl-psyllium', name: 'Konsyl Psyllium Husk Packet', category: 'morning', defaultMealSection: 'breakfast', calories: 20, protein: 0, fiber: 5, defaultDaily: true },
  { id: 'benefiber-packet', name: 'Benefiber Packet', category: 'morning', defaultMealSection: 'breakfast', calories: 15, protein: 0, fiber: 3, defaultDaily: true },

  // Protein Sources
  { id: 'egg-whites-1cup-1whole', name: 'Egg Whites 1 cup + 1 Whole Egg', category: 'protein', defaultMealSection: 'breakfast', calories: 205, protein: 32, fiber: 0, defaultDaily: true },
  { id: 'egg-whites-4-1whole', name: 'Egg Whites 4 + 1 Whole Egg', category: 'protein', defaultMealSection: 'breakfast', calories: 185, protein: 28, fiber: 0, defaultDaily: false },
  { id: 'ground-turkey-4oz', name: 'Ground Turkey 4oz (93/7)', category: 'protein', defaultMealSection: 'breakfast', calories: 175, protein: 22, fiber: 0, defaultDaily: false },
  { id: 'ground-turkey-5oz', name: 'Ground Turkey 5oz (93/7)', category: 'protein', defaultMealSection: 'dinner', calories: 219, protein: 28, fiber: 0, defaultDaily: false },
  { id: 'ground-beef-4oz', name: 'Ground Beef 4oz (93/7 Grass Fed)', category: 'protein', defaultMealSection: 'dinner', calories: 190, protein: 24, fiber: 0, defaultDaily: false },
  { id: 'ground-beef-4-5oz', name: 'Ground Beef 4.5oz (93/7 Grass Fed)', category: 'protein', defaultMealSection: 'dinner', calories: 215, protein: 27, fiber: 0, defaultDaily: false },
  { id: 'salmon-3oz', name: 'Salmon 3oz', category: 'protein', defaultMealSection: 'dinner', calories: 120, protein: 20, fiber: 0, defaultDaily: false },
  { id: 'salmon-4oz', name: 'Salmon 4oz', category: 'protein', defaultMealSection: 'dinner', calories: 160, protein: 23, fiber: 0, defaultDaily: false },
  { id: 'salmon-4-5oz', name: 'Salmon 4.5oz', category: 'protein', defaultMealSection: 'dinner', calories: 225, protein: 26, fiber: 0, defaultDaily: false },
  { id: 'chicken-breast-3oz', name: 'Chicken Breast 3oz', category: 'protein', defaultMealSection: 'dinner', calories: 120, protein: 20, fiber: 0, defaultDaily: false },
  { id: 'rotisserie-chicken-4oz', name: 'Rotisserie Chicken Breast 4oz', category: 'protein', defaultMealSection: 'dinner', calories: 185, protein: 35, fiber: 0, defaultDaily: false },
  { id: 'jerk-chicken-3-4oz', name: 'Jerk Chicken 3-4oz', category: 'protein', defaultMealSection: 'dinner', calories: 165, protein: 28, fiber: 0, defaultDaily: false },
  { id: 'turkey-pepperoni-12pc', name: 'Turkey Pepperoni 12 pieces', category: 'protein', defaultMealSection: 'afternoon', calories: 100, protein: 10, fiber: 0, defaultDaily: false },
  { id: 'turkey-sticks-x2', name: 'Turkey Sticks x2', category: 'protein', defaultMealSection: 'afternoon', calories: 80, protein: 10, fiber: 0, defaultDaily: false },
  { id: 'chomps-beef-stick', name: 'Chomps Beef Stick (1 stick)', category: 'protein', defaultMealSection: 'afternoon', calories: 100, protein: 10, fiber: 0, defaultDaily: false },
  { id: 'better-bovine-jerky-50g', name: 'Better Bovine Jerky Full Pack (50g)', category: 'protein', defaultMealSection: 'afternoon', calories: 130, protein: 30, fiber: 0, defaultDaily: false },
  { id: '1st-tee-sriracha-jerky', name: '1st Tee Sriracha Beef Jerky Full Bag', category: 'protein', defaultMealSection: 'afternoon', calories: 225, protein: 43, fiber: 0, defaultDaily: false },
  { id: 'cottage-cheese-113g', name: "Cottage Cheese 113g (Breakstone's)", category: 'protein', defaultMealSection: 'dinner', calories: 120, protein: 11, fiber: 0, defaultDaily: false },
  { id: 'dino-nuggets-x2', name: 'Dino Nuggets x2', category: 'protein', defaultMealSection: 'snacks', calories: 100, protein: 6, fiber: 0, defaultDaily: false },

  // Shakes & Broth
  { id: 'core-power-elite-42g', name: 'Core Power Elite 42g Shake', category: 'shake-broth', defaultMealSection: 'afternoon', calories: 230, protein: 42, fiber: 0, defaultDaily: true },
  { id: 'bone-broth-2pk-standard', name: 'Bone Broth 2 Packs (standard)', category: 'shake-broth', defaultMealSection: 'breakfast', calories: 100, protein: 20, fiber: 0, defaultDaily: true },
  { id: 'bone-broth-2pk-ketostat', name: 'Bone Broth 2 Packs (Ketostat Grass Fed)', category: 'shake-broth', defaultMealSection: 'breakfast', calories: 130, protein: 32, fiber: 0, defaultDaily: false },
  { id: 'orgain-collagen-1scoop', name: 'Orgain Collagen Peptides 1 scoop', category: 'shake-broth', defaultMealSection: 'breakfast', calories: 80, protein: 19, fiber: 0, defaultDaily: true },
  { id: 'isopure-vanilla-1scoop', name: 'Isopure Zero Carb Vanilla 1 scoop', category: 'shake-broth', defaultMealSection: 'afternoon', calories: 110, protein: 25, fiber: 0, defaultDaily: false },
  { id: 'iso100-1scoop', name: 'Dymatize ISO100 Hydrolyzed 1 scoop', category: 'shake-broth', defaultMealSection: 'afternoon', calories: 110, protein: 25, fiber: 0, defaultDaily: false },
  { id: 'xtend-bcaa-1scoop', name: 'Xtend BCAA 1 scoop', category: 'shake-broth', defaultMealSection: 'afternoon', calories: 15, protein: 0, fiber: 0, defaultDaily: false },

  // Yogurt & Dairy
  { id: 'fage-0-170g', name: 'Fage 0% Plain Greek Yogurt 170g', category: 'yogurt-dairy', defaultMealSection: 'breakfast', calories: 90, protein: 18, fiber: 0, defaultDaily: true },
  { id: 'fage-0-150g', name: 'Fage 0% Plain Greek Yogurt 150g', category: 'yogurt-dairy', defaultMealSection: 'breakfast', calories: 80, protein: 16, fiber: 0, defaultDaily: false },
  { id: 'oikos-triple-zero', name: 'Oikos Triple Zero (any flavor)', category: 'yogurt-dairy', defaultMealSection: 'afternoon', calories: 100, protein: 15, fiber: 0, defaultDaily: false },
  { id: 'too-good-vanilla', name: 'Too Good Vanilla Yogurt', category: 'yogurt-dairy', defaultMealSection: 'afternoon', calories: 80, protein: 12, fiber: 0, defaultDaily: false },
  { id: 'chia-seeds-1tsp', name: 'Chia Seeds 1 tsp', category: 'yogurt-dairy', defaultMealSection: 'breakfast', calories: 30, protein: 1, fiber: 3, defaultDaily: false },
  { id: 'chia-seeds-2tsp', name: 'Chia Seeds 2 tsp', category: 'yogurt-dairy', defaultMealSection: 'breakfast', calories: 60, protein: 2, fiber: 5, defaultDaily: true },
  { id: 'ground-flaxseed-1tbsp', name: 'Ground Flaxseed 1 tbsp', category: 'yogurt-dairy', defaultMealSection: 'breakfast', calories: 37, protein: 1, fiber: 2, defaultDaily: false },

  // Carbs & Produce
  { id: 'sweet-potato-full', name: 'Sweet Potato Full', category: 'carbs-produce', defaultMealSection: 'dinner', calories: 200, protein: 4, fiber: 4, defaultDaily: false },
  { id: 'sweet-potato-half', name: 'Sweet Potato Half', category: 'carbs-produce', defaultMealSection: 'dinner', calories: 100, protein: 2, fiber: 2, defaultDaily: true },
  { id: 'sweet-potato-3-7oz', name: 'Sweet Potato 3.7oz', category: 'carbs-produce', defaultMealSection: 'dinner', calories: 95, protein: 2, fiber: 2, defaultDaily: false },
  { id: 'broccoli-2-3oz', name: 'Broccoli 2-3oz steamed', category: 'carbs-produce', defaultMealSection: 'dinner', calories: 25, protein: 3, fiber: 2, defaultDaily: true },
  { id: 'green-apple-large', name: 'Green Apple Large', category: 'carbs-produce', defaultMealSection: 'breakfast', calories: 110, protein: 0, fiber: 5, defaultDaily: true },
  { id: 'green-apple-small', name: 'Green Apple Small', category: 'carbs-produce', defaultMealSection: 'breakfast', calories: 80, protein: 0, fiber: 3, defaultDaily: false },
  { id: 'blueberries-35-40g', name: 'Blueberries 35-40g', category: 'carbs-produce', defaultMealSection: 'breakfast', calories: 22, protein: 0, fiber: 2, defaultDaily: false },
  { id: 'avocado-half', name: 'Avocado Half', category: 'carbs-produce', defaultMealSection: 'dinner', calories: 120, protein: 1, fiber: 5, defaultDaily: false },
  { id: 'edamame-1cup', name: 'Edamame 1 cup shelled', category: 'carbs-produce', defaultMealSection: 'afternoon', calories: 180, protein: 17, fiber: 8, defaultDaily: false },
  { id: 'rice-cake-half', name: 'Rice Cake Half', category: 'carbs-produce', defaultMealSection: 'afternoon', calories: 35, protein: 0, fiber: 0, defaultDaily: false },
  { id: 'honey-1tbsp', name: 'Honey 1 tbsp (21g)', category: 'carbs-produce', defaultMealSection: 'afternoon', calories: 60, protein: 0, fiber: 0, defaultDaily: false },
  { id: 'water-cracker', name: 'Water Cracker', category: 'carbs-produce', defaultMealSection: 'afternoon', calories: 30, protein: 0, fiber: 0, defaultDaily: false },
  { id: 'banana-medium', name: 'Banana Medium', category: 'carbs-produce', defaultMealSection: 'breakfast', calories: 105, protein: 1, fiber: 3, defaultDaily: false },

  // Snacks & Extras
  { id: 'tostitos-x5', name: 'Tostitos Restaurant Style x5 chips', category: 'snacks', defaultMealSection: 'snacks', calories: 70, protein: 1, fiber: 0, defaultDaily: false },
  { id: 'tostitos-x10', name: 'Tostitos Restaurant Style x10 chips', category: 'snacks', defaultMealSection: 'snacks', calories: 140, protein: 2, fiber: 1, defaultDaily: false },
  { id: 'sparkling-ice', name: 'Sparkling Ice Zero Sugar', category: 'snacks', defaultMealSection: 'snacks', calories: 15, protein: 0, fiber: 0, defaultDaily: false },
  { id: 'coke-zero', name: 'Coke Zero / Diet Soda', category: 'snacks', defaultMealSection: 'snacks', calories: 0, protein: 0, fiber: 0, defaultDaily: false },
  { id: 'protein-bar-200', name: 'Protein Bar ~200cal', category: 'snacks', defaultMealSection: 'snacks', calories: 200, protein: 15, fiber: 7, defaultDaily: false },
  { id: 'chimes-ginger-chew', name: 'Chimes Ginger Chews (per piece)', category: 'snacks', defaultMealSection: 'snacks', calories: 20, protein: 0, fiber: 0, defaultDaily: false },
  { id: 'cappuccino-no-sugar', name: 'Cappuccino no sugar', category: 'snacks', defaultMealSection: 'snacks', calories: 80, protein: 4, fiber: 0, defaultDaily: false },
  { id: 'cappuccino-1-sugar', name: 'Cappuccino + 1 sugar', category: 'snacks', defaultMealSection: 'snacks', calories: 90, protein: 4, fiber: 0, defaultDaily: false },
  { id: 'wawa-almond-latte', name: 'Almond Milk Latte Wawa 16oz', category: 'snacks', defaultMealSection: 'snacks', calories: 100, protein: 1, fiber: 0, defaultDaily: false },
  { id: 'mcd-large-latte-whole', name: "McDonald's Large Hot Latte (whole milk)", category: 'snacks', defaultMealSection: 'snacks', calories: 280, protein: 13, fiber: 0, defaultDaily: false },
  { id: 'mcd-large-latte-almond', name: "McDonald's Large Latte (almond milk)", category: 'snacks', defaultMealSection: 'snacks', calories: 150, protein: 6, fiber: 0, defaultDaily: false },
  { id: 'mcd-4-nuggets', name: "McDonald's 4 Nuggets", category: 'snacks', defaultMealSection: 'snacks', calories: 190, protein: 12, fiber: 0, defaultDaily: false },
  { id: 'mcd-mcdouble', name: "McDonald's McDouble", category: 'snacks', defaultMealSection: 'snacks', calories: 400, protein: 23, fiber: 2, defaultDaily: false },
  { id: 'mcd-small-fry', name: "McDonald's Small Fry", category: 'snacks', defaultMealSection: 'snacks', calories: 230, protein: 3, fiber: 2, defaultDaily: false },
  { id: 'popcorn-3cups', name: 'Popcorn plain 3 cups', category: 'snacks', defaultMealSection: 'snacks', calories: 90, protein: 3, fiber: 3, defaultDaily: false },
  { id: 'movie-popcorn-third', name: 'Movie Theater Large Popcorn 1/3', category: 'snacks', defaultMealSection: 'snacks', calories: 350, protein: 4, fiber: 4, defaultDaily: false },
];

export const APPROVED_FREE_SAUCES = [
  'G Hughes Sugar-Free BBQ',
  "Frank's RedHot",
  'Cholula',
  'Sriracha',
  'Chili Garlic Sauce',
  'Salsa',
  'Mustard',
  'Peri-Peri',
];

export function getFoodById(id: string): Food | undefined {
  return FOOD_LIBRARY.find((f) => f.id === id);
}

export function getDefaultDailyFoodIds(): string[] {
  return FOOD_LIBRARY.filter((f) => f.defaultDaily).map((f) => f.id);
}
