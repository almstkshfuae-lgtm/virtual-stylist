import { useCallback, useEffect, useRef, useState } from 'react';
import { copyTextToClipboard } from '../lib/referral';

export type ClipboardState = 'idle' | 'copied' | 'manual' | 'error';

export const useClipboard = (resetDelayMs = 1500) => {
  const [state, setState] = useState<ClipboardState>('idle');
  const timeoutRef = useRef<number | null>(null);
  const fallbackTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  const clearResetTimer = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const scheduleReset = useCallback(() => {
    clearResetTimer();
    timeoutRef.current = window.setTimeout(() => {
      setState('idle');
      timeoutRef.current = null;
    }, resetDelayMs);
  }, [clearResetTimer, resetDelayMs]);

  const selectForManualCopy = useCallback((text: string) => {
    if (typeof document === 'undefined') return;
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', 'true');
    textarea.setAttribute('aria-hidden', 'true');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    textarea.style.pointerEvents = 'none';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);
    fallbackTextareaRef.current = textarea;
  }, []);

  const clearManualSelection = useCallback(() => {
    if (!fallbackTextareaRef.current) return;
    fallbackTextareaRef.current.remove();
    fallbackTextareaRef.current = null;
  }, []);

  const copy = useCallback(
    async (text: string) => {
      const ok = await copyTextToClipboard(text);
      if (ok) {
        clearManualSelection();
        setState('copied');
      } else {
        selectForManualCopy(text);
        setState('manual');
      }
      scheduleReset();
      return ok;
    },
    [clearManualSelection, scheduleReset, selectForManualCopy]
  );

  useEffect(
    () => () => {
      clearResetTimer();
      clearManualSelection();
    },
    [clearManualSelection, clearResetTimer]
  );

  return { state, copy };
};
