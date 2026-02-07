import React, { useEffect, useMemo, useState, useId } from 'react';
import { useLoyalty } from '../hooks/useConvex';
import { useTranslation } from '../i18n/useTranslation';

interface CustomerProfileFormProps {
  userId: string;
}

export const CustomerProfileForm: React.FC<CustomerProfileFormProps> = ({ userId }) => {
  const { account, ensureCustomer } = useLoyalty(userId);
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [nationality, setNationality] = useState('');
  const [age, setAge] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Build ASCII-only ids so browser autofill/a11y tooling can reliably resolve aria-labelledby.
  const idBase = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const nameId = `customer-name-${idBase}`;
  const emailId = `customer-email-${idBase}`;
  const nationalityId = `customer-nationality-${idBase}`;
  const ageId = `customer-age-${idBase}`;
  const mobileId = `customer-mobile-${idBase}`;
  const addressId = `customer-address-${idBase}`;
  const referralId = `customer-referral-${idBase}`;

  useEffect(() => {
    if (account?.name) setName(account.name);
    if (account?.email) setEmail(account.email);
    if (account?.nationality) setNationality(account.nationality);
    if (typeof account?.age === 'number') setAge(String(account.age));
    if (account?.mobileNumber) setMobile(account.mobileNumber);
    if (account?.address) setAddress(account.address);
    if (account?.referredByCode) setReferralCode(account.referredByCode);
  }, [
    account?.address,
    account?.age,
    account?.email,
    account?.mobileNumber,
    account?.name,
    account?.nationality,
    account?.referredByCode,
  ]);

  const isDirty = useMemo(() => {
    return (
      name.trim() !== (account?.name ?? '') ||
      email.trim() !== (account?.email ?? '') ||
      nationality.trim() !== (account?.nationality ?? '') ||
      age.trim() !== (typeof account?.age === 'number' ? String(account.age) : '') ||
      mobile.trim() !== (account?.mobileNumber ?? '') ||
      address.trim() !== (account?.address ?? '') ||
      referralCode.trim() !== (account?.referredByCode ?? '')
    );
  }, [
    account?.address,
    account?.age,
    account?.email,
    account?.mobileNumber,
    account?.name,
    account?.nationality,
    account?.referredByCode,
    address,
    age,
    email,
    mobile,
    name,
    nationality,
    referralCode,
  ]);
  const isEmailInvalid = email.trim().length > 0 && !emailPattern.test(email.trim());
  const parsedAge = age.trim() ? Number(age.trim()) : undefined;
  const isAgeInvalid = Boolean(age.trim()) && (!Number.isFinite(parsedAge) || parsedAge <= 0);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!userId || !ensureCustomer) return;
    const trimmedEmail = email.trim();
    if (trimmedEmail && !emailPattern.test(trimmedEmail)) {
      setStatus('error');
      setErrorMsg(t('landing.profileForm.invalidEmail'));
      return;
    }
    if (isAgeInvalid) {
      setStatus('error');
      setErrorMsg(t('landing.profileForm.invalidAge'));
      return;
    }
    setStatus('saving');
    setErrorMsg(null);

    try {
      await ensureCustomer({
        userId,
        name: name.trim() || undefined,
        email: trimmedEmail || undefined,
        nationality: nationality.trim() || undefined,
        age: parsedAge,
        mobileNumber: mobile.trim() || undefined,
        address: address.trim() || undefined,
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
          <p className="text-xs font-semibold uppercase tracking-[0.12em] sm:tracking-[0.25em] text-gray-600 dark:text-gray-300">
            {t('landing.profileForm.eyebrow')}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-200">
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
            className="rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100 dark:focus:ring-pink-500/40"
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
            aria-invalid={isEmailInvalid}
            aria-describedby={status === 'error' && errorMsg ? `${emailId}-error` : undefined}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100 dark:focus:ring-pink-500/40"
            placeholder={t('landing.profileForm.emailPlaceholder')}
            autoComplete="email"
          />
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label htmlFor={nationalityId} className="flex flex-col gap-1 text-sm font-semibold text-gray-800 dark:text-gray-100">
          <span id={`${nationalityId}-label`}>{t('landing.profileForm.nationalityLabel')}</span>
          <input
            id={nationalityId}
            name="nationality"
            aria-labelledby={`${nationalityId}-label`}
            value={nationality}
            onChange={(e) => setNationality(e.target.value)}
            className="rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100 dark:focus:ring-pink-500/40"
            placeholder={t('landing.profileForm.nationalityPlaceholder')}
            autoComplete="country-name"
          />
        </label>
        <label htmlFor={ageId} className="flex flex-col gap-1 text-sm font-semibold text-gray-800 dark:text-gray-100">
          <span id={`${ageId}-label`}>{t('landing.profileForm.ageLabel')}</span>
          <input
            id={ageId}
            name="age"
            aria-labelledby={`${ageId}-label`}
            aria-invalid={isAgeInvalid}
            type="number"
            min={1}
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100 dark:focus:ring-pink-500/40"
            placeholder={t('landing.profileForm.agePlaceholder')}
            inputMode="numeric"
          />
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label htmlFor={mobileId} className="flex flex-col gap-1 text-sm font-semibold text-gray-800 dark:text-gray-100">
          <span id={`${mobileId}-label`}>{t('landing.profileForm.mobileLabel')}</span>
          <input
            id={mobileId}
            name="mobile"
            aria-labelledby={`${mobileId}-label`}
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100 dark:focus:ring-pink-500/40"
            placeholder={t('landing.profileForm.mobilePlaceholder')}
            autoComplete="tel"
          />
        </label>
        <label htmlFor={addressId} className="flex flex-col gap-1 text-sm font-semibold text-gray-800 dark:text-gray-100">
          <span id={`${addressId}-label`}>{t('landing.profileForm.addressLabel')}</span>
          <input
            id={addressId}
            name="address"
            aria-labelledby={`${addressId}-label`}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100 dark:focus:ring-pink-500/40"
            placeholder={t('landing.profileForm.addressPlaceholder')}
            autoComplete="street-address"
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
          className="rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100 dark:focus:ring-pink-500/40"
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
        {status === 'error' && (
          <span id={`${emailId}-error`} className="text-red-500 font-semibold">
            {errorMsg}
          </span>
        )}
      </div>
    </form>
  );
};

export default CustomerProfileForm;
