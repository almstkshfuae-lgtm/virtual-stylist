
import type { Outfit, StyleProfile, TrendAnalysisResult, BodyShape, ChatMessage, Coordinates, StoreLocation, GroundingChunk } from '../types';
import type { CombinationResult } from '../types';

// This client-side service now forwards requests to the server-side proxy
// at `/api/gemini-proxy`. The proxy holds the API key and calls Google GenAI
// using the server SDK. This prevents shipping the API key to the browser.

const callProxy = async (model: string, payload: any) => {
    const res = await fetch('/api/gemini-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, payload }),
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Proxy error: ${res.status} ${text}`);
    }
    return res.json();
};

const languageMap: { [key: string]: string } = {
    en: 'English',
    ar: 'Arabic',
    fr: 'French',
    ru: 'Russian',
    nl: 'Dutch'
};

// Helper to convert File to a base64 string for the API
const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
        if (typeof reader.result === 'string') {
            resolve(reader.result.split(',')[1]);
        }
    };
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

// Generate a simple icon for an accessory
async function generateIconImage(prompt: string): Promise<string> {
    const model = 'gemini-2.5-flash-image';
    const payload = {
      contents: { parts: [{ text: `A simple, minimalist, vector-style icon of ${prompt}, on a pure white background, no shadows, clean lines.` }] }
    };
    const result = await callProxy(model, payload);
    for (const part of result.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
            const base64data = part.inlineData.data;
            const mimeType = part.inlineData.mimeType;
            return `data:${mimeType};base64,${base64data}`;
        }
    }
    throw new Error("Icon generation failed, no image part found in response.");
}

// 1. Generate outfit descriptions and image prompts for a SINGLE item
async function getOutfitPrompts(imagePart: { inlineData: { data: string; mimeType: string; } }, styles: string[], language: string, styleProfile?: StyleProfile, bodyShape?: BodyShape) {
  const model = "gemini-3-flash-preview";
  const targetLanguage = languageMap[language] || 'English';
  const numStyles = styles.length;
  const outfitText = numStyles === 1 ? 'outfit suggestion' : 'distinct outfit suggestions';

  const userPreferencePrompt = (styleProfile && (styleProfile.liked.length > 0 || styleProfile.disliked.length > 0))
    ? `
**User's Personal Style Profile:**
- They tend to **LIKE** styles described with keywords like: [${styleProfile.liked.slice(0, 15).join(', ')}]. Prioritize these elements.
- They tend to **DISLIKE** styles described with keywords like: [${styleProfile.disliked.slice(0, 15).join(', ')}]. Avoid these elements.
Use this profile to heavily influence your creations, making them more personalized.`
    : '';

  const bodyShapePrompt = bodyShape ? `
**User's Body Shape:**
The user has identified their body shape as **'${bodyShape}'**. Please tailor your suggestions to be flattering for this shape. For each valid outfit, you **MUST** add a 'bodyShapeTip' (in ${targetLanguage}) explaining in one concise sentence why this outfit works well for the specified body shape.` : '';


  const prompt = `You are a world-class, honest, and creative fashion consultant. Your response MUST be in ${targetLanguage} for the specified fields.
${userPreferencePrompt}
${bodyShapePrompt}
Deeply analyze the clothing item in the image. Based on this analysis, create ${numStyles} ${outfitText}, one for each of these styles: '${styles.join("', '")}'.

**CRITICAL RULE: Honesty is your top priority.** If a requested style is fundamentally incompatible with the item (e.g., styling a formal ball gown as 'Streetwear'), you **MUST** reject it. For a rejected style, return an object with \`"isUnsuitable": true\` and a \`"rejectionReason"\` (in ${targetLanguage}) explaining concisely why it's a bad fashion match. In this case, other fields should be empty strings.

For each **valid** outfit, provide:
1.  A 'title' (in English) from the requested styles: '${styles.join("', '")}'.
2.  A 'description' (in ${targetLanguage}) with a sophisticated explanation of **why** the outfit works, referencing fashion principles (color theory, texture, silhouette).
3.  An 'imagePrompt' (in English) for a clean, top-down 'flat-lay' photograph on a neutral light grey background.
4.  A 'keyAccessory' string (in ${targetLanguage}) for a crucial accessory.
5.  An 'iconPrompt' string (in English), a simple phrase for the key accessory.
6.  A 'keywords' array of 3-5 descriptive English keywords about the outfit's style (e.g., "minimalist", "structured", "neutral tones"). This is crucial for personalization.
${bodyShape ? "7. A 'bodyShapeTip' field as described in the User's Body Shape section." : ""}

Format the output as a JSON array of objects.`;
  
    const payload = {
        contents: { parts: [imagePart, { text: prompt }] },
        config: { responseMimeType: 'application/json' }
    };
    const result = await callProxy(model, payload);
    
    // Extract text from response - handle different response structures
    const responseText = result.text || 
                        result.candidates?.[0]?.content?.parts?.[0]?.text ||
                        (typeof result === 'string' ? result : null);
    
  if (!responseText) {
      console.error('Response structure:', JSON.stringify(result).substring(0, 200));
      throw new Error("Failed to generate outfit descriptions.");
  }
  return JSON.parse(responseText.trim());
}

// 2. Generate a flat-lay image based on a prompt and the original item
async function generateFlatLayImage(imagePart: { inlineData: { data: string; mimeType: string; } }, prompt: string): Promise<string> {
    const model = 'gemini-2.5-flash-image';
    const payload = { contents: { parts: [imagePart, { text: prompt }] } };
    const result = await callProxy(model, payload);
    for (const part of result.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
            const base64data = part.inlineData.data;
            const mimeType = part.inlineData.mimeType;
            return `data:${mimeType};base64,${base64data}`;
        }
    }
    throw new Error("Image generation failed, no image part found in response.");
}

export const generateOutfits = async (file: File, styles: string[], language: string, styleProfile?: StyleProfile, bodyShape?: BodyShape): Promise<Outfit[]> => {
    const imagePart = await fileToGenerativePart(file);
    
    const outfitPrompts: (any)[] = await getOutfitPrompts(imagePart, styles, language, styleProfile, bodyShape);
    
    const validPrompts = outfitPrompts.filter(p => !p.isUnsuitable);

    const imageGenerationPromises = validPrompts.map((p: { imagePrompt: string }) => 
        generateFlatLayImage(imagePart, p.imagePrompt)
    );
    const iconGenerationPromises = validPrompts.map((p: { iconPrompt: string }) => 
        generateIconImage(p.iconPrompt)
    );

    const [generatedImageUrls, generatedIconUrls] = await Promise.all([
      Promise.all(imageGenerationPromises),
      Promise.all(iconGenerationPromises)
    ]);
    
    let validCounter = 0;
    return outfitPrompts.map((prompt): Outfit => {
        if (prompt.isUnsuitable) {
            return {
                title: prompt.title,
                isUnsuitable: true,
                rejectionReason: prompt.rejectionReason,
            };
        }
        
        const result = {
            title: prompt.title,
            description: prompt.description,
            keyAccessory: prompt.keyAccessory,
            keywords: prompt.keywords || [],
            imageUrl: generatedImageUrls[validCounter],
            iconUrl: generatedIconUrls[validCounter],
            isUnsuitable: false as const,
            bodyShapeTip: prompt.bodyShapeTip,
        };
        validCounter++;
        return result;
    });
};


export const combineItems = async (files: File[], language: string): Promise<CombinationResult[]> => {
    const model = "gemini-3-flash-preview";
    const imageParts = await Promise.all(files.map(fileToGenerativePart));
    const targetLanguage = languageMap[language] || 'English';

    const prompt = `You are a world-class, honest, and critical fashion consultant. Your response MUST be in ${targetLanguage} for the specified fields.

Your task is to analyze this collection of clothing items and identify all possible **genuinely stylish and coherent outfits**. Be highly selective. Do not suggest combinations that are mediocre, clash in style, or have poor color harmony. It is better to return fewer, high-quality outfits than many questionable ones. If no truly great combinations exist, return an empty array.

For your analysis, consider:
- **Color Harmony:** Do the colors complement each other? Avoid clashing palettes.
- **Style Cohesion:** Do the items belong to a similar style family (e.g., don't mix formal wear with streetwear unless it's a deliberate, high-fashion choice)?
- **Proportion & Balance:** How do the silhouettes of the items work together?
- **Completeness:** An outfit should typically have a top and bottom, or be a single piece like a dress.

For each valid, high-quality combination you find, provide:
1. A 'title' (in ${targetLanguage}) for the outfit (e.g., in French "Look décontracté du week-end", in Arabic "إطلالة نهاية الأسبوع الكاجوال").
2. A 'description' (in ${targetLanguage}) that provides a sophisticated explanation of **why** the combination works, referencing fashion principles.
3. An 'itemIndices' array containing the zero-based indexes of the items from the input collection that make up this outfit.
4. A 'keyAccessory' string (in ${targetLanguage}) describing one important accessory that would complete this look.
5. An 'iconPrompt' string (in English), a simple phrase for the accessory to generate an icon (e.g., "black boots").

Format the output as a JSON array of objects. The values for 'title', 'description' and 'keyAccessory' MUST be in ${targetLanguage}. The value for 'iconPrompt' MUST be in English.`;

    const payload = { contents: { parts: [...imageParts, { text: prompt }] }, config: { responseMimeType: 'application/json' } };
    const result = await callProxy(model, payload);

    const responseText = result.text || 
                        result.candidates?.[0]?.content?.parts?.[0]?.text ||
                        (typeof result === 'string' ? result : null);
    if (!responseText) {
        throw new Error("Failed to generate outfit combinations.");
    }
    
    const combinationPrompts = JSON.parse(responseText.trim());

    if (combinationPrompts.length === 0) return [];
    
    const iconGenerationPromises = combinationPrompts.map((p: { iconPrompt: string }) => 
        generateIconImage(p.iconPrompt)
    );
    const generatedIconUrls = await Promise.all(iconGenerationPromises);

    return combinationPrompts.map((p: any, index: number) => ({
        title: p.title,
        description: p.description,
        itemIndices: p.itemIndices,
        keyAccessory: p.keyAccessory,
        iconUrl: generatedIconUrls[index]
    }));
};


export const editImage = async (base64ImageUrl: string, uploadedItem: File, editPrompt: string): Promise<string> => {
    const model = 'gemini-2.5-flash-image';
    
    const uploadedItemPart = await fileToGenerativePart(uploadedItem);

    // Convert the base64 URL of the outfit image back to an API-compatible part
    const [header, data] = base64ImageUrl.split(',');
    const mimeType = header.match(/:(.*?);/)?.[1] || 'image/png';
    const outfitImagePart = { inlineData: { data, mimeType } };

    const promptText = `Your task is to edit the main outfit image based on the following instruction: "${editPrompt}". It is crucial that you maintain the integrity and style of the original clothing item provided. Apply the edit to the complete outfit image.`;

    const result = await ai.models.generateContent({
        model,
        contents: { parts: [outfitImagePart, uploadedItemPart, { text: promptText }] }
    });

    if (result.candidates && result.candidates.length > 0 && result.candidates[0].content.parts) {
        for (const part of result.candidates[0].content.parts) {
            if (part.inlineData) {
                const newBase64data = part.inlineData.data;
                const newMimeType = part.inlineData.mimeType;
                return `data:${newMimeType};base64,${newBase64data}`;
            }
        }
    }

    if (result.promptFeedback?.blockReason) {
        const reason = result.promptFeedback.blockReason.toLowerCase().replace(/_/g, ' ');
        throw new Error(`Edit failed due to: ${reason}. Please revise your prompt.`);
    }

    throw new Error("Image editing failed, no image part found in response.");
};


export const analyzeTrends = async (file: File, language: string): Promise<TrendAnalysisResult> => {
    const imagePart = await fileToGenerativePart(file);
    const model = "gemini-3-flash-preview";
    const targetLanguage = languageMap[language] || 'English';

    const prompt = `Based on the clothing item in the image, use Google Search to find and summarize the top 3-4 current fashion trends related to it. For each trend, briefly explain what it is and how this item fits into it. The response must be in ${targetLanguage}. Format the response using markdown.`;

    const result = await ai.models.generateContent({
        model,
        contents: { parts: [imagePart, { text: prompt }] },
        config: {
            tools: [{ googleSearch: {} }],
        },
    });
    
    const text = result.text || 
                result.candidates?.[0]?.content?.parts?.[0]?.text ||
                (typeof result === 'string' ? result : null);
    const groundingChunks = result.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    if (!text) {
        throw new Error("Failed to analyze trends.");
    }

    return {
        text,
        sources: groundingChunks,
    };
};

export const sendMessageToChat = async (history: ChatMessage[], language: string, itemFile?: File): Promise<string> => {
    const targetLanguage = languageMap[language] || 'English';
    const model = 'gemini-3-pro-preview';
    
    const systemInstruction = `You are a friendly, enthusiastic, and expert fashion advisor. Your goal is to provide helpful, stylish, and encouraging advice. Converse with the user in ${targetLanguage}. Keep your responses concise and easy to read. Use markdown for formatting like lists or bold text when it improves readability.`;

    const contents: Content[] = [];

    // Add history
    for (const message of history) {
        contents.push({ role: message.role, parts: [{ text: message.text }] });
    }
    
    // Add the image to the last user message if it exists
    if (itemFile) {
        const imagePart = await fileToGenerativePart(itemFile);
        const lastUserMessage = contents.slice().reverse().find(c => c.role === 'user');
        if (lastUserMessage) {
            // This is a bit of a hack since SDK doesn't directly support adding parts.
            // We find the last user message and prepend the image.
            const userParts = lastUserMessage.parts;
            // Prepend the image part and a context text
            lastUserMessage.parts = [imagePart, {text: "Refer to this image for context in your answer."}, ...userParts];
        }
    }
    
    const result = await ai.models.generateContent({
        model,
        contents,
        config: {
            systemInstruction
        }
    });

    const responseText = result.text || 
                        result.candidates?.[0]?.content?.parts?.[0]?.text ||
                        (typeof result === 'string' ? result : null);
    if (!responseText) {
        throw new Error("Received an empty response from the chat API.");
    }
    return responseText;
};

export const findNearbyStores = async (accessory: string, location: Coordinates | string, language: string): Promise<StoreLocation[]> => {
    if (!location) {
        throw new Error("Location not available.");
    }

    const model = "gemini-2.5-flash";
    const targetLanguage = languageMap[language] || 'English';

    let prompt = "";
    let requestConfig: any = {
        tools: [{ googleMaps: {} }]
    };

    if (typeof location === 'string') {
        prompt = `As a personal stylist assistant, please find 3-5 top-rated fashion retailers, clothing boutiques, or shoe stores in or near "${location}" that are likely to sell "${accessory}". Prioritize physical stores with high ratings. The response should rely on Google Maps data.`;
    } else {
        prompt = `As a personal stylist assistant, please find 3-5 top-rated fashion retailers, clothing boutiques, or shoe stores near the user's current location that are likely to sell "${accessory}". Prioritize physical stores with high ratings. The response should rely on Google Maps data.`;
        requestConfig.toolConfig = {
            retrievalConfig: {
                latLng: {
                    latitude: location.latitude,
                    longitude: location.longitude,
                },
            },
        };
    }

    const result = await ai.models.generateContent({
        model,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: requestConfig,
    });

    const groundingChunks = result.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    const stores: StoreLocation[] = groundingChunks
        .map((chunk: GroundingChunk) => chunk.maps)
        .filter((maps): maps is { uri: string; title: string } => !!(maps && maps.uri && maps.title))
        .map(maps => ({ title: maps.title, uri: maps.uri }));

    if (stores.length === 0) {
        const fallbackText = result.text;
        if(fallbackText && fallbackText.length > 0) {
             const queryLocation = typeof location === 'string' ? location : '';
             // If no structured map data, return a generic Google Maps search link as fallback
             return [{ title: "Search on Google Maps", uri: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`clothing stores selling ${accessory} ${queryLocation}`)}` }]
        }
    }
    
    // Remove duplicate stores based on title
    const uniqueStores = Array.from(new Map(stores.map(store => [store.title, store])).values());

    return uniqueStores;
};
