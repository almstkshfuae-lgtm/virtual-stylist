import React from 'react';
import { useTranslation } from '../i18n/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import { ArrowRightIcon } from './icons/ArrowRightIcon';
import { ThemeToggle } from './ThemeToggle';

interface LandingPageProps {
  onGetStarted: () => void;
}

const BURGUNDY_COLOR = '#6b1a3c';

const AnimatedText: React.FC<{ text: string; isRtl: boolean, className: string, style: React.CSSProperties }> = ({ text, isRtl, className, style }) => (
  <h1 className={className} style={style}>
    {text.split('').map((char, index) => {
      // For RTL, we maintain the visual sweep direction logic or reading order.
      // Using (length - 1 - index) for RTL creates a Left-to-Right sweep visually (last char first).
      // Standard index creates a Right-to-Left sweep (first char first, reading order).
      const delay = isRtl ? (text.length - 1 - index) * 60 : index * 60;
      return (
        <span 
          key={index} 
          className="animate-letter-reveal" 
          style={{ animationDelay: `${delay}ms`}}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      );
    })}
  </h1>
);

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const { t, language } = useTranslation();
  const isRtl = language === 'ar';
  const backgroundText = t('landing.hello');
  
  const commonTextStyle = "font-black text-[18vw] sm:text-[15vw] md:text-[10vw] lg:text-[10rem] leading-none tracking-[-0.05em] select-none whitespace-nowrap";

  return (
    <div className="min-h-screen w-full font-sans overflow-hidden relative flex items-center justify-center">
        <div className="absolute top-4 right-4 z-20 flex items-center gap-4">
          <ThemeToggle />
          <LanguageSelector />
        </div>
        
        {/* Main Content container */}
        <div className="relative w-full max-w-7xl mx-auto h-[70vh] md:h-[80vh] flex items-stretch">
            {/* Left Panel - Grey background */}
            <div className={`w-5/12 ${isRtl ? 'order-2' : 'order-1'} relative bg-gray-200 dark:bg-gray-800`}>
            </div>

            {/* Right Panel - Text content */}
            <div className={`w-7/12 ${isRtl ? 'order-1' : 'order-2'} bg-white dark:bg-gray-900 flex flex-col items-center justify-center text-center p-8`}>
                <div className="max-w-md">
                    <div className="grid grid-cols-3 gap-1.5 w-6 mb-8 mx-auto animate-text-fade-in" style={{ animationDelay: '0ms' }}>
                        {Array.from({ length: 9 }).map((_, i) => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: BURGUNDY_COLOR}}></div>
                        ))}
                    </div>

                    <h2 className="text-4xl lg:text-5xl font-bold animate-text-fade-in" style={{color: BURGUNDY_COLOR, animationDelay: '100ms'}}>{t('landing.juliana.name')}</h2>
                    <p className="text-lg lg:text-xl italic mt-2 animate-text-fade-in" style={{color: BURGUNDY_COLOR, animationDelay: '300ms'}}>
                        {t('landing.juliana.title')}
                    </p>
                    <p className="mt-6 text-gray-600 dark:text-gray-300 leading-relaxed animate-text-fade-in" style={{ animationDelay: '500ms' }}>
                        {t('landing.juliana.bio')}
                    </p>

                    <div className="mt-10 animate-text-fade-in" style={{ animationDelay: '700ms' }}>
                        <button
                        onClick={onGetStarted}
                        className="inline-flex items-center gap-3 px-8 py-4 text-white font-bold rounded-xl shadow-lg transition-transform duration-300 hover:animate-gentle-bounce"
                        style={{backgroundColor: BURGUNDY_COLOR}}
                        >
                        {t('landing.juliana.cta')}
                        <ArrowRightIcon className="w-5 h-5 rtl:transform rtl:-scale-x-100" />
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/* HELLO Text Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className="relative w-full max-w-7xl mx-auto h-[70vh] md:h-[80vh]">
                 {/* Burgundy text, clipped to the left panel */}
                <AnimatedText 
                    text={backgroundText}
                    isRtl={isRtl}
                    className={`${commonTextStyle} absolute inset-0 flex items-center justify-center`}
                    style={{ color: BURGUNDY_COLOR, clipPath: isRtl ? 'inset(0 0 0 58.333%)' : 'inset(0 58.333% 0 0)'}}
                />
                 {/* Light Grey text, clipped to the right panel */}
                 <AnimatedText 
                    text={backgroundText}
                    isRtl={isRtl}
                    className={`${commonTextStyle} text-gray-200 dark:text-gray-700 absolute inset-0 flex items-center justify-center`}
                    style={{ clipPath: isRtl ? 'inset(0 41.667% 0 0)' : 'inset(0 0 0 41.667%)' }}
                />
            </div>
        </div>
    </div>
  );
};