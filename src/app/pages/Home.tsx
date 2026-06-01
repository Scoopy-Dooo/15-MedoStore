import { Gamepad2, Shield, Star, Users, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import medoLogo from '../../assets/medo-logo-cutted.png';
import { GameCard } from '../components/GameCard';
import { ProductCard } from '../components/ProductCard';
import { useApp } from '../context/AppContext';
import {telegramLoginFeeFeatures,  freefireIdPackages, gamesData, pubgIdPackages, tiktokPackages } from '../data/gamesData';
import { useTranslation } from '../hooks/useTranslation';
// import { freefireIdPackages, pubgIdPackages, telegramLoginFeeFeatures, tiktokPackages } from '../data/gamesData';
const heroImage = 'https://media.istockphoto.com/id/2186585249/photo/gamer-work-space-concept-top-view-a-gaming-gear-mouse-keyboard-joystick-headset-mobile.jpg?s=612x612&w=0&k=20&c=T55vDUdRFbrv6K_rSs97OfcTdqmI946klCpZOCrJ5vA=';

const popularProducts = [
  { ...pubgIdPackages[3], gameName: 'PUBG Mobile', gameId: 'pubg' },
  { ...freefireIdPackages[0], gameName: 'Free Fire', gameId: 'freefire' },
  { ...telegramLoginFeeFeatures[0], gameName: 'Telegram', gameId: 'telegram' },
  { ...tiktokPackages[0], gameName: 'TikTok', gameId: 'tiktok' }
];


const reviews = [
  { id: 1, rating: 5 },
  { id: 2, rating: 5 },
  { id: 3, rating: 5 }
];

export default function Home() {
  const { t, language } = useTranslation();
  const { userName, theme } = useApp();
  const isDark = theme === 'dark';
  
  
  
  const features = [
    { icon: Zap, text: language === 'ar' ? 'تسليم فوري' : 'Instant Delivery' },
    { icon: Shield, text: language === 'ar' ? 'دفع آمن' : 'Secure Payment' },
    { icon: Gamepad2, text: language === 'ar' ? 'جميع الألعاب' : 'All Games' },
    { icon: Users, text: language === 'ar' ? 'دعم 24/7' : '24/7 Support' },
  ]


  const handleOrder = (gameName: string, amount: string, price: number) => {
    let message = '';
    if (userName) {
      message = language === 'ar'
        ? `مرحباً، أنا ${userName} وأريد طلب ${amount} من ${gameName} بسعر ${price.toLocaleString()} جنيه`
        : `Hello, I'm ${userName} and I want to order ${amount} from ${gameName} for ${price.toLocaleString()} SDG`;
    } else {
      message = language === 'ar'
        ? `مرحباً، أريد طلب ${amount} من ${gameName} بسعر ${price.toLocaleString()} جنيه`
        : `Hello, I want to order ${amount} from ${gameName} for ${price.toLocaleString()} SDG`;
    }

    window.open(`https://wa.me/249908180432?text=${encodeURIComponent(message)}`, '_blank');
  };


  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[83vh] md:bg-red-500 2xl:min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Gaming"
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 bg-gradient-to-b ${isDark
            ? 'from-[#0b0f1a]/90 via-[#0b0f1a]/80 to-[#0b0f1a]'
            : 'from-white/90 via-white/80 to-white'
            }`} />
          <div className={`absolute inset-0 ${isDark
            ? 'bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.1),transparent_50%)]'
            : 'bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.08),transparent_50%)]'
            }`} />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Logo */}
            <motion.div
              className="w-32 h-32 mx-auto mb-4 sm:mb-8"
              animate={{
                filter: isDark ? [
                  'drop-shadow(0 0 20px rgba(34,211,238,0.5))',
                  'drop-shadow(0 0 40px rgba(168,85,247,0.5))',
                  'drop-shadow(0 0 20px rgba(34,211,238,0.5))',
                ] : [
                  'drop-shadow(0 0 10px rgba(6,182,212,0.3))',
                  'drop-shadow(0 0 20px rgba(147,51,234,0.3))',
                  'drop-shadow(0 0 10px rgba(6,182,212,0.3))',
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <img
                src={medoLogo}
                alt="Medo Store"
                className="w-full h-full object-contain"
              />
            </motion.div>

            <h1 className={`text-3xl sm:leading-24 mb-1  md:text-7xl font-bold sm:mb-6 bg-gradient-to-r bg-clip-text text-transparent ${isDark
              ? 'from-purple-400 via-purple-400 to-pink-400'
              : 'from-purple-600 via-purple-600 to-pink-600'
              }`}>
              {t('heroTitle')}
            </h1>

            <p className={`text-sm md:text-2xl mb-1 sm:mb-8 max-w-3xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
              {t('heroSubtitle')}
            </p>

            <motion.a
              href="#games"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`inline-block sm:px-8 sm:py-4 px-4 py-2 bg-gradient-to-r text-white  font-bold sm:text-lg text-sm rounded-full transition-all ${isDark
                ? 'from-purple-500 to-purple-500 hover:from-purple-400 hover:to-purple-400 shadow-[0_0_30px_rgba(34,211,238,0.5)] hover:shadow-[0_0_50px_rgba(34,211,238,0.7)]'
                : 'from-purple-600 to-purple-600 hover:from-purple-500 hover:to-purple-500 shadow-lg hover:shadow-xl'
                }`}
            >
              {t('browseGames')}
            </motion.a>

            {/* Features */}
            <div className="grid grid-cols-2 md:grid-cols-4 sm:gap-6 gap-3 mt-5 max-w-4xl mx-auto">
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 + 0.5 }}
                  className={`backdrop-blur-lg border rounded-xl p-4 ${isDark
                    ? 'bg-white/5 border-purple-500/20'
                    : 'bg-white/60 border-purple-200'
                    }`}
                >
                  <feature.icon className={`sm:w-8 w-6 h-6 sm:h-8 mx-auto mb-2 ${isDark ? 'text-purple-400' : 'text-purple-600'
                    }`} />
                  <div className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {feature.text}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>



      </section>

      {/* Game Categories Section */}
      <section id="games" className="max-sm:scroll-m-16 py-10 sm:py-20 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={`text-4xl md:text-5xl py-2 font-bold text-center mb-12 bg-gradient-to-r bg-clip-text text-transparent ${isDark
            ? 'from-purple-400 to-purple-400'
            : 'from-purple-600 to-purple-600'
            }`}>
            {t('gameCategories')}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {gamesData.map((game, idx) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ delay: idx * 0.1 }}
              >
                <GameCard game={game} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>


      {/* Popular Top-Ups Section */}
      <section className="py-10 sm:py-20 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={`text-4xl pb-2 md:text-5xl font-bold text-center mb-12 bg-gradient-to-r bg-clip-text text-transparent ${isDark
            ? 'from-purple-400 to-purple-400'
            : 'from-purple-600 to-purple-600'
            }`}>
            {t('popularTopUps')}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularProducts.map((product, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ delay: idx * 0.1 }}
              >
                <ProductCard
                  package={product}
                  gameName={product.gameName}
                  onOrder={() => handleOrder(product.gameName, product.amount, product.price)}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Customer Reviews Section */}
      <section className="max-sm:scroll-m-16 py-10 sm:py-20 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={`text-4xl py-2 md:text-5xl font-bold text-center mb-12 bg-gradient-to-r bg-clip-text text-transparent ${isDark
            ? 'from-purple-400 to-purple-400'
            : 'from-purple-600 to-purple-600'
            }`}>
            {t('customerReviews')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {reviews.map((review, idx) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className={`bg-gradient-to-br backdrop-blur-xl border rounded-2xl p-6 transition-all ${isDark
                  ? 'from-white/5 to-white/[0.02] border-purple-500/20 hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.3)]'
                  : 'from-white/80 to-white/60 border-purple-200 hover:border-purple-400 hover:shadow-[0_10px_30px_rgba(6,182,212,0.3)]'
                  }`}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t(`review${review.id}` as any)}
                </p>


              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
}