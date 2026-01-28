# Convex Quick Reference

## Running Convex Locally

```bash
# View dashboard
npx convex dashboard

# Check status
npx convex info

# Deploy to cloud
npx convex login
npx convex deploy
```

## Using Convex in Components

### Import Hooks
```typescript
import { useOutfits, useStyleProfile, useCombinations, useChatHistory, useBookmarkedStores } from '../hooks/useConvex';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';
```

### Save an Outfit
```typescript
const { saveOutfit } = useOutfits(userId);

await saveOutfit({
  userId: "user123",
  title: "Casual Summer Look",
  description: "Light and comfortable outfit",
  style: "Casual",
  imageUrl: "data:image/...",
  keywords: ["summer", "casual", "light"],
  bodyShapeTip: "Great for pear shapes"
});
```

### Get User's Outfits
```typescript
const { outfits } = useOutfits(userId);
// outfits is an array of outfit objects
```

### Favorite an Outfit
```typescript
const { toggleFavorite } = useOutfits(userId);
await toggleFavorite({ outfitId });
```

### Save Style Profile
```typescript
const { updateStyleProfile } = useStyleProfile(userId);

await updateStyleProfile({
  userId: "user123",
  liked: ["minimalist", "neutral", "elegant"],
  disliked: ["bright", "flashy"],
  preferredBodyShape: "pear"
});
```

### Save Chat Message
```typescript
const { addMessage } = useChatHistory(userId);

await addMessage({
  userId: "user123",
  role: "user",
  content: "What colors suit me?"
});

await addMessage({
  userId: "user123",
  role: "assistant",
  content: "Based on your skin tone, earthy tones work well..."
});
```

### Bookmark a Store
```typescript
const { bookmarkStore } = useBookmarkedStores(userId);

await bookmarkStore({
  userId: "user123",
  name: "Fashion District",
  address: "123 Main St",
  latitude: 40.7580,
  longitude: -73.9855,
  distance: 2.5,
  rating: 4.5
});
```

## Database Tables Reference

### Users
```typescript
{
  _id: Id<"users">,
  clerkId: string,
  email?: string,
  name?: string,
  profileImage?: string,
  createdAt: number,
  updatedAt: number
}
```

### Outfits
```typescript
{
  _id: Id<"outfits">,
  userId: string,
  title: string,
  description: string,
  style: string,
  imageUrl: string,
  keywords: string[],
  bodyShapeTip?: string,
  rating?: number,      // 0-5
  favorited: boolean,
  createdAt: number,
  updatedAt: number
}
```

### Style Profiles
```typescript
{
  _id: Id<"styleProfiles">,
  userId: string,
  liked: string[],
  disliked: string[],
  preferredBodyShape?: string,
  updatedAt: number
}
```

### Chat Messages
```typescript
{
  _id: Id<"chatMessages">,
  userId: string,
  role: "user" | "assistant",
  content: string,
  createdAt: number
}
```

### Bookmarked Stores
```typescript
{
  _id: Id<"bookmarkedStores">,
  userId: string,
  name: string,
  address: string,
  phone?: string,
  website?: string,
  latitude: number,
  longitude: number,
  distance: number,
  rating?: number,
  createdAt: number
}
```

## Useful Queries

### Get Favorited Outfits Only
```typescript
const { useQuery } = require('convex/react');
const { api } = require('../convex/_generated/api');

const favorites = useQuery(api.outfits.getFavoritedOutfits, { userId });
```

### Add Multiple Outfits to Combination
```typescript
const { saveCombination } = useCombinations(userId);

await saveCombination({
  userId: "user123",
  outfitIds: [id1, id2, id3],
  title: "Beach Vacation Pack",
  description: "Three outfits for tropical getaway"
});
```

## Deployment Checklist

- [ ] `npm install` to get latest packages
- [ ] Test locally with `npx convex dev`
- [ ] View data with `npx convex dashboard`
- [ ] Run `npx convex login` to create account
- [ ] Run `npx convex deploy` to deploy backend
- [ ] Add `VITE_CONVEX_URL` to Vercel env vars
- [ ] Push code to GitHub
- [ ] Vercel auto-deploys via CI/CD

## Troubleshooting

**"Module not found: convex/react"**
```bash
npm install convex @tanstack/react-query
```

**"VITE_CONVEX_URL is undefined"**
- Run `npx convex dev` to generate `.env.local`
- Check that `.env.local` has `VITE_CONVEX_URL=...`

**Database queries returning empty**
- Check Convex dashboard: `npx convex dashboard`
- Verify userId is correct
- Check table indexes match your queries

**Vercel says "Cannot find module convex"**
- Add to `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "installCommand": "npm install"
}
```

---

See [CONVEX_SETUP.md](CONVEX_SETUP.md) for complete documentation.
