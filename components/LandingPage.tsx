
import React from 'react';
import { useTranslation } from '../i18n/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import { ThemeToggle } from './ThemeToggle';
import { TranslationKey } from '../i18n/translations';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowDown, Sparkles, Shuffle, Globe, MessageCircle, MapPin, Upload } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const AnimatedText: React.FC<{ text: string; isRtl: boolean; className: string; style?: React.CSSProperties }> = ({ text, isRtl, className, style }) => {
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
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, index }) => (
    <motion.div
        className="bg-white dark:bg-gray-700/50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-600 flex flex-col items-center text-center hover:-translate-y-2"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ delay: index * 0.08, duration: 0.4 }}
    >
        <div className="w-14 h-14 bg-pink-50 dark:bg-pink-900/30 rounded-full flex items-center justify-center mb-4 text-pink-600 dark:text-pink-400">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{description}</p>
    </motion.div>
);

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const { t, language } = useTranslation();
  const isRtl = language === 'ar';
  const backgroundText = t('landing.hello');

  const scrollToFeatures = () => {
      document.getElementById('landing-features')?.scrollIntoView({ behavior: 'smooth' });
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
        <section
            className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cover bg-center bg-hero-image"
        >
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/60" aria-hidden="true" />
            {/* BACKGROUND TEXT LAYER */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <div className="relative w-full max-w-7xl mx-auto h-[70vh] md:h-[80vh]">
                     {/* Dark text part */}
                    <AnimatedText 
                        text={backgroundText}
                        isRtl={isRtl}
                        className={`${commonTextStyle} absolute inset-0 flex items-center justify-center opacity-10 dark:opacity-20 text-brand ${isRtl ? 'clip-dark-rtl' : 'clip-dark-ltr'}`}
                    />
                     {/* Light text part */}
                     <AnimatedText 
                        text={backgroundText}
                        isRtl={isRtl}
                        className={`${commonTextStyle} text-gray-200 dark:text-gray-700 absolute inset-0 flex items-center justify-center opacity-30 dark:opacity-10 ${isRtl ? 'clip-light-rtl' : 'clip-light-ltr'}`}
                    />
                </div>
            </div>

            {/* Main Content Card */}
            <div className="relative w-full max-w-7xl mx-auto h-[70vh] md:h-[80vh] flex items-stretch z-30 shadow-2xl rounded-lg overflow-hidden my-auto px-4 md:px-0 backdrop-blur-sm">
                {/* Left Panel (Empty/Grey) - Becomes Right in RTL */}
                <div className={`hidden md:block md:w-5/12 ${isRtl ? 'order-2' : 'order-1'} relative bg-gray-200 dark:bg-gray-800 transition-colors duration-300`}>
                </div>

                {/* Right Panel (Content) - Becomes Left in RTL */}
                <div className={`w-full md:w-7/12 ${isRtl ? 'order-1' : 'order-2'} bg-white dark:bg-gray-900 flex flex-col items-center justify-center text-center p-6 md:p-12 transition-colors duration-300 rounded-lg md:rounded-none`}>
                    <div className="max-w-md w-full">
                        {/* Decorative Dots */}
                        <div className="grid grid-cols-3 gap-1.5 w-6 mb-8 mx-auto animate-text-fade-in opacity-60" style={{ animationDelay: '0ms' }}>
                            {Array.from({ length: 9 }).map((_, i) => (
                            <div key={i} className="w-1.5 h-1.5 rounded-full bg-brand"></div>
                            ))}
                        </div>

                        <motion.h2
                            className="text-4xl lg:text-5xl font-bold mb-2"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.5 }}
                        >
                            <span className="text-brand">{t('landing.juliana.name')}</span>
                        </motion.h2>
                        <motion.p
                            className="text-lg lg:text-xl italic opacity-80 text-brand"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25, duration: 0.5 }}
                        >
                            {t('landing.juliana.title')}
                        </motion.p>
                        <motion.p
                            className="mt-6 text-gray-600 dark:text-gray-300 leading-relaxed text-base md:text-lg"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                        >
                            {t('landing.juliana.bio')}
                        </motion.p>

                        <motion.div
                            className="mt-10"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.55, duration: 0.5 }}
                        >
                            <button
                            onClick={onGetStarted}
                            className="inline-flex items-center gap-3 px-8 py-4 text-white font-bold rounded-xl shadow-lg transition-transform duration-300 hover:animate-gentle-bounce hover:shadow-xl hover:scale-105 active:scale-95 bg-brand"
                            >
                            {t('landing.juliana.cta')}
                            <ArrowRight className={`w-5 h-5 ${isRtl ? 'transform rotate-180' : ''}`} />
                            </button>
                        </motion.div>
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
                    <ArrowDown className="w-8 h-8 text-gray-200 opacity-70" />
                </button>
            </div>
        </section>

        {/* Features Section */}
        <section id="landing-features" className="relative py-24 px-4 md:px-8 bg-white dark:bg-gray-800 transition-colors duration-300 scroll-mt-10">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">{t('landing.features.title')}</h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">{t('landing.features.subtitle')}</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        { icon: Sparkles, title: 'landing.features.ai.title', desc: 'landing.features.ai.desc' },
                        { icon: Shuffle, title: 'landing.features.mix.title', desc: 'landing.features.mix.desc' },
                        { icon: Globe, title: 'landing.features.trends.title', desc: 'landing.features.trends.desc' },
                        { icon: MessageCircle, title: 'landing.features.chat.title', desc: 'landing.features.chat.desc' },
                        { icon: MapPin, title: 'landing.features.local.title', desc: 'landing.features.local.desc' },
                        { icon: Upload, title: 'landing.features.closet.title', desc: 'landing.features.closet.desc' },
                    ].map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <FeatureCard
                                key={feature.title}
                                icon={<Icon className="w-8 h-8" />}
                                title={t(feature.title as TranslationKey)}
                                description={t(feature.desc as TranslationKey)}
                                index={index}
                            />
                        );
                    })}
                </div>
            </div>
        </section>
    </div>
  );
};
