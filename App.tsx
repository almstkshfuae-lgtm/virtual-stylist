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

// Lazy-load the demo image from the public assets folder.
const DEMO_IMAGE_FILENAME = 'demo-skirt.png';
const DEMO_IMAGE_URL = `${import.meta.env.BASE_URL ?? '/'}demo-skirt.png`;
let demoImagePromise: Promise<File> | null = null;

const fetchDemoImageFile = async (): Promise<File> => {
  const response = await fetch(DEMO_IMAGE_URL);
  if (!response.ok) {
    throw new Error('Failed to load the demo image asset');
  }
  const blob = await response.blob();
  return new File([blob], DEMO_IMAGE_FILENAME, { type: blob.type || 'image/png' });
};

const loadDemoImageFile = (): Promise<File> => {
  if (!demoImagePromise) {
    demoImagePromise = fetchDemoImageFile().catch(error => {
      demoImagePromise = null;
      throw error;
    });
  }
  return demoImagePromise;
};

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
      const demoFile = await loadDemoImageFile();
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
