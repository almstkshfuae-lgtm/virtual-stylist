import React, { useEffect, useMemo, useState } from 'react';
import { toDataURL } from 'qrcode';
import { useLoyalty } from '../hooks/useConvex';

interface LoyaltyHeroProps {
  userId: string;
}

const copyToClipboard = async (text: string) => {
  if (typeof navigator === 'undefined' || !navigator.clipboard) return false;
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Clipboard write failed', error);
    return false;
  }
};

export const LoyaltyHero: React.FC<LoyaltyHeroProps> = ({ userId }) => {
  const { account, settings, ensureCustomer } = useLoyalty(userId);
  const [copied, setCopied] = useState(false);
  const [qrSrc, setQrSrc] = useState<string | null>(null);
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    if (!userId) return;
    ensureCustomer({ userId }).catch(() => {
      // ignore; loyalty hook handles missing codegen during dev
    });
  }, [ensureCustomer, userId]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  const referralLink = useMemo(() => {
    if (!account?.referralCode) return null;
    return `${origin || 'https://virtual-stylist.ai'}/?ref=${account.referralCode}`;
  }, [account?.referralCode, origin]);

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
    const success = await copyToClipboard(referralLink);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!userId) return null;

  return (
    <div className="mt-8 rounded-3xl border border-white/40 bg-white/90 p-6 shadow-2xl shadow-pink-500/20 dark:border-slate-700 dark:bg-slate-900/80">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-pink-500">Loyalty overview</p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Points & referral</h3>
          <p className="text-sm text-gray-500 dark:text-gray-300">
            {account?.name || 'Your profile'} · {account?.email || 'No email yet'}
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-pink-100 bg-pink-50 px-4 py-2 text-sm font-semibold text-pink-700 dark:border-pink-600 dark:bg-pink-900/20 dark:text-pink-200">
          <span className="text-base font-bold text-pink-600 dark:text-pink-100">
            {account ? `${account.pointsBalance.toLocaleString()} pts` : '0 pts'}
          </span>
          <span className="text-xs text-pink-500 dark:text-pink-200">Balance</span>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-gray-50/90 p-4 text-sm text-gray-600 dark:border-slate-800 dark:bg-slate-900/50">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400">Monthly points</p>
          <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">{monthlyPoints} pts</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-gray-50/90 p-4 text-sm text-gray-600 dark:border-slate-800 dark:bg-slate-900/50">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400">Signup</p>
          <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">{signupPoints} pts</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{account?.signupAwarded ? 'Awarded' : 'Pending'}</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-gray-50/90 p-4 text-sm text-gray-600 dark:border-slate-800 dark:bg-slate-900/50">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400">Welcome package</p>
          <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">{welcomePoints} pts</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{account?.welcomeAwarded ? 'Awarded' : 'Pending'}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr,auto]">
        <div className="rounded-3xl border border-gray-100 bg-white/80 p-4 text-sm text-gray-600 dark:border-slate-800 dark:bg-slate-900/40">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">Referral link</p>
          <p className="mt-1 text-base font-semibold text-gray-900 dark:text-white truncate">{referralLink ?? 'Collect points by signing up'}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Both referrer and friend earn {referralPoints} pts</p>
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={handleCopyReferral}
              disabled={!referralLink}
              className="rounded-full bg-pink-500 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:bg-pink-200"
            >
              {copied ? 'Link copied' : 'Copy link'}
            </button>
            <span className="text-xs text-gray-400">{account?.referralCode ?? 'Referral code pending'}</span>
          </div>
        </div>
        {qrSrc && (
          <div className="flex items-center justify-center rounded-3xl border border-gray-100 bg-white/80 p-4 text-xs text-gray-500 dark:border-slate-800 dark:bg-slate-900/40">
            <img src={qrSrc} alt="Referral QR code" className="h-32 w-32" />
          </div>
        )}
      </div>
    </div>
  );
};

export default LoyaltyHero;
