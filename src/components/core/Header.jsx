jsx
import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { Sun, Moon, Briefcase, DollarSign, LayoutDashboard, SlidersHorizontal, Gem } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
        {/* ... Currency Selector and Theme Toggle code remains the same as previous prompt ... */}
      </div>
    </header>
  );
};

export default Header;