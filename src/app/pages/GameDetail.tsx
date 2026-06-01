import { useParams, Navigate } from 'react-router';
import { motion } from 'motion/react';
import { useTranslation } from '../hooks/useTranslation';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { 
  gamesData, 
  pubgIdPackages, 
  pubgQrPackages, 
  pubgPrimePackages,
  freefireIdPackages,
  freefireMembershipPackages,
  freefireAccountPackages,
  // efootballAndroidPackages,
  // efootballIphonePackages,
  telegramStarsPackages,
  tiktokPackages,
  telegramLoginFeeFeatures,
  telegramPremiumPackages,
  gearUpBoosterSub
} from '../data/gamesData';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';

export default function GameDetail() {
  const { gameId } = useParams();
  const { t, language } = useTranslation();
  const { userName, theme } = useApp();
  const isDark = theme === 'dark';

  const game = gamesData.find(g => g.id === gameId);

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
        : `Hello, I want to order ${amount} from ${gameName} for ${price.toLocaleString()} SDG  {من الموقع الالكتروني}`;
    }
    
    window.open(`https://wa.me/249908180432?text=${encodeURIComponent(message)}`, '_blank');
  };

  const renderPackageSection = (title: string, packages: any[]) => (
    <div className="mb-16">
      <h3 className={`text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r bg-clip-text text-transparent ${
        isDark 
          ? 'from-purple-400 to-purple-400'
          : 'from-purple-600 to-purple-600'
      }`}>
        {title}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {packages.map((pkg, idx) => (
          <motion.div
            key={idx}
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
    </div>
  );

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
        {gameId === 'pubg' && (
          <>
            {renderPackageSection(
              language === 'ar' ? 'عروض الأيدي' : 'ID Offers',
              pubgIdPackages
            )}
            {renderPackageSection(
              language === 'ar' ? 'عروض QR' : 'QR Offers',
              pubgQrPackages
            )}
            {renderPackageSection(
              language === 'ar' ? 'عروض البرايم' : 'Prime Offers',
              pubgPrimePackages
            )}
          </>
        )}

        {gameId === 'freefire' && (
          <>
            {renderPackageSection(
              language === 'ar' ? 'عروض الأيدي' : 'ID Offers',
              freefireIdPackages
            )}
            {renderPackageSection(
              language === 'ar' ? 'باقات العضوية (الأيدي)' : 'Membership Packages (ID)',
              freefireMembershipPackages
            )}
            {renderPackageSection(
              language === 'ar' ? 'عروض الحساب' : 'Account Offers',
              freefireAccountPackages
            )}
          </>
        )}

        {/* {gameId === 'efootball' && (
          <>
            {renderPackageSection(
              t('androidOffers'),
              efootballAndroidPackages
            )}
            {renderPackageSection(
              t('iphoneOffers'),
              efootballIphonePackages
            )}
          </>
        )} */}
        {gameId === 'gearUp' && (
          <>
            {renderPackageSection(
              t('gameBooster'),
              gearUpBoosterSub
            )}
          </>
        )}
        {gameId === 'telegram' && (
          <>
              {renderPackageSection(
                t('teleLogin'),
                telegramLoginFeeFeatures
              )}
            {renderPackageSection(
              t('telegramStars'),
              telegramStarsPackages
            )}
            {renderPackageSection(
              t('telegramPremium'),
              telegramPremiumPackages
            )}
          </>
        )}

        {gameId === 'tiktok' && (
          <>
            {renderPackageSection(
              language === 'ar' ? 'باقات العملات' : 'Coins Packages',
              tiktokPackages
            )}
          </>
        )}
      </section>
    </div>
  );
}