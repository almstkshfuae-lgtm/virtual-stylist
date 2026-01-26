
import React, { useState, useEffect } from 'react';
import type { ValidOutfit } from '../types';
import { EditIcon } from './icons/EditIcon';
import { Loader } from './Loader';
import { ShareIcon } from './icons/ShareIcon';
import { useTranslation } from '../i18n/LanguageContext';
import { TranslationKey } from '../i18n/translations';
import { ThumbsUpIcon } from './icons/ThumbsUpIcon';
import { ThumbsDownIcon } from './icons/ThumbsDownIcon';
import { BodyIcon } from './icons/BodyIcon';

interface OutfitCardProps {
  outfit: ValidOutfit;
  onEditImage: (editPrompt: string) => Promise<string>;
  index: number;
  total: number;
  rating: 'liked' | 'disliked' | null;
  onRate: (outfit: ValidOutfit, rating: 'liked' | 'disliked') => void;
}

export const OutfitCard: React.FC<OutfitCardProps> = ({ outfit, onEditImage, index, rating, onRate }) => {
  const [editPrompt, setEditPrompt] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [shareFeedback, setShareFeedback] = useState('Share');
  const { t } = useTranslation();

  const animationDelay = `${index * 150}ms`;

  useEffect(() => {
    setShareFeedback(t('outfitCard.share'));
  }, [t]);

  const handleShare = async () => {
    const shareData = {
      title: `${t('share.title')}: ${t(`styles.${outfit.title}.name` as TranslationKey)}`,
      text: `${outfit.description}\n\n${t('share.text')}`,
    };

    try {
      const response = await fetch(outfit.imageUrl);
      const blob = await response.blob();
      const file = new File([blob], `${outfit.title.toLowerCase().replace(/\s/g, '-')}.png`, { type: blob.type });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          ...shareData,
          files: [file],
        });
      } else {
        await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}`);
        setShareFeedback(t('outfitCard.copied'));
        setTimeout(() => setShareFeedback(t('outfitCard.share')), 2000);
      }
    } catch (error) {
      console.error('Error sharing:', error);
      try {
        await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}`);
        setShareFeedback(t('outfitCard.copied'));
        setTimeout(() => setShareFeedback(t('outfitCard.share')), 2000);
      } catch (copyError) {
        console.error('Error copying to clipboard:', copyError);
        setShareFeedback(t('outfitCard.failed'));
        setTimeout(() => setShareFeedback(t('outfitCard.share')), 2000);
      }
    }
  };

  // Fix: Add handleEdit function and return JSX to complete the component
  const handleEdit = async () => {
    if (!editPrompt.trim()) return;
    setIsEditing(true);
    setError(null);
    try {
      await onEditImage(editPrompt);
      setIsEditMode(false);
      setEditPrompt('');
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setIsEditing(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl animate-fade-in-stagger" style={{ animationDelay }}>
      <div className="md:flex">
        <div className="md:flex-shrink-0 md:w-1/2">
          <img className="h-64 w-full object-cover md:h-full" src={outfit.imageUrl} alt={outfit.title} />
        </div>
        <div className="p-6 md:w-1/2 flex flex-col justify-between">
          <div>
            <div className="uppercase tracking-wide text-sm text-pink-500 font-semibold">{t(`styles.${outfit.title}.name` as TranslationKey, outfit.title)}</div>
            <p className="mt-2 text-gray-600">{outfit.description}</p>
            {outfit.bodyShapeTip && (
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-start gap-2 text-sm text-blue-700 bg-blue-50 p-2 rounded-md">
                    <BodyIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-semibold">{t('outfitCard.bodyShapeTipTitle')}</p>
                        <p>{outfit.bodyShapeTip}</p>
                    </div>
                </div>
            )}
            {outfit.iconUrl && outfit.keyAccessory && (
              <div className="mt-3 pt-3 border-t flex items-center gap-3 text-sm text-gray-700">
                <img src={outfit.iconUrl} alt={outfit.keyAccessory} className="w-8 h-8 object-contain bg-gray-50 rounded-full p-1" />
                <div>
                  <p className="font-semibold text-gray-500">{t('main.suggestedAccessory')}:</p>
                  <p>{outfit.keyAccessory}</p>
                </div>
              </div>
            )}
          </div>
          <div className="mt-6">
            {isEditMode ? (
              <div className="space-y-2">
                <label htmlFor={`edit-${index}`} className="block text-sm font-medium text-gray-700">{t('outfitCard.editLabel')}</label>
                <input
                  id={`edit-${index}`}
                  type="text"
                  value={editPrompt}
                  onChange={(e) => setEditPrompt(e.target.value)}
                  placeholder={t('outfitCard.editPlaceholder')}
                  className="w-full px-3 py-2 text-sm bg-gray-100 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                {error && <p className="text-xs text-red-500">{t('outfitCard.editError')}: {error}</p>}
                <div className="flex gap-2">
                  <button onClick={handleEdit} disabled={isEditing} className="flex-1 px-3 py-1.5 text-sm font-semibold text-white bg-pink-500 rounded-md hover:bg-pink-600 disabled:bg-pink-300">
                    {isEditing ? t('outfitCard.applying') : t('outfitCard.apply')}
                  </button>
                  <button onClick={() => setIsEditMode(false)} className="flex-1 px-3 py-1.5 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">{t('outfitCard.cancel')}</button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-4 items-center gap-2">
                <button
                  onClick={() => onRate(outfit, 'liked')}
                  className={`flex items-center justify-center p-2 rounded-md transition-colors ${rating === 'liked' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500 hover:bg-green-50 hover:text-green-500'}`}
                  aria-label={t('outfitCard.like')}
                >
                  <ThumbsUpIcon className="w-5 h-5" />
                </button>
                 <button
                  onClick={() => onRate(outfit, 'disliked')}
                  className={`flex items-center justify-center p-2 rounded-md transition-colors ${rating === 'disliked' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500'}`}
                  aria-label={t('outfitCard.dislike')}
                >
                  <ThumbsDownIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsEditMode(true)}
                  className="flex items-center justify-center gap-1 p-2 bg-gray-100 text-gray-500 rounded-md hover:bg-gray-200"
                  aria-label={t('outfitCard.edit')}
                >
                  <EditIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center justify-center gap-1 p-2 bg-gray-100 text-gray-500 rounded-md hover:bg-gray-200"
                  aria-label={t('outfitCard.share')}
                >
                  <ShareIcon className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
