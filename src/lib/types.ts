export type FoodCategory =
  | 'morning'
  | 'protein'
  | 'shake-broth'
  | 'yogurt-dairy'
  | 'carbs-produce'
  | 'snacks';

export type MealSection =
  | 'breakfast'
  | 'afternoon'
  | 'dinner'
  | 'post-gym'
  | 'snacks';

export type Food = {
  id: string;
  name: string;
  category: FoodCategory;
  defaultMealSection: MealSection;
  calories: number;
  protein: number;
  fiber: number;
  defaultDaily: boolean;
};

export type LogStatus = 'planned' | 'eaten';

export type LogEntry = {
  id: string;
  foodId: string;
  name: string;
  calories: number;
  protein: number;
  fiber: number;
  status: LogStatus;
  mealSection: MealSection;
  loggedAt: number;
  date: string;
  portionMultiplier: number;
};

export type DailyState = {
  date: string;
  logs: LogEntry[];
  steps: number;
  activeCalories: number;
  waterOz: number;
};

export type AppFlags = {
  goingOutTonight: boolean;
  travelMode: boolean;
  isGymDay: boolean;
  todaysSplit: 'arms' | 'legs' | 'chest' | 'back' | 'rest';
};

export type DailyChecklistConfig = {
  foodIds: string[];
};

export type AppState = {
  today: DailyState;
  history: Record<string, DailyState>;
  customFoods: Food[];
  archivedDefaults: string[];
  checklist: DailyChecklistConfig;
  flags: AppFlags;
  theme: 'dark' | 'light';
  streak: number;
  lastStreakDate: string;
};

export type RecommendationType =
  | 'suggestions'
  | 'endOfDay'
  | 'fullDay'
  | 'goingOut'
  | 'catchUp'
  | 'parseFood';

export type Suggestion = {
  name: string;
  reason: string;
};

export type ParsedFood = {
  name: string;
  calories: number;
  protein: number;
  fiber: number;
  defaultPortion: string;
};
