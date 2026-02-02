
import React, { useRef, useState } from 'react';
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

const CollectionItem: React.FC<{
    item: ClothingItem;
    index: number;
    isSelected: boolean;
    isRemoving: boolean;
    viewMode: 'single' | 'combine';
    onSelectItem: (index: number) => void;
    onRemoveItem: (index: number, url: string) => void;
    t: any;
}> = ({ item, index, isSelected, isRemoving, viewMode, onSelectItem, onRemoveItem, t }) => {
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    return (
        <div
            className={`relative group aspect-square ${isRemoving ? 'animate-item-remove' : 'animate-item-add'}`}
        >
            <button 
                onClick={() => onSelectItem(index)}
                className={`w-full h-full rounded-md overflow-hidden focus:outline-none ring-2 ring-offset-2 dark:ring-offset-slate-800 transition-all duration-200 ${
                    viewMode === 'single' && isSelected ? 'ring-pink-500' : 'ring-transparent'
                } relative`}
            >
                {!isImageLoaded && (
                    <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md" />
                )}
                <img 
                    src={item.url} 
                    alt={`Clothing item ${index + 1}`} 
                    loading="lazy"
                    decoding="async"
                    className={`w-full h-full object-cover rounded-md border-2 border-gray-200 dark:border-gray-500 transition-opacity duration-500 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`} 
                    onLoad={() => setIsImageLoaded(true)}
                />
                {viewMode === 'combine' && (
                    <div className={`absolute inset-0 bg-black transition-opacity duration-200 rounded-md ${isSelected ? 'opacity-40' : 'opacity-0 group-hover:opacity-20'}`}></div>
                )}
            </button>
            {viewMode === 'combine' && (
                <div className={`absolute top-1 left-1 rtl:left-auto rtl:right-1 w-5 h-5 rounded-sm border-2 bg-white/50 flex items-center justify-center pointer-events-none transition-all duration-200 ${isSelected ? 'border-white bg-white' : 'border-gray-400 dark:border-gray-500'}`}>
                    {isSelected && <svg className="w-3 h-3 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                </div>
            )}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onRemoveItem(index, item.url);
                }}
                aria-label={t('main.removeItem')}
                className="absolute top-1 right-1 rtl:right-auto rtl:left-1 bg-black/50 text-white rounded-full p-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2 dark:ring-offset-slate-800"
            >
                <TrashIcon className="w-4 h-4" />
            </button>
        </div>
    );
};

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
    const [removingItems, setRemovingItems] = useState<string[]>([]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            onAddItem(event.target.files[0]);
        }
    };
    
    const handleAddClick = () => {
        fileInputRef.current?.click();
    };

    const handleRemoveClick = (index: number, url: string) => {
        if (removingItems.includes(url)) return;
        setRemovingItems(prev => [...prev, url]);
        setTimeout(() => {
            onRemoveItem(index);
            setRemovingItems(prev => prev.filter(itemUrl => itemUrl !== url));
        }, 300); // Animation duration
    };

    return (
        <div className="p-4 bg-white rounded-xl border border-gray-200 dark:bg-slate-800 dark:border-slate-700">
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">{t('main.yourCollection')}</h2>
                <ModeToggle viewMode={viewMode} onViewModeChange={onViewModeChange} />
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto p-1">
                {items.map((item, index) => (
                    <CollectionItem
                        key={item.url}
                        item={item}
                        index={index}
                        isSelected={selection.includes(index)}
                        isRemoving={removingItems.includes(item.url)}
                        viewMode={viewMode}
                        onSelectItem={onSelectItem}
                        onRemoveItem={handleRemoveClick}
                        t={t}
                    />
                ))}
                 <button
                    onClick={handleAddClick}
                    className="flex flex-col items-center justify-center aspect-square bg-gray-50 dark:bg-slate-700/50 rounded-md border-2 border-dashed border-gray-300 dark:border-slate-600 text-gray-400 hover:bg-gray-100 hover:border-pink-400 hover:text-pink-500 dark:hover:bg-slate-700 dark:hover:border-pink-500 dark:hover:text-pink-400 transition-colors"
                    aria-label={t('main.addItem')}
                >
                    <UploadIcon className="w-6 h-6" />
                    <span className="text-xs mt-1">{t('main.addItem')}</span>
                </button>
                <input
                    name="collectionImageUpload"
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
