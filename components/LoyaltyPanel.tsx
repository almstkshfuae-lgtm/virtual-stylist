import React, { useEffect, useState } from 'react';
import { useLoyalty } from '../hooks/useConvex';

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
  const [isIssuing, setIsIssuing] = useState(false);

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
    <section className="mx-auto mt-10 max-w-6xl rounded-3xl border border-gray-200 bg-white/90 p-6 shadow-lg shadow-pink-500/10 dark:border-slate-800 dark:bg-slate-900/70">
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
            <button
              type="button"
              onClick={copyReferralCode}
              className="text-xs font-semibold uppercase text-pink-600 hover:text-pink-400"
            >
              {copyStatus === 'copied' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <p className="mt-2 text-2xl font-bold text-pink-700 dark:text-pink-200">
            {hasData && account?.referralCode ? account.referralCode : '—'}
          </p>
          <p className="text-xs text-pink-600/80 dark:text-pink-100">
            {`Both referrer and referee earn ${referralPoints} pts when a new account joins.`}
          </p>
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
    </section>
  );
};

export default LoyaltyPanel;
