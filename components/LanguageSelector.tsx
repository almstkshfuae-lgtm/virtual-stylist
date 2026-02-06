
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../i18n/useTranslation';

const languages = {
  en: 'English',
  fr: 'Français',
  ar: 'العربية',
  ru: 'Русский',
  nl: 'Nederlands'
};

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLanguageChange = (langCode: 'en' | 'ar' | 'fr' | 'ru' | 'nl') => {
    setLanguage(langCode);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex min-h-10 items-center justify-between w-full sm:w-36 px-4 py-2 text-sm font-medium text-gray-800 bg-white border border-gray-300 rounded-xl shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 dark:bg-slate-800 dark:text-gray-100 dark:border-slate-600 dark:hover:bg-slate-700"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{languages[language]}</span>
        <svg className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      {isOpen && (
        <div className="absolute z-10 w-full sm:w-36 mt-1 bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 end-0 dark:bg-slate-800 dark:ring-slate-700">
          <div className="py-1">
            {Object.entries(languages).map(([code, name]) => (
              <button
                key={code}
                onClick={() => handleLanguageChange(code as 'en' | 'ar' | 'fr' | 'ru' | 'nl')}
                className="block w-full px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 text-start dark:text-gray-100 dark:hover:bg-slate-700"
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
