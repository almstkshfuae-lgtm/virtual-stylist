# Phase 2 Migration Guide: Option B - Migrate Features to Root

**Status**: In Progress  
**Option**: B - Migrate Stylist Features to Root  
**Timeline**: 4-6 hours  
**Risk Level**: 🟡 Moderate (requires careful testing)

---

## Migration Strategy

### What We're Keeping from Stylist
1. ✅ `ConvexProviderWithAuthKit.tsx` - WorkOS auth integration pattern
2. ✅ `stylist/convex/auth.config.ts` - WorkOS JWT configuration (as reference)
3. ⏭️ Consider: WorkOS authentication pattern vs. current custom auth

### What We're Keeping in Root
1. ✅ Full production feature set in root `/convex`
2. ✅ Root `convex.json` with production project ID
3. ✅ Current authentication/Convex setup

### What We're Deleting
1. 🗑️ Minimal example functions (`myFunctions.ts`)
2. 🗑️ Simple test schema
3. 🗑️ Entire `/stylist` directory after migration

---

## Step-by-Step Migration

### Phase 1: Document Current State (10 minutes)

Create a backup branch:
```bash
git checkout -b backup/stylist-template
git push origin backup/stylist-template
git checkout main
```

Document what we're doing:
```bash
git log --oneline -5
# Note the current commit for rollback if needed
```

### Phase 2: Copy Useful Components (15 minutes)

#### 2.1 Copy ConvexProviderWithAuthKit
```bash
# This is valuable - shows how to integrate external auth with Convex
cp stylist/src/ConvexProviderWithAuthKit.tsx components/
```

#### 2.2 Copy Error Boundary (if different from root)
```bash
# Check if root has ErrorBoundary
ls components/ErrorBoundary.tsx
# If not present:
# cp stylist/src/ErrorBoundary.tsx components/
```

#### 2.3 Keep Reference Config (don't copy, just document)
```bash
# stylist/convex/auth.config.ts shows WorkOS setup
# Document this for future reference in CONVEX_SETUP.md
```

### Phase 3: Update Convex Backend (20 minutes)

#### 3.1 Keep Root Schema (Already comprehensive)
The root `convex/schema.ts` has all production tables:
- users
- outfits
- styleProfiles
- combinations
- trends
- messages
- loyaltyPoints

No migration needed - stylist schema is minimal test data.

#### 3.2 Keep Root Functions
All production functions are in root:
- `convex/loyalty.ts` - loyalty features
- `convex/insights.ts` - fashion insights
- `convex/messages.ts` - chat
- `convex/outfits.ts` - outfit management
- `convex/http.ts` - HTTP endpoints

Stylist only has dummy `myFunctions.ts` - not needed.

### Phase 4: Update Authentication Strategy (30 minutes)

**Decision Point**: Do we want to integrate WorkOS into the main app?

**Option B1: Keep Current Custom Auth**
- Keep root's current authentication
- Use WorkOS pattern only as reference
- `ConvexProviderWithAuthKit.tsx` stays as documentation

**Option B2: Integrate WorkOS Auth**
- Update root to use WorkOS AuthKit
- Use `ConvexProviderWithAuthKit.tsx` in production
- Add `auth.config.ts` to root Convex
- More complex but more flexible

**Recommendation**: Option B1 (safer, minimal changes)

---

## Detailed Execution Steps

### STEP 1: Backup Current State (5 min)

```bash
# Create backup branch
git checkout -b backup/stylist-template
git push origin backup/stylist-template

# Return to main
git checkout main
```

✅ **Result**: Safe backup created

---

### STEP 2: Copy WorkOS Auth Components (10 min)

```bash
# Copy the WorkOS provider component
cp stylist/src/ConvexProviderWithAuthKit.tsx components/

# Rename for clarity
mv components/ConvexProviderWithAuthKit.tsx components/ConvexProviderWithAuthKit.reference.tsx
```

**Update** `components/ConvexProviderWithAuthKit.reference.tsx`:
```typescript
/**
 * REFERENCE IMPLEMENTATION
 * This demonstrates how to integrate WorkOS AuthKit with Convex.
 * Currently used in: [optional - if we implement it]
 * See: stylist/src/main.tsx for example usage
 */
```

✅ **Result**: WorkOS pattern available for reference/future use

---

### STEP 3: Document Auth Configuration (5 min)

Create a reference file:
```bash
cp stylist/convex/auth.config.ts docs/WORKOS_AUTH_REFERENCE.ts
```

Add comment:
```typescript
/**
 * REFERENCE: WorkOS JWT Configuration for Convex
 * 
 * This file shows how to configure Convex authentication
 * with WorkOS. To use this in production:
 * 
 * 1. Copy contents to convex/auth.config.ts
 * 2. Set WORKOS_CLIENT_ID environment variable
 * 3. Install @workos-inc/authkit-react
 * 4. Use ConvexProviderWithAuthKit in your app
 * 
 * Current implementation: [describe current auth setup]
 */
```

✅ **Result**: Clear documentation for future auth migration

---

### STEP 4: Remove Stylist from TypeScript Config (5 min)

**Check current `tsconfig.json`**:

```bash
cat tsconfig.json | grep -A 5 exclude
```

**Should show** (from Phase 1 fixes):
```json
"exclude": ["node_modules", "dist", "dist-ssr", "build", "vite.config.ts"]
```

✅ **Already done** - no changes needed

---

### STEP 5: Update Root Package.json (5 min)

**Check for any stylist-specific scripts**:

```bash
cat package.json | grep -A 30 scripts
```

**Expected**: No stylist scripts  
**If found**: Remove them

---

### STEP 6: Verify Imports (10 min)

Check that nothing in root imports from stylist:

```bash
# Search for stylist imports
grep -r "from.*stylist" src/ components/ 2>/dev/null || echo "No stylist imports found ✓"
grep -r "import.*stylist" src/ components/ 2>/dev/null || echo "No stylist imports found ✓"
```

**Expected**: No results (clean separation)

---

### STEP 7: Test Build Before Deletion (10 min)

```bash
# Install dependencies
npm install

# Build root app (should succeed)
npm run build

# Check for errors
echo "Build status: $?"
```

**Expected Output**: ✅ Successful build, 0 errors

---

### STEP 8: Delete Stylist Directory (5 min)

```bash
# Delete the stylist directory
rm -rf stylist/

# Verify it's gone
ls stylist 2>&1 && echo "ERROR: stylist still exists" || echo "✓ stylist directory deleted"
```

---

### STEP 9: Final Verification (10 min)

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build

# Run dev server (quick check)
npm run verify:setup
```

**Checklist**:
- [ ] No npm errors
- [ ] No TypeScript errors
- [ ] Build completes successfully
- [ ] No missing modules
- [ ] `verify:setup` passes

---

### STEP 10: Test Full Application (10 min)

```bash
# Start the development environment
npm run dev:all
```

**Manual Testing**:
- [ ] Frontend loads without errors
- [ ] API proxy works
- [ ] Convex queries work
- [ ] No console errors
- [ ] All features responsive

---

### STEP 11: Commit Changes (5 min)

```bash
# Check what we're committing
git status

# Stage everything
git add -A

# Commit with detailed message
git commit -m "refactor(phase-2): consolidate stylist features into root

SUMMARY:
- Copied ConvexProviderWithAuthKit.tsx as reference for WorkOS integration
- Documented WorkOS auth pattern in docs/WORKOS_AUTH_REFERENCE.ts
- Kept all production features from root convex/
- Removed stylist directory (backup available at backup/stylist-template)
- All tests pass, build successful

CHANGES:
- components/ConvexProviderWithAuthKit.reference.tsx (new)
- docs/WORKOS_AUTH_REFERENCE.ts (new)
- Deleted: /stylist directory and all contents

TESTING:
- npm run build ✓
- npm run dev:all ✓
- npm run verify:setup ✓
- No TypeScript errors ✓
- No import errors ✓

This consolidates the codebase into a single project with:
- Single Convex backend (prj_NPJzW1zefr7iqoJAAf6JJfqTctSC)
- All production features maintained
- Reference patterns available for future auth migration
- Cleaner repository structure

Backup branch: backup/stylist-template
If issues arise, revert: git revert HEAD"

# Push changes
git push origin main
```

✅ **Result**: Changes committed and pushed

---

## Validation Checklist

Before completing, verify:

- [ ] Build succeeds: `npm run build`
- [ ] No TypeScript errors: `npm run build` output clean
- [ ] No missing imports: Checked with grep
- [ ] Convex functions work: Project ID unchanged
- [ ] API proxy works: `npm run start:api`
- [ ] Frontend works: `npm run dev`
- [ ] `/stylist` deleted: `ls stylist 2>&1` returns error
- [ ] Backup exists: `git branch | grep backup`
- [ ] Changes committed: `git log` shows commit
- [ ] Changes pushed: `git branch -vv` shows origin/main

---

## Post-Migration Actions

### 1. Update Documentation

Add to `README.md`:
```markdown
## Architecture

This project uses a single Convex backend with all production features.

### Previous Versions
- A WorkOS AuthKit reference implementation was previously in `/stylist`
- This has been consolidated into the root project
- Reference patterns available in `docs/WORKOS_AUTH_REFERENCE.ts` if needed
```

### 2. Update IMPLEMENTATION_CHECKLIST.md

```markdown
## Phase 2: Completed ✅

- [x] Option B selected: Migrate Features to Root
- [x] Copied WorkOS auth reference components
- [x] Documented auth patterns for future use
- [x] Deleted stylist directory
- [x] All tests pass
- [x] Build successful
- [x] Changes committed
```

### 3. Update Team

Create a summary for your team:

```
📢 Phase 2 Migration Complete

What Changed:
- Consolidated stylist template into root project
- Single Convex backend maintained
- WorkOS auth pattern preserved as reference

Files Added:
- components/ConvexProviderWithAuthKit.reference.tsx
- docs/WORKOS_AUTH_REFERENCE.ts

Files Removed:
- /stylist directory (backup: backup/stylist-template)

Testing:
- ✅ Build passes
- ✅ All features work
- ✅ No breaking changes

Next Steps:
- Continue with Phase 3: Architecture Improvements
```

---

## Rollback Plan (If Issues Arise)

If anything goes wrong:

```bash
# See what changed
git log --oneline -5

# Revert the migration
git revert HEAD

# Or restore from backup branch
git reset --hard backup/stylist-template
git push origin main -f  # ⚠️ Only if absolutely necessary
```

---

## Timeline

- ⏱️ Backup: 5 min
- ⏱️ Copy components: 15 min
- ⏱️ Document auth: 10 min
- ⏱️ Update config: 15 min
- ⏱️ Verify imports: 10 min
- ⏱️ Test build: 15 min
- ⏱️ Delete directory: 5 min
- ⏱️ Final tests: 20 min
- ⏱️ Commit & push: 10 min
- ⏱️ Documentation: 20 min

**Total: ~2-3 hours**

---

## Success Criteria

✅ **Phase 2 Completion**: All of the following true

- [ ] Single Convex project active
- [ ] No reference to `/stylist` in code
- [ ] All features working
- [ ] Build succeeds
- [ ] No TypeScript errors
- [ ] Tests pass
- [ ] Changes committed
- [ ] Backup created
- [ ] Team notified

---

## Next Phase

Once complete, move to **Phase 3: Architecture Improvements**:
- Service layer refactoring
- Component organization by feature
- Testing setup
- Monitoring & logging

See `IMPLEMENTATION_CHECKLIST.md` Phase 3 section.

---

**Ready to start? Begin with Step 1: Backup ➡️**
