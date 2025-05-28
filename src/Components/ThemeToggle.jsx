import { FaMoon, FaSun } from 'react-icons/fa';
import { useTheme } from '../Contexts/ThemeContext';

const ThemeToggle = () => {
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="btn btn-circle btn-ghost swap swap-rotate"
            aria-label="Toggle theme"
        >
            {isDarkMode ? (
                <FaMoon className="text-xl text-yellow-400 swap-on" />
            ) : (
                <FaSun className="text-xl text-yellow-400 swap-off" />
            )}
        </button>
    );
};

export default ThemeToggle; 