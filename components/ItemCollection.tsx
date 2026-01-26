
import React, { useRef } from 'react';
import { useTranslation } from '../i18n/LanguageContext';
import { UploadIcon } from './icons/UploadIcon';
import { TrashIcon } from './icons/TrashIcon';
import type { ClothingItem } from '../types';
import { ModeToggle } from './ModeToggle';

interface ItemCollectionProps {
    items: ClothingItem[];
    selection: number[];
    onSelectItem: (index: number) => void;
    onRemoveItem: (index: number) => void;
    onAddItem: (file: File) => void;
    viewMode: 'single' | 'combine';
    onViewModeChange: (mode: 'single' | 'combine') => void;
}

export const ItemCollection: React.FC<ItemCollectionProps> = ({
    items,
    selection,
    onSelectItem,
    onRemoveItem,
    onAddItem,
    viewMode,
    onViewModeChange,
}) => {
    const { t } = useTranslation();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            onAddItem(event.target.files[0]);
        }
    };
    
    const handleAddClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="p-4 bg-white rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-gray-700">{t('main.yourCollection')}</h2>
                <ModeToggle viewMode={viewMode} onViewModeChange={onViewModeChange} />
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto p-1">
                {items.map((item, index) => {
                    const isSelected = selection.includes(index);
                    return (
                        <div key={index} className="relative group aspect-square">
                            <button 
                                onClick={() => onSelectItem(index)}
                                className={`w-full h-full rounded-md overflow-hidden focus:outline-none ring-2 ring-offset-2 transition-all duration-200 ${
                                    viewMode === 'single' && isSelected ? 'ring-pink-500' : 'ring-transparent hover:ring-pink-300'
                                }`}
                            >
                                <img src={item.url} alt={`Clothing item ${index + 1}`} className="w-full h-full object-cover" />
                                {viewMode === 'combine' && (
                                    <div className={`absolute inset-0 bg-black transition-opacity duration-200 ${isSelected ? 'opacity-40' : 'opacity-0 group-hover:opacity-20'}`}></div>
                                )}
                            </button>
                            {viewMode === 'combine' && (
                                <div className={`absolute top-1 left-1 rtl:left-auto rtl:right-1 w-5 h-5 rounded-sm border-2 bg-white/50 flex items-center justify-center pointer-events-none transition-all duration-200 ${isSelected ? 'border-indigo-500 bg-indigo-500' : 'border-gray-400'}`}>
                                    {isSelected && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                                </div>
                            )}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onRemoveItem(index);
                                }}
                                aria-label={t('main.removeItem')}
                                className="absolute top-1 right-1 rtl:right-auto rtl:left-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <TrashIcon className="w-4 h-4" />
                            </button>
                        </div>
                    )
                })}
                 <button
                    onClick={handleAddClick}
                    className="flex flex-col items-center justify-center aspect-square bg-gray-50 rounded-md border-2 border-dashed border-gray-300 text-gray-400 hover:bg-gray-100 hover:border-pink-400 hover:text-pink-500 transition-colors"
                    aria-label={t('main.addItem')}
                >
                    <UploadIcon className="w-6 h-6" />
                    <span className="text-xs mt-1">{t('main.addItem')}</span>
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                />
            </div>
        </div>
    );
};
