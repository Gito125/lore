# Design & UX
## Lore — Wikipedia as a Social Experience

## 1. UI/UX Philosophy

### Core Aesthetic: Dark Editorial
Inspired by: The Economist app, Instapaper, Matter Reader — but with soul.
**Not:** Twitter UI applied to Wikipedia.  
**Yes:** A premium newspaper from 2030.

### Typography Stack
- Headlines: Playfair Display (authoritative, editorial)
- Body: Source Serif Pro (readable, long-form optimized)
- UI/Meta: Inter (clean system font for chrome)

### Layout Architecture
```
[Mobile]                    [Desktop]
┌─────────────────┐         ┌─────────┬─────────────┬─────────┐
│   Top Nav       │         │  Nav    │   Feed      │Sidebar  │
│─────────────────│         │         │             │Recs     │
│   Article Card  │         │         │Article Cards│         │
│   Article Card  │         │         │             │Topic    │
│   Article Card  │         │         │             │Stats    │
│   ...           │         │         │             │         │
│─────────────────│         └─────────┴─────────────┴─────────┘
│ Bottom Nav      │
└─────────────────┘
```

## 2. Theme System

- Supported themes switchable at runtime, persisted per account.
- Applied via CSS custom properties on `:root` (no JS bundle increase).

| Theme | Vibe | Primary BG | Accent | Text Primary |
|-------|------|------------|--------|--------------|
| **Midnight** (default) | Premium dark | `#0A0A0F` | `#6C63FF` | `#F0F0F5` |
| **Ink** | Print editorial | `#1A1A1A` | `#F5C842` | `#EBEBEB` |
| **Sepia** | Scholar | `#2C2416` | `#C4956A` | `#EDE0C8` |
| **Arctic** | Clean minimal | `#F0F4F8` | `#0057FF` | `#1A1A2E` |
| **Neon** | Cyberpunk | `#080816` | `#00FFB3` | `#E0E0FF` |

## 3. Social Sharing Engine

### Platforms Supported
| Platform | Format | Mechanic |
|----------|--------|----------|
| X / Twitter | Thread | Auto-generate 3–5 tweet thread from article |
| WhatsApp | Link + card | OG image with title, excerpt, category tag |
| Instagram | Story card | Vertical card: quote + article title + branding |
| Web Share API | Native | Mobile native share sheet |

### Share Card Design Example
```
┌─────────────────────────┐
│  LORE                   │
│  ─────────────────────  │
│  [Article Thumbnail]    │
│                         │
│  "The most interesting  │
│   fact from this..."    │
│                         │
│  📚 History • 4 min     │
│  lore.app/a/[id]        │
└─────────────────────────┘
```

## 4. Motion & Animation Philosophy

### Stillness with Intention
Animation in Lore communicates meaning, not decoration. Our mantra is restraint: **Expensive = restrained. Cheap = everything moves constantly.** Every motion should contribute to the premium, dark editorial feel of the platform.

### Motion Stack
- **Framer Motion:** Used for all React component animations (the daily UI fabric).
- **GSAP:** Reserved exclusively for signature cinematic moments (e.g., onboarding, knowledge graph interactions, scroll-driven sequences).
- **CSS Transitions:** Used for simple state changes like theme switches, color changes, and basic hover effects.

### Framer Motion Rules & Snippets
1. **Feed Card Enter:** Fade up + scale from 0.96 → 1, duration 0.3s.
   ```tsx
   <motion.div
     initial={{ opacity: 0, scale: 0.96, y: 20 }}
     animate={{ opacity: 1, scale: 1, y: 0 }}
     transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
   >
     {/* Card Content */}
   </motion.div>
   ```
2. **Article Open:** Shared layout animation using `layoutId`. The card expands to full page without a page jump.
3. **Stagger Children:** 0.06s between items. Never more.
   ```tsx
   <motion.ul
     variants={{
       animate: { transition: { staggerChildren: 0.06 } }
     }}
   >
     {/* List Items */}
   </motion.ul>
   ```
4. **Spring Configs:** Must feel physical, not bouncy. Use stiffness: 300, damping: 30.
   ```tsx
   transition={{ type: "spring", stiffness: 300, damping: 30 }}
   ```
5. **Exit Animations:** Always. Nothing should disappear without intent.
6. **Hover States:** Subtle scale to 1.02, 150ms duration. Never more.
   ```tsx
   <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.15 }}>
   ```

### GSAP Rules & Snippets
1. **Onboarding Hero:** Cinematic text reveal using `SplitText` and `ScrollTrigger`.
   ```javascript
   gsap.from(split.chars, {
     duration: 1,
     y: 50,
     opacity: 0,
     stagger: 0.02,
     ease: "power4.out",
     scrollTrigger: { trigger: ".hero" }
   });
   ```
2. **Knowledge Graph:** Force-directed nodes animated via GSAP ticker.
3. **Share Card:** Timeline-based reveal triggered when the modal opens.
4. **Rule of Thumb:** Never use GSAP where Framer Motion works fine. Keep the bundle light.

### What to NEVER Do
- **NO** bounce easing on serious content.
- **NO** rotation animations (they feel cheap).
- **NO** infinite loops unless it's a loading spinner.
- **NO** animation on text that is actively being read.
- **NO** simultaneous animations competing for the user's attention.

