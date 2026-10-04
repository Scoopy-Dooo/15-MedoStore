import { useParams, Navigate } from 'react-router';
import { motion } from 'motion/react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useApp } from '../context/AppContext';
import { useGame } from '../hooks/useGame';
import { useGamePackages } from '../hooks/useGamePackages';
import { ProductCard } from '../components/ProductCard';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { ProductCardSkeleton } from '../components/skeletons/ProductCardSkeleton';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';

export default function GameDetail() {
  const { gameId } = useParams();
  const { t, language } = useTranslation();
  const { userName, theme } = useApp();
  const isDark = theme === 'dark';

  // Fetch game by ID
  const { data: game, isLoading: gameLoading, isError: gameError, refetch: refetchGame } = useGame(gameId || '');
  
  // Fetch packages for this game (only when game is loaded)
  const { data: packages = [], isLoading: packagesLoading, isError: packagesError, refetch: refetchPackages } = useGamePackages(game?.id || '', {
    enabled: !!game?.id,
  });

  const isLoading = gameLoading || packagesLoading;
  const isError = gameError || packagesError;

  // Loading state
  if (gameLoading) {
    return (
      <div className="min-h-screen">
        {/* Hero Skeleton */}
        <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden">
          <Skeleton className="absolute inset-0" />
          <div className="relative z-10 container mx-auto px-4">
            <Skeleton className="h-6 w-32 mb-6" />
            <Skeleton className="h-16 w-64" />
          </div>
        </section>

        {/* Packages Skeleton */}
        <section className="py-16 container mx-auto px-4">
          <Skeleton className="h-10 w-48 mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <ProductCardSkeleton />
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  // Error or not found
  if (!gameLoading && (!game || gameError)) {
    return (
      <div className="min-h-screen flex items-center justify-center container mx-auto px-4">
        <div className="text-center max-w-md">
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {language === 'ar'
                ? 'اللعبة غير موجودة أو حدث خطأ في التحميل'
                : 'Game not found or failed to load'}
            </AlertDescription>
          </Alert>
          <div className="flex gap-4 justify-center">
            <Link to="/">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('home')}
              </Button>
            </Link>
            {gameError && (
              <Button onClick={() => refetchGame()}>
                {language === 'ar' ? 'إعادة المحاولة' : 'Retry'}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!game) {
    return <Navigate to="/" replace />;
  }

  const handleOrder = (amount: string, price: number) => {
    const gameName = language === 'ar' ? game.nameAr : game.name;
    
    let message = '';
    if (userName) {
      message = language === 'ar'
        ? `مرحباً، أنا ${userName} وأريد طلب ${amount} من ${gameName} بسعر ${price.toLocaleString()} جنيه {من الموقع الالكتروني}`
        : `Hello, I'm ${userName} and I want to order ${amount} from ${gameName} for ${price.toLocaleString()} SDG {من الموقع الالكتروني}`;
    } else {
      message = language === 'ar'
        ? `مرحباً، أريد طلب ${amount} من ${gameName} بسعر ${price.toLocaleString()} جنيه {من الموقع الالكتروني}`
        : `Hello, I want to order ${amount} from ${gameName} for ${price.toLocaleString()} SDG {من الموقع الالكتروني}`;
    }
    
    window.open(`https://wa.me/249908180432?text=${encodeURIComponent(message)}`, '_blank');
  };

  // Render packages with loading/error states
  const renderPackages = () => {
    if (packagesLoading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <ProductCardSkeleton />
            </motion.div>
          ))}
        </div>
      );
    }

    if (packagesError) {
      return (
        <Alert variant="destructive" className="max-w-2xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>
              {language === 'ar'
                ? 'فشل تحميل الباقات'
                : 'Failed to load packages'}
            </span>
            <Button onClick={() => refetchPackages()} variant="outline" size="sm">
              {language === 'ar' ? 'إعادة المحاولة' : 'Retry'}
            </Button>
          </AlertDescription>
        </Alert>
      );
    }

    if (packages.length === 0) {
      return (
        <div className="text-center py-12">
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            {language === 'ar'
              ? 'لا توجد باقات متاحة حالياً'
              : 'No packages available at the moment'}
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {packages.map((pkg, idx) => (
          <motion.div
            key={pkg.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ delay: idx * 0.05 }}
          >
            <ProductCard
              package={pkg}
              gameName={language === 'ar' ? game.nameAr : game.name}
              onOrder={() => handleOrder(pkg.amount, pkg.price)}
            />
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={game.image}
            alt={language === 'ar' ? game.nameAr : game.name}
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 bg-gradient-to-b ${
            isDark 
              ? 'from-[#0b0f1a]/70 via-[#0b0f1a]/85 to-[#0b0f1a]'
              : 'from-white/70 via-white/85 to-white'
          }`} />
          <div className={`absolute inset-0 ${
            isDark 
              ? 'bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.15),transparent_70%)]'
              : 'bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.1),transparent_70%)]'
          }`} />
        </div>

        <div className="relative z-10 container mx-auto px-4">
          <Link 
            to="/"
            className={`inline-flex items-center gap-2 transition-colors mb-6 ${
              isDark ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{t('home')}</span>
          </Link>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-4xl md:text-6xl font-bold bg-gradient-to-r bg-clip-text text-transparent ${
              isDark 
                ? 'from-purple-400 via-purple-400 to-pink-400'
                : 'from-purple-600 via-purple-600 to-pink-600'
            }`}
          >
            {language === 'ar' ? game.nameAr : game.name}
          </motion.h1>
        </div>
      </section>

      {/* Packages */}
      <section className="py-16 container mx-auto px-4">
        <h2 className={`text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r bg-clip-text text-transparent ${
          isDark 
            ? 'from-purple-400 to-purple-400'
            : 'from-purple-600 to-purple-600'
        }`}>
          {language === 'ar' ? 'الباقات المتاحة' : 'Available Packages'}
        </h2>
        {renderPackages()}
      </section>
    </div>
  );
}