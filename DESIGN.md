# Design System Inspired by Linear

## 1. Visual Theme & Atmosphere
Linear's design is defined by extreme precision engineering — a near-black canvas (`#08090a`) where content emerges from darkness. The "Linear look" is defined by sharp corners, subtle gradients, and the iconic purple accent.

## 2. Color Palette & Roles
- **Canvas (Background):** `#08090a` (Pure dark void)
- **Surface (Primary):** `#111214` (Cards and sections)
- **Surface (Secondary):** `#1a1b1e` (Hover states)
- **Accent (Primary):** `#5e6ad2` (Signature purple)
- **Accent (Muted):** `#3b3d54` (Subtle active states)
- **Text (Primary):** `#ffffff` (High contrast headers)
- **Text (Secondary):** `#b1b3b8` (Body text)
- **Text (Tertiary):** `#707277` (Descriptions, metadata)
- **Border (Subtle):** `rgba(255, 255, 255, 0.08)` (Ghost border)
- **Border (Strong):** `rgba(255, 255, 255, 0.15)` (Focus/active)

## 3. Typography
- **Font Stack:** 'Inter', 'Outfit', system-ui, sans-serif.
- **Hierarchy:** High contrast in weights (500 for headers, 400 for body).
- **Tracking:** Tight letter-spacing for headers (-0.02em).

## 4. Components
- **Buttons:** 4px border-radius. Primary uses `#5e6ad2` with a subtle inner shadow.
- **Cards:** Background `#111214`, 1px border `rgba(255,255,255,0.08)`. Radius 8px.
- **Inputs:** Dark background `rgba(0, 0, 0, 0.2)` with focus border `#5e6ad2`.

## 5. Depth
Luminance Elevation: Depth is created by making elements slightly lighter as they rise from the canvas. Level 0 is the canvas, Level 1 is the card, Level 2 is the modal.
