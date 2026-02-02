import DOMPurify from 'dompurify';
import { marked } from 'marked';

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export const sanitizeMarkdownToHtml = (value: string) => {
  const escaped = escapeHtml(value || '');
  const rendered = marked.parse(escaped, { breaks: true, gfm: true });

  return DOMPurify.sanitize(rendered, {
    USE_PROFILES: { html: true },
    FORBID_TAGS: ['style', 'script', 'iframe', 'object', 'embed', 'form'],
    FORBID_ATTR: ['style', 'onerror', 'onload', 'onclick'],
  });
};

export const sanitizeHref = (value: unknown): string | null => {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith('/')) return trimmed;

  try {
    const parsed = new URL(trimmed);
    if (['http:', 'https:', 'mailto:', 'tel:'].includes(parsed.protocol)) {
      return trimmed;
    }
  } catch {
    return null;
  }

  return null;
};
