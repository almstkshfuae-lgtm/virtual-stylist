
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
        className="group bg-white dark:bg-gray-700/50 p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-600 flex flex-col items-center text-center h-full"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ delay: index * 0.1, duration: 0.5 }}
        whileHover={{ y: -8 }}
    >
        <motion.div 
            className="w-14 h-14 sm:w-16 sm:h-16 bg-pink-50 dark:bg-pink-900/30 rounded-full flex items-center justify-center mb-5 sm:mb-6 text-pink-600 dark:text-pink-400 group-hover:scale-110 transition-transform duration-300"
            whileHover={{ rotate: 10, scale: 1.15 }}
        >
            {icon}
        </motion.div>
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 sm:mb-4 leading-tight">{title}</h3>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed flex-grow">{description}</p>
    </motion.div>
);

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const { t, language } = useTranslation();
  const isRtl = language === 'ar';

  const scrollToFeatures = () => {
      document.getElementById('landing-features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen w-full font-sans bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-x-hidden">
        {/* Header Actions */}
        <div className="fixed top-4 sm:top-6 right-4 sm:right-6 z-50 flex items-center gap-2 sm:gap-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm p-2 sm:p-3 rounded-full shadow-lg">
          <ThemeToggle />
          <LanguageSelector />
        </div>
        
        {/* Hero Section */}
        <section
            className="relative w-full flex flex-col items-center justify-center overflow-hidden bg-cover bg-center bg-hero-image pt-52 sm:pt-72 md:pt-96 pb-16 sm:pb-20 md:pb-24 min-h-fit"
        >
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/60" aria-hidden="true" />
            
            {/* Main Hero Content - Simplified and Responsive */}
            <div className="relative w-full max-w-4xl mx-auto z-30 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
                <div className="w-full max-w-2xl">
                    {/* Decorative Dots */}
                    <motion.div 
                        className="flex justify-center gap-1.5 mb-6 sm:mb-8"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        {Array.from({ length: 9 }).map((_, i) => (
                            <div 
                                key={i} 
                                className="w-2 h-2 rounded-full bg-brand"
                                style={{ 
                                    opacity: 0.6 + (i % 3) * 0.15,
                                    animation: `pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
                                    animationDelay: `${i * 0.1}s`
                                }}
                            />
                        ))}
                    </motion.div>

                    <motion.h1
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-3 sm:mb-4 leading-tight"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.6 }}
                    >
                        <span className="text-brand">{t('landing.juliana.name')}</span>
                    </motion.h1>

                    <motion.p
                        className="text-lg sm:text-xl md:text-2xl italic text-brand/80 mb-4 sm:mb-6 font-semibold"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                    >
                        {t('landing.juliana.title')}
                    </motion.p>

                    <motion.p
                        className="text-base sm:text-lg md:text-xl text-gray-200 dark:text-gray-100 leading-relaxed mb-6 sm:mb-8 max-w-xl mx-auto"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                    >
                        {t('landing.juliana.bio')}
                    </motion.p>

                    <motion.button
                        onClick={onGetStarted}
                        className="inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 text-white font-bold text-base sm:text-lg rounded-full sm:rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 active:scale-95 bg-brand hover:bg-brand/90 w-full sm:w-auto max-w-sm sm:max-w-none"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {t('landing.juliana.cta')}
                        <ArrowRight className={`w-5 h-5 sm:w-6 sm:h-6 ${isRtl ? 'transform rotate-180' : ''}`} />
                    </motion.button>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div 
                className="relative mt-6 sm:mt-8 z-30"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                <button 
                    onClick={scrollToFeatures}
                    className="p-2 sm:p-3 rounded-full bg-white/20 dark:bg-white/10 hover:bg-white/40 dark:hover:bg-white/20 transition-all focus:outline-none focus:ring-2 focus:ring-white/50"
                    aria-label="Scroll down to features"
                >
                    <ArrowDown className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </button>
            </motion.div>
        </section>

        {/* Features Section */}
        <section 
            id="landing-features" 
            className="relative w-full py-16 sm:py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800 transition-colors duration-300 scroll-mt-10"
        >
            <div className="max-w-6xl mx-auto">
                {/* Section Header */}
                <motion.div
                    className="text-center mb-12 sm:mb-16 md:mb-20"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight">
                        {t('landing.features.title')}
                    </h2>
                    <div className="w-16 h-1 bg-brand rounded-full mx-auto mb-6 sm:mb-8" />
                    <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        {t('landing.features.subtitle')}
                    </p>
                </motion.div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
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
                                icon={<Icon className="w-7 h-7 sm:w-8 sm:h-8" />}
                                title={t(feature.title as TranslationKey)}
                                description={t(feature.desc as TranslationKey)}
                                index={index}
                            />
                        );
                    })}
                </div>

                {/* CTA at bottom */}
                <motion.div
                    className="text-center mt-12 sm:mt-16 md:mt-20"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <button
                        onClick={onGetStarted}
                        className="inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 text-white font-bold text-base sm:text-lg rounded-full sm:rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 active:scale-95 bg-brand hover:bg-brand/90"
                        aria-label="Get started with Virtual Stylist"
                    >
                        {t('landing.juliana.cta')}
                        <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                </motion.div>
            </div>
        </section>
    </div>
  );
};
