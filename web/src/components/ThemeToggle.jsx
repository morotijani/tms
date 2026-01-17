import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface border border-border text-primary hover:bg-surface-hover transition-colors shadow-sm"
            aria-label="Toggle Theme"
        >
            {theme === 'light' ? (
                <Moon size={20} className="animate-fade-in" />
            ) : (
                <Sun size={20} className="animate-fade-in" />
            )}
        </motion.button>
    );
};

export default ThemeToggle;
