import React, { useEffect, useMemo, useState, useId } from 'react';
import { useLoyalty } from '../hooks/useConvex';
import { useTranslation } from '../i18n/LanguageContext';

interface CustomerProfileFormProps {
  userId: string;
}

export const CustomerProfileForm: React.FC<CustomerProfileFormProps> = ({ userId }) => {
  const { account, ensureCustomer } = useLoyalty(userId);
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Build ASCII-only ids so browser autofill/a11y tooling can reliably resolve aria-labelledby.
  const idBase = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const nameId = `customer-name-${idBase}`;
  const emailId = `customer-email-${idBase}`;
  const referralId = `customer-referral-${idBase}`;

  useEffect(() => {
    if (account?.name) setName(account.name);
    if (account?.email) setEmail(account.email);
    if (account?.referredByCode) setReferralCode(account.referredByCode);
  }, [account?.email, account?.name, account?.referredByCode]);

  const isDirty = useMemo(() => {
    return (
      name.trim() !== (account?.name ?? '') ||
      email.trim() !== (account?.email ?? '') ||
      referralCode.trim() !== (account?.referredByCode ?? '')
    );
  }, [account?.email, account?.name, account?.referredByCode, email, name, referralCode]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!userId || !ensureCustomer) return;
    setStatus('saving');
    setErrorMsg(null);

    try {
      await ensureCustomer({
        userId,
        name: name.trim() || undefined,
        email: email.trim() || undefined,
        referredByCode: referralCode.trim() || undefined,
      });
      setStatus('saved');
      setTimeout(() => setStatus('idle'), 1500);
    } catch (error: any) {
      console.error('Failed to save customer profile', error);
      setStatus('error');
      setErrorMsg(error?.message ?? t('landing.profileForm.errorFallback'));
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-4 rounded-3xl border border-gray-200 bg-white/90 p-5 shadow-md dark:border-slate-800 dark:bg-slate-900/60"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500 dark:text-gray-400">
            {t('landing.profileForm.eyebrow')}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {t('landing.profileForm.description')}
          </p>
        </div>
        <button
          type="submit"
          disabled={status === 'saving' || !isDirty}
          className="rounded-full bg-pink-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-pink-700 disabled:cursor-not-allowed disabled:bg-pink-300"
        >
          {status === 'saving' ? t('landing.profileForm.saving') : t('landing.profileForm.save')}
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label htmlFor={nameId} className="flex flex-col gap-1 text-sm font-semibold text-gray-800 dark:text-gray-100">
          <span id={`${nameId}-label`}>{t('landing.profileForm.nameLabel')}</span>
          <input
            id={nameId}
            name="name"
            aria-labelledby={`${nameId}-label`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100 dark:focus:ring-pink-500/40"
            placeholder={t('landing.profileForm.namePlaceholder')}
            autoComplete="name"
          />
        </label>
        <label htmlFor={emailId} className="flex flex-col gap-1 text-sm font-semibold text-gray-800 dark:text-gray-100">
          <span id={`${emailId}-label`}>{t('landing.profileForm.emailLabel')}</span>
          <input
            id={emailId}
            name="email"
            aria-labelledby={`${emailId}-label`}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100 dark:focus:ring-pink-500/40"
            placeholder={t('landing.profileForm.emailPlaceholder')}
            autoComplete="email"
          />
        </label>
      </div>

      <label htmlFor={referralId} className="flex flex-col gap-1 text-sm font-semibold text-gray-800 dark:text-gray-100">
        <span id={`${referralId}-label`}>{t('landing.profileForm.referralLabel')}</span>
        <input
          id={referralId}
          name="referralCode"
          aria-labelledby={`${referralId}-label`}
          value={referralCode}
          onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
          className="rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100 dark:focus:ring-pink-500/40"
          placeholder={t('landing.profileForm.referralPlaceholder')}
          autoComplete="off"
        />
      </label>

      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
        <span className="rounded-full bg-pink-50 px-3 py-1 font-semibold text-pink-700 dark:bg-pink-900/30 dark:text-pink-200">
          {t('landing.profileForm.rewardSignup')}
        </span>
        <span className="rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200">
          {t('landing.profileForm.rewardReferral')}
        </span>
        {status === 'saved' && <span className="text-emerald-600 font-semibold">{t('landing.profileForm.saved')}</span>}
        {status === 'error' && <span className="text-red-500 font-semibold">{errorMsg}</span>}
      </div>
    </form>
  );
};

export default CustomerProfileForm;
