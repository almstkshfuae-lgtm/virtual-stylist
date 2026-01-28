import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../theme/ThemeContext';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';
import { MonitorIcon } from './icons/MonitorIcon';
import { useTranslation } from '../i18n/LanguageContext';
import { TranslationKey } from '../i18n/translations';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const icons = {
    light: <SunIcon className="w-5 h-5" />,
    dark: <MoonIcon className="w-5 h-5" />,
    system: <MonitorIcon className="w-5 h-5" />
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 dark:focus:ring-offset-slate-900 transition-colors"
        aria-label="Theme settings"
      >
        {icons[theme]}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 w-36 mt-2 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-slate-800 dark:ring-slate-700 overflow-hidden animate-fade-in-up">
          <div className="py-1">
            {(['light', 'dark', 'system'] as const).map((tOption) => (
              <button
                key={tOption}
                onClick={() => {
                  setTheme(tOption);
                  setIsOpen(false);
                }}
                className={`flex items-center w-full px-4 py-2 text-sm text-left gap-3 transition-colors
                  ${theme === tOption 
                    ? 'bg-pink-50 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400' 
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-700'
                  }
                `}
              >
                <span className="w-5 h-5 flex items-center justify-center">{icons[tOption]}</span>
                <span>{t(`theme.${tOption}` as TranslationKey)}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};