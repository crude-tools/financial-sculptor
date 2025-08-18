jsx
import React, { useContext, useState } from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { AppContext } from '../../context/AppContext';
import { useFinancialStore } from '../../store/useFinancialStore';
import { Target, Trash2, PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const GoalCard = ({ goal }) => {
  const { formatCurrency } = useContext(AppContext);
  const { deleteGoal, addFundsToGoal } = useFinancialStore();
  const { width, height } = useWindowSize();

  const progress = goal.target > 0 ? (goal.current / goal.target) * 100 : 0;
  
  const handleAddFunds = () => {
    const amountStr = prompt(`How much from the Foundry would you like to add to "${goal.name}"?`);
    const amount = parseFloat(amountStr);
    if (!isNaN(amount) && amount > 0) {
        addFundsToGoal(goal.id, amount);
    }
  };

  return (
    <>
      {goal.completed && <Confetti width={width} height={height} numberOfPieces={200} recycle={false} initialVelocityY={10} />}
      <div className={`relative overflow-hidden group p-6 h-full flex flex-col bg-secondary/30 border border-border rounded-xl transition-all duration-300 ${goal.completed ? 'border-accent' : 'hover:border-primary/70 hover:shadow-2xl hover:shadow-primary/10'}`}>
        <div className="flex justify-between items-start">
            <h3 className="font-heading text-lg font-semibold mb-2">{goal.icon} {goal.name}</h3>
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {!goal.completed && 
                    <button onClick={handleAddFunds} className="text-muted-foreground hover:text-accent" title="Add Funds"><PlusCircle size={16} /></button>
                }
                <button onClick={() => deleteGoal(goal.id)} className="text-muted-foreground hover:text-destructive" title="Delete Goal"><Trash2 size={16} /></button>
            </div>
        </div>
        <div className="mt-auto">
            <p className="text-sm text-muted-foreground">
              {formatCurrency(goal.current)} / {formatCurrency(goal.target)}
            </p>
            <div className="w-full bg-input rounded-full h-2.5 my-3">
              <motion.div
                className={`h-2.5 rounded-full ${goal.completed ? 'bg-accent' : 'bg-primary'}`}
                initial={{ width: 0 }}
                animate={{ width: `${progress > 100 ? 100 : progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{goal.completed ? "Completed! 🎉" : "Progress"}</span>
              <span>{Math.round(progress)}%</span>
            </div>
        </div>
      </div>
    </>
  );
};

export default GoalCard;