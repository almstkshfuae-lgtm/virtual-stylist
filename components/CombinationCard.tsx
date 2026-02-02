
import React from 'react';
import type { CombinationResult, ClothingItem } from '../types';
import { useTranslation } from '../i18n/LanguageContext';

interface CombinationCardProps {
    result: CombinationResult;
    allItems: ClothingItem[];
}

export const CombinationCard: React.FC<CombinationCardProps> = ({ result, allItems }) => {
    const { t } = useTranslation();

    const matchedItems = result.itemIndices.map(index => allItems[index]).filter(Boolean);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl dark:border dark:border-gray-700">
            <div className="p-6">
                <h3 className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">{result.title}</h3>
                <div className="flex flex-wrap gap-2 my-4">
                    {matchedItems.map((item, index) => (
                        <img 
                            key={index} 
                            src={item.url} 
                            alt={`Item ${result.itemIndices[index]}`}
                            loading="lazy"
                            decoding="async"
                            className="w-20 h-20 object-cover rounded-md border dark:border-gray-700"
                        />
                    ))}
                </div>
                <p className="mt-2 text-gray-600 dark:text-gray-300">{result.description}</p>
                {result.iconUrl && result.keyAccessory && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                        <img src={result.iconUrl} alt={result.keyAccessory} loading="lazy" decoding="async" className="w-8 h-8 object-contain bg-gray-50 dark:bg-gray-700 rounded-full p-1"/>
                        <div>
                            <p className="font-semibold text-gray-500 dark:text-gray-400">{t('main.suggestedAccessory')}:</p>
                            <p>{result.keyAccessory}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
