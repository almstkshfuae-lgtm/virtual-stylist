import React, { useState, useCallback, useEffect } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { OutfitCard } from './components/OutfitCard';
import { Loader } from './components/Loader';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { generateOutfits, editImage, combineItems, analyzeTrends, sendMessageToChat, findNearbyStores } from './services/geminiService';
import type { Outfit, ClothingItem, CombinationResult, ValidOutfit, StyleProfile, TrendAnalysisResult, ChatMessage, BodyShape, Coordinates, StoreLocation } from './types';
import { useTranslation } from './i18n/LanguageContext';
import { LanguageSelector } from './components/LanguageSelector';
import { ItemCollection } from './components/ItemCollection';
import { CombinationCard } from './components/CombinationCard';
import { LandingPage } from './components/LandingPage';
import { RejectedStyleCard } from './components/RejectedStyleCard';
import { RestartIcon } from './components/icons/RestartIcon';
import { Chatbot } from './components/Chatbot';
import { ChatBubbleIcon } from './components/icons/ChatBubbleIcon';
import { TrendAnalysisModal } from './components/TrendAnalysisModal';
import { StoreLocatorModal } from './components/StoreLocatorModal';
import { GlobeIcon } from './components/icons/GlobeIcon';
import { OutfitCardSkeleton } from './components/OutfitCardSkeleton';
import { ThemeToggle } from './components/ThemeToggle';
import { PlusMinusIcon } from './components/icons/PlusMinusIcon';
import { StyleSelector } from './components/StyleSelector';
import { BodyShapeSelector } from './components/BodyShapeSelector';
import { StyleProfileDisplay } from './components/StyleProfileDisplay';
import { ConvexProviderWrapper } from './components/ConvexProviderWrapper';

// Helper to convert a Base64 data URL into a File object
const dataURLtoFile = (dataurl: string, filename: string): File => {
    const arr = dataurl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) {
      throw new Error('Invalid data URL');
    }
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
};

// The demo image is now embedded to avoid cross-origin fetching issues.
const DEMO_IMAGE_DATA_URL = 'data:image/png;base64,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';

const App: React.FC = () => {
  const [collection, setCollection] = useState<ClothingItem[]>([]);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
  const [outfits, setOutfits] = useState<(Outfit | null)[]>([]);
  const [combinationResults, setCombinationResults] = useState<CombinationResult[]>([]);
  const [combinationSelection, setCombinationSelection] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'single' | 'combine'>('single');
  const [hasStarted, setHasStarted] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const { t, language } = useTranslation();
  
  const [styleProfile, setStyleProfile] = useState<StyleProfile>({ liked: [], disliked: [] });
  const [ratedOutfits, setRatedOutfits] = useState<Record<string, 'liked' | 'disliked'>>({});
  
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  
  const [isTrendLoading, setIsTrendLoading] = useState(false);
  const [trendAnalysisResult, setTrendAnalysisResult] = useState<TrendAnalysisResult | null>(null);
  const [bodyShape, setBodyShape] = useState<BodyShape>(null);

  const [userLocation, setUserLocation] = useState<Coordinates>(null);
  const [isFindingStores, setIsFindingStores] = useState(false);
  const [storeFinderError, setStoreFinderError] = useState<string | null>(null);
  const [storeLocations, setStoreLocations] = useState<StoreLocation[]>([]);
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
  const [activeSearchAccessory, setActiveSearchAccessory] = useState<string | null>(null);

  const [selectedStyles, setSelectedStyles] = useState<string[]>(['Casual', 'Business', 'Night Out']);

  const [savedOutfits, setSavedOutfits] = useState<ValidOutfit[]>([]);


  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('styleProfile');
      if (savedProfile) {
        setStyleProfile(JSON.parse(savedProfile));
      }
    } catch (e) {
      console.error("Failed to load style profile from localStorage", e);
    }
    setChatHistory([{ role: 'model', text: t('chat.welcome') }]);
  }, []);

   useEffect(() => {
    setChatHistory(prev => prev.length > 1 ? prev : [{ role: 'model', text: t('chat.welcome') }]);
  }, [language, t]);

  useEffect(() => {
    // FIX: Changed NodeJS.Timeout to number as setInterval in browser returns a number.
    let interval: number | undefined;
    if (isLoading && viewMode === 'combine') {
      const messages = t('main.loading.messages') as string[];
      setLoadingMessage(messages[0]);
      interval = window.setInterval(() => {
        setLoadingMessage(messages[Math.floor(Math.random() * messages.length)]);
      }, 2500);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isLoading, t, viewMode]);

  useEffect(() => {
    // Load saved outfits
    try {
      const stored = localStorage.getItem('savedOutfits');
      if (stored) {
        setSavedOutfits(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load saved outfits", e);
    }
  }, []);

  const handleToggleSaveOutfit = (outfit: ValidOutfit) => {
    setSavedOutfits(prev => {
      const isSaved = prev.some(o => o.imageUrl === outfit.imageUrl);
      let newSaved;
      if (isSaved) {
        newSaved = prev.filter(o => o.imageUrl !== outfit.imageUrl);
      } else {
        newSaved = [...prev, outfit];
      }
      
      try {
        localStorage.setItem('savedOutfits', JSON.stringify(newSaved));
      } catch (e) {
        console.error("Failed to save to localStorage", e);
        // If storage is full, we might want to alert the user, but for now we just return the previous state if save fails.
        // Actually, let's allow state update even if storage fails so UI reflects change temporarily.
      }
      return newSaved;
    });
  };

  const handleImageUpload = (files: File[]) => {
    const newItems = files.map(file => ({ file, url: URL.createObjectURL(file) }));
    setCollection(prev => [...prev, ...newItems]);
    setOutfits([]);
    setRatedOutfits({});
    setError(null);
    if (selectedItemIndex === null && viewMode === 'single') {
      setSelectedItemIndex(collection.length);
    }
    if (!hasStarted) {
      setHasStarted(true);
    }
  };
  
  const handleSelectItem = (index: number) => {
    if(index !== selectedItemIndex) {
      setSelectedItemIndex(index);
      setOutfits([]);
      setRatedOutfits({});
      setCombinationResults([]);
      setError(null);
    }
  };

  const handleToggleCombinationSelection = (index: number) => {
    setCombinationSelection(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
    setCombinationResults([]);
  };

  const handleRemoveItem = (index: number) => {
    const itemToRemove = collection[index];
    if (itemToRemove) {
      URL.revokeObjectURL(itemToRemove.url);
    }
    setCollection(prev => prev.filter((_, i) => i !== index));
    if (selectedItemIndex === index) {
      setSelectedItemIndex(null);
      setOutfits([]);
      setRatedOutfits({});
    } else if (selectedItemIndex && selectedItemIndex > index) {
      setSelectedItemIndex(prev => (prev !== null ? prev - 1 : null));
    }
    setCombinationSelection(prev => prev.filter(i => i !== index).map(i => i > index ? i - 1 : i));
  }

  const handleGenerateOutfits = useCallback(async (itemFile: File, styles: string[]) => {
    setOutfits([]); // Clear old outfits immediately
    setIsLoading(true);
    setError(null);
    setRatedOutfits({});
    try {
      const generated = await generateOutfits(itemFile, styles, language, styleProfile, bodyShape);
      setOutfits(generated);
    } catch (e) {
      setOutfits([]);
      console.error(e);
      setError(e instanceof Error ? e.message : 'An unknown error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [language, styleProfile, bodyShape]);

   const handleAnalyzeTrends = useCallback(async () => {
    if (selectedItemIndex === null || !collection[selectedItemIndex]) return;

    setIsTrendLoading(true);
    setError(null);
    setTrendAnalysisResult(null);
    try {
      const result = await analyzeTrends(collection[selectedItemIndex].file, language);
      setTrendAnalysisResult(result);
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'An unknown error occurred while analyzing trends.');
    } finally {
      setIsTrendLoading(false);
    }
  }, [selectedItemIndex, collection, language]);
  
  const handleCombineItems = useCallback(async () => {
    if (combinationSelection.length < 2) {
      setError(t('main.error.minTwoItems'));
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setCombinationResults([]);
    try {
        const itemsToCombine = combinationSelection.map(index => collection[index].file);
        const results = await combineItems(itemsToCombine, language);
        const mappedResults = results.map(result => ({
            ...result,
            itemIndices: result.itemIndices.map(relativeIndex => combinationSelection[relativeIndex])
        }));
        setCombinationResults(mappedResults);
    } catch(e) {
        console.error(e);
        setError(e instanceof Error ? e.message : 'An unknown error occurred. Please try again.');
    } finally {
        setIsLoading(false);
    }
  }, [combinationSelection, collection, t, language]);

  const handleEditImage = async (outfitIndex: number, editPrompt: string): Promise<string> => {
    if (selectedItemIndex === null || !collection[selectedItemIndex]) {
      throw new Error("No item selected for editing.");
    }
    
    const currentOutfit = outfits[outfitIndex];
    if (currentOutfit === null || 'rejectionReason' in currentOutfit) {
        throw new Error("Cannot edit a rejected or loading outfit.");
    }
    if (!currentOutfit.imageUrl) {
        throw new Error("No image URL found for the current outfit.");
    }

    try {
      const editedImageUrl = await editImage(currentOutfit.imageUrl, collection[selectedItemIndex].file, editPrompt);
      
      const newOutfits = [...outfits];
      const updatedOutfit: ValidOutfit = { ...currentOutfit, imageUrl: editedImageUrl };
      newOutfits[outfitIndex] = updatedOutfit;
      setOutfits(newOutfits);
      return editedImageUrl;
    } catch (e) {
      console.error(e);
      // Re-throw the error so the component can catch it and display a message
      throw e;
    }
  };

  const handleRateOutfit = (outfit: ValidOutfit, rating: 'liked' | 'disliked') => {
    setRatedOutfits(prev => ({ ...prev, [outfit.imageUrl]: rating }));
    
    setStyleProfile(currentProfile => {
        const newProfile = { ...currentProfile };
        const keywords = outfit.keywords || [];

        if (rating === 'liked') {
            newProfile.liked = [...new Set([...newProfile.liked, ...keywords])];
            newProfile.disliked = newProfile.disliked.filter(k => !keywords.includes(k));
        } else {
            newProfile.disliked = [...new Set([...newProfile.disliked, ...keywords])];
            newProfile.liked = newProfile.liked.filter(k => !keywords.includes(k));
        }

        try {
            localStorage.setItem('styleProfile', JSON.stringify(newProfile));
        } catch (e) {
            console.error("Failed to save style profile to localStorage", e);
        }
        
        return newProfile;
    });
  };

  const handleClearProfile = () => {
      const newProfile = { liked: [], disliked: [] };
      setStyleProfile(newProfile);
      try {
        localStorage.removeItem('styleProfile');
      } catch (e) {
        console.error("Failed to clear style profile from localStorage", e);
      }
  }

  const handleSendMessage = async (message: string) => {
    const currentSelectedItemFile = (selectedItemIndex !== null && viewMode === 'single') ? collection[selectedItemIndex].file : undefined;
    const newHistory: ChatMessage[] = [...chatHistory, { role: 'user', text: message }];
    setChatHistory(newHistory);
    setIsChatLoading(true);
    try {
        const responseText = await sendMessageToChat(newHistory, language, currentSelectedItemFile);
        setChatHistory(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (e) {
        console.error(e);
        setChatHistory(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error. Please try again." }]);
    } finally {
        setIsChatLoading(false);
    }
  };

  const handleManualLocationSearch = async (location: string) => {
      if (!activeSearchAccessory) return;
      
      setIsFindingStores(true);
      setStoreFinderError(null);
      setStoreLocations([]);
      
      try {
          const stores = await findNearbyStores(activeSearchAccessory, location, language);
          setStoreLocations(stores);
      } catch (e) {
          console.error(e);
          setStoreFinderError(t('storeLocator.error'));
      } finally {
          setIsFindingStores(false);
      }
  };

  const handleFindNearbyStores = useCallback(async (accessory: string) => {
      const search = async (coords: Coordinates) => {
          setIsFindingStores(true);
          setStoreFinderError(null);
          setStoreLocations([]);
          setActiveSearchAccessory(accessory);
          setIsStoreModalOpen(true);
          try {
              const stores = await findNearbyStores(accessory, coords, language);
              setStoreLocations(stores);
          } catch (e) {
              console.error(e);
              setStoreFinderError(t('storeLocator.error'));
          } finally {
              setIsFindingStores(false);
          }
      };

      if (userLocation) {
          search(userLocation);
      } else {
          setActiveSearchAccessory(accessory);
          setIsStoreModalOpen(true);
          setIsFindingStores(true);
          navigator.geolocation.getCurrentPosition(
              (position) => {
                  const coords = {
                      latitude: position.coords.latitude,
                      longitude: position.coords.longitude,
                  };
                  setUserLocation(coords);
                  search(coords);
              },
              (error) => {
                  console.error("Geolocation error:", error);
                  setStoreFinderError(t('storeLocator.error'));
                  setIsFindingStores(false);
                  // The modal remains open, allowing manual search
              }
          );
      }
  }, [userLocation, language, t]);
  
  const resetApp = () => {
    collection.forEach(item => URL.revokeObjectURL(item.url));
    setCollection([]);
    setSelectedItemIndex(null);
    setOutfits([]);
    setError(null);
    setIsLoading(false);
    setViewMode('single');
    setCombinationSelection([]);
    setCombinationResults([]);
    setHasStarted(false);
    setRatedOutfits({});
  }

  const handleStartDemo = useCallback(async () => {
    setHasStarted(true);
    setIsLoading(true);
    setError(null);
    setCollection([]);
    setOutfits([]);
    setRatedOutfits({});
    try {
      const demoFile = dataURLtoFile(DEMO_IMAGE_DATA_URL, "demo-skirt.png");
      const demoItem = { file: demoFile, url: URL.createObjectURL(demoFile) };
      setCollection([demoItem]);
      setSelectedItemIndex(0);
      
      await handleGenerateOutfits(demoFile, ['Casual', 'Business', 'Night Out']);

    } catch (e) {
      console.error(e);
      setError("Failed to load demo. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [handleGenerateOutfits]);

  const selectedItem = selectedItemIndex !== null ? collection[selectedItemIndex] : null;

  if (!hasStarted && collection.length === 0) {
    return <LandingPage onGetStarted={() => setHasStarted(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 font-sans">
      <header className="p-4 border-b border-gray-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-10">
        <div className="container mx-auto max-w-6xl flex justify-between items-center">
          <div onClick={resetApp} className="cursor-pointer group">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 tracking-tight transition-colors group-hover:text-pink-500">
              {t('header.titlePart1')} <span className="text-pink-500 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors">{t('header.titlePart2')}</span>
            </h1>
          </div>
          <div className='flex items-center gap-4'>
            <button 
                onClick={resetApp} 
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors"
                aria-label={t('header.startOver')}
            >
                <RestartIcon className="w-4 h-4"/>
                <span>{t('header.startOver')}</span>
            </button>
            <LanguageSelector />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-6xl p-4 md:p-8">
        {collection.length === 0 ? (
          <ImageUploader onImageUpload={handleImageUpload} />
        ) : (
          <div className="flex flex-col md:flex-row-reverse gap-8">
            <div className="md:w-1/3 space-y-4">
              <div className="space-y-4 sticky top-24">
                <ItemCollection 
                    items={collection}
                    selection={viewMode === 'single' ? (selectedItemIndex !== null ? [selectedItemIndex] : []) : combinationSelection}
                    onSelectItem={viewMode === 'single' ? handleSelectItem : handleToggleCombinationSelection}
                    onRemoveItem={handleRemoveItem}
                    onAddItem={ (file) => handleImageUpload([file])}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                />

                {viewMode === 'single' && selectedItem && (
                  <div className="space-y-4">
                    <StyleProfileDisplay profile={styleProfile} onClear={handleClearProfile} />
                    <BodyShapeSelector selectedShape={bodyShape} onShapeChange={setBodyShape} />
                    <StyleSelector selectedStyles={selectedStyles} onStylesChange={setSelectedStyles} />
                    <button
                      onClick={() => handleGenerateOutfits(selectedItem.file, selectedStyles)}
                      disabled={isLoading || selectedStyles.length === 0}
                      className="w-full flex items-center justify-between p-6 bg-pink-500 text-white font-semibold rounded-2xl shadow-md hover:bg-pink-600 transition-all duration-300 disabled:bg-pink-300 disabled:cursor-not-allowed transform hover:scale-105"
                    >
                      <span className="text-xl">{isLoading ? t('main.styling') : t('main.generate')}</span>
                      <SparklesIcon className="w-10 h-10" />
                    </button>
                    <button
                        onClick={handleAnalyzeTrends}
                        disabled={isTrendLoading}
                        className="w-full flex items-center justify-between p-6 bg-white text-cyan-600 dark:bg-slate-800 dark:text-cyan-400 font-semibold rounded-2xl shadow-md border-2 border-gray-200 dark:border-slate-700 hover:bg-cyan-50 dark:hover:bg-slate-700 transition-all duration-300 disabled:bg-gray-100 disabled:cursor-not-allowed transform hover:scale-105"
                    >
                        <span className="text-xl">{isTrendLoading ? t('trends.loading') : t('trends.button')}</span>
                        <GlobeIcon className="w-10 h-10" />
                    </button>
                  </div>
                )}

                {viewMode === 'combine' && (
                    <div className="mt-4">
                        <button
                            onClick={handleCombineItems}
                            disabled={isLoading || combinationSelection.length < 2}
                            className="w-full flex items-center justify-between p-6 bg-indigo-300 dark:bg-indigo-400 text-white font-semibold rounded-2xl shadow-lg transition-all duration-300 disabled:bg-indigo-300/50 disabled:cursor-not-allowed transform hover:scale-105 disabled:hover:scale-100 disabled:shadow-md"
                        >
                            <span className="text-xl text-start">{isLoading ? t('main.combining') : t('main.combine')}</span>
                            <PlusMinusIcon className="w-12 h-12 text-white/80" />
                        </button>
                    </div>
                )}

              </div>
            </div>
            
            <div className="md:w-2/3">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 dark:bg-red-900/20 dark:border-red-500/30 dark:text-red-300 px-4 py-3 rounded-lg mb-4" role="alert">
                    <strong className="font-bold">{t('main.error.title')}</strong>
                    <span className="block sm:inline ms-2">{error}</span>
                    </div>
                )}

                {isLoading && viewMode === 'combine' && (
                    <div className="flex flex-col items-center justify-center h-full min-h-[50vh] text-center">
                        <Loader />
                        <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">{loadingMessage || t('main.combining')}</p>
                    </div>
                )}

                {isLoading && viewMode === 'single' && (
                    <div className="space-y-8">
                        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">{t('main.aiSuggestions')}</h2>
                        {selectedStyles.map((_, index) => (
                            <OutfitCardSkeleton key={index} index={index} />
                        ))}
                    </div>
                )}
                
                {!isLoading && (
                    <>
                        {viewMode === 'single' && !selectedItem && (
                            <div className="flex items-center justify-center h-full min-h-[50vh] text-center p-8 bg-white dark:bg-transparent rounded-lg">
                                <p className="text-gray-500 dark:text-gray-400">{t('main.selectItemPrompt')}</p>
                            </div>
                        )}
                        {viewMode === 'combine' && combinationSelection.length < 2 && (
                             <div className="flex items-center justify-center h-full min-h-[50vh] text-center p-8 bg-white dark:bg-transparent rounded-lg">
                                <p className="text-gray-500 dark:text-gray-400">{t('main.combinePrompt')}</p>
                            </div>
                        )}

                        {viewMode === 'single' && outfits.length > 0 && (
                            <div className="space-y-8">
                                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">{t('main.aiSuggestions')}</h2>
                                {outfits.map((outfit, index) => {
                                    if (!outfit) return <OutfitCardSkeleton key={index} index={index} />;
                                    if ('rejectionReason' in outfit) {
                                        return <RejectedStyleCard key={`${selectedItemIndex}-${index}`} title={outfit.title} reason={outfit.rejectionReason} index={index} total={outfits.length} />
                                    } else {
                                        return <OutfitCard 
                                        key={`${selectedItemIndex}-${index}-${outfit.imageUrl}`} 
                                        outfit={outfit} 
                                        onEditImage={(prompt) => handleEditImage(index, prompt)} 
                                        index={index} total={outfits.length} 
                                        rating={ratedOutfits[outfit.imageUrl] || null}
                                        onRate={handleRateOutfit}
                                        onFindNearby={handleFindNearbyStores}
                                        isFindingNearby={isFindingStores && activeSearchAccessory === outfit.keyAccessory}
                                        isSaved={savedOutfits.some(saved => saved.imageUrl === outfit.imageUrl)}
                                        onToggleSave={() => handleToggleSaveOutfit(outfit)}
                                        />
                                    }
                                })}
                            </div>
                        )}

                        {viewMode === 'combine' && combinationResults.length > 0 && (
                            <div className="space-y-8">
                                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">{t('main.combinationSuggestions')}</h2>
                                {combinationResults.map((result, index) => (
                                <CombinationCard key={index} result={result} allItems={collection} />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
          </div>
        )}
      </main>
      <footer className="text-center p-4 mt-8 text-sm text-gray-400 dark:text-gray-500 border-t border-gray-200 dark:border-slate-800">
        <p>{t('footer.poweredBy')}</p>
      </footer>
       <button 
        onClick={() => setIsChatOpen(true)} 
        className="fixed bottom-6 right-6 bg-pink-500 text-white p-4 rounded-full shadow-lg hover:bg-pink-600 transition-transform transform hover:scale-110 z-20"
        aria-label="Open Fashion Chat"
        >
            <ChatBubbleIcon className="w-8 h-8"/>
      </button>

      <Chatbot
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        history={chatHistory}
        onSendMessage={handleSendMessage}
        isLoading={isChatLoading}
        selectedItemImage={viewMode === 'single' && selectedItem ? selectedItem.url : null}
      />
      
      {trendAnalysisResult && (
        <TrendAnalysisModal
            result={trendAnalysisResult}
            onClose={() => setTrendAnalysisResult(null)}
        />
      )}

      {isStoreModalOpen && (
          <StoreLocatorModal
            isOpen={isStoreModalOpen}
            onClose={() => setIsStoreModalOpen(false)}
            stores={storeLocations}
            isLoading={isFindingStores}
            error={storeFinderError}
            accessory={activeSearchAccessory}
            onSearchManualLocation={handleManualLocationSearch}
          />
      )}
    </div>
  );
};

export default App;