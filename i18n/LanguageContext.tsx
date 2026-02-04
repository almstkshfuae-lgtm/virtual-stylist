
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { translations } from './translations';

type Language = 'en' | 'ar' | 'fr' | 'ru' | 'nl';
type LanguageDirection = 'ltr' | 'rtl';
const LANGUAGE_STORAGE_KEY = 'virtual-stylist-language';

const isLanguage = (value: string): value is Language =>
  value === 'en' || value === 'ar' || value === 'fr' || value === 'ru' || value === 'nl';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, fallback?: string | Record<string, string|number>) => any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'en';
    const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (saved && isLanguage(saved)) return saved;
    return 'en';
  });

  useEffect(() => {
    const dir: LanguageDirection = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }, [language]);

  const t = useCallback((key: string, options?: string | Record<string, string|number>): any => {
    const keys = key.split('.');
    let result: any = translations[language];

    for (const k of keys) {
        if (result && typeof result === 'object' && k in result) {
            result = result[k];
        } else {
            // Fallback to English
            result = translations.en;
            for (const fk of keys) {
                if (result && typeof result === 'object' && fk in result) {
                    result = result[fk];
                } else {
                    // If key not found in English either, return key or fallback
                    return typeof options === 'string' ? options : key;
                }
            }
            break; 
        }
    }
    
    if (typeof result === 'string') {
        if (options && typeof options === 'object') {
            return Object.entries(options).reduce((acc: string, [k, v]) => {
                return acc.replace(new RegExp(`{{${k}}}`, 'g'), String(v));
            }, result);
        }
        return result;
    }
    
    if (Array.isArray(result)) {
      return result;
    }

    return typeof options === 'string' ? options : key;

  }, [language]);
  

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
