jsx
import React from 'react';
import { useFinancialStore } from '../store/useFinancialStore';
import GoalCard from '../components/goals/GoalCard';
import FoundryCard from '../components/goals/FoundryCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';

const GoalsPage = () => {
  const { goals, addGoal, featureAccess } = useFinancialStore();
  const access = featureAccess();

  const handleAddGoal = () => {
    const name = prompt("Enter goal name:");
    const target = parseFloat(prompt("Enter target amount:"));
    if (name && target) {
      const icon = prompt("Enter an emoji icon:", "💰");
      addGoal({ name, target, icon });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-heading text-4xl font-bold">Your Goals</h1>
        <button
          onClick={handleAddGoal}
          disabled={goals.length >= access.maxGoals}
          className="flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-4 py-2 rounded-md hover:bg-primary/90 transition-colors duration-200 disabled:bg-muted disabled:cursor-not-allowed"
        >
          <Plus size={16} /> New Goal
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <FoundryCard />
        </motion.div>
        <AnimatePresence>
          {goals.map((goal, index) => (
            <motion.div
              key={goal.id} layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0, transition: { delay: (index + 1) * 0.1 } }}
              exit={{ opacity: 0, y: -20 }}
            >
              <GoalCard goal={goal} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GoalsPage;