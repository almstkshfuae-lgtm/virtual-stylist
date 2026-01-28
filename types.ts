
export interface ValidOutfit {
  title: string;
  description: string;
  imageUrl: string;
  keyAccessory: string;
  iconUrl: string;
  keywords: string[];
  isUnsuitable?: false | undefined;
  bodyShapeTip?: string;
}

export interface RejectedOutfitInfo {
  title: string;
  isUnsuitable: true;
  rejectionReason: string;
}

// This is the type that comes from the API and is stored in the main state
export type Outfit = ValidOutfit | RejectedOutfitInfo;


export interface ClothingItem {
  file: File;
  url: string;
}

export interface CombinationResult {
  title: string;
  description: string;
  itemIndices: number[];
  keyAccessory: string;
  iconUrl: string;
}

export interface StyleProfile {
    liked: string[];
    disliked: string[];
}

export interface GroundingChunk {
    web?: {
        uri?: string;
        title?: string;
    };
    maps?: {
        uri?: string;
        title?: string;
    }
}

export interface TrendAnalysisResult {
    text: string;
    sources: GroundingChunk[];
}

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

export type BodyShape = 'apple' | 'pear' | 'hourglass' | 'rectangle' | 'inverted_triangle' | null;

export type Coordinates = {
    latitude: number;
    longitude: number;
} | null;

export interface StoreLocation {
    title: string;
    uri: string;
}
