import React, { useEffect, useState, useId } from 'react';
import { Share2, Copy } from 'lucide-react';
import { useLoyalty } from '../hooks/useConvex';
import CustomerProfileForm from './CustomerProfileForm';
import { useClipboard, type ClipboardState } from '../hooks/useClipboard';
import { useTranslation } from '../i18n/useTranslation';
import {
  buildReferralLink,
  buildReferralInviteMailto,
  isValidReferralEmail,
} from '../lib/referral';

const LEDGER_LABEL_KEYS: Record<string, string> = {
  monthly: 'landing.loyalty.ledger.monthly',
  signup: 'landing.loyalty.ledger.signup',
  welcome: 'landing.loyalty.ledger.welcome',
  referral_referrer: 'landing.loyalty.ledger.referralReferrer',
  referral_new_user: 'landing.loyalty.ledger.referralNewUser',
  spend: 'landing.loyalty.ledger.spend',
  adjustment: 'landing.loyalty.ledger.adjustment',
};

const formatMonthKey = (value?: string) => {
  if (!value) return 'Not issued yet';
  const [year, month] = value.split('-');
  const parsed = Number(month);
  if (Number.isNaN(parsed)) return value;
  const date = new Date(Number(year), parsed - 1);
  return date.toLocaleString(undefined, { month: 'short', year: 'numeric' });
};

interface LoyaltyPanelProps {
  userId: string;
}

export const LoyaltyPanel: React.FC<LoyaltyPanelProps> = ({ userId }) => {
  const { t } = useTranslation();
  const { account, settings, ledger, ensureCustomer, issueMonthly } = useLoyalty(userId);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteError, setInviteError] = useState<string | null>(null);
  const inviteEmailId = useId();
  const [isIssuing, setIsIssuing] = useState(false);
  const codeClipboard = useClipboard();
  const linkClipboard = useClipboard();
  const getClipboardLabel = (state: ClipboardState, key: string) => {
    if (state === 'copied') return t('landing.loyalty.clipboardCopied');
    if (state === 'manual') return t('landing.loyalty.clipboardManual');
    if (state === 'error') return t('landing.loyalty.clipboardError');
    return t(key);
  };
  const getLedgerLabel = (type: string) => {
    const key = LEDGER_LABEL_KEYS[type];
    return key ? t(key) : t('landing.loyalty.ledger.default', { type });
  };
  const formatPointsLabel = (value?: number) => t('landing.header.pointsLabel', { points: value ?? 0 });
  const clipboardHintMessage =
    codeClipboard.state === 'manual' || linkClipboard.state === 'manual'
      ? t('landing.loyalty.clipboardManualHint')
      : codeClipboard.state === 'error' || linkClipboard.state === 'error'
        ? t('landing.loyalty.clipboardErrorHint')
        : null;

  useEffect(() => {
    if (!userId) return;
    ensureCustomer({ userId }).catch((error: Error) => {
      console.debug('Loyalty customer initialization skipped', error.message);
    });
  }, [ensureCustomer, userId]);

  const handleIssueMonthly = async () => {
    if (!userId || !issueMonthly) return;
    setIsIssuing(true);
    try {
      await issueMonthly({ userId });
    } catch (error) {
      console.error('Failed to issue monthly points', error);
    } finally {
      setIsIssuing(false);
    }
  };

  const copyReferralCode = async () => {
    if (!account?.referralCode) return;
    await codeClipboard.copy(account.referralCode);
  };

  const origin = typeof window !== 'undefined' ? window.location.origin : undefined;
  const referralLink = buildReferralLink(account?.referralCode, origin);
  const isInviteEmailInvalid =
    inviteEmail.trim().length > 0 && !isValidReferralEmail(inviteEmail);

  const sendInvite = () => {
    setInviteError(null);
    const trimmedEmail = inviteEmail.trim();
    if (!referralLink) return;
    if (!trimmedEmail) {
      setInviteError(t('landing.loyalty.inviteErrorEmpty'));
      return;
    }
    if (!isValidReferralEmail(trimmedEmail)) {
      setInviteError(t('landing.restore.invalidEmail'));
      return;
    }
    window.location.href = buildReferralInviteMailto({
      toEmail: trimmedEmail,
      referralLink,
      subject: t('landing.loyalty.shareSubject'),
      message: t('landing.loyalty.shareEmailBody', { referralLink }),
    });
  };

  const copyReferralLink = async () => {
    if (!referralLink) return;
    await linkClipboard.copy(referralLink);
  };

  const shareReferral = async () => {
    if (!referralLink || typeof navigator === 'undefined') return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: t('landing.loyalty.shareTitle'),
          text: t('landing.loyalty.shareText'),
          url: referralLink,
        });
      } catch (error) {
        console.debug('Share cancelled or failed', error);
      }
    } else {
      await copyReferralLink();
    }
  };

  const monthlyPoints = settings?.monthlyPoints ?? 300;
  const signupPoints = settings?.signupBonusPoints ?? 500;
  const welcomePoints = settings?.welcomePackagePoints ?? 1300;
  const referralPoints = settings?.referralRewardPoints ?? 500;
  const spendPerAction = 1;

  const ledgerPreview = ledger?.slice(0, 4) ?? [];
  const hasData = Boolean(account && settings);
  const marketingTags = account?.marketingTags ?? [];
  const segments = account?.segments ?? [];

  if (!userId) return null;

  return (
    <section className="mx-auto mt-10 max-w-6xl space-y-6">
      <CustomerProfileForm userId={userId} />

      <div className="rounded-3xl border border-gray-200 bg-white/90 p-6 shadow-lg shadow-pink-500/10 dark:border-slate-800 dark:bg-slate-900/70">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400">
            {t('landing.loyalty.panelEyebrow')}
          </p>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('landing.loyalty.panelTitle')}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {hasData
              ? t('landing.loyalty.panelDescriptionData')
              : t('landing.loyalty.panelDescriptionMissing')}
          </p>
        </div>
        <button
          className="inline-flex items-center justify-center rounded-full border border-pink-500 bg-pink-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:bg-pink-300"
          onClick={handleIssueMonthly}
          disabled={isIssuing || !hasData}
        >
          {isIssuing
            ? t('landing.loyalty.issueLoading')
            : t('landing.loyalty.issueButton', { points: monthlyPoints })}
        </button>
      </div>

      <div className="mt-6 rounded-2xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-700 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 dark:text-gray-200">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500 dark:text-gray-400 mb-2">
          {t('landing.loyalty.rulesTitle')}
        </p>
        <ul className="space-y-1">
          <li>• {t('landing.loyalty.rulesBase', { points: monthlyPoints })}</li>
          <li>• {t('landing.loyalty.rulesReferral', { points: referralPoints })}</li>
          <li>• {t('landing.loyalty.rulesSpend', { points: spendPerAction })}</li>
          <li>• {t('landing.loyalty.rulesConversion')}</li>
        </ul>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
          <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
            {t('landing.loyalty.balance')}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {hasData ? formatPointsLabel(account?.pointsBalance) : '—'}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {hasData
              ? t('landing.loyalty.lifetime', { points: account?.lifetimePoints ?? 0 })
              : '—'}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
          <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
            {t('landing.loyalty.panelMonthlyAward')}
          </p>
          <p className="text-xl font-semibold text-gray-900 dark:text-white">
            {formatPointsLabel(monthlyPoints)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t('landing.loyalty.lastIssued', { month: formatMonthKey(account?.monthlyIssuedFor) })}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
          <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
            {t('landing.loyalty.panelSignupBonus')}
          </p>
          <p className="text-xl font-semibold text-gray-900 dark:text-white">
            {formatPointsLabel(signupPoints)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {account?.signupAwarded ? t('landing.loyalty.awarded') : t('landing.loyalty.pending')}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
          <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
            {t('landing.loyalty.panelWelcomePackage')}
          </p>
          <p className="text-xl font-semibold text-gray-900 dark:text-white">
            {formatPointsLabel(welcomePoints)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {account?.welcomeAwarded ? t('landing.loyalty.awarded') : t('landing.loyalty.pending')}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-pink-200/60 bg-pink-50/60 p-4 dark:border-pink-700/40 dark:bg-pink-900/30">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase text-pink-700 dark:text-pink-200">
              {t('landing.loyalty.referralCodeLabel')}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={copyReferralCode}
                className="inline-flex items-center gap-1 text-xs font-semibold uppercase text-pink-600 hover:text-pink-400"
              >
                <Copy className="h-3.5 w-3.5" />
                {getClipboardLabel(codeClipboard.state, 'landing.loyalty.clipboardCopy')}
              </button>
              <button
                type="button"
                onClick={copyReferralLink}
                disabled={!referralLink}
                className="inline-flex items-center gap-1 text-xs font-semibold uppercase text-pink-600 hover:text-pink-400 disabled:text-pink-300"
              >
                <Copy className="h-3.5 w-3.5" />
                {getClipboardLabel(linkClipboard.state, 'landing.loyalty.clipboardLink')}
              </button>
              <button
                type="button"
                onClick={shareReferral}
                disabled={!referralLink}
                className="inline-flex items-center gap-1 text-xs font-semibold uppercase text-pink-600 hover:text-pink-400 disabled:text-pink-300"
              >
                <Share2 className="h-3.5 w-3.5" />
                {t('landing.loyalty.share')}
              </button>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-pink-700 dark:text-pink-200">
            {hasData && account?.referralCode ? account.referralCode : '—'}
          </p>
          <p className="text-xs text-pink-600/80 dark:text-pink-100">
            {t('landing.loyalty.bothEarn', { points: referralPoints })}
          </p>
          {clipboardHintMessage && (
            <p className="mt-2 text-xs text-red-600 dark:text-red-300" role="alert" aria-live="assertive">
              {clipboardHintMessage}
            </p>
          )}
          {referralLink && (
            <button
              type="button"
              onClick={async (e) => {
                e.preventDefault();
                const ok = await copyTextToClipboard(referralLink);
                if (!ok) {
                  setClipboardHintMessage(t('landing.loyalty.copyFailed', 'لم نتمكن من نسخ الرابط، جرّب يدوياً.'));
                } else {
                  setClipboardHintMessage(t('landing.loyalty.copySuccess', 'تم نسخ رابط الإحالة!'));
                }
              }}
              className="mt-3 inline-flex text-xs font-semibold text-pink-700 underline hover:text-pink-900"
            >
              {t('landing.loyalty.shareViaEmail')}
            </button>
          )}
          <div className="mt-3 flex flex-col gap-2 rounded-2xl border border-pink-100 bg-white/70 p-3 shadow-sm dark:border-pink-700/30 dark:bg-slate-900/60">
            <label htmlFor={inviteEmailId} className="text-xs font-semibold uppercase text-pink-700 dark:text-pink-200">
              {t('landing.loyalty.inviteLabel')}
            </label>
            <form
              className="flex flex-col gap-2 sm:flex-row"
              onSubmit={(event) => {
                event.preventDefault();
                sendInvite();
              }}
            >
              <input
                id={inviteEmailId}
                name="inviteEmail"
                type="email"
                value={inviteEmail}
                onChange={(e) => {
                  setInviteEmail(e.target.value);
                  if (inviteError) setInviteError(null);
                }}
                aria-invalid={isInviteEmailInvalid}
                aria-describedby={isInviteEmailInvalid || inviteError ? `${inviteEmailId}-error` : undefined}
                placeholder={t('landing.loyalty.invitePlaceholder')}
                className="flex-1 rounded-full border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100 dark:focus:ring-pink-500/40"
              />
              <button
                type="submit"
                disabled={!referralLink}
                className="inline-flex items-center justify-center rounded-full bg-pink-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-pink-700 disabled:cursor-not-allowed disabled:bg-pink-300"
              >
                {t('landing.loyalty.inviteButton')}
              </button>
            </form>
            {(isInviteEmailInvalid || inviteError) && (
              <p id={`${inviteEmailId}-error`} className="text-[11px] text-red-600 dark:text-red-300" role="alert" aria-live="assertive">
                {inviteError || t('landing.restore.invalidEmail')}
              </p>
            )}
            {!referralLink && (
              <p className="text-[11px] text-gray-500 dark:text-gray-400" aria-live="polite">
                {t('landing.loyalty.referralPendingMessage')}
              </p>
            )}
            <p className="text-[11px] text-pink-600/80 dark:text-pink-200">
              {t('landing.loyalty.inviteMailHint')}
            </p>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/40">
          <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
            {t('landing.loyalty.referredByLabel')}
          </p>
          <p className="text-base font-semibold text-gray-900 dark:text-white">
            {account?.referredByCode ?? t('landing.loyalty.none')}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t('landing.loyalty.referredByHint')}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/40">
          <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
            {t('landing.loyalty.accountInfo')}
          </p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {account?.name ?? t('landing.loyalty.anonymous')}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {account?.email ?? t('landing.loyalty.noEmailCaptured')}
          </p>
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500">
            {t('landing.loyalty.marketingTags')}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {marketingTags.length ? (
              marketingTags.map((tag) => (
                <span key={`tag-${tag}`} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-slate-800 dark:text-gray-200">
                  {tag}
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {t('landing.loyalty.noMarketingTags')}
              </span>
            )}
          </div>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/40">
          <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
            {t('landing.loyalty.segments')}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {segments.length ? (
              segments.map((segment) => (
                <span key={`segment-${segment}`} className="rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-700 dark:border-slate-700 dark:text-gray-200">
                  {segment}
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {t('landing.loyalty.noSegments')}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/40">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
            {t('landing.loyalty.recentLedger')}
          </p>
          <p className="text-xs text-gray-400">
            {t('landing.loyalty.ledgerEntries', { count: ledger?.length ?? 0 })}
          </p>
        </div>
        {ledgerPreview.length === 0 ? (
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            {t('landing.loyalty.noLedgerActivity')}
          </p>
        ) : (
          <div className="mt-3 space-y-3">
            {ledgerPreview.map((entry) => (
              <div key={entry._id ?? `${entry.createdAt}-${entry.delta}`} className="flex items-center justify-between rounded-2xl border border-gray-100 p-3 dark:border-slate-800">
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                    {getLedgerLabel(entry.type)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(entry.createdAt).toLocaleString()}
                  </p>
                </div>
                <span
                  className={`text-sm font-semibold ${entry.delta >= 0 ? 'text-emerald-600' : 'text-red-500'}`}
                >
                  {entry.delta >= 0 ? '+' : ''}{entry.delta} pts
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
    </section>
  );
};

export default LoyaltyPanel;
