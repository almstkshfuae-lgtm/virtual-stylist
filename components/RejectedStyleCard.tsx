
import React from 'react';
import { useTranslation } from '../i18n/LanguageContext';
import { TranslationKey } from '../i18n/translations';
import { XCircleIcon } from './icons/XCircleIcon';

interface RejectedStyleCardProps {
  title: string;
  reason: string;
  index: number;
  total: number;
}

export const RejectedStyleCard: React.FC<RejectedStyleCardProps> = ({ title, reason, index }) => {
  const { t } = useTranslation();
  const animationDelay = `${index * 150}ms`;

  return (
    <div 
      className="bg-gray-100 dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 animate-fade-in-stagger"
      style={{ animationDelay }}
    >
      <div className="p-6">
        <div className="flex items-center gap-3">
            <XCircleIcon className="w-8 h-8 text-red-400 flex-shrink-0" />
            <div>
                <div className="uppercase tracking-wide text-sm text-red-500 font-semibold">{t(`styles.${title}.name` as TranslationKey, title)}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{t('rejectedCard.title')}</p>
            </div>
        </div>
        <div className="mt-3 pt-3 border-t dark:border-gray-700">
            <p className="text-sm text-gray-700 dark:text-gray-300 font-semibold mb-1">{t('rejectedCard.subtitle')}</p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">"{reason}"</p>
        </div>
      </div>
    </div>
  );
};
