import { MapPin, MessageCircle, Send } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../hooks/useTranslation';

export function Footer() {
  const { t } = useTranslation();
  const { theme } = useApp();
  const isDark = theme === 'dark';
  const { userName, language } = useApp();

  // إنشاء رسالة الواتساب مع اسم المستخدم إذا كان موجودًا
  const message = userName
    ? `مرحباً، أنا ${userName} وأحتاج مساعدة { من الموقع}`
    : "مرحباً، أحتاج مساعدة { من الموقع}";

  const whatsappUrl = `https://wa.me/249908180432?text=${encodeURIComponent(message)}`;


  return (
    <footer className={`border-t mt-20 pb-20 transition-colors ${isDark ? 'bg-[#0b0f1a] border-purple-500/20' : 'bg-white border-gray-200'
      }`}>
      <div className="container mx-auto px-4 py-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className={`text-xl font-bold mb-4 bg-gradient-to-r bg-clip-text text-transparent ${isDark ? 'from-purple-400 to-purple-500' : 'from-purple-600 to-purple-600'
              }`}>
              {t('aboutStore')}
            </h3>
            <p className={`mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {t('storeDescription')}
            </p>
            <div className={`flex items-center gap-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              <MapPin className={`w-4 h-4 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
              <span>Sudan</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {t('quickLinks')}
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className={`transition-colors ${isDark ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600 hover:text-purple-600'
                  }`}>
                  {t('home')}
                </a>
              </li>
              <li>
                <a href="/games" className={`transition-colors ${isDark ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600 hover:text-purple-600'
                  }`}>
                  {t('games')}
                </a>
              </li>
              <li>
                <span className={isDark ? 'text-gray-500' : 'text-gray-500'}>
                  {t('otherServices')}
                </span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {t('contactUs')}
            </h3>
            <div className="space-y-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 transition-colors ${isDark ? 'text-gray-400 hover:text-green-400' : 'text-gray-600 hover:text-green-600'
                  }`}
              >
                <MessageCircle className="w-4 h-4" />
                <span dir='ltr'>Whatsapp : +249 908 180 432</span>
              </a>
              <a
                href="https://t.me/MEDOPGM"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 transition-colors ${isDark ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'
                  }`}
              >
                <Send className="w-4 h-4" />
                <span dir='ltr'>Telegram user : @MEDOPGM</span>
              </a>

            </div>
          </div>
        </div>

        <div className={`fixed bottom-0 z-20 left-0 right-0 mt-8 py-2  backdrop-blur-lg   border-t text-center ${isDark ? 'border-purple-500/20 text-gray-400 bg-zinc-950/50' : 'bg-white/50 border-gray-200 text-gray-600'
          }`}>
          <p className='sm:text-sm'>© 2026 MEDO STORE. {t('allRightsReserved')}</p>
          <a className='hover:text-blue-500 text-nowrap text-xs sm:text-sm md:text-lg text-red-400' href="https://github.com/Scoopy-Dooo" target="_blank" rel="noopener noreferrer">{t('designer')}</a>
        </div>
      </div>
    </footer>
  );
}