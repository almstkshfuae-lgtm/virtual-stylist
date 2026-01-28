
import React from 'react';

export const OutfitCardSkeleton: React.FC<{ index: number }> = ({ index }) => {
  const animationDelay = `${index * 150}ms`;
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden animate-fade-in-stagger" style={{ animationDelay }}>
      <div className="md:flex animate-pulse">
        <div className="md:flex-shrink-0 md:w-1/2">
          <div className="h-64 w-full bg-gray-200 dark:bg-gray-700 md:h-full"></div>
        </div>
        <div className="p-6 md:w-1/2 flex flex-col justify-between">
          <div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            <div className="mt-4 space-y-2">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            </div>
            <div className="mt-5 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                        <div className="space-y-1.5">
                            <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                        </div>
                    </div>
                     <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-20"></div>
                </div>
            </div>
          </div>
          <div className="mt-6">
             <div className="grid grid-cols-4 items-center gap-2">
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
