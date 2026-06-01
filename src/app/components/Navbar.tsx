import { Link } from 'react-router';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../hooks/useTranslation';
import { Menu, Moon, Sun, Globe } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import logoImg from '../../assets/medo-logo-cutted.png';

export function Navbar() {
  const { theme, language, toggleTheme, toggleLanguage } = useApp();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isDark = theme === 'dark';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b transition-colors ${
      isDark 
        ? 'bg-[#0b0f1a]/80 border-purple-500/20' 
        : 'bg-white/80 border-gray-200'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 relative transition-transform duration-300 group-hover:scale-110">
              <img 
                src={logoImg} 
                alt="Medo Store" 
                className="w-full h-full object-contain"
              />
            </div>
            <span className={`text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent transition-all duration-300 ${
              isDark 
                ? 'from-purple-400 to-purple-500 group-hover:from-purple-300 group-hover:to-purple-400'
                : 'from-purple-600 to-purple-600 group-hover:from-purple-500 group-hover:to-purple-500'
            }`}>
              MEDO STORE
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              to="/" 
              className={`font-medium transition-colors ${
                isDark ? 'text-white hover:text-purple-400' : 'text-gray-900 hover:text-purple-600'
              }`}
            >
              {t('home')}
            </Link>
            <Link 
              to="/games" 
              className={`font-medium transition-colors ${
                isDark ? 'text-white hover:text-purple-400' : 'text-gray-900 hover:text-purple-600'
              }`}
            >
              {t('games')}
            </Link>
            <span className={`font-medium cursor-not-allowed ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {t('otherServices')}
            </span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className={`p-2.5 rounded-lg border transition-all duration-300 ${
                isDark 
                  ? 'bg-purple-500/10 border-purple-500/20 hover:bg-purple-500/20 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:border-purple-500/40'
                  : 'bg-purple-50 border-purple-200 hover:bg-purple-100 hover:border-purple-300 hover:shadow-md'
              }`}
              aria-label="Toggle language"
            >
              <Globe className={`w-5 h-5 transition-colors ${
                isDark ? 'text-pink-400' : 'text-pink-600'
              }`} />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-lg border transition-all duration-300 ${
                isDark 
                  ? 'bg-purple-500/10 border-purple-500/20 hover:bg-purple-500/20 hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:border-purple-500/40'
                  : 'bg-purple-50 border-purple-200 hover:bg-purple-100 hover:border-purple-300 hover:shadow-md'
              }`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className={`w-5 h-5 transition-colors ${
                  isDark ? 'text-cyan-400' : 'text-cyan-600'
                }`} />
              ) : (
                <Moon className={`w-5 h-5 transition-colors ${
                  isDark ? 'text-purple-400' : 'text-purple-600'
                }`} />
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2.5 rounded-lg border transition-all duration-300 ${
                isDark 
                  ? 'bg-purple-500/10 border-purple-500/20 hover:bg-purple-500/20 hover:border-purple-500/40'
                  : 'bg-purple-50 border-purple-200 hover:bg-purple-100 hover:border-purple-300'
              }`}
              aria-label="Toggle menu"
            >
              <Menu className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`md:hidden border-t overflow-hidden transition-colors ${
              isDark ? 'bg-[#0b0f1a]/95 border-purple-500/20' : 'bg-white/95 border-gray-200'
            }`}
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              <Link 
                to="/" 
                className={`font-medium py-2 transition-colors ${
                  isDark ? 'text-white hover:text-purple-400' : 'text-gray-900 hover:text-purple-600'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('home')}
              </Link>
              <Link 
                to="/games" 
                className={`font-medium py-2 transition-colors ${
                  isDark ? 'text-white hover:text-purple-400' : 'text-gray-900 hover:text-purple-600'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('games')}
              </Link>
              <span className={`font-medium py-2 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {t('otherServices')}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}