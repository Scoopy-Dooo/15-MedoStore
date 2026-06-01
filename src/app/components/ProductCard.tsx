import { motion } from 'motion/react';
import { useTranslation } from '../hooks/useTranslation';
import { GamePackage } from '../data/gamesData';
import { Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface ProductCardProps {
  package: GamePackage;
  gameName: string;
  onOrder: () => void;
}

export function ProductCard({ package: pkg, gameName, onOrder }: ProductCardProps) {
  const { t } = useTranslation();
  const { theme } = useApp();
  const isDark = theme === 'dark';

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      className="relative group"
    >
      <div
        className={`bg-gradient-to-br backdrop-blur-xl border rounded-2xl p-6 h-full transition-all duration-300 ${
          isDark
            ? 'from-white/5 to-white/[0.02] border-purple-500/20 hover:border-purple-500/50 hover:shadow-[0_0_40px_rgba(34,211,238,0.3)]'
            : 'from-white/80 to-white/60 border-purple-200 hover:border-purple-400 hover:shadow-[0_10px_30px_rgba(6,182,212,0.3)]'
        }`}
      >
        {/* Popular Badge */}
        {pkg.popular && (
          <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-[0_0_20px_rgba(251,191,36,0.5)]">
            <Sparkles className="w-3 h-3" />
            <span>{t('language') === 'ar' ? 'شائع' : 'Popular'}</span>
          </div>
        )}

        {/* Game Name */}
        <div
          className={`text-sm mb-2 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          {gameName}
        </div>

        {/* Amount */}
        <div
          className={`text-2xl font-bold mb-4 bg-gradient-to-r bg-clip-text text-transparent ${
            isDark
              ? 'from-purple-700 to-purple-400'
              : 'from-purple-700 to-purple-600'
          }`}
        >
          {pkg.amount}
        </div>

        {/* Price */}
        <div
          className={`text-3xl font-bold mb-6 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}
        >
          {pkg.price.toLocaleString()}
          <span
            className={`text-lg ms-2 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            {t('currency')}
          </span>
        </div>

        {/* Order Button */}
        <button
          onClick={onOrder}
          className={`w-full py-3 bg-gradient-to-r text-white font-bold rounded-lg transition-all group-hover:scale-105 ${
            isDark
              ? 'from-purple-700 to-purple-500 hover:from-purple-700 hover:to-purple-400 shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)]'
              : 'from-purple-700 to-purple-600 hover:from-purple-700 hover:to-purple-500 shadow-lg hover:shadow-xl'
          }`}
        >
          {t('orderViaWhatsApp')}
        </button>

        {/* Glow Effect */}
        <div
          className={`absolute inset-0 bg-gradient-to-r rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ${
            isDark
              ? 'from-purple-700/10 to-purple-500/10'
              : 'from-purple-700/20 to-purple-500/20'
          }`}
        />
      </div>
    </motion.div>
  );
}