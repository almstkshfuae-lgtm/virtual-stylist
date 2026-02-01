import React, { useEffect, useMemo, useState, useId } from 'react';
import { Share2, Copy } from 'lucide-react';
import { useLoyalty } from '../hooks/useConvex';
import CustomerProfileForm from './CustomerProfileForm';

const ENTRY_LABELS: Record<string, string> = {
  monthly: 'Monthly allotment',
  signup: 'Signup bonus',
  welcome: 'Welcome package',
  referral_referrer: 'Referral (referrer)',
  referral_new_user: 'Referral (new customer)',
  spend: 'Redemption',
  adjustment: 'Manual adjustment',
};

type CopyStatus = 'idle' | 'copied' | 'error';

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
  const { account, settings, ledger, ensureCustomer, issueMonthly } = useLoyalty(userId);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle');
  const [copyLinkStatus, setCopyLinkStatus] = useState<CopyStatus>('idle');
  const [inviteEmail, setInviteEmail] = useState('');
  const inviteEmailId = useId();
  const [isIssuing, setIsIssuing] = useState(false);
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    if (!userId) return;
    ensureCustomer({ userId }).catch((error: Error) => {
      console.debug('Loyalty customer initialization skipped', error.message);
    });
  }, [ensureCustomer, userId]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

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
    if (typeof navigator === 'undefined' || !navigator.clipboard) {
      setCopyStatus('error');
      return;
    }
    try {
      await navigator.clipboard.writeText(account.referralCode);
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 1500);
    } catch (error) {
      console.error('Failed to copy referral code', error);
      setCopyStatus('error');
    }
  };

  const referralLink = useMemo(() => {
    if (!account?.referralCode) return null;
    const base = origin || 'https://virtual-stylist.ai';
    return `${base}/?ref=${account.referralCode}`;
  }, [account?.referralCode, origin]);

  const sendInvite = () => {
    const trimmedEmail = inviteEmail.trim();
    if (!referralLink || !trimmedEmail) return;
    const subject = encodeURIComponent('انضم إلي منسق الأزياء الافتراضي');
    const body = encodeURIComponent(
      `جرّب منسق الأزياء الافتراضي واحصل على نقاط مكافأة باستخدام رابط الإحالة الخاص بي:\n${referralLink}`
    );
    const encodedEmail = encodeURIComponent(trimmedEmail);
    window.location.href = `mailto:${encodedEmail}?subject=${subject}&body=${body}`;
  };

  const copyReferralLink = async () => {
    if (!referralLink || typeof navigator === 'undefined' || !navigator.clipboard) {
      setCopyLinkStatus('error');
      return;
    }
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopyLinkStatus('copied');
      setTimeout(() => setCopyLinkStatus('idle'), 1500);
    } catch (error) {
      console.error('Failed to copy referral link', error);
      setCopyLinkStatus('error');
    }
  };

  const shareReferral = async () => {
    if (!referralLink || typeof navigator === 'undefined') return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'اكتشف منسق الأزياء الافتراضي',
          text: 'جرّب منسق الأزياء الافتراضي واحصل على نقاط مكافأة معي.',
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
            Loyalty & Referral
          </p>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Customer profile & points</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {hasData
              ? 'Every purchase adds loyalty data to the customer account.'
              : 'Connect Convex to see the loyalty ledger and referral rewards.'}
          </p>
        </div>
        <button
          className="inline-flex items-center justify-center rounded-full border border-pink-500 bg-pink-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:bg-pink-300"
          onClick={handleIssueMonthly}
          disabled={isIssuing || !hasData}
        >
          {isIssuing ? 'Issuing...' : `Issue ${monthlyPoints} pts`}
        </button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
          <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Balance</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {hasData ? `${account?.pointsBalance ?? 0} pts` : '—'}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Lifetime {hasData ? `${account?.lifetimePoints ?? 0} pts` : '—'}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
          <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Monthly award</p>
          <p className="text-xl font-semibold text-gray-900 dark:text-white">{monthlyPoints} pts</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Last issued {formatMonthKey(account?.monthlyIssuedFor)}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
          <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Signup bonus</p>
          <p className="text-xl font-semibold text-gray-900 dark:text-white">{signupPoints} pts</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {account?.signupAwarded ? 'Awarded' : 'Pending'}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
          <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Welcome package</p>
          <p className="text-xl font-semibold text-gray-900 dark:text-white">{welcomePoints} pts</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {account?.welcomeAwarded ? 'Awarded' : 'Pending'}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-pink-200/60 bg-pink-50/60 p-4 dark:border-pink-700/40 dark:bg-pink-900/30">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase text-pink-700 dark:text-pink-200">Referral code</p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={copyReferralCode}
                className="inline-flex items-center gap-1 text-xs font-semibold uppercase text-pink-600 hover:text-pink-400"
              >
                <Copy className="h-3.5 w-3.5" />{copyStatus === 'copied' ? 'Copied' : 'Copy'}
              </button>
              <button
                type="button"
                onClick={copyReferralLink}
                disabled={!referralLink}
                className="inline-flex items-center gap-1 text-xs font-semibold uppercase text-pink-600 hover:text-pink-400 disabled:text-pink-300"
              >
                <Copy className="h-3.5 w-3.5" />{copyLinkStatus === 'copied' ? 'Link copied' : 'Link'}
              </button>
              <button
                type="button"
                onClick={shareReferral}
                disabled={!referralLink}
                className="inline-flex items-center gap-1 text-xs font-semibold uppercase text-pink-600 hover:text-pink-400 disabled:text-pink-300"
              >
                <Share2 className="h-3.5 w-3.5" />شارك
              </button>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-pink-700 dark:text-pink-200">
            {hasData && account?.referralCode ? account.referralCode : '—'}
          </p>
          <p className="text-xs text-pink-600/80 dark:text-pink-100">
            {`Both referrer and referee earn ${referralPoints} pts when a new account joins.`}
          </p>
          {referralLink && (
            <a
              href={`mailto:?subject=انضم%20إلي%20منسق%20الأزياء%20الافتراضي&body=${encodeURIComponent(
                `استخدم هذا الرابط لتحصل على نقاط مكافأة:\n${referralLink}`,
              )}`}
              className="mt-3 inline-flex text-xs font-semibold text-pink-700 underline hover:text-pink-900"
            >
              أرسل الرابط عبر البريد
            </a>
          )}
          <div className="mt-3 flex flex-col gap-2 rounded-2xl border border-pink-100 bg-white/70 p-3 shadow-sm dark:border-pink-700/30 dark:bg-slate-900/60">
            <label htmlFor={inviteEmailId} className="text-xs font-semibold uppercase text-pink-700 dark:text-pink-200">
              أرسل رابط الإحالة لصديق جديد
            </label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                id={inviteEmailId}
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="friend@example.com"
                className="flex-1 rounded-full border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100 dark:focus:ring-pink-500/40"
              />
              <button
                type="button"
                onClick={sendInvite}
                disabled={!referralLink || !inviteEmail.trim()}
                className="inline-flex items-center justify-center rounded-full bg-pink-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-pink-700 disabled:cursor-not-allowed disabled:bg-pink-300"
              >
                إرسال الدعوة
              </button>
            </div>
            <p className="text-[11px] text-pink-600/80 dark:text-pink-200">
              سيُفتح بريدك الافتراضي مع رسالة جاهزة تتضمن رابط الإحالة.
            </p>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/40">
          <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Referred by</p>
          <p className="text-base font-semibold text-gray-900 dark:text-white">{account?.referredByCode ?? 'None'}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Adds context to the customer profile.</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/40">
          <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Account info</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">{account?.name ?? 'Anonymous'}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{account?.email ?? 'No email captured'}</p>
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500">Marketing tags</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {marketingTags.length ? (
              marketingTags.map((tag) => (
                <span key={`tag-${tag}`} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-slate-800 dark:text-gray-200">
                  {tag}
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-500 dark:text-gray-400">No tags yet</span>
            )}
          </div>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/40">
          <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Segments</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {segments.length ? (
              segments.map((segment) => (
                <span key={`segment-${segment}`} className="rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-700 dark:border-slate-700 dark:text-gray-200">
                  {segment}
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-500 dark:text-gray-400">None captured</span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/40">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Recent ledger</p>
          <p className="text-xs text-gray-400">{ledger?.length ?? 0} entries</p>
        </div>
        {ledgerPreview.length === 0 ? (
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">No activity recorded yet.</p>
        ) : (
          <div className="mt-3 space-y-3">
            {ledgerPreview.map((entry) => (
              <div key={entry._id ?? `${entry.createdAt}-${entry.delta}`} className="flex items-center justify-between rounded-2xl border border-gray-100 p-3 dark:border-slate-800">
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                    {ENTRY_LABELS[entry.type] ?? entry.type}
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
