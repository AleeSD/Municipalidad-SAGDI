---
name: Institutional Document System
colors:
  surface: '#f9f9ff'
  surface-dim: '#d8dae2'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3fb'
  surface-container: '#ecedf6'
  surface-container-high: '#e7e8f0'
  surface-container-highest: '#e1e2ea'
  on-surface: '#191c21'
  on-surface-variant: '#424752'
  inverse-surface: '#2e3037'
  inverse-on-surface: '#eff0f8'
  outline: '#727783'
  outline-variant: '#c2c6d4'
  surface-tint: '#005db6'
  primary: '#00478d'
  on-primary: '#ffffff'
  primary-container: '#005eb8'
  on-primary-container: '#c8daff'
  inverse-primary: '#a9c7ff'
  secondary: '#526069'
  on-secondary: '#ffffff'
  secondary-container: '#d3e2ed'
  on-secondary-container: '#56656e'
  tertiary: '#3f4a42'
  on-tertiary: '#ffffff'
  tertiary-container: '#566259'
  on-tertiary-container: '#d0ddd1'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#a9c7ff'
  on-primary-fixed: '#001b3d'
  on-primary-fixed-variant: '#00468c'
  secondary-fixed: '#d6e5ef'
  secondary-fixed-dim: '#bac9d3'
  on-secondary-fixed: '#0f1d25'
  on-secondary-fixed-variant: '#3b4951'
  tertiary-fixed: '#d9e6da'
  tertiary-fixed-dim: '#bdcabe'
  on-tertiary-fixed: '#131e17'
  on-tertiary-fixed-variant: '#3e4a41'
  background: '#f9f9ff'
  on-background: '#191c21'
  surface-variant: '#e1e2ea'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  code-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  container-max-width: 1440px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The design system is engineered for public administration and high-stakes document management. It projects an image of unwavering reliability, transparency, and institutional authority. The aesthetic is rooted in **Modern Corporate Minimalism**, prioritizing information density without sacrificing clarity. 

The emotional response should be one of "calm efficiency." By utilizing high whitespace and a restrained pastel palette, the system reduces the cognitive load associated with complex bureaucratic processes. Every visual choice is made to reinforce the user's trust in the automated processing and the legal validity of the documents managed within the system. There is an absolute exclusion of decorative elements that do not serve a functional purpose; icons are strictly technical line-drawings, and imagery is replaced by structured data visualization.

## Colors

The palette is anchored by a high-contrast **Institutional Blue** for primary actions and headings to ensure accessibility compliance (WCAG AA/AAA). This is supported by a sophisticated trio of pastel tones: **Celeste (Sky Blue)** for secondary surfaces, **Mint Green** for success states and confirmation workflows, and **Soft Purple** for specific administrative classifications or automated metadata highlights.

The background uses a subtle **Off-White** (#F8F9FA) rather than pure white to reduce eye strain during prolonged document review sessions. Borders and dividers utilize a cool-toned light grey to maintain structure without creating visual noise. Dark mode is intentionally omitted to maintain the "paper-like" institutional feel associated with official records.

## Typography

This design system utilizes **Inter** for all typographic roles. Inter provides a neutral, highly legible character set that excels in data-dense environments. 

Headlines utilize a semi-bold weight (600) to establish a clear hierarchy against body text. Body text is set with generous line-heights to ensure that long-form legal documents remain readable. Label styles are used for metadata, table headers, and form captions, employing a slightly heavier weight and increased letter spacing to distinguish them from interactive content. For automated document strings or reference numbers, a slightly smaller "body-sm" or "code-sm" variant is preferred to maintain a technical, precise appearance.

## Layout & Spacing

The design system follows a **Fixed-Fluid Hybrid Grid**. On desktop, content is constrained to a 1440px max-width container to prevent line lengths from becoming illegible on ultra-wide monitors. The layout utilizes a 12-column system with 24px gutters.

The spacing philosophy is built on a 4px baseline. High whitespace is a functional requirement here; it separates distinct document sections and administrative modules. 
- **Mobile:** 4-column grid with 16px side margins.
- **Tablet:** 8-column grid with 24px side margins.
- **Desktop:** 12-column grid with 40px side margins.

Internal component spacing (padding) should be generous—typically 16px or 20px—to ensure that touch targets are clear and the interface never feels "cramped" or "cluttered," which is a common failure in legacy government software.

## Elevation & Depth

Hierarchy is established primarily through **Tonal Layering** and **Low-Contrast Outlines** rather than dramatic shadows. 

The base canvas is #F8F9FA. Primary containers (like document viewers or data tables) use a pure white (#FFFFFF) background with a very thin (1px) border in a light grey (#E9ECEF). 

Where depth is required to indicate interactivity (such as a modal or a floating action menu), a "Soft Shadow" is used: 
- **Character:** 0px offset, 8px-12px blur, 4% opacity black. 
- **Purpose:** To subtly lift the element from the page without creating a "heavy" or "game-like" appearance. 

Backdrop blurs should be avoided in favor of solid pastel overlays to maintain the serious, institutional tone.

## Shapes

The design system uses a **Soft** shape language. Elements like buttons, input fields, and cards utilize a 0.25rem (4px) corner radius. 

This specific radius is chosen to soften the "industrial" feel of a data-heavy system while maintaining the precision of a grid-based corporate layout. Larger components, such as main content areas or modal containers, may use `rounded-lg` (8px), but the system avoids fully rounded "pill" shapes or sharp 0px corners, as they can appear either too casual or too aggressive for a government context.

## Components

### Buttons
- **Primary:** Solid Institutional Blue with white text. 4px radius. 
- **Secondary:** Solid Celeste (#E3F2FD) with Institutional Blue text. No border.
- **Ghost:** No fill, 1px light grey border. Used for tertiary actions.

### Input Fields
- Background: Pure white. 
- Border: 1px grey, turning Institutional Blue on focus. 
- Labels: Always visible above the field (no floating labels) in "label-md" style.

### Cards
- Used for document previews. 
- Style: White background, 1px grey border, 4px radius. No shadow unless hovered.

### Status Chips
- **Success:** Mint green background with dark green text.
- **Pending:** Celeste background with Institutional Blue text.
- **Alert:** Very soft red/pink background with dark red text.

### Iconography
- Strictly 2px stroke line icons. 
- Geometric and literal (e.g., a simple rectangle for a "document," a magnifying glass for "search"). 
- No fills, no gradients, and absolutely no emojis.

### Lists & Tables
- Zebra-striping using the Off-White background color.
- High row height (48px - 56px) to maintain readability of data.