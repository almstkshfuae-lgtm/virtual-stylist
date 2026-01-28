# Convex Backend Integration Guide

## Overview

Convex has been integrated into your Virtual Stylist AI project to handle:
- **User Profile Management**: Store user preferences and settings
- **Outfit Storage**: Save and manage generated outfits
- **Style Profiles**: Track user's liked/disliked styles
- **Chat History**: Persistent chatbot conversations
- **Bookmarked Stores**: Save favorite shopping locations
- **Outfit Combinations**: Group outfits that work well together

## What's Included

### Backend Functions (`convex/outfits.ts`)

**User Management:**
- `getOrCreateUser()` - Create or retrieve user profile
- `getStyleProfile()` - Get user's style preferences
- `updateStyleProfile()` - Update liked/disliked keywords

**Outfit Management:**
- `saveOutfit()` - Save generated outfit
- `getUserOutfits()` - Retrieve all user's outfits
- `getFavoritedOutfits()` - Get favorited outfits only
- `toggleFavorite()` - Mark/unmark as favorite
- `rateOutfit()` - Rate outfit 0-5 stars
- `deleteOutfit()` - Remove outfit

**Combinations:**
- `saveCombination()` - Group multiple outfits
- `getUserCombinations()` - Retrieve user's combinations

**Chat & Stores:**
- `addChatMessage()` - Save chat message
- `getChatHistory()` - Retrieve conversation history
- `bookmarkStore()` - Save store location
- `getBookmarkedStores()` - Get bookmarked stores

### Database Schema (`convex/schema.ts`)

Tables created:
- `users` - User profiles
- `outfits` - Saved outfits with metadata
- `styleProfiles` - User style preferences
- `combinations` - Outfit groupings
- `trends` - Cached trend analysis
- `bookmarkedStores` - Saved store locations
- `chatMessages` - Chat history

### React Hooks (`hooks/useConvex.ts`)

Convenient hooks for components:

```typescript
import { 
  useOutfits, 
  useStyleProfile, 
  useCombinations, 
  useChatHistory, 
  useBookmarkedStores 
} from '../hooks/useConvex';

// In your component:
const { outfits, saveOutfit, toggleFavorite } = useOutfits(userId);
```

## Local Development

Convex is already running locally. The app uses a local deployment at `http://127.0.0.1:3210`.

Environment variables added to `.env.local`:
```
CONVEX_DEPLOYMENT=...
VITE_CONVEX_URL=http://127.0.0.1:3210
```

### View Local Data

Open the Convex dashboard:
```bash
npx convex dashboard
```

This opens your local backend UI where you can:
- View all database tables
- Manually create/edit records
- Monitor function calls
- Check real-time logs

## Integration with Your App

The Convex provider is already wrapped in your app (`index.tsx`):

```typescript
<ConvexProviderWrapper>
  <ThemeProvider>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </ThemeProvider>
</ConvexProviderWrapper>
```

## Example: Saving an Outfit

```typescript
import { useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';

function OutfitCard({ outfit }) {
  const saveOutfit = useMutation(api.outfits.saveOutfit);
  
  const handleSave = async () => {
    await saveOutfit({
      userId: "user123",
      title: outfit.title,
      description: outfit.description,
      style: outfit.style,
      imageUrl: outfit.imageUrl,
      keywords: outfit.keywords,
      bodyShapeTip: outfit.bodyShapeTip
    });
  };
  
  return <button onClick={handleSave}>Save Outfit</button>;
}
```

## Deployment to Production

### Option 1: Deploy Convex Cloud (Recommended)

1. **Create Convex account** (free tier available):
   ```bash
   npx convex login
   ```

2. **Create a production deployment**:
   ```bash
   npx convex deploy
   ```

3. **Add environment variables to Vercel**:
   - Go to Vercel project settings → Environment Variables
   - Add `CONVEX_DEPLOYMENT` (from `npx convex deploy` output)
   - Add `VITE_CONVEX_URL` (provided by Convex)

### Option 2: Keep Local Development

For development/testing, the local Convex deployment is sufficient. In production, you must deploy to Convex Cloud.

## Architecture

```
Frontend (React)
    ↓
Convex Client (React Hooks)
    ↓
Convex Backend (Functions)
    ↓
Convex Database (Tables)
```

## Database Structure

### Users Table
```typescript
{
  clerkId: string,
  email: string,
  name: string,
  profileImage: string,
  createdAt: number,
  updatedAt: number
}
```

### Outfits Table
```typescript
{
  userId: string,
  title: string,
  description: string,
  style: string,
  imageUrl: string,
  keywords: string[],
  bodyShapeTip: string,
  rating: 0-5,
  favorited: boolean,
  createdAt: number,
  updatedAt: number
}
```

### Style Profile Table
```typescript
{
  userId: string,
  liked: string[],           // Keywords they like
  disliked: string[],        // Keywords they dislike
  preferredBodyShape: string,
  updatedAt: number
}
```

## Next Steps

1. **Add Authentication** (Optional):
   - Install Clerk: `npm install @clerk/clerk-react`
   - Wrap app with `<ClerkProvider>`
   - Use `useUser()` to get userId for database operations

2. **Implement UI Components**:
   - Add "Save Outfit" button in OutfitCard
   - Add "View Saved" page to display user's outfits
   - Add "Style Profile Editor" to manage preferences

3. **Connect Features**:
   - Save generated outfits automatically
   - Load user preferences before generating
   - Persist chat history
   - Bookmark stores from results

## Troubleshooting

**Local Convex not connecting?**
```bash
# Restart Convex
npx convex dev
```

**Database table not found?**
```bash
# Regenerate types
npx convex dev --run init
```

**Vercel deployment issues?**
```bash
# Check environment variables are set
npx convex info
```

## Resources

- [Convex Documentation](https://docs.convex.dev)
- [React Hooks Documentation](https://docs.convex.dev/client/react/use-mutation)
- [Database Schema Guide](https://docs.convex.dev/database/schemas)
- [Vercel Integration](https://docs.convex.dev/deployment/vercel)

---

**Status**: ✅ Convex is ready to use in development and can be deployed to production anytime.
