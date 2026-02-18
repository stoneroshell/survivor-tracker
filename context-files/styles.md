# Design System: Bitcoin DeFi Aesthetic

Canonical style reference for the project. This is not generic dark mode—it is a deep cosmic void where data glows with Bitcoin orange and digital gold.

---

## Design Philosophy

- **Luminescent Energy**: Light from interactive elements; Bitcoin orange and gold glows; colored shadows only (no pure black).
- **Mathematical Precision**: 1px borders, monospace for data, grids as structure.
- **Layered Depth**: Glass morphism, colored glow shadows, backdrop blur; digital depth, not physical.
- **Textured Void**: Backgrounds never flat—grid patterns, radial gradient blurs, subtle noise.
- **Trust Through Design**: High contrast, clear hierarchy, technical precision. Vibe: Secure, Technical, Valuable.

---

## Design Tokens

### Colors (Dark Mode Only)

| Token        | Hex       | Name / Usage                                              |
| ------------ | --------- | --------------------------------------------------------- |
| Background   | `#030304` | True Void — base background                               |
| Surface      | `#0F1115` | Dark Matter — cards, panels, elevated surfaces            |
| Foreground   | `#FFFFFF` | Pure Light — primary text                                 |
| Muted        | `#94A3B8` | Stardust — secondary text, descriptions, metadata         |
| Border       | `#1E293B` | Dim Boundary — borders (often white at 10–20% opacity)    |
| Primary      | `#F7931A` | Bitcoin Orange — CTAs, links, active states, trust         |
| Secondary    | `#EA580C` | Burnt Orange — gradients, secondary elements              |
| Tertiary     | `#FFD600` | Digital Gold — gradients with primary, highlights, success |

**Gradient**: `linear-gradient(to right, #EA580C, #F7931A)` or `linear-gradient(to right, #F7931A, #FFD600)` for text/buttons.

### Typography

| Role        | Font           | Weights   | Usage                          | Class         |
| ----------- | -------------- | --------- | ------------------------------- | ------------- |
| Headings    | Space Grotesk  | 400–700   | h1–h6, section/card titles      | `font-heading`|
| Body        | Inter          | 400, 500, 600 | Body copy, descriptions, buttons | `font-body`   |
| Mono/Data   | JetBrains Mono | 400, 500  | Stats, prices, badges, labels   | `font-mono`   |

- Scale: dramatic for display (e.g. `text-4xl` → `md:text-7xl`), comfortable for body (`text-base` / `text-lg`). Mobile-first.
- Headings: `leading-tight`; body: `leading-relaxed`; uppercase mono: `tracking-wider` / `tracking-widest`.

### Radius & Borders

- **Radius**: Cards/containers `rounded-2xl` (16px) or `rounded-xl` (12px); buttons `rounded-full`; inputs `rounded-lg` or bottom-border only; badges/icons `rounded-lg` or `rounded-full`.
- **Borders**: 1px. Default `border border-white/10`; hover `border-[#F7931A]/50`; focus `border-[#F7931A]`. Optional corner accents, gradient borders via pseudo-elements.

### Shadows & Effects

- **Orange glow (primary)**: `0 0 20px -5px rgba(234,88,12,0.5)` or `0 0 30px -5px rgba(247,147,26,0.6)` — buttons, cards on hover, CTAs.
- **Gold glow**: `0 0 20px rgba(255,214,0,0.3)` — highlights, success, value.
- **Card elevation**: `0 0 50px -10px rgba(247,147,26,0.1)` — major sections.
- **Glass**: `backdrop-blur-lg` + `bg-white/5` or `bg-black/40`.
- **Radial blur**: Large soft blobs, low opacity (5–10%), `blur-[120px]` / `blur-[150px]` for ambient glow.
- **Rule**: All shadows orange/gold tinted; no pure black shadows.

### Textures & Patterns

- **Grid pattern**: 50px grid, linear gradients for lines, radial mask for vignette (fade toward edges). Use class `.bg-grid-pattern`.
- Optional: external texture overlays at very low opacity; radial gradient blurs for depth.

---

## Utility Classes

- `.font-heading` — Space Grotesk (set via layout CSS variable).
- `.font-body` — Inter.
- `.font-mono` — JetBrains Mono.
- `.bg-grid-pattern` — 50px grid with radial vignette mask.
- `.animate-float` — 8s ease-in-out float keyframes for hero/orb.

---

## Component Guidelines

### Buttons (all `rounded-full`, min-height 44px, `transition-all`)

- **Primary**: Gradient `from-[#EA580C] to-[#F7931A]`, white bold uppercase `tracking-wider`, orange glow shadow; hover `scale-105` + stronger glow.
- **Outline**: Transparent, `border-2 border-white/20`, white text; hover `border-white` + `bg-white/10`.
- **Ghost**: Transparent, white text; hover `bg-white/10` + `text-[#F7931A]`.
- **Link**: `text-[#F7931A]`, hover underline.

### Cards

- **Standard**: `bg-[#0F1115]`, `border border-white/10`, `rounded-2xl`, `p-8`; hover `-translate-y-1`, `border-[#F7931A]/50`, orange glow; `transition-all duration-300`.
- **Glass**: `bg-black/40` or `bg-white/5`, `backdrop-blur-sm`/`backdrop-blur-lg`, `border border-white/10`.
- **Pricing**: Highlighted tier `scale-105`, `border-[#F7931A]`, elevated shadow; others `opacity-80`, scale on hover.
- **Card hierarchy**: Header `p-8 pb-4`; title `font-heading font-semibold text-2xl`; description `text-[#94A3B8] text-sm`; content/footer `p-8 pt-0`.

### Inputs

- `bg-black/50`, `border-b-2 border-white/20`, `h-12`, `px-4 py-2`, `text-white text-sm`, `placeholder:text-white/30`.
- Focus: `border-[#F7931A]`, glow shadow, `outline-none`. Disabled: `opacity-50 cursor-not-allowed`.

### Icons (e.g. lucide-react)

- Stroke: default 1.5–2px. Colors: `text-[#F7931A]`/`text-[#EA580C]`, `text-[#FFD600]`, `text-[#94A3B8]`, `text-white`.
- Containers: e.g. `bg-[#EA580C]/20 border border-[#EA580C]/50 rounded-lg p-3`; hover add glow.
- Decorative: large, low opacity, `group-hover:opacity-100`.

---

## Bold Choices (Non-Generic)

1. Gradient text on headlines: `bg-gradient-to-r from-[#F7931A] to-[#FFD600] bg-clip-text text-transparent` on final 1–2 words.
2. Spinning orbital rings: `animate-[spin_10s_linear_infinite]` and reverse for inner ring.
3. Corner border accents (e.g. top-left + bottom-right in Bitcoin orange).
4. Pulsing badges: `animate-ping` for live/status.
5. Background icon watermarks: `opacity-20 group-hover:opacity-100`.
6. Timeline as blockchain: vertical gradient line + circular nodes.
7. Asymmetric pricing: one tier `scale-105`, others `opacity-80`.
8. Glass + grid: backdrop blur over grid pattern.
9. Colored shadows only—no black shadows.

---

## Layout & Spacing

- **Container**: `max-w-7xl` (1280px).
- **Sections**: `py-24`; gaps `gap-8` or `gap-12`.
- **Dividers**: No `<hr>`. Use spacing, alternating backgrounds (`#030304` / `#0F1115`), or subtle `border-y` where needed.
- **Grids**: Mobile single column; `md:grid-cols-2` or `md:grid-cols-3`; `lg:grid-cols-4` for features; pricing `md:grid-cols-3`.

---

## Motion

- **Float**: `@keyframes float` (translateY 0 → -20px → 0), 8s ease-in-out infinite.
- **Spin**: `animate-[spin_10s_linear_infinite]`, reverse for inner ring.
- **Bounce/ping**: Staggered delays for cards; `animate-ping` for status.
- **Speed**: 200–300ms for interactions (hover, focus). Cards/buttons: `transition-all duration-300`.
- **Hover**: Cards lift + border + glow; buttons scale + glow; images scale + contrast.

---

## Responsive

- Mobile-first; breakpoints: `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px.
- Typography: hero `text-4xl sm:text-5xl md:text-7xl`; section titles `text-2xl md:text-4xl`; body `text-base md:text-lg`.
- Touch targets: min 44px (`min-h-[44px]`, `h-10`+).
- Keep grid, glows, gradients on mobile; simplify layout (e.g. single column, no scale on pricing on small screens).

---

## Accessibility

- Contrast: White on `#030304` (AAA); orange on dark meets AA for large text.
- Focus: `focus-visible:ring-2 focus-visible:ring-[#F7931A]` on interactive elements.
- Semantic HTML: heading hierarchy (h1→h2→h3), `<nav>`, `<section>`, `<button>`.
- Alt text for images; keyboard navigable (Tab, Enter/Space).
- Consider `prefers-reduced-motion`: disable or reduce float/spin where appropriate.

---

## Implementation

- **Fonts**: Load via Next.js `next/font/google` (Space_Grotesk, Inter, JetBrains_Mono); expose as CSS variables for `.font-heading`, `.font-body`, `.font-mono`.
- **Tokens**: Define in Tailwind v4 `@theme inline` in `src/styles/globals.css` (colors, radius, shadows).
- **Custom classes**: `.font-heading` / `.font-body` / `.font-mono`, `.bg-grid-pattern`, `@keyframes float` + `.animate-float` in globals.
- **Components**: Optional—build Button, Card, Input with `cva` (class-variance-authority) and design-system variants; icons from `lucide-react`.
