import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AppContextType {
  theme: 'dark' | 'light';
  language: 'ar' | 'en';
  userName: string;
  toggleTheme: () => void;
  toggleLanguage: () => void;
  setUserName: (name: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [userName, setUserNameState] = useState<string>('');

  // Load saved preferences on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('medoStoreTheme') as 'dark' | 'light' | null;
    const savedLanguage = localStorage.getItem('medoStoreLanguage') as 'ar' | 'en' | null;
    const savedName = localStorage.getItem('medoStoreUserName');

    if (savedTheme) setTheme(savedTheme);
    if (savedLanguage) setLanguage(savedLanguage);
    if (savedName) setUserNameState(savedName);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', language);
  }, [theme, language]);

  const toggleTheme = () => {
    setTheme(prev => {
      const newTheme = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('medoStoreTheme', newTheme);
      return newTheme;
    });
  };

  const toggleLanguage = () => {
    setLanguage(prev => {
      const newLanguage = prev === 'ar' ? 'en' : 'ar';
      localStorage.setItem('medoStoreLanguage', newLanguage);
      return newLanguage;
    });
  };

  const setUserName = (name: string) => {
    setUserNameState(name);
    localStorage.setItem('medoStoreUserName', name);
  };

  return (
    <AppContext.Provider value={{ theme, language, userName, toggleTheme, toggleLanguage, setUserName }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}