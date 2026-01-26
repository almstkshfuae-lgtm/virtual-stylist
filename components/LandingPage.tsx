
import React from 'react';
import { useTranslation } from '../i18n/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import { ArrowRightIcon } from './icons/ArrowRightIcon';
import { ThemeToggle } from './ThemeToggle';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LANDING_BG_COLOR = '#6b1a3c';
const JULIANA_IMAGE_URL = 'data:image/webp;base64,UklGRqgMAABXRUJQVlA4TJwMAAAv/8F/EOsJ27ZtI/f5j+w8k20/M6wT/39vJ6iJJIWb4U+yE+9kCBzTtu3uTm3btt2m/o9t22iF4H84T7btfrN/f/f69QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgP+/H4AE+K8W8O+/t/8BAAAAgA==';

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const { t } = useTranslation();
  const backgroundText = 'HELLO!';

  return (
    <div className="min-h-screen w-full bg-white dark:bg-gray-900 flex flex-col md:flex-row font-sans overflow-hidden">
      
      {/* Decorative Column */}
      <div
        className="w-full md:w-5/12 min-h-[50vh] md:min-h-screen relative flex items-center justify-center p-4 order-1 md:order-1 bg-cover bg-center"
        style={{ backgroundImage: `url(${JULIANA_IMAGE_URL})` }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="text-center relative z-10">
            <h1 className="text-white font-extrabold text-[18vw] sm:text-[15vw] md:text-[10vw] lg:text-[10rem] leading-none tracking-[-0.05em] select-none">
              {backgroundText.split('').map((char, index) => (
                <span 
                  key={index} 
                  className="animate-letter-reveal" 
                  style={{ animationDelay: `${index * 100}ms`}}
                >
                  {char}
                </span>
              ))}
            </h1>
        </div>
      </div>
      
      {/* Content Column */}
      <div className="w-full md:w-7/12 bg-white dark:bg-gray-900 flex flex-col items-center justify-center text-center p-8 sm:p-12 order-2 md:order-2">
        <div className="absolute top-4 right-4 z-10 flex items-center gap-4">
          <ThemeToggle />
          <LanguageSelector />
        </div>
        <div className="max-w-md">
          <div className="grid grid-cols-3 gap-1.5 w-6 mb-8 mx-auto animate-text-fade-in" style={{ animationDelay: '0ms' }}>
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: LANDING_BG_COLOR}}></div>
            ))}
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold animate-text-fade-in" style={{color: LANDING_BG_COLOR, animationDelay: '100ms'}}>{t('landing.juliana.name')}</h2>
          <p className="text-lg lg:text-xl italic mt-2 animate-text-fade-in" style={{color: LANDING_BG_COLOR, animationDelay: '300ms'}}>
            {t('landing.juliana.title')}
          </p>
          <p className="mt-6 text-gray-600 dark:text-gray-300 leading-relaxed animate-text-fade-in" style={{ animationDelay: '500ms' }}>
            {t('landing.juliana.bio')}
          </p>

          <div className="mt-10 animate-text-fade-in" style={{ animationDelay: '700ms' }}>
            <button
              onClick={onGetStarted}
              className="inline-flex items-center gap-3 px-8 py-4 text-white font-bold rounded-xl shadow-lg transition-transform duration-300 hover:animate-gentle-bounce"
              style={{backgroundColor: LANDING_BG_COLOR}}
            >
              {t('landing.juliana.cta')}
              {/* Icon flips for RTL languages */}
              <ArrowRightIcon className="w-5 h-5 rtl:transform rtl:-scale-x-100" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};