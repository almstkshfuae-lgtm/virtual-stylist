import React, { useState, useEffect } from 'react';
import type { ValidOutfit } from '../types';
import { EditIcon } from './icons/EditIcon';
import { ShareIcon } from './icons/ShareIcon';
import { useTranslation } from '../i18n/LanguageContext';
import { TranslationKey } from '../i18n/translations';
import { ThumbsUpIcon } from './icons/ThumbsUpIcon';
import { ThumbsDownIcon } from './icons/ThumbsDownIcon';
import { BodyIcon } from './icons/BodyIcon';
import { MapPinIcon } from './icons/MapPinIcon';
import { BookmarkIcon } from './icons/BookmarkIcon';

interface OutfitCardProps {
  outfit: ValidOutfit;
  onEditImage: (editPrompt: string) => Promise<string>;
  index: number;
  total: number;
  rating: 'liked' | 'disliked' | null;
  onRate: (outfit: ValidOutfit, rating: 'liked' | 'disliked') => void;
  onFindNearby: (accessory: string) => void;
  isFindingNearby: boolean;
  isSaved: boolean;
  onToggleSave: () => void;
}

export const OutfitCard: React.FC<OutfitCardProps> = ({ outfit, onEditImage, index, rating, onRate, onFindNearby, isFindingNearby, isSaved, onToggleSave }) => {
  const [editPrompt, setEditPrompt] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [shareFeedback, setShareFeedback] = useState('Share');
  const { t } = useTranslation();
  const shareLabel = t('outfitCard.share');

  const animationDelay = `${index * 150}ms`;

  useEffect(() => {
    setShareFeedback(shareLabel);
  }, [shareLabel]);

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
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl dark:border dark:border-gray-700 animate-fade-in-stagger" style={{ animationDelay }}>
      <div className="md:flex">
        <div className="md:flex-shrink-0 md:w-1/2 overflow-hidden">
          <img
            className="h-64 w-full object-cover md:h-full animate-image-scale origin-center"
            src={outfit.imageUrl}
            alt={`Generated outfit preview: ${outfit.title}`}
            loading={index === 0 ? 'eager' : 'lazy'}
            fetchPriority={index === 0 ? 'high' : 'low'}
            decoding="async"
          />
        </div>
        <div className="p-6 md:w-1/2 flex flex-col justify-between">
          <div>
            <div className="uppercase tracking-wide text-sm text-pink-500 font-semibold">{t(`styles.${outfit.title}.name` as TranslationKey, outfit.title)}</div>
            <p className="mt-2 text-gray-600 dark:text-gray-300">{outfit.description}</p>
            {outfit.bodyShapeTip && (
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-start gap-2 text-sm text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20 p-2 rounded-md">
                    <BodyIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-semibold">{t('outfitCard.bodyShapeTipTitle')}</p>
                        <p>{outfit.bodyShapeTip}</p>
                    </div>
                </div>
            )}
            {outfit.iconUrl && outfit.keyAccessory && (
              <div className="mt-3 pt-3 border-t dark:border-gray-700 flex items-center justify-between gap-3 text-sm text-gray-700 dark:text-gray-300">
                <div className="flex items-center gap-3">
                    <img src={outfit.iconUrl} alt={`Accessory icon: ${outfit.keyAccessory}`} loading="lazy" decoding="async" className="w-8 h-8 object-contain bg-gray-50 dark:bg-gray-700 rounded-full p-1" />
                    <div>
                    <p className="font-semibold text-gray-500 dark:text-gray-400">{t('main.suggestedAccessory')}:</p>
                    <p>{outfit.keyAccessory}</p>
                    </div>
                </div>
                <button 
                  onClick={() => onFindNearby(outfit.keyAccessory)}
                  disabled={isFindingNearby}
                  className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/30 rounded-full hover:bg-cyan-100 dark:hover:bg-cyan-900/50 transition-colors disabled:opacity-50 disabled:cursor-wait focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 dark:ring-offset-gray-800"
                >
                  <MapPinIcon className="w-3 h-3"/>
                  {isFindingNearby ? t('outfitCard.finding') : t('outfitCard.findNearby')}
                </button>
              </div>
            )}
          </div>
          <div className="mt-6">
            {isEditMode ? (
              <div className="space-y-2">
                <label htmlFor={`edit-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('outfitCard.editLabel')}</label>
                <input
                  id={`edit-${index}`}
                  type="text"
                  value={editPrompt}
                  onChange={(e) => setEditPrompt(e.target.value)}
                  placeholder={t('outfitCard.editPlaceholder')}
                  className="w-full px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                {error && <p className="text-xs text-red-500 dark:text-red-400">{t('outfitCard.editError')}: {error}</p>}
                <div className="flex gap-2">
                  <button onClick={handleEdit} disabled={isEditing} className="flex-1 px-3 py-1.5 text-sm font-semibold text-white bg-pink-500 rounded-md hover:bg-pink-600 disabled:bg-pink-300">
                    {isEditing ? t('outfitCard.applying') : t('outfitCard.apply')}
                  </button>
                  <button onClick={() => setIsEditMode(false)} className="flex-1 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">{t('outfitCard.cancel')}</button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-5 items-center gap-2">
                 <button
                  onClick={onToggleSave}
                  className={`flex items-center justify-center gap-1 p-2 rounded-md transition-colors ${
                      isSaved 
                      ? 'bg-pink-100 text-pink-600 dark:bg-pink-500/20 dark:text-pink-300' 
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
                  } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2 dark:ring-offset-gray-800`}
                  aria-label={isSaved ? t('outfitCard.unsave') : t('outfitCard.save')}
                  title={isSaved ? t('outfitCard.unsave') : t('outfitCard.save')}
                >
                  <BookmarkIcon className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={() => onRate(outfit, 'liked')}
                  className={`flex items-center justify-center p-2 rounded-md transition-colors ${rating === 'liked' ? 'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-300' : 'bg-gray-100 text-gray-500 hover:bg-green-50 hover:text-green-500 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-green-500/20 dark:hover:text-green-400'} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 dark:ring-offset-gray-800`}
                  aria-label={t('outfitCard.like')}
                  title={t('outfitCard.like')}
                >
                  <ThumbsUpIcon className="w-5 h-5" />
                </button>
                 <button
                  onClick={() => onRate(outfit, 'disliked')}
                  className={`flex items-center justify-center p-2 rounded-md transition-colors ${rating === 'disliked' ? 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-300' : 'bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-red-500/20 dark:hover:text-red-400'} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 dark:ring-offset-gray-800`}
                  aria-label={t('outfitCard.dislike')}
                  title={t('outfitCard.dislike')}
                >
                  <ThumbsDownIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsEditMode(true)}
                  className="flex items-center justify-center gap-1 p-2 bg-gray-100 text-gray-500 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2 dark:ring-offset-gray-800"
                  aria-label={t('outfitCard.edit')}
                  title={t('outfitCard.edit')}
                >
                  <EditIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center justify-center gap-1 p-2 bg-gray-100 text-gray-500 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2 dark:ring-offset-gray-800"
                  aria-label={shareLabel}
                  title={shareLabel}
                >
                  <ShareIcon className="w-5 h-5" />
                </button>
              </div>
            )}
            <div className="mt-2 min-h-[1rem]" aria-live="polite">
              {shareFeedback !== shareLabel && (
                <p className="text-xs text-gray-700 dark:text-gray-300">{shareFeedback}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
