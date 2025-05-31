import { useTheme } from '../contexts/ThemeContext';
import { FaSun, FaMoon } from 'react-icons/fa';

const ThemeToggle = () => {
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="relative inline-flex items-center p-2 rounded-lg transition-colors duration-300
                     dark:bg-gray-700 bg-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600"
            aria-label="Toggle Theme"
        >
            {isDarkMode ? (
                <FaMoon className="w-5 h-5 text-indigo-500 transition-transform duration-300 transform rotate-0" />
            ) : (
                <FaSun className="w-5 h-5 text-yellow-500 transition-transform duration-300 transform rotate-0" />
            )}
        </button>
    );
};

export default ThemeToggle; 