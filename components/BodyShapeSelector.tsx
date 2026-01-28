
import React from 'react';
import { useTranslation } from '../i18n/LanguageContext';
import type { BodyShape } from '../types';
import { TranslationKey } from '../i18n/translations';
import { InfoIcon } from './icons/InfoIcon';

const BODY_SHAPES: Exclude<BodyShape, null>[] = ['apple', 'pear', 'hourglass', 'rectangle', 'inverted_triangle'];

interface BodyShapeSelectorProps {
    selectedShape: BodyShape;
    onShapeChange: (shape: BodyShape) => void;
}

export const BodyShapeSelector: React.FC<BodyShapeSelectorProps> = ({ selectedShape, onShapeChange }) => {
    const { t } = useTranslation();

    return (
        <div className="p-4 bg-white rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('bodyShape.title')}</h3>
            <div className="flex flex-wrap gap-2 mt-2">
                {BODY_SHAPES.map((shape) => {
                    const isSelected = selectedShape === shape;
                    return (
                        <div key={shape} className="relative group">
                            <button
                                onClick={() => onShapeChange(isSelected ? null : shape)}
                                className={`flex items-center gap-1.5 ps-3 pe-2 py-1 text-sm rounded-full transition-colors duration-200 border
                                    ${isSelected
                                        ? 'bg-blue-500 text-white border-blue-500'
                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600'
                                    }
                                `}
                            >
                                <span>{t(`bodyShape.${shape}.name` as TranslationKey, shape)}</span>
                                <InfoIcon className={isSelected ? 'text-blue-200' : 'text-gray-400'} />
                            </button>
                            <div
                                role="tooltip"
                                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 p-2 text-xs text-white bg-gray-800 dark:bg-black rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10"
                            >
                                {t(`bodyShape.${shape}.description` as TranslationKey)}
                                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-800 dark:border-t-black"></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
