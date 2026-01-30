
import React from 'react';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import { useTranslation } from '../i18n/LanguageContext';
import { TrendAnalysisResult } from '../types';
import { GlobeIcon } from './icons/GlobeIcon';

interface TrendAnalysisModalProps {
  result: TrendAnalysisResult;
  onClose: () => void;
}

export const TrendAnalysisModal: React.FC<TrendAnalysisModalProps> = ({ result, onClose }) => {
  const { t } = useTranslation();
  const sanitizedHtml = DOMPurify.sanitize(marked.parse(result.text || '', { breaks: true }));
  const dialogRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const focusable = Array.from(
      dialog.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ).filter(el => !el.hasAttribute('disabled'));

    focusable[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
      if (event.key === 'Tab' && focusable.length > 0) {
        const currentIndex = focusable.indexOf(document.activeElement as HTMLElement);
        const direction = event.shiftKey ? -1 : 1;
        const nextIndex = (currentIndex + direction + focusable.length) % focusable.length;
        focusable[nextIndex].focus();
        event.preventDefault();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div 
        className="fixed inset-0 bg-black/30 dark:bg-black/50 z-30 flex items-center justify-center p-4"
        onClick={onClose}
    >
      <div 
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="trend-modal-title"
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col animate-fade-in-up focus:outline-none"
        onClick={(e) => e.stopPropagation()}
    >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h3 id="trend-modal-title" className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <GlobeIcon className="w-5 h-5 text-cyan-500" />
            {t('trends.modalTitle')}
          </h3>
          <button
            onClick={onClose}
            aria-label={t('trends.close')}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-full"
          >
            &times;
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          <div 
            className="prose prose-sm max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
          />
        </div>

        {result.sources && result.sources.length > 0 && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
                <h4 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2">{t('trends.sources')}</h4>
                <div className="flex flex-col gap-2">
                    {result.sources.filter(source => source.web?.uri).map((source, index) => (
                        <a 
                            key={index} 
                            href={source.web!.uri} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-sm text-cyan-600 hover:underline dark:text-cyan-400 truncate"
                        >
                           {source.web!.title || source.web!.uri}
                        </a>
                    ))}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
