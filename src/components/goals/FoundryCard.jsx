jsx
import React, { useContext } from 'react';
import { useFinancialStore } from '../../store/useFinancialStore';
import { AppContext } from '../../context/AppContext';
import { Droplets } from 'lucide-react';
import { motion } from 'framer-motion';

const FoundryCard = () => {
    const balance = useFinancialStore(state => state.foundry.balance);
    const { formatCurrency } = useContext(AppContext);

    return (
        <div className="p-6 h-full flex flex-col justify-between bg-primary/10 border border-primary/20 rounded-xl">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <Droplets className="h-6 w-6 text-primary" />
                    <h3 className="font-heading text-lg font-semibold">The Foundry</h3>
                </div>
                <p className="text-sm text-primary/80">Funds here are ready to be assigned to your goals.</p>
            </div>
            <div className="text-right mt-4">
                <p className="text-sm text-primary/80">Available</p>
                <motion.p 
                    key={balance}
                    initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                    className="text-3xl font-bold text-primary"
                >
                    {formatCurrency(balance)}
                </motion.p>
            </div>
        </div>
    );
};

export default FoundryCard;