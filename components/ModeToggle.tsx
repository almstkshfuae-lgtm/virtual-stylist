
import React from 'react';
import { useTranslation } from '../i18n/LanguageContext';

interface ModeToggleProps {
    viewMode: 'single' | 'combine';
    onViewModeChange: (mode: 'single' | 'combine') => void;
}

export const ModeToggle: React.FC<ModeToggleProps> = ({ viewMode, onViewModeChange }) => {
    const { t } = useTranslation();

    const singleActive = viewMode === 'single';
    const combineActive = viewMode === 'combine';

    return (
        <div className="flex items-center bg-gray-200 rounded-full p-0.5">
            <button
                onClick={() => onViewModeChange('single')}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${singleActive ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
                {t('main.mode.single')}
            </button>
            <button
                onClick={() => onViewModeChange('combine')}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${combineActive ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
                {t('main.mode.combine')}
            </button>
        </div>
    );
};
