import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
    const [currency, setCurrency] = useState(() => localStorage.getItem('currency') || 'USD');
    const [currentPage, setCurrentPage] = useState('goals');

    const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
    
    useEffect(() => {
        localStorage.setItem('theme', theme);
        document.documentElement.className = theme;
    }, [theme]);
    
    useEffect(() => {
        localStorage.setItem('currency', currency);
    }, [currency]);
    
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency', currency, minimumFractionDigits: 0, maximumFractionDigits: 0,
        }).format(amount || 0);
    };

    const value = {
        theme, toggleTheme,
        currency, setCurrency, formatCurrency,
        currentPage, setCurrentPage,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};