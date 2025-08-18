import { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import useWindowSize from 'react-use/lib/useWindowSize';
import { Sun, Moon, Briefcase, DollarSign, Plus, Droplets, Send, Trash2, X } from 'lucide-react';

//=========== CONTEXT & GLOBAL STATE MANAGEMENT ===========
const AppContext = createContext();

const AppProvider = ({ children }) => {
    // ---- GOALS HOOK LOGIC ----
    const GOALS_STORAGE_KEY = 'financialSculptor.goals.v3';
    const defaultGoals = [
        { id: 'foundry', name: 'Foundry', icon: '🏦', current: 500, target: 1, isPermanent: true },
        { id: 'goal_1', name: 'Rainy Day Fund', icon: '💰', current: 1200, target: 3000, transactions: [] },
        { id: 'goal_2', name: 'Vacation to Japan', icon: '✈️', current: 800, target: 4000, transactions: [] }
    ];

    const [goals, setGoals] = useState(() => {
        try {
            const saved = localStorage.getItem(GOALS_STORAGE_KEY);
            return saved ? JSON.parse(saved) : defaultGoals;
        } catch { return defaultGoals; }
    });

    useEffect(() => {
        localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(goals));
    }, [goals]);

    const addGoal = ({ name, target, current, icon }) => {
        const newGoal = { id: `goal_${Date.now()}`, name, icon, target, current, transactions: [{ amount: current, source: 'Initial', date: new Date().toISOString() }] };
        setGoals(prev => [...prev, newGoal]);
    };

    const updateGoal = (id, updatedData) => setGoals(prev => prev.map(g => (g.id === id ? { ...g, ...updatedData } : g)));
    const deleteGoal = (id) => setGoals(prev => prev.filter(g => g.id !== id && !g.isPermanent));
    
    const addFundsToGoal = (id, amount, source) => {
        setGoals(prev => prev.map(g => {
            if (g.id === id) {
                const newCurrent = g.current + amount;
                const newTransaction = { amount, source, date: new Date().toISOString() };
                const newTransactions = g.transactions ? [...g.transactions, newTransaction] : [newTransaction];
                return { ...g, current: newCurrent, transactions: newTransactions };
            }
            return g;
        }));
    };

    // ---- THEME & CURRENCY ----
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
    const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
    useEffect(() => {
        localStorage.setItem('theme', theme);
        document.documentElement.className = theme;
    }, [theme]);

    const [currency, setCurrency] = useState(() => localStorage.getItem('currency') || 'USD');
    useEffect(() => {
        localStorage.setItem('currency', currency);
    }, [currency]);
    
    const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount || 0);

    const value = { theme, toggleTheme, currency, setCurrency, formatCurrency, goals, addGoal, updateGoal, deleteGoal, addFundsToGoal };
    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

//=========== COMPONENTS ===========

const GoalFormModal = ({ onClose, goal }) => {
    const { addGoal, updateGoal } = useContext(AppContext);
    const [name, setName] = useState(goal?.name || '');
    const [target, setTarget] = useState(goal?.target || '');
    const [current, setCurrent] = useState(goal?.current || 0);
    const [selectedIcon, setSelectedIcon] = useState(goal?.icon || '💰');
    const icons = ['💰', '🏠', '✈️', '🎓', '❤️', '📈', '🚗', '🎁'];
  
    const handleSubmit = (e) => {
        e.preventDefault();
        const goalData = { name, target: parseFloat(target), current: parseFloat(current), icon: selectedIcon };
        if (goal) { updateGoal(goal.id, goalData); } else { addGoal(goalData); }
        onClose();
    };
  
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <motion.div initial={{ y: "-50%", opacity: 0, scale: 0.9 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: "50%", opacity: 0, scale: 0.9 }} transition={{ duration: 0.3, ease: 'easeOut' }} className="bg-card border border-border rounded-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-6"><h2 className="font-heading text-xl font-semibold">{goal ? 'Edit' : 'Create'} Goal</h2><button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X /></button></div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="text-sm font-medium text-muted-foreground">Icon</label><div className="mt-2 flex gap-2 flex-wrap">{icons.map(icon => (<button key={icon} type="button" onClick={() => setSelectedIcon(icon)} className={`text-2xl p-2 rounded-lg ${selectedIcon === icon ? 'bg-primary/20 ring-2 ring-primary' : 'bg-input'}`}>{icon}</button>))}</div></div>
            <input className="w-full bg-input p-2 rounded-md" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Goal Name (e.g., Dream Vacation)" required />
            <input className="w-full bg-input p-2 rounded-md" type="number" value={target} onChange={e => setTarget(e.target.value)} placeholder="Target Amount" required min="1" />
            <input className="w-full bg-input p-2 rounded-md" type="number" value={current} onChange={e => setCurrent(e.target.value)} placeholder="Current Amount" required min="0"/>
            <div className="flex justify-end gap-4 pt-4"><button type="button" onClick={onClose} className="px-4 py-2 bg-secondary rounded-md text-secondary-foreground font-semibold">Cancel</button><button type="submit" className="px-4 py-2 bg-primary rounded-md text-primary-foreground font-semibold">{goal ? 'Save' : 'Create'}</button></div>
          </form>
        </motion.div>
      </div>
    );
};

const GoalCard = ({ goal }) => {
    const { formatCurrency, deleteGoal } = useContext(AppContext);
    const { width, height } = useWindowSize();
    const progress = goal.target > 0 ? (goal.current / goal.target) * 100 : 0;
    const isComplete = progress >= 100;
  
    return (
      <>
        {isComplete && <Confetti width={width} height={height} numberOfPieces={300} recycle={false} />}
        <div className={`relative overflow-hidden group p-6 h-full flex flex-col bg-secondary/30 border border-border rounded-xl transition-all duration-300 ${isComplete ? 'border-accent' : 'hover:border-primary/70 hover:shadow-2xl hover:shadow-primary/10'}`}>
          <div className="flex justify-between items-start">
            <h3 className="font-heading text-lg font-semibold mb-2">{goal.icon} {goal.name}</h3>
            <button onClick={() => deleteGoal(goal.id)} className="absolute top-4 right-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
          </div>
          <div className="mt-auto">
            <p className="text-sm text-muted-foreground">{formatCurrency(goal.current)} / {formatCurrency(goal.target)}</p>
            <div className="w-full bg-input rounded-full h-2.5 my-3"><motion.div className={`h-2.5 rounded-full ${isComplete ? 'bg-accent' : 'bg-primary'}`} initial={{ width: 0 }} animate={{ width: `${progress > 100 ? 100 : progress}%` }} transition={{ duration: 1, ease: "easeOut" }}/></div>
            <div className="flex justify-between text-xs text-muted-foreground"><span>{isComplete ? "Completed! 🎉" : "Progress"}</span><span>{Math.round(progress)}%</span></div>
          </div>
        </div>
      </>
    );
};
  
const GoalGrid = () => {
    const { goals } = useContext(AppContext);
    const userGoals = goals.filter(g => g.id !== 'foundry');
    return (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><AnimatePresence>{userGoals.map((goal, index) => (<motion.div key={goal.id} layout initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20, scale: 0.95 }} transition={{ duration: 0.5, delay: index * 0.1 }}><GoalCard goal={goal} /></motion.div>))}</AnimatePresence></div>);
};

const AllocationModal = ({ onClose }) => {
    const { formatCurrency, addFundsToGoal, goals } = useContext(AppContext);
    const [amount, setAmount] = useState(1000);
    const [allocations, setAllocations] = useState({});
    const userGoals = goals.filter(g => g.id !== 'foundry');
    const totalAllocated = Object.values(allocations).reduce((sum, val) => sum + (val || 0), 0);
    const unallocated = amount - totalAllocated;

    const handleAllocate = (goalId, value) => {
        setAllocations(prev => {
            const newAllocations = { ...prev };
            const currentVal = newAllocations[goalId] || 0;
            const newTotal = totalAllocated - currentVal + value;
            if (newTotal > amount) { value = amount - (totalAllocated - currentVal); }
            newAllocations[goalId] = value < 0 ? 0 : value;
            return newAllocations;
        });
    };
    
    const handleSubmit = () => {
        if(unallocated > 0) { addFundsToGoal('foundry', unallocated, "Unallocated from Splitter"); }
        for (const [goalId, goalAmount] of Object.entries(allocations)) {
            if (goalAmount > 0) { addFundsToGoal(goalId, goalAmount, "Allocation"); }
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <motion.div initial={{ y: "-50%", opacity: 0, scale: 0.9 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: "50%", opacity: 0, scale: 0.9 }} transition={{ duration: 0.3, ease: 'easeOut' }} className="bg-card border border-border rounded-xl w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4"><h2 className="font-heading text-xl font-semibold">Allocate Funds</h2><button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X /></button></div>
                <div className="space-y-6"><div><label className="text-sm font-medium text-muted-foreground">Amount to Allocate</label><input type="number" value={amount} onChange={(e) => setAmount(parseFloat(e.target.value) || 0)} className="w-full bg-input text-2xl font-bold p-2 mt-1 rounded-md"/></div><div className="p-4 bg-secondary/50 rounded-lg"><h3 className="font-semibold mb-2">Assign to Goals</h3><div className="space-y-3 max-h-60 overflow-y-auto pr-2">{userGoals.map(goal => (<div key={goal.id} className="grid grid-cols-3 gap-2 items-center"><span className="truncate">{goal.icon} {goal.name}</span><input type="range" min="0" max={amount} step="10" value={allocations[goal.id] || 0} onChange={(e) => handleAllocate(goal.id, parseFloat(e.target.value))} className="w-full h-2 bg-input rounded-lg appearance-none cursor-pointer" /><span className="text-right text-sm font-mono">{formatCurrency(allocations[goal.id] || 0)}</span></div>))}</div></div><div className="p-4 bg-primary/10 border border-primary/20 rounded-lg text-sm"><div className="flex justify-between"><span>Total to Allocate:</span> <strong>{formatCurrency(amount)}</strong></div><div className="flex justify-between text-primary"><span>Total Assigned:</span> <strong>{formatCurrency(totalAllocated)}</strong></div><div className={`flex justify-between mt-2 pt-2 border-t border-primary/20 ${unallocated > 0 ? 'text-foreground' : 'text-muted-foreground'}`}><span>Remainder to Foundry:</span><strong>{formatCurrency(unallocated)}</strong></div></div></div>
                <div className="flex justify-end gap-4 pt-6"><button onClick={handleSubmit} className="px-4 py-2 bg-primary rounded-md text-primary-foreground font-semibold flex items-center gap-2"><Send className="h-4 w-4"/> Confirm Allocation</button></div>
            </motion.div>
        </div>
    );
};

const Foundry = () => {
    const { goals, formatCurrency } = useContext(AppContext);
    const [isAllocationModalOpen, setAllocationModalOpen] = useState(false);
    const foundryGoal = goals.find(g => g.id === 'foundry');
    const foundryBalance = foundryGoal ? foundryGoal.current : 0;
    return (
        <div className="bg-secondary/50 border border-border rounded-xl p-6 mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2"><Droplets className="h-6 w-6 text-primary" /><h3 className="font-heading text-2xl font-semibold">The Foundry</h3></div>
                    <p className="text-muted-foreground max-w-lg">This is your financial inbox. Split windfalls or income here, then allocate the funds to your goals.</p>
                </div>
                <div className="text-left sm:text-right">
                    <p className="text-sm text-muted-foreground">Available to Allocate</p>
                    <motion.p key={foundryBalance} className="text-3xl font-bold text-primary" initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>{formatCurrency(foundryBalance)}</motion.p>
                </div>
            </div>
             <div className="mt-6 flex justify-start sm:justify-end">
                <button onClick={() => setAllocationModalOpen(true)} className="flex items-center gap-2 bg-accent text-accent-foreground font-semibold px-4 py-2 rounded-md hover:bg-accent/90 transition-colors duration-200 shadow-lg shadow-accent/20"><Send className="h-4 w-4" /> Allocate Funds</button>
            </div>
            <AnimatePresence>{isAllocationModalOpen && <AllocationModal onClose={() => setAllocationModalOpen(false)} />}</AnimatePresence>
        </div>
    );
};

const Dashboard = () => {
    const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
    return (
      <>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"><h2 className="font-heading text-3xl font-semibold">Dashboard</h2><button onClick={() => setIsGoalModalOpen(true)} className="flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-4 py-2 rounded-md hover:bg-primary/90 transition-colors duration-200"><Plus className="h-4 w-4" /> New Goal</button></div>
        <Foundry />
        <GoalGrid />
        <AnimatePresence>{isGoalModalOpen && <GoalFormModal onClose={() => setIsGoalModalOpen(false)}/>}</AnimatePresence>
      </>
    );
};

const Header = () => {
    const { theme, toggleTheme, currency, setCurrency } = useContext(AppContext);
    return (
      <header className="flex flex-col sm:flex-row justify-between items-center pb-6 mb-8 border-b border-white/10">
        <div className="flex items-center gap-2 mb-4 sm:mb-0"><Briefcase className="text-primary h-8 w-8" /><h1 className="font-heading text-2xl font-bold text-primary">Financial Sculptor</h1></div>
        <div className="flex items-center gap-4"><div className="relative"><DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><select value={currency} onChange={(e) => setCurrency(e.target.value)} className="pl-9 pr-4 py-2 bg-input border border-border rounded-md appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring"><option value="USD">USD</option><option value="GBP">GBP</option><option value="EUR">EUR</option></select></div><motion.button onClick={toggleTheme} className="relative flex items-center justify-center h-10 w-10 bg-input border border-border rounded-full" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}><AnimatePresence mode="wait">{theme === 'dark' ? (<motion.div key="sun" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}><Sun className="h-5 w-5" /></motion.div>) : (<motion.div key="moon" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}><Moon className="h-5 w-5" /></motion.div>)}</AnimatePresence></motion.button></div>
      </header>
    );
};

const Layout = ({ children }) => {
    return (
      <div className="relative min-h-screen bg-background text-foreground font-sans p-4 sm:p-8 overflow-x-hidden">
        <div className="fixed top-0 left-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle_at_20%_20%,_hsl(var(--primary))_0,_transparent_30%),_radial-gradient(circle_at_80%_70%,_hsl(var(--destructive))_0,_transparent_30%)] -z-10 -translate-x-1/2 -translate-y-1/2 blur-3xl saturate-150 opacity-20 animate-background-pan" />
        <div className="relative z-10 bg-card/80 backdrop-blur-xl border border-white/10 rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-3xl shadow-2xl shadow-black/20 p-4 sm:p-6 md:p-8">{children}</div>
      </div>
    );
};

//=========== THE MAIN APP EXPORT ===========
function App() {
  const { theme } = useContext(AppContext);
  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);
  return (
    <Layout>
      <div className="w-full max-w-5xl mx-auto animate-fade-in">
        <Header />
        <main><Dashboard /></main>
        <footer className="text-center py-6 mt-8 border-t border-white/10 text-muted-foreground text-sm">© 2025 Financial Sculptor. One file wonder.</footer>
      </div>
    </Layout>
  );
}

// This is the real final export that wraps the entire app
export default function AppWrapper() {
  return (
    <AppProvider>
      <App />
    </AppProvider>
  )
}