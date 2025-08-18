import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const FeatureGates = {
  BASIC: { maxGoals: 3, splitterLimit: 30000 },
  INTERMEDIATE: { maxGoals: 6, splitterLimit: 100000 },
  STUDIO: { maxGoals: Infinity, splitterLimit: Infinity },
};

export const useFinancialStore = create(
  persist(
    (set, get) => ({
      goals: [
        { id: 'goal_1', name: 'Emergency Fund', icon: '🛡️', current: 2500, target: 5000, completed: false },
        { id: 'goal_2', name: 'Trip to Bali', icon: '✈️', current: 800, target: 4000, completed: false },
      ],
      foundry: { balance: 1250 },
      user: {
        tier: 'BASIC', // 'BASIC', 'INTERMEDIATE', 'STUDIO'
        completedGoalsCount: 0,
      },

      addGoal: (newGoal) => {
        const { user } = get();
        const currentGoals = get().goals.length;
        if (currentGoals >= FeatureGates[user.tier].maxGoals) {
          alert("Goal limit reached! Upgrade or complete goals to add more.");
          return false;
        }
        set((state) => ({ goals: [...state.goals, { ...newGoal, id: `goal_${Date.now()}`, current: 0, completed: false }] }));
        return true;
      },

      deleteGoal: (id) => set((state) => ({ goals: state.goals.filter(g => g.id !== id) })),

      addFundsToFoundry: (amount) => set((state) => ({ foundry: { balance: state.foundry.balance + amount } })),

      addFundsToGoal: (id, amount) => {
        const { foundry } = get();
        if (amount > foundry.balance) {
          alert("Not enough funds in Foundry!");
          return;
        }
        set((state) => ({
          foundry: { balance: state.foundry.balance - amount },
          goals: state.goals.map(g => {
            if (g.id === id) {
              const newCurrent = g.current + amount;
              const isCompleted = !g.completed && newCurrent >= g.target;
              if (isCompleted) {
                get()._checkUserLevelUp();
              }
              return { ...g, current: newCurrent, completed: isCompleted };
            }
            return g;
          }),
        }));
      },
      
      _checkUserLevelUp: () => {
          const completedGoals = get().goals.filter(g => g.completed).length;
          set(state => {
              let newTier = state.user.tier;
              if (completedGoals >= 3 && state.user.tier === 'BASIC') {
                  newTier = 'INTERMEDIATE';
                  setTimeout(() => alert("Congratulations! You've completed 3 goals and unlocked Intermediate features!"), 500);
              }
              return { user: { ...state.user, completedGoalsCount: completedGoals, tier: newTier } };
          });
      },
      
      featureAccess: () => FeatureGates[get().user.tier],
    }),
    {
      name: 'financial-sculptor-store-v3',
    }
  )
);