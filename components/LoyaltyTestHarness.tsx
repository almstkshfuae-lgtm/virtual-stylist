import React, { useMemo, useState } from 'react';
import { useLoyalty } from '../hooks/useConvex';

interface LoyaltyTestHarnessProps {
  userId: string;
}

const Field = ({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) => (
  <label className="flex flex-col gap-1 text-xs font-semibold text-gray-700 dark:text-gray-200">
    {label}
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-100 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100 dark:focus:ring-pink-500/40"
    />
  </label>
);

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

  const referralLink = useMemo(() => {
    if (!account?.referralCode && typeof window === 'undefined') return '';
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://virtual-stylist.ai';
    return account?.referralCode ? `${origin}/?ref=${account.referralCode}` : '';
  }, [account?.referralCode]);

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
  const canSpend = Number.isFinite(parsedSpendAmount) && parsedSpendAmount > 0;

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
        <Field label="البريد" value={email} onChange={setEmail} type="email" placeholder={account?.email ?? 'you@example.com'} />
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
          className="rounded-full bg-pink-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-pink-700"
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
          href={referralLink || '#'}
          target="_blank"
          rel="noreferrer"
          className={`rounded-full px-4 py-2 text-sm font-semibold ${referralLink ? 'text-emerald-700 bg-emerald-50 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-200' : 'text-gray-400 border border-gray-200 cursor-not-allowed'}`}
          aria-disabled={!referralLink}
        >
          رابط إحالتك
        </a>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900/60">
          <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">اختبار خصم/استبدال</p>
          <div className="grid gap-2">
            <Field label="المبلغ" type="number" value={spendAmount} onChange={setSpendAmount} />
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
            <Field label="قيمة التعديل (+/-)" type="number" value={adjustDelta} onChange={setAdjustDelta} />
            <Field label="الوصف" value={adjustNote} onChange={setAdjustNote} />
            <button
              onClick={() =>
                run(() => adjustPoints({ userId, delta: Number(adjustDelta) || 0, description: adjustNote || 'Manual adjust' }), 'Adjust points')
              }
              className="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
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
