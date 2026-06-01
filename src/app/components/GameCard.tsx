import { Link } from 'react-router';
import { motion } from 'motion/react';
import { useTranslation } from '../hooks/useTranslation';
import { Game } from '../data/gamesData';
import { ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface GameCardProps {
  game: Game;
}

export function GameCard({ game }: GameCardProps) {
  const { t, language } = useTranslation();
  const { theme } = useApp();
  const isDark = theme === 'dark';

  return (
    <Link to={`/game/${game.id}`}>
      <motion.div
        whileHover={{ y: -12, scale: 1.03 }}
        className="relative group cursor-pointer"
      >
        <div className={`bg-gradient-to-br backdrop-blur-xl border rounded-3xl overflow-hidden transition-all duration-300 ${
          isDark 
            ? 'from-white/5 to-white/[0.02] border-purple-500/20 hover:border-purple-500/50 hover:shadow-[0_0_50px_rgba(34,211,238,0.4)]'
            : 'from-white/80 to-white/60 border-purple-200 hover:border-purple-400 hover:shadow-[0_10px_40px_rgba(6,182,212,0.3)]'
        }`}>
          {/* Image */}
          <div className="relative h-64 overflow-hidden">
            <img
              src={game.image}
              alt={language === 'ar' ? game.nameAr : game.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className={`absolute inset-0 bg-gradient-to-t ${
              isDark 
                ? 'from-[#0b0f1a] via-[#0b0f1a]/50 to-transparent'
                : 'from-white via-white/60 to-transparent'
            }`} />
            
            {/* Category Badge */}
            <div className={`absolute top-4 left-4 backdrop-blur-md border px-3 py-1 rounded-full text-sm font-medium ${
              isDark 
                ? 'bg-purple-500/20 border-purple-500/30 text-purple-300'
                : 'bg-purple-100/80 border-purple-300 text-purple-700'
            }`}>
              {game.category}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <h3 className={`text-2xl font-bold mb-4 bg-gradient-to-r bg-clip-text text-transparent ${
              isDark 
                ? 'from-purple-400 to-purple-400'
                : 'from-purple-600 to-purple-600'
            }`}>
              {language === 'ar' ? game.nameAr : game.name}
            </h3>

            <div className="flex items-center justify-between">
              <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                {t('viewPackages')}
              </span>
              <motion.div
                className={isDark ? 'text-purple-400' : 'text-purple-600'}
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </div>
          </div>

          {/* Glow Effect */}
          <div className={`absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ${
            isDark 
              ? 'from-purple-500/10 to-purple-500/10'
              : 'from-purple-500/20 to-purple-500/20'
          }`} />
        </div>
      </motion.div>
    </Link>
  );
}