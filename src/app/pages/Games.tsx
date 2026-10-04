import { motion } from 'motion/react';
import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { GameCard } from '../components/GameCard';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../hooks/useTranslation';
import { useGames } from '../hooks/useGames';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Button } from '../components/ui/button';
import { GameCardSkeleton } from '../components/skeletons/GameCardSkeleton';

export default function Games() {
  const { t, language } = useTranslation();
  const { theme } = useApp();
  const isDark = theme === 'dark';
  const [page, setPage] = useState(1);
  const pageSize = 12;

  // Fetch games with pagination
  const { data: apiResponse, isLoading, isError, refetch } = useGames({
    page,
    limit: pageSize,
  });

  const gamesData = apiResponse?.games || [];
  const totalPages = apiResponse?.pagination?.totalPages || 1;
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

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

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(pageSize)].map((_, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <GameCardSkeleton />
                </motion.div>
              ))}
            </div>
          )}

          {/* Error State */}
          {isError && !isLoading && (
            <Alert variant="destructive" className="max-w-2xl mx-auto mb-8">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>
                  {language === 'ar'
                    ? 'فشل تحميل الألعاب'
                    : 'Failed to load games'}
                </span>
                <Button onClick={() => refetch()} variant="outline" size="sm">
                  {language === 'ar' ? 'إعادة المحاولة' : 'Retry'}
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Games Grid */}
          {!isLoading && (
            <>
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-12">
                  <Button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={!hasPrevPage}
                    variant="outline"
                  >
                    {language === 'ar' ? 'السابق' : 'Previous'}
                  </Button>
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                    {language === 'ar'
                      ? `صفحة ${page} من ${totalPages}`
                      : `Page ${page} of ${totalPages}`}
                  </span>
                  <Button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={!hasNextPage}
                    variant="outline"
                  >
                    {language === 'ar' ? 'التالي' : 'Next'}
                  </Button>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}