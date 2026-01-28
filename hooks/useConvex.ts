import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

/**
 * Hook to manage saved outfits
 */
export function useOutfits(userId: string | null) {
  const outfits = useQuery(
    api.outfits.getUserOutfits,
    userId ? { userId } : "skip"
  );
  const saveOutfit = useMutation(api.outfits.saveOutfit);
  const toggleFavorite = useMutation(api.outfits.toggleFavorite);
  const rateOutfit = useMutation(api.outfits.rateOutfit);
  const deleteOutfit = useMutation(api.outfits.deleteOutfit);

  return {
    outfits: outfits || [],
    saveOutfit,
    toggleFavorite,
    rateOutfit,
    deleteOutfit,
  };
}

/**
 * Hook to manage style profile
 */
export function useStyleProfile(userId: string | null) {
  const profile = useQuery(
    api.outfits.getStyleProfile,
    userId ? { userId } : "skip"
  );
  const updateStyleProfile = useMutation(api.outfits.updateStyleProfile);

  return {
    profile,
    updateStyleProfile,
  };
}

/**
 * Hook to manage outfit combinations
 */
export function useCombinations(userId: string | null) {
  const combinations = useQuery(
    api.outfits.getUserCombinations,
    userId ? { userId } : "skip"
  );
  const saveCombination = useMutation(api.outfits.saveCombination);

  return {
    combinations: combinations || [],
    saveCombination,
  };
}

/**
 * Hook to manage chat history
 */
export function useChatHistory(userId: string | null) {
  const messages = useQuery(
    api.outfits.getChatHistory,
    userId ? { userId } : "skip"
  );
  const addMessage = useMutation(api.outfits.addChatMessage);

  return {
    messages: messages || [],
    addMessage,
  };
}

/**
 * Hook to manage bookmarked stores
 */
export function useBookmarkedStores(userId: string | null) {
  const stores = useQuery(
    api.outfits.getBookmarkedStores,
    userId ? { userId } : "skip"
  );
  const bookmarkStore = useMutation(api.outfits.bookmarkStore);

  return {
    stores: stores || [],
    bookmarkStore,
  };
}
