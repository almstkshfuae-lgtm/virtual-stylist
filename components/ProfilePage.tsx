import React, { useEffect, useState, useId } from 'react';
import { toDataURL } from 'qrcode';
import { Copy, Share2, ArrowLeft } from 'lucide-react';
import { useLoyalty } from '../hooks/useConvex';
import { useTranslation } from '../i18n/LanguageContext';
import type { ValidOutfit } from '../types';
import { useClipboard } from '../hooks/useClipboard';
import {
  buildReferralLink,
  buildReferralInviteMailto,
  isValidReferralEmail,
} from '../lib/referral';
import { useNavigate } from 'react-router-dom';

interface ProfilePageProps {
  userId: string;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ userId }) => {
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const isRtl = language === 'ar';
  const { account, settings, ledger, ensureCustomer } = useLoyalty(userId);
  const [savedOutfits, setSavedOutfits] = useState<ValidOutfit[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteError, setInviteError] = useState<string | null>(null);
  const inviteEmailId = useId();
  const [qrSrc, setQrSrc] = useState<string | null>(null);
  const codeClipboard = useClipboard();
  const linkClipboard = useClipboard();

  // Ensure loyalty account exists so the profile is populated automatically.
  useEffect(() => {
    if (!userId || !ensureCustomer) return;
    ensureCustomer({ userId }).catch((err: Error) =>
      console.debug('ensureCustomer (profile) skipped', err.message)
    );
  }, [ensureCustomer, userId]);

  // Load saved outfits from localStorage to show them on the profile.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = window.localStorage.getItem('savedOutfits');
      if (stored) {
        setSavedOutfits(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load saved outfits', error);
    }
  }, []);

  const origin = typeof window !== 'undefined' ? window.location.origin : undefined;
  const referralLink = buildReferralLink(account?.referralCode, origin);

  useEffect(() => {
    if (!referralLink) {
      setQrSrc(null);
      return;
    }

    toDataURL(referralLink, { margin: 2, width: 160 })
      .then(setQrSrc)
      .catch((error) => {
        console.error('Failed to generate QR code', error);
        setQrSrc(null);
      });
  }, [referralLink]);

  const handleShare = async () => {
    if (!referralLink || typeof navigator === 'undefined') return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'منسق الأزياء الافتراضي',
          text: 'استخدم رابط الإحالة واحصل على نقاط إضافية.',
          url: referralLink,
        });
      } catch (error) {
        console.debug('Share cancelled or failed', error);
      }
    } else {
      await linkClipboard.copy(referralLink);
    }
  };

  const getSafeInviteEmail = () => {
    const trimmed = inviteEmail.trim();
    if (!isValidReferralEmail(trimmed)) {
      return null;
    }
    return trimmed;
  };

  const sendInvite = () => {
    setInviteError(null);
    if (!referralLink) return;
    const trimmedEmail = inviteEmail.trim();
    if (!trimmedEmail) {
      setInviteError(t('landing.restore.emailRequired'));
      return;
    }
    const safeEmail = getSafeInviteEmail();
    if (!safeEmail) {
      setInviteError(t('landing.restore.invalidEmail'));
      return;
    }
    window.location.href = buildReferralInviteMailto({
      toEmail: safeEmail,
      referralLink,
      subject: 'انضم إلي منسق الأزياء الافتراضي',
      message: 'مرحباً! جرّب منسق الأزياء الافتراضي واحصل على نقاط مكافأة باستخدام رابط الإحالة الخاص بي:',
    });
  };

  const referralPoints = settings?.referralRewardPoints ?? 500;
  const monthlyPoints = settings?.monthlyPoints ?? 300;
  const referralQrAlt = t('profilePage.referralQrAlt');
  const isInviteEmailInvalid = inviteEmail.trim().length > 0 && !getSafeInviteEmail();
  const formatPoints = (value: number) =>
    t('landing.header.pointsLabel', { points: value.toLocaleString(language) });

  const handleBack = () => {
    navigate('/');
  };

  const getSavedOutfitAlt = (outfit: ValidOutfit, index: number) => {
    const normalizedTitle = outfit.title?.trim();
    if (normalizedTitle) {
      return t('profilePage.savedOutfitAlt', { title: normalizedTitle });
    }
    return t('profilePage.savedOutfitAltFallback', { index: index + 1 });
  };

  return (
    <main
      className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-emerald-50 text-gray-900 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 px-4 pb-12"
      aria-labelledby="profile-page-title"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-6 pt-10">
        <header className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse text-right' : ''}`}>
          <button
            onClick={handleBack}
            className={`inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-sm font-semibold text-gray-700 shadow-sm hover:border-pink-400 hover:text-pink-600 dark:border-slate-800 dark:bg-slate-900 dark:text-gray-200 ${isRtl ? 'flex-row-reverse' : ''}`}
          >
            <ArrowLeft className={`h-4 w-4 ${isRtl ? 'rotate-180' : ''}`} />
            {t('landing.header.profile')}
          </button>
          <span className="text-xs text-gray-500 dark:text-gray-400" dir="auto">
            {isRtl ? `${account?.email || '—'} · الصفحة الشخصية` : `Profile · ${account?.email || '—'}`}
          </span>
        </header>

        <section
          aria-labelledby="profile-page-title"
          className="rounded-3xl border border-white/60 bg-white/90 p-6 shadow-[0_22px_60px_rgba(0,0,0,0.08)] dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-[0_22px_60px_rgba(0,0,0,0.35)]"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className={`text-xs font-semibold text-pink-500 ${isRtl ? '' : 'uppercase tracking-[0.35em]'}`}>
                {t('landing.header.profile')}
              </p>
              <h1 id="profile-page-title" className="text-3xl font-black text-gray-900 dark:text-white">
                {account?.name || t('landing.header.guest')}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {account?.email || 'أضف بريدك للحصول على الإشعارات والمكافآت.'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-pink-100 bg-pink-50 px-4 py-3 text-sm font-semibold text-pink-700 dark:border-pink-700/50 dark:bg-pink-900/30 dark:text-pink-100">
                {formatPoints(account ? account.pointsBalance : 0)}
                <span className={`${isRtl ? 'mr-2' : 'ml-2'} text-xs text-pink-500 dark:text-pink-200`}>الرصيد</span>
              </div>
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 dark:border-emerald-700/40 dark:bg-emerald-900/30 dark:text-emerald-100">
                {account?.monthlyIssuedFor ? 'محدّث' : 'انتظار'} · {formatPoints(monthlyPoints)}
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-[2fr,1fr]">
            <div className="rounded-2xl border border-gray-100 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-900/70">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">كود الإحالة</p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {account?.referralCode ?? 'يتم إنشاؤه تلقائياً...'}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {`أنت وصديقك تحصلان على ${referralPoints} نقطة عند التسجيل.`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={!account?.referralCode}
                    onClick={() => account?.referralCode && codeClipboard.copy(account.referralCode)}
                    className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-700 hover:border-pink-400 hover:text-pink-600 disabled:cursor-not-allowed disabled:border-gray-100 disabled:text-gray-300 dark:border-slate-700 dark:text-gray-100 dark:hover:border-pink-500 dark:hover:text-pink-200"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    {codeClipboard.state === 'copied'
                      ? 'تم النسخ'
                      : codeClipboard.state === 'manual'
                        ? 'اضغط Ctrl+C'
                      : codeClipboard.state === 'error'
                        ? 'فشل النسخ'
                        : 'نسخ الكود'}
                  </button>
                  <button
                    type="button"
                    disabled={!referralLink}
                    onClick={() => referralLink && linkClipboard.copy(referralLink)}
                    className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-700 hover:border-pink-400 hover:text-pink-600 disabled:cursor-not-allowed disabled:border-gray-100 disabled:text-gray-300 dark:border-slate-700 dark:text-gray-100 dark:hover:border-pink-500 dark:hover:text-pink-200"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    {linkClipboard.state === 'copied'
                      ? 'الرابط نُسخ'
                      : linkClipboard.state === 'manual'
                        ? 'اضغط Ctrl+C'
                      : linkClipboard.state === 'error'
                        ? 'فشل النسخ'
                        : 'نسخ الرابط'}
                  </button>
                  <button
                    type="button"
                    disabled={!referralLink}
                    onClick={handleShare}
                    className="inline-flex items-center gap-1 rounded-full border border-pink-500 bg-pink-500 px-3 py-1 text-xs font-semibold text-white shadow-sm transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:bg-pink-300"
                  >
                    <Share2 className="h-3.5 w-3.5" />
                    مشاركة
                  </button>
                </div>
              </div>
              {referralLink && (
                <p className="mt-2 truncate text-xs text-gray-500 dark:text-gray-400">{referralLink}</p>
              )}
              {(codeClipboard.state === 'manual' ||
                linkClipboard.state === 'manual' ||
                codeClipboard.state === 'error' ||
                linkClipboard.state === 'error') && (
                <p className="mt-2 text-xs text-red-600 dark:text-red-300" role="alert" aria-live="assertive">
                  {codeClipboard.state === 'manual' || linkClipboard.state === 'manual'
                    ? 'تم تحديد النص تلقائياً. اضغط Ctrl+C للنسخ.'
                    : 'تعذر النسخ. امنح إذن الحافظة أو انسخ الرابط يدوياً.'}
                </p>
              )}
              <div className="mt-3 flex flex-col gap-2 rounded-2xl border border-pink-100 bg-white/70 p-3 shadow-sm dark:border-pink-700/30 dark:bg-slate-900/60">
                <label htmlFor={inviteEmailId} className="text-xs font-semibold uppercase text-pink-700 dark:text-pink-200">
                  أرسل رابط الإحالة لصديق جديد
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
                    placeholder="friend@example.com"
                    className={`flex-1 rounded-full bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:outline-none focus:ring-2 dark:bg-slate-900 dark:text-gray-100 ${
                      isInviteEmailInvalid || inviteError
                        ? 'border border-red-400 focus:border-red-500 focus:ring-red-200 dark:border-red-500/70 dark:focus:ring-red-500/40'
                        : 'border border-gray-200 focus:border-pink-500 focus:ring-pink-200 dark:border-slate-700 dark:focus:ring-pink-500/40'
                    }`}
                  />
                  <button
                    type="submit"
                    disabled={!referralLink}
                    className="inline-flex items-center justify-center rounded-full bg-pink-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-pink-700 disabled:cursor-not-allowed disabled:bg-pink-300"
                  >
                    إرسال الدعوة
                  </button>
                </form>
                {(isInviteEmailInvalid || inviteError) && (
                  <p id={`${inviteEmailId}-error`} className="text-[11px] text-red-600 dark:text-red-300" role="alert" aria-live="assertive">
                    {inviteError || t('landing.restore.invalidEmail')}
                  </p>
                )}
                {!referralLink && (
                  <p className="text-[11px] text-gray-500 dark:text-gray-400" aria-live="polite">
                    {t('landing.loyalty.referralCodePending')}
                  </p>
                )}
                <p className="text-[11px] text-pink-600/80 dark:text-pink-200">
                  سيُفتح بريدك الافتراضي مع رسالة جاهزة تتضمن رابط الإحالة.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center rounded-2xl border border-gray-100 bg-white/70 p-4 text-xs text-gray-500 dark:border-slate-800 dark:bg-slate-900/60">
              {qrSrc ? (
                <div className="flex flex-col items-center gap-2">
                  <img src={qrSrc} alt={referralQrAlt} loading="lazy" decoding="async" className="h-32 w-32" />
                  <span className="text-[11px] text-gray-500 dark:text-gray-400">امسح لتحصل على النقاط</span>
                </div>
              ) : (
                <span>سيظهر رمز QR بعد إنشاء الكود.</span>
              )}
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.4fr,1fr]">
          <section aria-labelledby="saved-outfits-heading" className="rounded-3xl border border-white/60 bg-white/90 p-5 shadow-md dark:border-slate-800 dark:bg-slate-900/80">
            <div className="flex items-center justify-between">
              <h2 id="saved-outfits-heading" className="text-sm font-semibold text-gray-800 dark:text-gray-100">إطلالاتك المحفوظة</h2>
              <span className="text-xs text-gray-500 dark:text-gray-400">{savedOutfits.length} looks</span>
            </div>
            {savedOutfits.length === 0 ? (
              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                لا توجد إطلالات محفوظة بعد. جرّب إنشاء إطلالة واحفظها من الصفحة الرئيسية.
              </p>
            ) : (
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {savedOutfits.map((outfit, index) => (
                  <figure
                    key={outfit.imageUrl}
                    className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/70"
                  >
                    <img
                      src={outfit.imageUrl}
                      alt={getSavedOutfitAlt(outfit, index)}
                      loading={index === 0 ? 'eager' : 'lazy'}
                      decoding="async"
                      className="h-40 w-full object-cover"
                    />
                    <figcaption className="p-3">
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
                        {outfit.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{outfit.description}</p>
                    </figcaption>
                  </figure>
                ))}
              </div>
            )}
          </section>

          <section aria-labelledby="recent-activity-heading" className="rounded-3xl border border-white/60 bg-white/90 p-5 shadow-md dark:border-slate-800 dark:bg-slate-900/80">
            <div className="flex items-center justify-between">
              <h2 id="recent-activity-heading" className="text-sm font-semibold text-gray-800 dark:text-gray-100">آخر الحركات</h2>
              <span className="text-xs text-gray-500 dark:text-gray-400">{ledger?.length ?? 0} entries</span>
            </div>
            {ledger?.length ? (
              <div className="mt-3 space-y-3">
                {ledger.slice(0, 6).map((entry: any) => (
                  <div
                    key={entry._id ?? `${entry.createdAt}-${entry.delta}`}
                    className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white/70 p-3 dark:border-slate-800 dark:bg-slate-900/60"
                  >
                    <div>
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{entry.type}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(entry.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`text-sm font-bold ${
                        entry.delta >= 0 ? 'text-emerald-600' : 'text-red-500'
                      }`}
                    >
                      {entry.delta >= 0 ? '+' : ''}
                      {entry.delta} pts
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">لا توجد حركات بعد.</p>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
