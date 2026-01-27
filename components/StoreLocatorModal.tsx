import React, { useState } from 'react';
import { useTranslation } from '../i18n/LanguageContext';
import type { StoreLocation } from '../types';
import { Loader } from './Loader';
import { MapPinIcon } from './icons/MapPinIcon';
import { SendIcon } from './icons/SendIcon';

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

  const handleManualSearch = (e: React.FormEvent) => {
      e.preventDefault();
      if(manualLocation.trim()) {
          onSearchManualLocation(manualLocation);
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
                <div className="flex flex-col items-center justify-center h-48">
                    <Loader />
                </div>
            )}
            {error && !isLoading && (
                <div className="text-center text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg mb-4 text-sm">
                    {error}
                </div>
            )}
            {!isLoading && !error && stores.length > 0 && (
                <ul className="space-y-2">
                    {stores.map((store, index) => (
                        <li key={index}>
                            <a
                                href={store.uri}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <p className="font-medium text-cyan-700 dark:text-cyan-400">{store.title}</p>
                            </a>
                        </li>
                    ))}
                </ul>
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