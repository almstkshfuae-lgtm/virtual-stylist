
import React from 'react';
import { useTranslation } from '../i18n/LanguageContext';
import { TrashIcon } from './icons/TrashIcon';
import type { StyleProfile } from '../types';

interface StyleProfileDisplayProps {
  profile: StyleProfile;
  onClear: () => void;
}

export const StyleProfileDisplay: React.FC<StyleProfileDisplayProps> = ({ profile, onClear }) => {
  const { t } = useTranslation();
  const hasLikedKeywords = profile.liked && profile.liked.length > 0;

  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex justify-between items-start">
        <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('styleProfile.title')}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('styleProfile.description')}</p>
        </div>
        <button onClick={onClear} className="text-xs text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-500 transition-colors flex items-center gap-1 flex-shrink-0">
            <TrashIcon className="w-3 h-3"/>
            {t('styleProfile.clear')}
        </button>
      </div>
      <div className="mt-3 pt-3 border-t dark:border-gray-700">
        {hasLikedKeywords ? (
            <div className="flex flex-wrap gap-1.5">
            {profile.liked.map((keyword, index) => (
                <span key={index} className="px-2 py-0.5 text-xs bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-300 rounded-full capitalize">
                {keyword}
                </span>
            ))}
            </div>
        ) : (
            <p className="text-xs text-gray-400 dark:text-gray-500 text-center italic py-2">{t('styleProfile.empty')}</p>
        )}
      </div>
    </div>
  );
};
