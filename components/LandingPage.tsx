
import React, { useCallback } from 'react';
import { useTranslation } from '../i18n/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import { ThemeToggle } from './ThemeToggle';
import { TranslationKey } from '../i18n/translations';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowDown, Sparkles, Shuffle, Globe, MessageCircle, MapPin, Upload, Gift, User } from 'lucide-react';
import { useLoyalty } from '../hooks/useConvex';

import { LoyaltyHero } from './LoyaltyHero';
import CustomerProfileForm from './CustomerProfileForm';
import { isConvexEnabled } from '../lib/convexConfig';

interface LandingPageProps {
  onGetStarted: () => void;
  userId: string;
  onRestoreAccount: (email: string, name?: string) => Promise<void>;
  restoreLoading: boolean;
  onRegisterAccount: (email: string, name?: string, referralCode?: string) => Promise<void>;
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
        className="group relative overflow-hidden rounded-3xl border border-white/60 bg-white/80 p-6 sm:p-8 shadow-[0_24px_45px_rgba(15,15,15,0.08)] transition-all duration-300 hover:-translate-y-2 dark:border-white/10 dark:bg-slate-900/70 dark:shadow-[0_24px_45px_rgba(0,0,0,0.4)] flex flex-col items-start text-start h-full"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ delay: index * 0.1, duration: 0.5 }}
        whileHover={{ y: -8 }}
    >
        <motion.div 
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-5 sm:mb-6 text-[color:var(--landing-rose)] bg-[linear-gradient(135deg,rgba(194,91,62,0.18),rgba(31,78,61,0.18))] dark:bg-[linear-gradient(135deg,rgba(226,122,85,0.2),rgba(127,208,184,0.18))] group-hover:scale-110 transition-transform duration-300"
            whileHover={{ rotate: 10, scale: 1.15 }}
        >
            {icon}
        </motion.div>
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 mb-3 sm:mb-4 leading-tight">{title}</h3>
        <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed flex-grow">{description}</p>
    </motion.div>
);

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, userId, onRestoreAccount, restoreLoading, onRegisterAccount }) => {
  const { t, language } = useTranslation();
  const isRtl = language === 'ar';
  const { account, ensureCustomer } = useLoyalty(userId);
  const [restoreEmail, setRestoreEmail] = React.useState('');
  const [restoreName, setRestoreName] = React.useState('');
  const [restoreError, setRestoreError] = React.useState<string | null>(null);
  const [signupEmail, setSignupEmail] = React.useState('');
  const [signupName, setSignupName] = React.useState('');
  const [signupReferral, setSignupReferral] = React.useState('');
  const [signupError, setSignupError] = React.useState<string | null>(null);
  const [isSignupLoading, setIsSignupLoading] = React.useState(false);

  const scrollToFeatures = () => {
      document.getElementById('landing-features')?.scrollIntoView({ behavior: 'smooth' });
  };

  const profileLabel = t('landing.header.profile');
  const referralLabel = t('landing.header.referral');
  const referralUnavailableLabel = t('landing.header.referralUnavailable');

  const pointsFormatter = React.useMemo(() => new Intl.NumberFormat(language), [language]);
  const userName = account?.name ?? t('landing.header.guest');
  const userPoints = account
    ? t('landing.header.pointsLabel', { points: pointsFormatter.format(account.pointsBalance) })
    : t('landing.header.pointsUnknown');
  const referralStatus = account?.referralCode
    ? t('landing.header.referralActive')
    : t('landing.header.referralPending');
  const userInitial = userName ? userName.trim().charAt(0).toUpperCase() || 'V' : 'V';

  const scrollToSection = useCallback((id: string) => {
    if (typeof document === 'undefined') return;
    const target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);

  const handleProfileClick = useCallback(() => {
    scrollToSection('landing-profile-form');
  }, [scrollToSection]);

  const handleReferralClick = useCallback(() => {
    scrollToSection('landing-referral-target');
  }, [scrollToSection]);

  // Ensure loyalty account exists early so referral code is auto-generated.
  React.useEffect(() => {
    if (!userId || !ensureCustomer) return;
    ensureCustomer({ userId }).catch((err: Error) =>
      console.debug('ensureCustomer (landing) skipped', err.message)
    );
  }, [ensureCustomer, userId]);

  const handleRestore = async () => {
    setRestoreError(null);
    const trimmedEmail = restoreEmail.trim();
    if (!restoreEmail.trim()) {
      setRestoreError(t('landing.restore.emailRequired'));
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setRestoreError(t('landing.restore.invalidEmail'));
      return;
    }
    try {
      await onRestoreAccount(trimmedEmail, restoreName.trim() || undefined);
    } catch (error) {
      console.error('restore failed', error);
      setRestoreError(t('landing.restore.failed'));
    }
  };

  const handleSignup = async () => {
    setSignupError(null);
    const trimmedEmail = signupEmail.trim();
    if (!trimmedEmail) {
      setSignupError(t('landing.signup.emailRequired'));
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setSignupError(t('landing.signup.invalidEmail'));
      return;
    }
    setIsSignupLoading(true);
    try {
      await onRegisterAccount(
        trimmedEmail,
        signupName.trim() || undefined,
        signupReferral.trim() || undefined
      );
      setSignupError(null);
    } catch (error) {
      console.error('signup failed', error);
      setSignupError(t('landing.signup.failed'));
    } finally {
      setIsSignupLoading(false);
    }
  };

  const navButtonClass = (isDisabled = false) =>
    [
      'inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs sm:text-sm font-semibold shadow-sm transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500',
      isDisabled
        ? 'border-white/40 bg-white/60 text-gray-500 cursor-not-allowed dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-400'
        : 'border-white/70 bg-white/90 text-gray-900 hover:border-white dark:border-gray-700 dark:bg-gray-900/70 dark:text-white dark:hover:bg-gray-800',
    ].join(' ');

  const featureCards = [
    { icon: Sparkles, title: 'landing.features.ai.title', desc: 'landing.features.ai.desc' },
    { icon: Shuffle, title: 'landing.features.mix.title', desc: 'landing.features.mix.desc' },
    { icon: Globe, title: 'landing.features.trends.title', desc: 'landing.features.trends.desc' },
    { icon: MessageCircle, title: 'landing.features.chat.title', desc: 'landing.features.chat.desc' },
    { icon: MapPin, title: 'landing.features.local.title', desc: 'landing.features.local.desc' },
    { icon: Upload, title: 'landing.features.closet.title', desc: 'landing.features.closet.desc' },
  ];

  return (
    <div className="landing-shell min-h-screen w-full overflow-x-hidden">
        {/* Header Actions */}
        <div className="landing-header-panel pointer-events-none fixed top-3 left-2 right-2 sm:top-6 sm:left-auto sm:right-6 z-40 max-w-[calc(100vw-1rem)] sm:max-w-none max-h-[calc(100vh-1.5rem)] overflow-y-auto flex flex-col gap-2 rounded-3xl border border-white/70 bg-white/85 text-slate-800 dark:border-white/10 dark:bg-slate-900/85 dark:text-slate-100 backdrop-blur-md p-2 sm:p-3 shadow-[0_18px_45px_rgba(15,15,15,0.2)] [&>*]:pointer-events-auto">
          <div className="landing-header-row grid grid-cols-1 sm:flex sm:flex-wrap items-stretch sm:items-center gap-2">
            <button
              type="button"
              onClick={handleProfileClick}
              className={navButtonClass(false)}
            >
              <User className="h-4 w-4" aria-hidden="true" />
              <span>{profileLabel}</span>
            </button>
            <button
              type="button"
              onClick={handleReferralClick}
              disabled={!isConvexEnabled}
              aria-disabled={!isConvexEnabled}
              title={isConvexEnabled ? referralLabel : referralUnavailableLabel}
              className={navButtonClass(!isConvexEnabled)}
            >
                <Gift className="h-4 w-4" aria-hidden="true" />
                <span>{referralLabel}</span>
              </button>
              <div className="landing-restore-row flex flex-wrap items-center gap-2 rounded-2xl border border-white/60 bg-white/85 px-2 py-2 shadow-sm dark:border-white/10 dark:bg-slate-900/70">
                <input
                  name="restoreEmail"
                  type="email"
                  placeholder={t('landing.restore.emailPlaceholder')}
                  value={restoreEmail}
                  onChange={(e) => setRestoreEmail(e.target.value)}
                  className="min-w-[10rem] max-[360px]:min-w-0 max-[360px]:w-full flex-1 rounded-full border border-gray-200 bg-white px-3 py-2 text-xs sm:text-sm text-gray-800 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100 dark:focus:ring-pink-500/40"
                />
                <input
                  name="restoreName"
                  type="text"
                  placeholder={t('landing.restore.namePlaceholder')}
                  value={restoreName}
                  onChange={(e) => setRestoreName(e.target.value)}
                  className="hidden md:block min-w-[9rem] max-[360px]:min-w-0 max-[360px]:w-full flex-1 rounded-full border border-gray-200 bg-white px-3 py-2 text-xs sm:text-sm text-gray-800 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100 dark:focus:ring-pink-500/40"
                />
              <button
                type="button"
                onClick={handleRestore}
                disabled={restoreLoading || !restoreEmail.trim()}
                  className="rounded-full border border-gray-200 bg-gray-50 px-3 py-2 text-xs sm:text-sm font-semibold text-gray-800 hover:border-pink-400 hover:text-pink-700 disabled:cursor-not-allowed disabled:text-gray-400 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-100 dark:hover:border-pink-500 dark:hover:text-pink-200 max-[360px]:w-full"
                >
                  {restoreLoading ? t('landing.restore.loading') : t('landing.restore.action')}
                </button>
              </div>
            </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 rounded-full border border-white/40 bg-white/90 px-3 py-1.5 text-xs font-semibold text-gray-900 shadow-sm dark:border-white/20 dark:bg-gray-900/70 dark:text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-500 text-xs font-bold text-white">
                {userInitial}
              </span>
              <div className="flex flex-col leading-tight">
                <span className="text-xs font-semibold text-gray-900 dark:text-white">
                  {userName}
                </span>
                <span className="text-[0.7rem] text-gray-700 dark:text-gray-200">
                  {userPoints}
                </span>
              </div>
            </div>
            <span className="text-xs text-gray-700 dark:text-gray-200">
              {referralStatus}
            </span>
          </div>
          {restoreError && (
            <p className="px-1 text-xs text-red-600 dark:text-red-300">{restoreError}</p>
          )}
          <div className="flex flex-wrap items-center justify-end gap-2">
            <ThemeToggle />
            <LanguageSelector />
          </div>
        </div>
        
        {/* Hero Section */}
        <section
        className="landing-hero relative w-full overflow-hidden pt-48 sm:pt-36 lg:pt-36 pb-16 sm:pb-20 lg:pb-24 min-h-[70vh] lg:min-h-[75vh]"
        >
            <span className="landing-hello" aria-hidden="true">
              {t('landing.hello')}
            </span>

            <div
              className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8"
            >
                <div className="grid gap-10 lg:grid-cols-[1.1fr,0.9fr] items-center">
                  <div className="flex flex-col gap-6 text-center lg:text-start items-center lg:items-start">
                      <motion.span
                        className="landing-eyebrow"
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05, duration: 0.6 }}
                      >
                        {t('landing.hello')}
                      </motion.span>

                      <motion.h1
                        className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight text-slate-900 dark:text-slate-100"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.12, duration: 0.6 }}
                      >
                        <span className="text-brand">{t('landing.juliana.name')}</span>
                      </motion.h1>

                      <motion.p
                        className="text-lg sm:text-xl lg:text-2xl font-semibold text-[color:var(--landing-rose)]"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.22, duration: 0.6 }}
                      >
                        {t('landing.juliana.title')}
                      </motion.p>

                      <motion.p
                        className="text-base sm:text-lg lg:text-xl text-slate-800 dark:text-slate-100 leading-relaxed max-w-xl"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                      >
                        {t('landing.juliana.bio')}
                      </motion.p>

                      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                        <motion.button
                            onClick={onGetStarted}
                            className="inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 text-white font-bold text-base sm:text-lg rounded-full shadow-[0_20px_45px_rgba(140,35,64,0.35)] transition-all duration-300 hover:shadow-[0_25px_60px_rgba(140,35,64,0.45)] hover:-translate-y-0.5 active:translate-y-0 bg-brand hover:bg-brand/90 w-full sm:w-auto"
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.38, duration: 0.6 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {t('landing.juliana.cta')}
                            <ArrowRight className={`w-5 h-5 sm:w-6 sm:h-6 ${isRtl ? 'transform rotate-180' : ''}`} />
                        </motion.button>

                        <motion.button
                          onClick={scrollToFeatures}
                          className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-900/15 bg-white/80 px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm transition duration-300 hover:border-slate-900/30 hover:bg-white dark:border-white/20 dark:bg-slate-900/70 dark:text-slate-100 dark:hover:bg-slate-800/80 w-full sm:w-auto"
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.46, duration: 0.6 }}
                        >
                          {t('landing.features.title')}
                          <ArrowDown className="w-4 h-4" />
                        </motion.button>
                      </div>

                      <motion.div
                        className="flex flex-wrap justify-center lg:justify-start gap-2"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.52, duration: 0.6 }}
                      >
                        {featureCards.slice(0, 3).map((feature) => {
                          const Icon = feature.icon;
                          return (
                            <span key={feature.title} className="landing-chip">
                              <Icon className="w-4 h-4 text-[color:var(--landing-moss)]" />
                              {t(feature.title as TranslationKey)}
                            </span>
                          );
                        })}
                      </motion.div>
                  </div>

                  <div className="relative flex flex-col gap-4">
                    <motion.div
                      className="landing-card p-6 sm:p-8"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.25, duration: 0.6 }}
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--landing-rose)]">
                        {t('landing.features.title')}
                      </p>
                      <h3 className="mt-3 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
                        {t('landing.features.ai.title')}
                      </h3>
                      <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300">
                        {t('landing.features.subtitle')}
                      </p>
                      <div className="mt-6 grid grid-cols-3 gap-3">
                        {['bg-amber-500/20', 'bg-emerald-500/20', 'bg-rose-500/20'].map((color, index) => (
                          <div
                            key={`swatch-${index}`}
                            className={`h-12 rounded-2xl border border-white/60 ${color} dark:border-white/10`}
                          />
                        ))}
                      </div>
                    </motion.div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      {featureCards.slice(1, 3).map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                          <motion.div
                            key={`mini-${feature.title}`}
                            className="landing-card p-4"
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                          >
                            <div className="flex items-center gap-3">
                              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/80 text-[color:var(--landing-moss)] shadow-sm dark:bg-slate-800/80">
                                <Icon className="w-5 h-5" />
                              </span>
                              <div>
                                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                  {t(feature.title as TranslationKey)}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                  {t(feature.desc as TranslationKey)}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </div>
            </div>

            {isConvexEnabled && (
              <div
                id="landing-referral-target"
                className="relative w-full max-w-5xl mx-auto z-30 px-4 sm:px-6 lg:px-8 mt-10 sm:mt-14 scroll-mt-24"
              >
                <LoyaltyHero userId={userId} />
                <div className="mt-6 rounded-3xl border border-pink-100 bg-pink-50/80 p-5 shadow-lg dark:border-pink-700/40 dark:bg-pink-900/20">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] sm:tracking-[0.3em] text-pink-800 dark:text-pink-100">
                    {t('landing.signup.intro')}
                  </p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    <input
                      name="signupName"
                      type="text"
                      placeholder={t('landing.signup.namePlaceholder')}
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      className="rounded-full border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100 dark:focus:ring-pink-500/40"
                    />
                    <input
                      name="signupEmail"
                      type="email"
                      placeholder={t('landing.signup.emailPlaceholder')}
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      className="rounded-full border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100 dark:focus:ring-pink-500/40"
                    />
                    <input
                      name="signupReferralCode"
                      type="text"
                      placeholder={t('landing.signup.referralPlaceholder')}
                      value={signupReferral}
                      onChange={(e) => setSignupReferral(e.target.value)}
                      className="rounded-full border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100 dark:focus:ring-pink-500/40 sm:col-span-2"
                    />
                  </div>
                  {signupError && (
                    <p className="mt-2 text-sm font-semibold text-red-600 dark:text-red-300">{signupError}</p>
                  )}
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSignup}
                      disabled={isSignupLoading || !signupEmail.trim()}
                      className="inline-flex items-center justify-center rounded-full bg-pink-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-pink-700 disabled:cursor-not-allowed disabled:bg-pink-300"
                    >
                      {isSignupLoading ? t('landing.signup.loading') : t('landing.signup.submit')}
                    </button>
                    <span className="text-xs text-pink-700/80 dark:text-pink-200">
                      {t('landing.signup.hint')}
                    </span>
                  </div>
                </div>
              </div>
            )}
        </section>

        {/* Features Section */}
        {isConvexEnabled && (
          <section
            id="landing-profile-form"
            className="relative z-10 w-full py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white/85 dark:bg-slate-900/70"
          >
            <div className="max-w-5xl mx-auto space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
                {t('landing.profileSection.title')}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
                {t('landing.profileSection.subtitle')}
              </p>
              <CustomerProfileForm userId={userId} />
            </div>
          </section>
        )}

        <section 
            id="landing-features" 
            className="relative z-10 w-full py-16 sm:py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-white/80 dark:bg-slate-900/70 transition-colors duration-300 scroll-mt-10"
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
                    {featureCards.map((feature, index) => {
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
                        aria-label={t('landing.cta.ariaLabel')}
                    >
                        {t('landing.juliana.cta')}
                        <ArrowRight className={`w-5 h-5 sm:w-6 sm:h-6 ${isRtl ? 'transform rotate-180' : ''}`} />
                    </button>
                </motion.div>
            </div>
        </section>
    </div>
  );
};
