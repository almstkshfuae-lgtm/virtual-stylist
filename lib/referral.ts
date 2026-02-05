export const DEFAULT_REFERRAL_BASE_URL = 'https://virtual-stylist.ai';
export const REFERRAL_EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const REFERRAL_QUERY_PARAM = 'ref';
const REFERRAL_STORAGE_KEY = 'virtual-stylist-referral-code';

const normalizeReferralCode = (value?: string | null) => {
  if (!value) return null;
  const cleaned = value.trim().replace(/\s+/g, '');
  if (!cleaned) return null;
  return cleaned.toUpperCase();
};

export const isValidReferralEmail = (email: string) =>
  REFERRAL_EMAIL_PATTERN.test(email.trim());

export const readReferralFromSearch = (search?: string | null) => {
  if (!search) return null;
  const params = new URLSearchParams(search.startsWith('?') ? search : `?${search}`);
  return normalizeReferralCode(params.get(REFERRAL_QUERY_PARAM));
};

export const loadPendingReferralCode = () => {
  if (typeof window === 'undefined') return null;
  return normalizeReferralCode(window.localStorage.getItem(REFERRAL_STORAGE_KEY));
};

export const storePendingReferralCode = (value?: string | null) => {
  if (typeof window === 'undefined') return;
  if (!value) {
    window.localStorage.removeItem(REFERRAL_STORAGE_KEY);
    return;
  }
  window.localStorage.setItem(REFERRAL_STORAGE_KEY, value);
};

export const buildReferralLink = (referralCode?: string | null, origin?: string) => {
  if (!referralCode) return null;
  const base = origin || DEFAULT_REFERRAL_BASE_URL;
  return `${base}/?ref=${referralCode}`;
};

export const copyTextToClipboard = async (text: string) => {
  if (typeof navigator === 'undefined' || !navigator.clipboard) return false;
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Clipboard write failed', error);
    return false;
  }
};

interface ReferralMailtoOptions {
  toEmail: string;
  referralLink: string;
  subject: string;
  message: string;
}

export const buildReferralInviteMailto = ({
  toEmail,
  referralLink,
  subject,
  message,
}: ReferralMailtoOptions) => {
  const params = new URLSearchParams({
    subject,
    body: `${message}\n${referralLink}`,
  });
  return `mailto:${encodeURIComponent(toEmail)}?${params.toString()}`;
};
