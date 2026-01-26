
import React, { useState, useCallback } from 'react';
import { useTranslation } from '../i18n/LanguageContext';
import { UploadIcon } from './icons/UploadIcon';

interface ImageUploaderProps {
  onImageUpload: (files: File[]) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const { t } = useTranslation();

  const handleFileChange = (files: FileList | null) => {
    if (files && files.length > 0) {
      const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
      if (imageFiles.length > 0) {
        onImageUpload(imageFiles);
      } else {
        alert('Please upload valid image files.');
      }
    }
  };

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  }, [onImageUpload]);

  return (
    <div className="text-center p-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">{t('uploader.title')}</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto">{t('uploader.subtitle')}</p>
        <label
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`relative group flex flex-col items-center justify-center w-full max-w-2xl mx-auto h-64 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden bg-white/50 dark:bg-gray-800/50 ${isDragging ? 'border-pink-500 scale-105' : 'border-gray-300 dark:border-gray-600 hover:border-pink-400 dark:hover:border-pink-500'}`}
        >
            <div className={`absolute inset-0 bg-gradient-to-r from-pink-100 via-purple-100 to-indigo-100 opacity-0 transition-opacity duration-500 ${isDragging ? 'opacity-50' : 'group-hover:opacity-30'}`}></div>
            <div className="relative z-10 flex flex-col items-center justify-center pt-5 pb-6">
                <UploadIcon className={`w-10 h-10 mb-3 transition-colors ${isDragging ? 'text-pink-600' : 'text-gray-500 dark:text-gray-400'}`} />
                <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">{t('uploader.cta')}</span> {t('uploader.drop')}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">{t('uploader.info')}</p>
            </div>
            <input 
                id="dropzone-file" 
                type="file" 
                className="hidden" 
                accept="image/*"
                multiple
                onChange={(e) => handleFileChange(e.target.files)}
            />
        </label>
    </div>
  );
};
