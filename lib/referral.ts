export const DEFAULT_REFERRAL_BASE_URL = 'https://virtual-stylist.ai';
export const REFERRAL_EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const isValidReferralEmail = (email: string) =>
  REFERRAL_EMAIL_PATTERN.test(email.trim());

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
