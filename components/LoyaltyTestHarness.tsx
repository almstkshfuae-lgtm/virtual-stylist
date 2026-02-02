import React, { useId, useState } from 'react';
import { useLoyalty } from '../hooks/useConvex';
import { sanitizeHref } from '../lib/security';
import { isValidReferralEmail } from '../lib/referral';

interface LoyaltyTestHarnessProps {
  userId: string;
}

const Field: React.FC<{
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  invalid?: boolean;
  error?: string | null;
}> = ({ label, value, onChange, type = 'text', placeholder, invalid = false, error = null }) => {
  const inputId = `loyalty-test-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  return (
    <label htmlFor={inputId} className="flex flex-col gap-1 text-xs font-semibold text-gray-700 dark:text-gray-200">
      {label}
      <input
        id={inputId}
        name="loyaltyTestField"
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={invalid}
        aria-describedby={error ? `${inputId}-error` : undefined}
        placeholder={placeholder}
        className={`rounded-xl bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:outline-none focus:ring-2 dark:bg-slate-900 dark:text-gray-100 ${
          invalid
            ? 'border border-red-400 focus:border-red-500 focus:ring-red-200 dark:border-red-500/70 dark:focus:ring-red-500/40'
            : 'border border-gray-200 focus:border-pink-500 focus:ring-pink-100 dark:border-slate-700 dark:focus:ring-pink-500/40'
        }`}
      />
      {error && (
        <span id={`${inputId}-error`} className="text-[11px] font-medium text-red-600 dark:text-red-300" role="alert">
          {error}
        </span>
      )}
    </label>
  );
};

export const LoyaltyTestHarness: React.FC<LoyaltyTestHarnessProps> = ({ userId }) => {
  const { account, ensureCustomer, issueMonthly, spendPoints, adjustPoints } = useLoyalty(userId);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [referredBy, setReferredBy] = useState('');
  const [spendAmount, setSpendAmount] = useState('200');
  const [spendNote, setSpendNote] = useState('Test redemption');
  const [adjustDelta, setAdjustDelta] = useState('150');
  const [adjustNote, setAdjustNote] = useState('Manual boost');
  const [status, setStatus] = useState<string>('Idle');

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://virtual-stylist.ai';
  const referralLink = account?.referralCode ? `${origin}/?ref=${account.referralCode}` : '';
  const safeReferralLink = sanitizeHref(referralLink);

  const run = async (fn: () => Promise<any>, label: string) => {
    setStatus(`Running: ${label}`);
    try {
      await fn();
      setStatus(`Success: ${label}`);
    } catch (error: any) {
      console.error(label, error);
      setStatus(`Error: ${error?.message ?? 'unknown'}`);
    }
  };

  const parsedSpendAmount = Number(spendAmount);
  const parsedAdjustDelta = Number(adjustDelta);
  const canSpend = Number.isFinite(parsedSpendAmount) && parsedSpendAmount > 0;
  const canAdjust = Number.isFinite(parsedAdjustDelta) && parsedAdjustDelta > 0;
  const isEmailInvalid = email.trim().length > 0 && !isValidReferralEmail(email);
  const emailError = isEmailInvalid ? 'Enter a valid email address (example: you@example.com).' : null;
  const spendError = !canSpend ? 'Enter a positive number greater than 0.' : null;
  const adjustError = !canAdjust ? 'Enter a positive number greater than 0.' : null;

  return (
    <section className="rounded-3xl border border-dashed border-pink-300/70 bg-white/80 p-4 sm:p-6 shadow-sm dark:border-pink-800/60 dark:bg-slate-900/70">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-pink-600 dark:text-pink-300">
            QA · Loyalty Playground
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            جرّب الحفظ، الإحالة، وإصدار/خصم النقاط فوراً على حساب الاختبار الحالي.
          </p>
        </div>
        <span className="rounded-full bg-pink-100 px-3 py-1 text-xs font-semibold text-pink-700 dark:bg-pink-900/30 dark:text-pink-200">
          {status}
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Field label="الاسم" value={name} onChange={setName} placeholder={account?.name ?? 'مثال: سارة'} />
        <Field
          label="البريد"
          value={email}
          onChange={setEmail}
          type="email"
          placeholder={account?.email ?? 'you@example.com'}
          invalid={isEmailInvalid}
          error={emailError}
        />
        <Field
          label="كود إحالة لصديق"
          value={referredBy}
          onChange={(v) => setReferredBy(v.toUpperCase())}
          placeholder="ABC12345"
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          onClick={() =>
            run(() => ensureCustomer({ userId, name: name || undefined, email: email || undefined, referredByCode: referredBy || undefined }), 'Save profile & referral')
          }
          disabled={isEmailInvalid}
          className="rounded-full bg-pink-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-pink-700 disabled:cursor-not-allowed disabled:bg-pink-300"
        >
          حفظ واحتساب النقاط
        </button>
        <button
          onClick={() => run(() => issueMonthly({ userId }), 'Issue monthly points')}
          className="rounded-full border border-pink-600 px-4 py-2 text-sm font-semibold text-pink-700 hover:bg-pink-50 dark:hover:bg-pink-900/20"
        >
          إصدار نقاط الشهر
        </button>
        <a
          href={safeReferralLink || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className={`rounded-full px-4 py-2 text-sm font-semibold ${safeReferralLink ? 'text-emerald-700 bg-emerald-50 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-200' : 'text-gray-400 border border-gray-200 cursor-not-allowed'}`}
          aria-disabled={!safeReferralLink}
        >
          رابط إحالتك
        </a>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900/60">
          <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">اختبار خصم/استبدال</p>
          <div className="grid gap-2">
            <Field
              label="المبلغ"
              type="number"
              value={spendAmount}
              onChange={setSpendAmount}
              invalid={!canSpend}
              error={spendError}
            />
            <Field label="الوصف" value={spendNote} onChange={setSpendNote} />
            <button
              onClick={() =>
                run(
                  () =>
                    spendPoints({
                      userId,
                      amount: parsedSpendAmount,
                      description: spendNote || 'Test spend',
                    }),
                  'Spend points'
                )
              }
              disabled={!canSpend}
              className="rounded-xl bg-gray-900 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              خصم النقاط
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900/60">
          <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">اختبار تعديل رصيد</p>
          <div className="grid gap-2">
            <Field
              label="قيمة التعديل (موجب فقط)"
              type="number"
              value={adjustDelta}
              onChange={setAdjustDelta}
              invalid={!canAdjust}
              error={adjustError}
            />
            <Field label="الوصف" value={adjustNote} onChange={setAdjustNote} />
            <button
              onClick={() =>
                run(() => adjustPoints({ userId, delta: parsedAdjustDelta, description: adjustNote || 'Manual adjust' }), 'Adjust points')
              }
              disabled={!canAdjust}
              className="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
            >
              تطبيق التعديل
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoyaltyTestHarness;
