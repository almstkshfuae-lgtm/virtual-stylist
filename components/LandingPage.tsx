
import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from '../i18n/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import { ArrowRightIcon } from './icons/ArrowRightIcon';
import { ThemeToggle } from './ThemeToggle';
import { SparklesIcon } from './icons/SparklesIcon';
import { PlusMinusIcon } from './icons/PlusMinusIcon';
import { GlobeIcon } from './icons/GlobeIcon';
import { ChatBubbleIcon } from './icons/ChatBubbleIcon';
import { MapPinIcon } from './icons/MapPinIcon';
import { UploadIcon } from './icons/UploadIcon';
import { ArrowDownIcon } from './icons/ArrowDownIcon';
import { TranslationKey } from '../i18n/translations';

interface LandingPageProps {
  onGetStarted: () => void;
}

const BURGUNDY_COLOR = '#6b1a3c';

const AnimatedText: React.FC<{ text: string; isRtl: boolean, className: string, style: React.CSSProperties }> = ({ text, isRtl, className, style }) => {
  // For RTL languages (like Arabic), splitting text by character breaks ligatures (shaping).
  // We must render the text as a continuous block.
  if (isRtl) {
    return (
      <h1 className={className} style={style}>
        <span className="animate-letter-reveal" style={{ animationDelay: '0ms' }}>
          {text}
        </span>
      </h1>
    );
  }

  // For LTR languages, we can safely animate letter-by-letter.
  return (
    <h1 className={className} style={style}>
      {text.split('').map((char, index) => (
        <span 
          key={index} 
          className="animate-letter-reveal" 
          style={{ animationDelay: `${index * 60}ms`}}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </h1>
  );
};

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    index: number;
    isVisible: boolean;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, index, isVisible }) => (
    <div 
        className={`bg-white dark:bg-gray-700/50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-700 transform border border-gray-100 dark:border-gray-600 flex flex-col items-center text-center hover:-translate-y-2
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        style={{ transitionDelay: `${index * 100}ms` }}
    >
        <div className="w-14 h-14 bg-pink-50 dark:bg-pink-900/30 rounded-full flex items-center justify-center mb-4 text-pink-600 dark:text-pink-400">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{description}</p>
    </div>
);

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const { t, language } = useTranslation();
  const isRtl = language === 'ar';
  const backgroundText = t('landing.hello');
  
  const featuresRef = useRef<HTMLDivElement>(null);
  const [areFeaturesVisible, setAreFeaturesVisible] = useState(false);

  useEffect(() => {
      const observer = new IntersectionObserver(
          ([entry]) => {
              if (entry.isIntersecting) {
                  setAreFeaturesVisible(true);
                  observer.disconnect();
              }
          },
          { threshold: 0.1 }
      );

      if (featuresRef.current) {
          observer.observe(featuresRef.current);
      }

      return () => observer.disconnect();
  }, []);

  const scrollToFeatures = () => {
      featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Reduced font size slightly on mobile to prevent visual crowding
  const commonTextStyle = "font-black text-[15vw] md:text-[10vw] lg:text-[10rem] leading-none tracking-[-0.05em] select-none whitespace-nowrap transition-all duration-500";

  return (
    <div className="min-h-screen w-full font-sans bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
        {/* Header Actions */}
        <div className="fixed top-4 right-4 z-50 flex items-center gap-4">
          <ThemeToggle />
          <LanguageSelector />
        </div>
        
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* BACKGROUND TEXT LAYER */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <div className="relative w-full max-w-7xl mx-auto h-[70vh] md:h-[80vh]">
                     {/* Dark text part */}
                    <AnimatedText 
                        text={backgroundText}
                        isRtl={isRtl}
                        className={`${commonTextStyle} absolute inset-0 flex items-center justify-center opacity-10 dark:opacity-20`}
                        style={{ 
                            color: BURGUNDY_COLOR, 
                            clipPath: isRtl ? 'inset(0 0 0 58.333%)' : 'inset(0 58.333% 0 0)'
                        }}
                    />
                     {/* Light text part */}
                     <AnimatedText 
                        text={backgroundText}
                        isRtl={isRtl}
                        className={`${commonTextStyle} text-gray-200 dark:text-gray-700 absolute inset-0 flex items-center justify-center opacity-30 dark:opacity-10`}
                        style={{ 
                            clipPath: isRtl ? 'inset(0 41.667% 0 0)' : 'inset(0 0 0 41.667%)' 
                        }}
                    />
                </div>
            </div>

            {/* Main Content Card */}
            <div className="relative w-full max-w-7xl mx-auto h-[70vh] md:h-[80vh] flex items-stretch z-30 shadow-2xl rounded-lg overflow-hidden my-auto px-4 md:px-0">
                {/* Left Panel (Empty/Grey) - Becomes Right in RTL */}
                <div className={`hidden md:block md:w-5/12 ${isRtl ? 'order-2' : 'order-1'} relative bg-gray-200 dark:bg-gray-800 transition-colors duration-300`}>
                </div>

                {/* Right Panel (Content) - Becomes Left in RTL */}
                <div className={`w-full md:w-7/12 ${isRtl ? 'order-1' : 'order-2'} bg-white dark:bg-gray-900 flex flex-col items-center justify-center text-center p-6 md:p-12 transition-colors duration-300 rounded-lg md:rounded-none`}>
                    <div className="max-w-md w-full">
                        {/* Decorative Dots */}
                        <div className="grid grid-cols-3 gap-1.5 w-6 mb-8 mx-auto animate-text-fade-in opacity-60" style={{ animationDelay: '0ms' }}>
                            {Array.from({ length: 9 }).map((_, i) => (
                            <div key={i} className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: BURGUNDY_COLOR}}></div>
                            ))}
                        </div>

                        <h2 className="text-4xl lg:text-5xl font-bold animate-text-fade-in mb-2" style={{color: BURGUNDY_COLOR, animationDelay: '100ms'}}>
                            {t('landing.juliana.name')}
                        </h2>
                        <p className="text-lg lg:text-xl italic animate-text-fade-in opacity-80" style={{color: BURGUNDY_COLOR, animationDelay: '300ms'}}>
                            {t('landing.juliana.title')}
                        </p>
                        <p className="mt-6 text-gray-600 dark:text-gray-300 leading-relaxed animate-text-fade-in text-base md:text-lg" style={{ animationDelay: '500ms' }}>
                            {t('landing.juliana.bio')}
                        </p>

                        <div className="mt-10 animate-text-fade-in" style={{ animationDelay: '700ms' }}>
                            <button
                            onClick={onGetStarted}
                            className="inline-flex items-center gap-3 px-8 py-4 text-white font-bold rounded-xl shadow-lg transition-transform duration-300 hover:animate-gentle-bounce hover:shadow-xl hover:scale-105 active:scale-95"
                            style={{backgroundColor: BURGUNDY_COLOR}}
                            >
                            {t('landing.juliana.cta')}
                            <ArrowRightIcon className={`w-5 h-5 ${isRtl ? 'transform rotate-180' : ''}`} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 animate-bounce">
                <button 
                    onClick={scrollToFeatures}
                    className="p-2 rounded-full hover:bg-white/20 dark:hover:bg-black/20 transition-colors focus:outline-none"
                    aria-label="Scroll down"
                >
                    <ArrowDownIcon className="w-8 h-8 text-gray-600 dark:text-gray-400 opacity-70" />
                </button>
            </div>
        </section>

        {/* Features Section */}
        <section ref={featuresRef} className="relative py-24 px-4 md:px-8 bg-white dark:bg-gray-800 transition-colors duration-300 scroll-mt-10">
            <div className="max-w-7xl mx-auto">
                <div className={`text-center mb-16 transition-all duration-1000 transform ${areFeaturesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">{t('landing.features.title')}</h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">{t('landing.features.subtitle')}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <FeatureCard 
                        icon={<SparklesIcon className="w-8 h-8" />}
                        title={t('landing.features.ai.title')}
                        description={t('landing.features.ai.desc')}
                        index={0}
                        isVisible={areFeaturesVisible}
                    />
                    <FeatureCard 
                        icon={<PlusMinusIcon className="w-8 h-8" />}
                        title={t('landing.features.mix.title')}
                        description={t('landing.features.mix.desc')}
                        index={1}
                        isVisible={areFeaturesVisible}
                    />
                    <FeatureCard 
                        icon={<GlobeIcon className="w-8 h-8" />}
                        title={t('landing.features.trends.title')}
                        description={t('landing.features.trends.desc')}
                        index={2}
                        isVisible={areFeaturesVisible}
                    />
                    <FeatureCard 
                        icon={<ChatBubbleIcon className="w-8 h-8" />}
                        title={t('landing.features.chat.title')}
                        description={t('landing.features.chat.desc')}
                        index={3}
                        isVisible={areFeaturesVisible}
                    />
                    <FeatureCard 
                        icon={<MapPinIcon className="w-8 h-8" />}
                        title={t('landing.features.local.title')}
                        description={t('landing.features.local.desc')}
                        index={4}
                        isVisible={areFeaturesVisible}
                    />
                     <FeatureCard 
                        icon={<UploadIcon className="w-8 h-8" />}
                        title={t('landing.features.closet.title')}
                        description={t('landing.features.closet.desc')}
                        index={5}
                        isVisible={areFeaturesVisible}
                    />
                </div>
            </div>
        </section>
    </div>
  );
};
