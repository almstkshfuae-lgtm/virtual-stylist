import React from 'react';
import { useTranslation } from '../i18n/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import { ArrowRightIcon } from './icons/ArrowRightIcon';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LANDING_BG_COLOR = '#6b1a3c';

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen w-full bg-white flex flex-col md:flex-row font-sans relative">
      
      <div className="absolute top-4 right-4 z-10">
        <LanguageSelector />
      </div>

      {/* Left Column: HELLO text */}
      <div
        className="w-full md:w-5/12 min-h-[50vh] md:min-h-screen relative flex items-center justify-center overflow-hidden p-8"
        style={{ backgroundColor: LANDING_BG_COLOR }}
      >
        <div className="text-center">
            <h1 className="text-white font-extrabold text-[10rem] sm:text-[12rem] md:text-[14rem] lg:text-[18rem] leading-none tracking-tighter select-none">
            HEL
            <br />
            LO!
            </h1>
        </div>
      </div>

      {/* Right Column: Content */}
      <div className="w-full md:w-7/12 bg-white flex flex-col justify-center p-8 sm:p-12 md:p-16 lg:p-24">
        <div className="max-w-md">
          {/* Decorative Dots */}
          <div className="grid grid-cols-3 gap-1.5 w-6 mb-8">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: LANDING_BG_COLOR}}></div>
            ))}
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold" style={{color: LANDING_BG_COLOR}}>{t('landing.juliana.name')}</h2>
          <p className="text-lg lg:text-xl italic mt-2" style={{color: LANDING_BG_COLOR}}>
            {t('landing.juliana.title')}
          </p>
          <p className="mt-6 text-gray-600 leading-relaxed">
            {t('landing.juliana.bio')}
          </p>

          {/* CTA Button */}
          <div className="mt-10">
            <button
              onClick={onGetStarted}
              className="inline-flex items-center gap-3 px-8 py-3 text-white font-bold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
              style={{backgroundColor: LANDING_BG_COLOR}}
            >
              {t('landing.juliana.cta')}
              <ArrowRightIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
