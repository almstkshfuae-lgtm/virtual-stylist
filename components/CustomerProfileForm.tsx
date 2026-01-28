import React, { useEffect, useMemo, useState } from 'react';
import { useLoyalty } from '../hooks/useConvex';

interface CustomerProfileFormProps {
  userId: string;
}

export const CustomerProfileForm: React.FC<CustomerProfileFormProps> = ({ userId }) => {
  const { account, ensureCustomer } = useLoyalty(userId);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
      setErrorMsg(error?.message ?? 'لم نتمكن من حفظ بياناتك. حاول مرة أخرى.');
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
            ملف العميل
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            احفظ الاسم والبريد وكود الإحالة لتحصل على نقاطك فوراً.
          </p>
        </div>
        <button
          type="submit"
          disabled={status === 'saving' || !isDirty}
          className="rounded-full bg-pink-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-pink-700 disabled:cursor-not-allowed disabled:bg-pink-300"
        >
          {status === 'saving' ? 'جاري الحفظ...' : 'حفظ البيانات'}
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm font-semibold text-gray-800 dark:text-gray-100">
          الاسم
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100 dark:focus:ring-pink-500/40"
            placeholder="اكتب اسمك"
            autoComplete="name"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold text-gray-800 dark:text-gray-100">
          البريد الإلكتروني
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100 dark:focus:ring-pink-500/40"
            placeholder="you@example.com"
            autoComplete="email"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm font-semibold text-gray-800 dark:text-gray-100">
        كود الإحالة (للاستفادة من نقاط صديقك)
        <input
          value={referralCode}
          onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
          className="rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100 dark:focus:ring-pink-500/40"
          placeholder="مثال: ABC12345"
          autoComplete="off"
        />
      </label>

      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
        <span className="rounded-full bg-pink-50 px-3 py-1 font-semibold text-pink-700 dark:bg-pink-900/30 dark:text-pink-200">
          مكافأة التسجيل + الترحيب
        </span>
        <span className="rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200">
          تفعيل الإحالة يمنحك نقاطاً فورية
        </span>
        {status === 'saved' && <span className="text-emerald-600 font-semibold">تم الحفظ وإصدار النقاط 🎉</span>}
        {status === 'error' && <span className="text-red-500 font-semibold">{errorMsg}</span>}
      </div>
    </form>
  );
};

export default CustomerProfileForm;
