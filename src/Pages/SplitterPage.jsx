import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useFinancialStore } from '../store/useFinancialStore';
import { SlidersHorizontal, Zap } from 'lucide-react';

const SplitterPage = () => {
  const { formatCurrency } = useContext(AppContext);
  const addFundsToFoundry = useFinancialStore(state => state.addFundsToFoundry);
  const [amount, setAmount] = useState(5000);
  const strategies = {
    balanced: { name: 'Balanced', cash: 30, savings: 40, investments: 30 },
    growth: { name: 'Growth', cash: 10, savings: 20, investments: 70 },
    conservative: { name: 'Conservative', cash: 60, savings: 30, investments: 10 },
  };
  const [activeStrategy, setActiveStrategy] = useState('balanced');

  const split = strategies[activeStrategy];

  const handleSplit = () => {
    addFundsToFoundry(amount);
    alert(`${formatCurrency(amount)} sent to your Foundry! Go to the Goals page to allocate it.`);
    setAmount(0);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-heading text-4xl font-bold text-center mb-2">Fund Splitter</h1>
      <p className="text-center text-muted-foreground mb-8">Allocate incoming funds. The entire amount will be sent to your Foundry.</p>
      
      <div className="bg-secondary/30 border border-border p-8 rounded-xl space-y-6">
        <div>
          <label className="text-sm font-medium text-muted-foreground">Amount to Split</label>
          <input 
            type="number" 
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full bg-input text-4xl font-bold p-2 mt-1 rounded-md text-primary"
          />
        </div>

        <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Strategy</label>
            <div className="flex gap-2 p-1 bg-input rounded-lg">
                {Object.entries(strategies).map(([key, { name }]) => (
                    <button key={key} onClick={() => setActiveStrategy(key)} className={`w-full py-2 rounded-md text-sm font-semibold transition-colors ${activeStrategy === key ? 'bg-primary text-primary-foreground' : 'hover:bg-white/5'}`}>
                        {name}
                    </button>
                ))}
            </div>
        </div>

        <div className="space-y-3 pt-4">
            <h3 className="font-semibold flex items-center gap-2"><SlidersHorizontal size={16}/>Allocation Preview</h3>
            {Object.entries(split).map(([key, value]) => key !== 'name' && (
                <div key={key} className="flex justify-between items-center text-sm">
                    <span className="capitalize text-muted-foreground">{key}</span>
                    <div className="flex items-center gap-4">
                        <span className="w-12 text-right">{value}%</span>
                        <span className="font-semibold text-foreground w-24 text-right">{formatCurrency(amount * (value / 100))}</span>
                    </div>
                </div>
            ))}
        </div>
      </div>
      <div className="mt-6 flex justify-center">
          <button onClick={handleSplit} className="flex items-center gap-2 bg-accent text-accent-foreground font-semibold px-6 py-3 rounded-md hover:bg-accent/90 transition-colors duration-200 shadow-lg shadow-accent/20">
              <Zap size={16}/> Send to Foundry
          </button>
      </div>
    </div>
  );
};

export default SplitterPage;