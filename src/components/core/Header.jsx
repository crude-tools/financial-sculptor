import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { Sun, Moon, Briefcase, DollarSign, LayoutDashboard, SlidersHorizontal, Gem } from 'lucide-react';
import { motion } from 'framer-motion';

const NavLink = ({ page, label, icon }) => {
    const { currentPage, setCurrentPage } = useContext(AppContext);
    const isActive = currentPage === page;
    return (
        <button
            onClick={() => setCurrentPage(page)}
            className={`relative flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
        >
            {icon}
            {label}
            {isActive && <motion.div layoutId="nav-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
        </button>
    );
};

const Header = () => {
  const { theme, toggleTheme, currency, setCurrency } = useContext(AppContext);

  return (
    <header className="flex flex-col sm:flex-row justify-between items-center pb-6 border-b border-white/10 gap-4">
      <div className="flex items-center gap-2">
        <Briefcase className="text-primary h-8 w-8" />
        <h1 className="font-heading text-2xl font-bold text-primary">Financial Sculptor</h1>
      </div>
      
      <nav className="flex items-center gap-2 p-1 bg-secondary/30 rounded-lg">
          <NavLink page="goals" label="Goals" icon={<LayoutDashboard size={16}/>} />
          <NavLink page="splitter" label="Splitter" icon={<SlidersHorizontal size={16}/>} />
          <NavLink page="studio" label="Studio" icon={<Gem size={16}/>} />
      </nav>

      <div className="flex items-center gap-4">
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="pl-9 pr-4 py-2 bg-input border border-border rounded-md appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="USD">USD</option>
            <option value="GBP">GBP</option>
            <option value="EUR">EUR</option>
          </select>
        </div>
        <button
          onClick={toggleTheme}
          className="relative flex items-center justify-center h-10 w-10 bg-input border border-border rounded-full"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      </div>
    </header>
  );
};

export default Header;