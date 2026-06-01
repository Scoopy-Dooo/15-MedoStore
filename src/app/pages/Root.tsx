import { Outlet } from 'react-router';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { WhatsAppButton } from '../components/WhatsAppButton';
import { WelcomeModal } from '../components/WelcomeModal';
import { useApp } from '../context/AppContext';
import { useEffect } from 'react';

export default function Root() {
  const { theme } = useApp();
  
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  
  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-[#0b0f1a] text-white' 
        : 'bg-[#f5f5f7] text-gray-900'
    }`}>
      <Navbar />
      <main className="pt-20">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
      <WelcomeModal />
    </div>
  );
}