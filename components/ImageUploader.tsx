
import React, { useState, useCallback, useId, useRef } from 'react';
import { useTranslation } from '../i18n/useTranslation';
import { UploadIcon } from './icons/UploadIcon';
import { Loader } from './Loader';
import { getUploadLimits, validateImageFiles } from '../lib/uploadValidation';

interface ImageUploaderProps {
  onImageUpload: (files: File[]) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragDepthRef = useRef(0);
  const { maxFiles, maxFileSizeMb } = getUploadLimits();

  const handleFileChange = useCallback(async (files: FileList | null) => {
    const { files: validFiles, error: validationError } = validateImageFiles(files, t);

    if (validationError) {
      setError(validationError);
      return;
    }

    if (validFiles.length === 0) {
      return;
    }

    setIsProcessing(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      onImageUpload(validFiles);
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [onImageUpload, t]);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragDepthRef.current += 1;
    if (!isProcessing) setIsDragging(true);
  }, [isProcessing]);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);
    if (dragDepthRef.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragDepthRef.current = 0;
    setIsDragging(false);
    if (!isProcessing) {
        handleFileChange(e.dataTransfer.files);
    }
  }, [handleFileChange, isProcessing]);

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="text-center p-4 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">{t('uploader.title')}</h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 max-w-xl mx-auto">{t('uploader.subtitle')}</p>
        {error && (
            <p className="mb-4 text-sm text-red-600 dark:text-red-400" role="alert" aria-live="assertive">
                {error}
            </p>
        )}
        <p className="mb-4 text-xs text-gray-600 dark:text-gray-300" aria-live="polite">
          {t('uploader.guidance', `Tip: upload clear front-view photos. Up to ${maxFiles} images, ${maxFileSizeMb}MB each.`)}
        </p>
        <label
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            htmlFor={inputId}
            className={`uploader-dropzone relative group flex flex-col items-center justify-center w-full max-w-2xl mx-auto h-56 sm:h-64 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden bg-white/50 dark:bg-gray-800/50 ${isDragging ? 'border-pink-500 scale-105' : 'border-gray-300 dark:border-gray-600 hover:border-pink-400 dark:hover:border-pink-500'} ${isProcessing ? 'cursor-wait opacity-80' : ''}`}
            aria-busy={isProcessing}
            aria-disabled={isProcessing}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleClickUpload();
              }
            }}
        >
            <div className={`absolute inset-0 bg-gradient-to-r from-pink-100 via-purple-100 to-indigo-100 opacity-0 transition-opacity duration-500 ${isDragging ? 'opacity-50' : 'group-hover:opacity-30'}`}></div>
            
            {isProcessing ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 dark:bg-gray-800/90 z-20 backdrop-blur-sm animate-fade-in-up">
                    <Loader />
                    <p className="mt-4 text-sm font-semibold text-gray-600 dark:text-gray-300 animate-pulse">{t('main.loading.analyzing')}</p>
                </div>
            ) : (
                <div className="relative z-10 flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadIcon className={`w-10 h-10 mb-3 transition-colors ${isDragging ? 'text-pink-600' : 'text-gray-500 dark:text-gray-400'}`} />
                    <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-semibold">{t('uploader.cta')}</span> {t('uploader.drop')}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">{t('uploader.info')}</p>
                </div>
            )}
            
            <input 
                id={inputId} 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept="image/*"
                multiple
                onChange={(e) => handleFileChange(e.target.files)}
                disabled={isProcessing}
            />
        </label>
    </div>
  );
};
