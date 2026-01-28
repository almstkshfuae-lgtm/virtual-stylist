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

/**
 * Hook for loyalty/referral program.
 * Keeps program settings editable from Convex and points ledger transparent to UI.
 */
export function useLoyalty(userId: string | null) {
  // Type guard: codegen may not be regenerated yet in local envs (WSL1).
  const loyaltyApi = (api as any).loyalty;
  if (!loyaltyApi) {
    return {
      account: null,
      settings: null,
      ledger: [],
      ensureCustomer: async () => {
        throw new Error("Convex codegen missing loyalty api. Run `npx convex dev`.");
      },
      issueMonthly: async () => {
        throw new Error("Convex codegen missing loyalty api. Run `npx convex dev`.");
      },
      spendPoints: async () => {
        throw new Error("Convex codegen missing loyalty api. Run `npx convex dev`.");
      },
      adjustPoints: async () => {
        throw new Error("Convex codegen missing loyalty api. Run `npx convex dev`.");
      },
    };
  }
  const data = useQuery(
    loyaltyApi?.getCustomer,
    userId ? { userId } : "skip"
  );
  const ensureCustomer = useMutation(loyaltyApi?.getOrCreateCustomer);
  const issueMonthly = useMutation(loyaltyApi?.issueMonthlyPoints);
  const spendPoints = useMutation(loyaltyApi?.spendPoints);
  const adjustPoints = useMutation(loyaltyApi?.adjustPoints);
  const getLedger = useQuery(
    loyaltyApi?.getLedger,
    userId ? { userId, limit: 50 } : "skip"
  );

  return {
    account: data?.account ?? null,
    settings: data?.settings ?? null,
    ledger: getLedger || [],
    ensureCustomer,
    issueMonthly,
    spendPoints,
    adjustPoints,
  };
}
