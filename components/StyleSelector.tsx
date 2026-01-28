
import React from 'react';
import { InfoIcon } from './icons/InfoIcon';
import { useTranslation } from '../i18n/LanguageContext';
import { TranslationKey } from '../i18n/translations';

const STYLE_KEYS = [
  'Casual', 'Business', 'Night Out', 'Athleisure', 'Bohemian', 
  'Formal', 'Streetwear', 'Minimalist', 'Vintage'
];

const MAX_STYLES = 4;

interface StyleSelectorProps {
  selectedStyles: string[];
  onStylesChange: (styles: string[]) => void;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({ selectedStyles, onStylesChange }) => {
  const { t } = useTranslation();

  const handleStyleClick = (style: string) => {
    const isSelected = selectedStyles.includes(style);
    let newStyles;
    if (isSelected) {
      newStyles = selectedStyles.filter(s => s !== style);
    } else {
      if (selectedStyles.length < MAX_STYLES) {
        newStyles = [...selectedStyles, style];
      } else {
        return; 
      }
    }
    onStylesChange(newStyles);
  };

  const selectedCount = selectedStyles.length;

  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {t('styleSelector.label')}
        <span className="ms-2 text-xs font-normal text-gray-500 dark:text-gray-400">
            ({t('styleSelector.selectionCount', { selected: selectedCount, max: MAX_STYLES })})
        </span>
      </label>
      <div className="flex flex-wrap gap-2 mt-2">
        {STYLE_KEYS.map((styleKey) => {
          const isSelected = selectedStyles.includes(styleKey);
          return (
             <div key={styleKey} className="relative group">
                <button
                onClick={() => handleStyleClick(styleKey)}
                className={`flex items-center gap-2 ps-3 pe-2 py-1 text-sm rounded-full transition-colors duration-200 border
                    ${
                    isSelected
                        ? 'bg-pink-500 text-white border-pink-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600'
                    }
                    ${!isSelected && selectedStyles.length >= MAX_STYLES ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                disabled={!isSelected && selectedStyles.length >= MAX_STYLES}
                >
                <span>{t(`styles.${styleKey}.name`, styleKey)}</span>
                <InfoIcon className={isSelected ? 'text-pink-200' : 'text-gray-400'} />
                </button>
                 <div 
                    role="tooltip"
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 p-2 text-xs text-white bg-gray-800 dark:bg-black rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10"
                >
                    {t(`styles.${styleKey}.description`)}
                    <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-800 dark:border-t-black"></div>
                </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
