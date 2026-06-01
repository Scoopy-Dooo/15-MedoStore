import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../hooks/useTranslation';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import modalLogo from "../../assets/medo-logo-cutted.png"
export function WelcomeModal() {
  const { userName, setUserName, theme } = useApp();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const isDark = theme === 'dark';

  useEffect(() => {
    if (!userName) {
      setIsOpen(true);
    }
  }, [userName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      setUserName(name.trim());
      setIsOpen(false);
    } else if (name == '') {

      setUserName('عميل من الموقع');
      setIsOpen(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 backdrop-blur-sm z-[60] ${isDark ? 'bg-black/80' : 'bg-black/50'
              }`}
            onClick={() => { }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4"
          >
            <div className={`bg-gradient-to-br border rounded-2xl p-8 max-w-md w-full ${isDark
              ? 'from-[#0b0f1a] to-[#1a1f35] border-purple-500/30 shadow-[0_0_50px_rgba(34,211,238,0.3)]'
              : 'from-white to-gray-50 border-purple-300 shadow-2xl'
              }`}>
              <button
                onClick={() => setIsOpen(false)}
                className={`absolute top-4 right-4 transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto mb-4">
                  <img
                    src={modalLogo}
                    alt="Medo Store"
                    className="w-full h-full object-contain"
                  />
                </div>
                <h2 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                  {t('welcomeTitle')}
                </h2>
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                  {t('welcomeSubtitle')}
                </p>
                 {/* <p className='px-4 font-bold text-start sm:text-center text-red-600'>{t('notifyUsers')}</p> */}
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('enterName')}
                    className={`w-full px-4 py-3 border rounded-lg transition-all focus:outline-none ${isDark
                      ? 'bg-white/5 border-purple-500/30 text-white placeholder:text-gray-500 focus:border-purple-500 focus:shadow-[0_0_20px_rgba(34,211,238,0.3)]'
                      : 'bg-white border-purple-200 text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-200'
                      }`}
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  className={`w-full py-3 bg-gradient-to-r text-white font-bold rounded-lg transition-all ${isDark
                    ? 'from-purple-500 to-purple-500 hover:from-purple-400 hover:to-purple-400 shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_30px_rgba(34,211,238,0.6)]'
                    : 'from-purple-600 to-purple-600 hover:from-purple-500 hover:to-purple-500 shadow-lg hover:shadow-xl'
                    }`}
                >
                  {t('continue')}
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}