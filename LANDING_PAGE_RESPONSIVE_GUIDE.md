# Landing Page Responsive Design Guide

## Breakpoint Overview

### Mobile (< 640px)
```
┌─────────────────────┐
│ ⚙️  🌙  🌐         │ ← Header (compact spacing)
├─────────────────────┤
│                     │
│   ⚪ ⚪ ⚪          │ ← Decorative dots
│   ⚪ ⚪ ⚪          │    (animated, pulsing)
│   ⚪ ⚪ ⚪          │
│                     │
│  I'm Juliana        │ ← Name (responsive sizing)
│                     │
│ Fashion Stylist »»  │ ← Title (responsive sizing)
│                     │
│ Bio text that's     │ ← Bio (readable on mobile)
│ optimized for       │    (proper line length)
│ mobile screens...   │
│                     │
│ [Find Your Style]   │ ← Full-width CTA button
│                     │
│        ↓            │ ← Scroll indicator
│                     │
└─────────────────────┘

Features Section:
┌─────────────────┐
│  Elevate Style  │
│   ___________   │ ← Accent underline
└─────────────────┘

┌─────────────────┐
│  ⭐            │ ← Icon
│ AI Stylist      │
│ Get instant     │ ← Card (stacked, 1 column)
│ outfit...       │
└─────────────────┘

┌─────────────────┐
│  🔀            │
│ Mix & Match     │
│ Create...       │
└─────────────────┘

... (continues)
```

### Tablet (640px - 1024px)
```
┌───────────────────────────────────┐
│  ⚙️  🌙  🌐                       │ ← Header (better spaced)
├───────────────────────────────────┤
│                                   │
│      ⚪ ⚪ ⚪                     │
│      ⚪ ⚪ ⚪                     │
│      ⚪ ⚪ ⚪                     │
│                                   │
│    I'm Juliana                    │ ← Name (larger)
│   Fashion Stylist »»              │ ← Title
│                                   │
│ Bio text with better spacing       │ ← Bio (optimized width)
│ and line height for tablets...    │
│                                   │
│  [Find Your Style]                │ ← Auto-width button
│         ↓                         │
│                                   │
└───────────────────────────────────┘

Features Section:
┌───────────────────────────────────┐
│   Elevate Your Style              │
│   ___________                     │ ← Accent
│  Everything you need...           │
└───────────────────────────────────┘

┌──────────────────┐  ┌──────────────────┐
│  ⭐            │  │  🔀            │
│ AI Stylist      │  │ Mix & Match     │
│ Get instant...  │  │ Create...       │
└──────────────────┘  └──────────────────┘

┌──────────────────┐  ┌──────────────────┐
│  🌍            │  │  💬            │
│ Trend Analysis  │  │ Expert Advice   │
│ Stay ahead...   │  │ Chat with...    │
└──────────────────┘  └──────────────────┘

... (2 columns)
```

### Desktop (> 1024px)
```
┌─────────────────────────────────────────────────────┐
│  ⚙️  🌙  🌐                                         │ ← Fixed header
├─────────────────────────────────────────────────────┤
│                                                     │
│  [BACKGROUND DECORATIVE TEXT]                      │
│                                                     │
│         ⚪ ⚪ ⚪                                    │
│         ⚪ ⚪ ⚪                                    │
│         ⚪ ⚪ ⚪                                    │
│                                                     │
│          I'm Juliana                               │ ← Name (6xl)
│       Fashion Stylist »»                           │ ← Title (2xl)
│                                                     │
│  Bio text with premium spacing                     │ ← Bio (xl)
│  and beautiful typography for                      │    (premium presentation)
│  desktop viewers...                                │
│                                                     │
│      [Find Your Style]                             │ ← Larger button
│              ↓                                     │
│                                                     │
└─────────────────────────────────────────────────────┘

Features Section:
┌─────────────────────────────────────────────────────┐
│           Elevate Your Style                        │
│           _______________                          │ ← Accent underline
│  Everything you need to look your best...          │
└─────────────────────────────────────────────────────┘

┌────────────┐  ┌────────────┐  ┌────────────┐
│  ⭐       │  │  🔀       │  │  🌍       │
│ AI Stylist │  │ Mix Match  │  │ Trends     │
│ Get        │  │ Create     │  │ Stay       │
│ instant... │  │ stunning.. │  │ ahead...   │
└────────────┘  └────────────┘  └────────────┘

┌────────────┐  ┌────────────┐  ┌────────────┐
│  💬       │  │  📍       │  │  📤       │
│ Expert     │  │ Shop Local │  │ Digital    │
│ Advice     │  │ Find       │  │ Closet     │
│ Chat with..│  │ nearby...  │  │ Organize.. │
└────────────┘  └────────────┘  └────────────┘

         [Find Your Style] ← Bottom CTA
```

## Responsive Behavior Details

### Typography Scaling
```javascript
// Mobile (< 640px)
Hero Name:      3xl (30px)
Hero Title:     lg (18px)
Hero Bio:       base (16px)
Feature Title:  lg (18px)
Feature Desc:   sm (14px)

// Tablet (640px - 1024px)
Hero Name:      4xl → 5xl (36px → 48px)
Hero Title:     xl → 2xl (20px → 24px)
Hero Bio:       lg (18px)
Feature Title:  lg → xl (18px → 20px)
Feature Desc:   base (16px)

// Desktop (> 1024px)
Hero Name:      6xl (60px)
Hero Title:     2xl (24px)
Hero Bio:       xl (20px)
Feature Title:  xl (20px)
Feature Desc:   base (16px)
```

### Spacing & Padding
```javascript
// Header positioning
Mobile:   top-4 right-4 gap-2
Tablet:   top-6 right-6 gap-3
Desktop:  top-6 right-6 gap-4

// Feature cards
Mobile:   p-6 gap-6
Tablet:   p-8 gap-8
Desktop:  p-8 gap-8

// Section padding
Mobile:   py-16 px-4
Tablet:   py-20 px-6
Desktop:  py-28 px-8
```

### Layout Grid
```javascript
// Features grid
Mobile:   grid-cols-1 (stack)
Tablet:   grid-cols-2 (2 columns)
Desktop:  grid-cols-3 (3 columns)
```

## Color & Theme System

### Light Mode
- Background: Gray-50 → White gradient
- Text: Gray-900 (primary), Gray-600 (secondary)
- Accent: Brand Burgundy (#6b1a3c)
- Cards: White with gray borders

### Dark Mode
- Background: Gray-900 → Gray-800 gradient
- Text: White (primary), Gray-300 (secondary)
- Accent: Brand Burgundy (#6b1a3c)
- Cards: Gray-700/50 with darker borders

## Animation Specifications

### Scroll Indicator
- Animation: Smooth vertical bounce
- Duration: 2s
- Easing: cubic-bezier(0.4, 0, 0.6, 1)

### Feature Cards
- Initial: opacity-0, y: 20
- Target: opacity-1, y: 0
- Delay: index * 0.1s
- Hover: y: -8 (lift effect)
- Duration: 0.5s

### Decorative Dots
- Animation: Pulse with staggered delays
- Each dot: opacity 0.6 + (i % 3) * 0.15
- Delay: i * 0.1s

### Buttons
- Hover: scale(1.05), shadow-2xl
- Active: scale(0.95)
- Motion: Framer Motion with smooth easing

## Accessibility Features

### Keyboard Navigation
- Tab through all interactive elements
- Focus states on buttons and links
- Enter/Space to activate buttons

### Screen Readers
- ARIA labels on all buttons
- Semantic HTML structure
- Alt text for icons

### Color Contrast
- WCAG AA compliant throughout
- 4.5:1 minimum for text
- 3:1 minimum for UI components

### Touch Targets
- Minimum 44px x 44px on mobile
- Proper spacing between interactive elements
- Tap-friendly buttons

## Device-Specific Considerations

### Safe Area Insets
- Supports notched devices (iPhone, Android)
- Proper spacing for top/bottom safe areas
- Header positioned above notch

### Orientation Support
- Portrait: Full height optimization
- Landscape: Proper viewport adjustment
- No horizontal scrolling

### Performance
- GPU-accelerated transforms
- Lazy loading for images
- Optimized animation frame rate
