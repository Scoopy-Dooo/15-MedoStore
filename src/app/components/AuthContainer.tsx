/**
 * Auth Container Component
 * مكون موحّد لجميع صفحات المصادقة
 */

import { ReactNode } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface AuthContainerProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  showBackHome?: boolean;
}

export default function AuthContainer({
  children,
  title,
  subtitle,
  showBackHome = true,
}: AuthContainerProps) {
  const { theme } = useApp();
  const isDark = theme === 'dark';

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden ${
        isDark
          ? 'bg-gradient-to-br from-[#0b0f1a] via-[#1a1f35] to-[#0b0f1a]'
          : 'bg-gradient-to-br from-gray-50 via-purple-50 to-gray-50'
      }`}
    >
      {/* Background Effects */}
      <div
        className={`absolute inset-0 ${
          isDark
            ? 'bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_50%)]'
            : 'bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.05),transparent_50%)]'
        }`}
      />

      {/* Animated Blobs */}
      {isDark && (
        <>
          <motion.div
            className="absolute top-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.5, 0.3, 0.5],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </>
      )}

      {/* Back to Home Button */}
      {showBackHome && (
        <Link
          to="/"
          className={`absolute top-8 left-8 z-20 inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
            isDark
              ? 'bg-white/5 border border-purple-500/20 hover:bg-white/10 hover:border-purple-500/40 text-gray-300 hover:text-white'
              : 'bg-white/80 border border-purple-200 hover:bg-white hover:border-purple-300 text-gray-700 hover:text-gray-900'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">العودة للرئيسية</span>
        </Link>
      )}

      {/* Content Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div
          className={`backdrop-blur-xl border rounded-2xl p-8 transition-all duration-300 ${
            isDark
              ? 'bg-[rgba(20,25,45,0.6)] border-purple-500/20 shadow-[0_0_50px_rgba(139,92,246,0.1)] hover:border-purple-500/40'
              : 'bg-white/80 border-purple-200 shadow-lg hover:border-purple-300 hover:shadow-xl'
          }`}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`text-3xl font-bold mb-2 bg-gradient-to-r bg-clip-text text-transparent ${
                isDark
                  ? 'from-purple-400 to-cyan-400'
                  : 'from-purple-600 to-cyan-600'
              }`}
            >
              {title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className={isDark ? 'text-gray-400' : 'text-gray-600'}
            >
              {subtitle}
            </motion.p>
          </div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {children}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
