import React, { useState } from 'react';
import { useTranslation } from '../i18n/LanguageContext';
import type { StoreLocation } from '../types';
import { Loader } from './Loader';
import { MapPinIcon } from './icons/MapPinIcon';
import { SendIcon } from './icons/SendIcon';
import { CopyIcon } from './icons/CopyIcon';
import { GlobeIcon } from './icons/GlobeIcon';

interface StoreLocatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  stores: StoreLocation[];
  isLoading: boolean;
  error: string | null;
  accessory: string | null;
  onSearchManualLocation: (location: string) => void;
}

export const StoreLocatorModal: React.FC<StoreLocatorModalProps> = ({ isOpen, onClose, stores, isLoading, error, accessory, onSearchManualLocation }) => {
  const { t } = useTranslation();
  const [manualLocation, setManualLocation] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const GLOBAL_BRANDS = [
    'zara','h&m','hm','uniqlo','nike','adidas','puma','reebok','under armour',
    'levi','gap','mango','bershka','pull&bear','pull and bear','massimo dutti',
    'stradivarius','gucci','prada','louis vuitton','lv','chanel','dior','balenciaga','celine','armani'
  ];

  const isGlobalBrand = (title: string) => {
    const lower = title.toLowerCase();
    return GLOBAL_BRANDS.some((brand) => lower.includes(brand));
  };

  const handleManualSearch = (e: React.FormEvent) => {
      e.preventDefault();
      if(manualLocation.trim()) {
          onSearchManualLocation(manualLocation);
      }
  };

  const handleCopy = async (uri: string, index: number) => {
    try {
      await navigator.clipboard.writeText(uri);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1200);
    } catch (e) {
      setCopiedIndex(null);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div 
        className="fixed inset-0 bg-black/30 dark:bg-black/50 z-30 flex items-center justify-center p-4"
        onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
    >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <MapPinIcon className="w-5 h-5 text-cyan-500" />
                {t('storeLocator.title')}
            </h3>
            {accessory && <p className="text-xs text-gray-500 dark:text-gray-400 ms-7">{t('storeLocator.subtitle', { accessory })}</p>}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl">&times;</button>
        </div>
        
        <div className="p-6 overflow-y-auto">
            {/* Manual Search Form - Always shown at top to allow change of location */}
            <form onSubmit={handleManualSearch} className="mb-4 flex gap-2">
                <input 
                    type="text" 
                    value={manualLocation}
                    onChange={(e) => setManualLocation(e.target.value)}
                    placeholder={t('storeLocator.manualLocationPlaceholder')}
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <button 
                    type="submit"
                    disabled={isLoading || !manualLocation.trim()}
                    className="px-3 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <SendIcon className="w-4 h-4" />
                </button>
            </form>

            {isLoading && (
                <div className="space-y-3">
                  {[1,2,3].map((s) => (
                    <div key={s} className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-gray-700 p-3 animate-pulse">
                      <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
                        <div className="h-3 w-1/2 rounded bg-gray-100 dark:bg-gray-600" />
                      </div>
                    </div>
                  ))}
                </div>
            )}
            {error && !isLoading && (
                <div className="text-center text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg mb-4 text-sm">
                    {error}
                </div>
            )}
            {!isLoading && !error && stores.length > 0 && (
                <div className="grid gap-3 sm:grid-cols-2">
                    {stores.map((store, index) => (
                        <div
                          key={index}
                          className={`relative rounded-lg p-3 bg-gray-50 dark:bg-gray-700/40 transition ${
                            isGlobalBrand(store.title)
                              ? 'border border-amber-400/70 shadow-[0_8px_28px_rgba(255,193,7,0.35)]'
                              : 'border border-gray-200 dark:border-gray-700 hover:border-pink-400'
                          }`}
                        >
                            {isGlobalBrand(store.title) && (
                              <span className="absolute -top-2 -left-2 inline-flex items-center gap-1 rounded-full bg-amber-500 text-white px-2 py-1 text-[10px] font-bold shadow-md">
                                <GlobeIcon className="w-3 h-3" />
                                {t('storeLocator.globalBrand', 'علامة عالمية')}
                              </span>
                            )}
                            <div className="flex items-center gap-3">
                                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                                  isGlobalBrand(store.title)
                                    ? 'bg-amber-100 text-amber-700 shadow-inner'
                                    : 'bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-200'
                                }`}>
                                  <MapPinIcon className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={`font-semibold truncate ${
                                      isGlobalBrand(store.title)
                                        ? 'text-amber-700 dark:text-amber-300'
                                        : 'text-gray-800 dark:text-gray-100'
                                    }`}>{store.title}</p>
                                    <p className="text-[11px] text-cyan-700 dark:text-cyan-300 truncate">{store.uri}</p>
                                </div>
                            </div>
                            <div className="mt-3 flex items-center gap-2">
                                <a
                                    href={store.uri}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 rounded-md bg-gray-900 px-3 py-2 text-xs font-semibold text-white hover:bg-gray-800"
                                >
                                    {t('storeLocator.buttonOpen', 'Open in Maps')}
                                </a>
                                <button
                                    type="button"
                                    onClick={() => handleCopy(store.uri, index)}
                                    className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 hover:border-pink-400 hover:text-pink-600 dark:border-gray-600 dark:text-gray-200 dark:hover:border-pink-400"
                                >
                                    <CopyIcon className="w-4 h-4" /> {copiedIndex === index ? t('storeLocator.copied', 'تم النسخ') : t('storeLocator.copy', 'نسخ الرابط')}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
             {!isLoading && !error && stores.length === 0 && (
                 <div className="text-center text-gray-500 dark:text-gray-400 p-4">
                    {t('storeLocator.empty')}
                 </div>
             )}
        </div>
      </div>
    </div>
  );
};
