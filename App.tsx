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
import { LoyaltyPanel } from './components/LoyaltyPanel';
import LoyaltyTestHarness from './components/LoyaltyTestHarness';
import ProfilePage from './components/ProfilePage';
import { useLoyalty, useFashionInsights } from './hooks/useConvex';
import { isConvexEnabled } from './lib/convexConfig';
import { useMemo } from 'react';

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

const LOCAL_CUSTOMER_ID_KEY = 'virtual-stylist-customer-id';

const cryptoRandomInt = (max: number) => {
  const cryptoObj = typeof window !== 'undefined' ? window.crypto : undefined;
  if (!cryptoObj?.getRandomValues) {
    return Math.floor(Math.random() * max);
  }
  const bytes = new Uint32Array(1);
  cryptoObj.getRandomValues(bytes);
  return bytes[0] % max;
};

const getLocalCustomerId = () => {
  if (typeof window === 'undefined') {
    return 'virtual-stylist-visitor';
  }
  const stored = window.localStorage.getItem(LOCAL_CUSTOMER_ID_KEY);
  if (stored) {
    return stored;
  }

  const browserCrypto = window.crypto;
  const randomId =
    typeof browserCrypto?.randomUUID === 'function'
      ? browserCrypto.randomUUID()
      : `visitor-${Date.now()}-${cryptoRandomInt(1_000_000)}`;

  window.localStorage.setItem(LOCAL_CUSTOMER_ID_KEY, randomId);
  return randomId;
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
  const storeCache = React.useRef<Map<string, StoreLocation[]>>(new Map());
  const inFlightStoreKey = React.useRef<string | null>(null);
  const nearMePhrase = useMemo(() => {
    switch (language) {
      case 'ar':
        return 'بالقرب مني';
      case 'fr':
        return 'près de moi';
      case 'ru':
        return 'рядом со мной';
      case 'nl':
        return 'bij mij in de buurt';
      default:
        return 'near me';
    }
  }, [language]);

  const [selectedStyles, setSelectedStyles] = useState<string[]>(['Casual', 'Business', 'Night Out']);

  const loyaltySectionRef = React.useRef<HTMLDivElement | null>(null);

  const scrollToLoyalty = useCallback(() => {
    loyaltySectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const [savedOutfits, setSavedOutfits] = useState<ValidOutfit[]>([]);
  const [customerId, setCustomerId] = useState<string>(() => getLocalCustomerId());
  const isProfileRoute =
    typeof window !== 'undefined' &&
    (window.location.pathname === '/profile' || window.location.pathname === '/profile/');
  const {
    account: loyaltyAccount,
    ensureCustomer,
    spendPoints,
    loginWithEmail,
  } = useLoyalty(customerId);
  const { logInsight } = useFashionInsights(customerId);
  const [isBlocked, setIsBlocked] = useState(false);
  const [paywallMessage, setPaywallMessage] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);


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

  // Ensure loyalty account exists to track balance for paywall.
  useEffect(() => {
    if (!isConvexEnabled || !customerId || !ensureCustomer) return;
    ensureCustomer({ userId: customerId }).catch(() => {
      /* ignore */ 
    });
  }, [customerId, ensureCustomer]);

  const requireCredit = useCallback(
    async (pointsNeeded = 1) => {
      if (!isConvexEnabled) return true;
      const balance = loyaltyAccount?.pointsBalance ?? 0;
      if (balance < pointsNeeded) {
        setIsBlocked(true);
        setPaywallMessage(t('paywall.insufficient'));
        return false;
      }
      if (spendPoints) {
        try {
          await spendPoints({
            userId: customerId,
            amount: pointsNeeded,
            description: 'Gemini usage',
          });
        } catch (error) {
          console.error('Failed to spend points', error);
          setIsBlocked(true);
          setPaywallMessage(t('paywall.spendFailed'));
          return false;
        }
      }
      return true;
    },
    [customerId, loyaltyAccount?.pointsBalance, spendPoints]
  );

  const handleRestoreAccount = async (email: string, name?: string, referralCode?: string) => {
    if (!isConvexEnabled) {
      setError('Account login requires a configured Convex backend (set VITE_CONVEX_URL).');
      return;
    }
    if (!loginWithEmail || !email.trim()) return;
    setIsAuthLoading(true);
    try {
      const result = await loginWithEmail({
        email: email.trim(),
        name: name?.trim() || undefined,
        referredByCode: referralCode?.trim() || undefined,
      });
      const newUserId = result?.account?.userId;
      if (newUserId) {
        setCustomerId(newUserId);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(LOCAL_CUSTOMER_ID_KEY, newUserId);
        }
      }
    } catch (error) {
      console.error('Auth login failed', error);
      setError(t('auth.loginFailedEmail'));
    } finally {
      setIsAuthLoading(false);
    }
  };

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
        setLoadingMessage(messages[cryptoRandomInt(messages.length)]);
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
    if (!(await requireCredit(1))) {
      return;
    }
    setOutfits([]); // Clear old outfits immediately
    setIsLoading(true);
    setError(null);
    setRatedOutfits({});
    try {
      const generated = await generateOutfits(itemFile, styles, language, styleProfile, bodyShape);
      setOutfits(generated);

      // Log anonymized fashion insights for developer/brand analytics.
      const keywords = generated
        .filter((o): o is ValidOutfit => o !== null && !(o as any).rejectionReason)
        .flatMap((o) => o.keywords || [])
        .slice(0, 25);
      if (logInsight) {
        logInsight({
          userId: customerId,
          sessionId: undefined,
          styles,
          keywords,
          language,
          bodyShape: bodyShape || undefined,
        }).catch((err: any) => console.debug('logInsight skipped', err));
      }
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
    if (!(await requireCredit(1))) {
      return;
    }

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
    if (!(await requireCredit(1))) {
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
    if (!(await requireCredit(1))) {
      throw new Error('لا يوجد رصيد نقاط كافٍ. اشترك للاستمرار.');
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
    if (!(await requireCredit(1))) {
      return;
    }
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
          const cacheKey = `${activeSearchAccessory}::${location}`;
          if (storeCache.current.has(cacheKey)) {
            setStoreLocations(storeCache.current.get(cacheKey) || []);
          } else {
            const stores = await findNearbyStores(activeSearchAccessory, location, language);
            storeCache.current.set(cacheKey, stores);
            setStoreLocations(stores);
          }
      } catch (e) {
          console.error(e);
          setStoreFinderError(t('storeLocator.error'));
      } finally {
          setIsFindingStores(false);
      }
  };

  const handleFindNearbyStores = useCallback(async (accessory: string) => {
      const search = async (coords: Coordinates) => {
          const key = `${accessory}::${coords.latitude.toFixed(3)},${coords.longitude.toFixed(3)}`;
          if (storeCache.current.has(key)) {
            setStoreLocations(storeCache.current.get(key) || []);
            setActiveSearchAccessory(accessory);
            setIsStoreModalOpen(true);
            return;
          }

          if (inFlightStoreKey.current === key) {
            setIsStoreModalOpen(true);
            return;
          }

          inFlightStoreKey.current = key;
          setIsFindingStores(true);
          setStoreFinderError(null);
          setStoreLocations([]);
          setActiveSearchAccessory(accessory);
          setIsStoreModalOpen(true);
          try {
              const stores = await findNearbyStores(accessory, coords, language);
              storeCache.current.set(key, stores);
              setStoreLocations(stores);
          } catch (e) {
              console.error(e);
              setStoreFinderError(t('storeLocator.error'));
          } finally {
              setIsFindingStores(false);
              inFlightStoreKey.current = null;
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
              async (error) => {
                  console.error("Geolocation error:", error);
          // Fallback: still provide a generic Google Maps search link so the user sees suggestions.
                  try {
                      const key = `${accessory}::${nearMePhrase}`;
                      if (storeCache.current.has(key)) {
                        setStoreLocations(storeCache.current.get(key) || []);
                      } else {
                        const fallbackStores = await findNearbyStores(accessory, nearMePhrase, language);
                        storeCache.current.set(key, fallbackStores);
                        setStoreLocations(fallbackStores);
                      }
                  } catch (err) {
                      console.error("Fallback store lookup failed:", err);
                      setStoreFinderError(t('storeLocator.error'));
                  } finally {
                      setIsFindingStores(false);
                  }
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
    return (
      <LandingPage
        onGetStarted={() => setHasStarted(true)}
        userId={customerId}
        onRestoreAccount={handleRestoreAccount}
        restoreLoading={isAuthLoading}
        onRegisterAccount={handleRestoreAccount}
      />
    );
  }

  if (isProfileRoute) {
    return <ProfilePage userId={customerId} />;
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
            {isConvexEnabled && (
              <button
                onClick={scrollToLoyalty}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors"
                aria-label="Profile & loyalty"
              >
                <span>{t('landing.header.profile')}</span>
              </button>
            )}
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
    {hasStarted && isConvexEnabled && (
      <div ref={loyaltySectionRef} id="customer-profile-section" className="px-4 md:px-8 lg:px-10 mt-4 space-y-4 scroll-mt-20">
        <LoyaltyPanel userId={customerId} />
        <LoyaltyTestHarness userId={customerId} />
      </div>
    )}
    <footer className="text-center p-4 mt-8 text-sm text-gray-400 dark:text-gray-500 border-t border-gray-200 dark:border-slate-800 space-y-2">
      <p>{t('footer.copyright')}</p>
      <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-gray-500 dark:text-gray-400">
        <span className="gemini3-logo" aria-hidden="true">
          Gemini
          <span className="gemini3-logo-number">3</span>
        </span>
        <span>{t('footer.poweredBy')}</span>
        <a href="/privacy.html" className="underline hover:text-pink-500 dark:hover:text-pink-400">
          Privacy & Cookies
        </a>
      </div>
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

      {isBlocked && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4">
          <div className="max-w-md rounded-3xl bg-white p-6 text-center shadow-2xl dark:bg-slate-900">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">انتهى رصيد النقاط</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              {paywallMessage || 'استهلكت كل رصيدك. اشترك لإكمال الاستخدام.'}
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <button
                className="rounded-full bg-pink-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-pink-700"
              >
                اشترك الآن
              </button>
              <button
                className="text-sm text-gray-500 underline"
                onClick={() => setIsBlocked(false)}
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
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
