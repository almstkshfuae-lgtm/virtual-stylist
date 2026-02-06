import React, { useEffect, useMemo, useState } from 'react';
import { toDataURL } from 'qrcode';
import { useLoyalty } from '../hooks/useConvex';
import { useTranslation } from '../i18n/useTranslation';
import { useClipboard } from '../hooks/useClipboard';
import { buildReferralLink } from '../lib/referral';

interface LoyaltyHeroProps {
  userId: string;
}

export const LoyaltyHero: React.FC<LoyaltyHeroProps> = ({ userId }) => {
  const { t, language } = useTranslation();
  const { account, settings, ensureCustomer } = useLoyalty(userId);
  const [qrSrc, setQrSrc] = useState<string | null>(null);
  const { state: copyState, copy } = useClipboard(2000);
  const pointsFormatter = useMemo(() => new Intl.NumberFormat(language), [language]);

  useEffect(() => {
    if (!userId) return;
    ensureCustomer({ userId }).catch(() => {
      // ignore; loyalty hook gracefully no-ops when Convex is unavailable
    });
  }, [ensureCustomer, userId]);

  const origin = typeof window !== 'undefined' ? window.location.origin : undefined;
  const referralLink = buildReferralLink(account?.referralCode, origin);

  useEffect(() => {
    if (!referralLink) {
      setQrSrc(null);
      return;
    }

    toDataURL(referralLink, { margin: 2, width: 160 })
      .then((dataUrl) => setQrSrc(dataUrl))
      .catch((error) => {
        console.error('Failed to generate QR code', error);
        setQrSrc(null);
      });
  }, [referralLink]);

  const monthlyPoints = settings?.monthlyPoints ?? 300;
  const signupPoints = settings?.signupBonusPoints ?? 500;
  const welcomePoints = settings?.welcomePackagePoints ?? 1300;
  const referralPoints = settings?.referralRewardPoints ?? 500;

  const handleCopyReferral = async () => {
    if (!referralLink) return;
    await copy(referralLink);
  };

  if (!userId) return null;

  return (
    <div className="mt-8 rounded-3xl border border-white/40 bg-white/90 p-6 shadow-2xl shadow-pink-500/20 dark:border-slate-700 dark:bg-slate-900/80">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] sm:tracking-[0.3em] text-pink-600 dark:text-pink-300">{t('landing.loyalty.eyebrow')}</p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{t('landing.loyalty.title')}</h3>
          <p className="text-sm text-gray-700 dark:text-gray-200">
            {account?.name || t('landing.loyalty.profileFallback')} · {account?.email || t('landing.loyalty.emailFallback')}
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-pink-100 bg-pink-50 px-4 py-2 text-sm font-semibold text-pink-700 dark:border-pink-600 dark:bg-pink-900/20 dark:text-pink-200">
          <span className="text-base font-bold text-pink-600 dark:text-pink-100">
            {account
              ? t('landing.header.pointsLabel', { points: pointsFormatter.format(account.pointsBalance) })
              : t('landing.header.pointsLabel', { points: pointsFormatter.format(0) })}
          </span>
          <span className="text-xs text-pink-700 dark:text-pink-100">{t('landing.loyalty.balance')}</span>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-gray-50/90 p-4 text-sm text-gray-600 dark:border-slate-800 dark:bg-slate-900/50">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] sm:tracking-[0.3em] text-gray-600 dark:text-gray-300">{t('landing.loyalty.monthlyPoints')}</p>
          <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">{t('landing.header.pointsLabel', { points: pointsFormatter.format(monthlyPoints) })}</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-gray-50/90 p-4 text-sm text-gray-600 dark:border-slate-800 dark:bg-slate-900/50">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] sm:tracking-[0.3em] text-gray-600 dark:text-gray-300">{t('landing.loyalty.signup')}</p>
          <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">{t('landing.header.pointsLabel', { points: pointsFormatter.format(signupPoints) })}</p>
          <p className="text-xs text-gray-700 dark:text-gray-200">{account?.signupAwarded ? t('landing.loyalty.awarded') : t('landing.loyalty.pending')}</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-gray-50/90 p-4 text-sm text-gray-600 dark:border-slate-800 dark:bg-slate-900/50">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] sm:tracking-[0.3em] text-gray-600 dark:text-gray-300">{t('landing.loyalty.welcomePackage')}</p>
          <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">{t('landing.header.pointsLabel', { points: pointsFormatter.format(welcomePoints) })}</p>
          <p className="text-xs text-gray-700 dark:text-gray-200">{account?.welcomeAwarded ? t('landing.loyalty.awarded') : t('landing.loyalty.pending')}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr,auto]">
        <div className="rounded-3xl border border-gray-100 bg-white/80 p-4 text-sm text-gray-600 dark:border-slate-800 dark:bg-slate-900/40">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] sm:tracking-[0.3em] text-gray-600 dark:text-gray-300">{t('landing.loyalty.referralLink')}</p>
          <p className="mt-1 text-base font-semibold text-gray-900 dark:text-white truncate">{referralLink ?? t('landing.loyalty.collectPointsHint')}</p>
          <p className="text-xs text-gray-700 dark:text-gray-200">{t('landing.loyalty.bothEarn', { points: pointsFormatter.format(referralPoints) })}</p>
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={handleCopyReferral}
              disabled={!referralLink}
              className="rounded-full bg-pink-500 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:bg-pink-200"
            >
              {copyState === 'copied'
                ? t('landing.loyalty.linkCopied')
                : copyState === 'manual'
                  ? t('landing.loyalty.copyManual', 'Press Ctrl+C to copy')
                  : copyState === 'error'
                    ? t('landing.loyalty.copyFailed', 'Copy failed')
                  : t('landing.loyalty.copyLink')}
            </button>
            <span className="text-xs text-gray-600 dark:text-gray-300">{account?.referralCode ?? t('landing.loyalty.referralCodePending')}</span>
          </div>
          {(copyState === 'manual' || copyState === 'error') && (
            <p className="mt-2 text-xs text-red-600 dark:text-red-300" role="alert" aria-live="assertive">
              {copyState === 'manual'
                ? t('landing.loyalty.copyManualHint', 'Clipboard blocked. Text is selected; press Ctrl+C to copy.')
                : t('landing.loyalty.copyFailedHint', 'Clipboard permission denied. Please copy manually.')}
            </p>
          )}
        </div>
        {qrSrc && (
          <div className="flex items-center justify-center rounded-3xl border border-gray-100 bg-white/80 p-4 text-xs text-gray-500 dark:border-slate-800 dark:bg-slate-900/40">
            <img src={qrSrc} alt={t('landing.loyalty.qrAlt')} loading="lazy" decoding="async" className="h-32 w-32" />
          </div>
        )}
      </div>
    </div>
  );
};

export default LoyaltyHero;
