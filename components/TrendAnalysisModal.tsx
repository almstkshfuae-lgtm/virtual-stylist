
import React from 'react';
import { useTranslation } from '../i18n/LanguageContext';
import { TrendAnalysisResult } from '../types';
import { GlobeIcon } from './icons/GlobeIcon';

interface TrendAnalysisModalProps {
  result: TrendAnalysisResult;
  onClose: () => void;
}

export const TrendAnalysisModal: React.FC<TrendAnalysisModalProps> = ({ result, onClose }) => {
  const { t } = useTranslation();

  return (
    <div 
        className="fixed inset-0 bg-black/30 z-30 flex items-center justify-center p-4"
        onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
    >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <GlobeIcon className="w-5 h-5 text-cyan-500" />
            {t('trends.modalTitle')}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          <div 
            className="prose prose-sm max-w-none" 
            dangerouslySetInnerHTML={{ __html: result.text.replace(/\n/g, '<br/>') }}
          />
        </div>

        {result.sources && result.sources.length > 0 && (
            <div className="p-4 border-t border-gray-200 flex-shrink-0">
                <h4 className="text-xs font-semibold uppercase text-gray-500 mb-2">{t('trends.sources')}</h4>
                <div className="flex flex-col gap-2">
                    {result.sources.filter(source => source.web?.uri).map((source, index) => (
                        <a 
                            key={index} 
                            href={source.web!.uri} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-sm text-cyan-600 hover:underline truncate"
                        >
                           {source.web!.title || source.web!.uri}
                        </a>
                    ))}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
