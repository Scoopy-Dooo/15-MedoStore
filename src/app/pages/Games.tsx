import { motion } from 'motion/react';
import { GameCard } from '../components/GameCard';
import { useApp } from '../context/AppContext';
import { gamesData } from '../data/gamesData';
import { useTranslation } from '../hooks/useTranslation';

export default function Games() {
  const { t } = useTranslation();
  const { theme } = useApp();
  const isDark = theme === 'dark';

  return (
    <div className="min-h-screen pt-15 ">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className={`text-4xl pb-2 md:text-6xl font-bold text-center mb-16 bg-gradient-to-r bg-clip-text text-transparent ${
            isDark 
              ? 'from-purple-400 via-purple-400 to-pink-400'
              : 'from-purple-600 via-purple-600 to-pink-600'
          }`}>
            {t('gameCategories')}
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {gamesData.map((game, idx) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <GameCard game={game} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}