# Hasies & Gansies Website Brand Identity Guide

Use this document as the visual and stylistic reference for all website design, UI, copy presentation, graphics, components and future updates for **Hasies & Gansies**.

## 1. Brand Direction

The website must feel:

- Gentle.
- Playful.
- Warm.
- Wholesome.
- Child-friendly.
- Natural.
- Handcrafted.
- Soft and nostalgic.
- Calm rather than bright or overstimulating.
- Inspired by classic children's storybooks and watercolour illustrations.

Avoid making the brand feel:

- Corporate.
- Minimalist in a cold or clinical way.
- Highly saturated.
- Neon.
- Tech-focused.
- Harsh or angular.
- Cartoonish in a modern flat-vector style.

---

## 2. Core Brand Palette

Use the following colours as the main website palette.

| Brand Colour | HEX | RGB | Primary Use |
|---|---|---|---|
| Sage / Olive Green | `#878F60` | 135, 143, 96 | Main brand colour, buttons, headings, icons, navigation accents. |
| Blush Pink | `#F3D2D9` | 243, 210, 217 | Soft backgrounds, feminine accents, cards, highlights. |
| Powder Blue | `#CAD7E8` | 202, 215, 232 | Secondary accents, backgrounds, decorative UI elements. |
| White | `#FFFFFF` | 255, 255, 255 | Main page background and visual breathing space. |
| Soft Charcoal Brown | `#4B463F` | 75, 70, 63 | Main body text instead of pure black. |

### Optional Supporting Neutrals

Use these sparingly where additional depth is needed:

- Warm Cream: `#FAF7F1`.
- Soft Beige: `#EDE4D8`.
- Warm Taupe: `#B9AA98`.
- Light Natural Brown: `#A9876A`.

### Colour Usage Ratio

As a general guide:

- 55% to 65% white or warm cream.
- 15% to 20% sage green.
- 10% to 15% blush pink.
- 5% to 10% powder blue.
- Small amounts of beige, taupe or natural brown.

Do not use large areas of highly saturated colour.

---

## 3. Typography

The brand uses rounded, friendly typography with soft geometry.

### Preferred Font Pairing

**Headings and display text:**  
`Fredoka`

Recommended weights:

- 600 SemiBold.
- 700 Bold.

**Body text and UI text:**  
`Nunito`

Recommended weights:

- 400 Regular.
- 500 Medium.
- 600 SemiBold.

### Acceptable Alternatives

If the preferred fonts are unavailable:

- Baloo 2.
- Quicksand.
- Rounded sans-serif fonts with soft forms.

### Typography Rules

- Use rounded sans-serif fonts only.
- Avoid condensed fonts.
- Avoid sharp geometric display fonts.
- Avoid formal serif fonts for main interface text.
- Use generous line-height.
- Keep headings friendly and substantial rather than thin.
- Use sentence case rather than excessive uppercase.
- Do not use pure black text.

---

## 4. Recommended Website Type Scale

Desktop starting point:

```css
h1 {
  font-family: "Fredoka", sans-serif;
  font-size: clamp(2.75rem, 5vw, 5rem);
  font-weight: 700;
  line-height: 1.0;
}

h2 {
  font-family: "Fredoka", sans-serif;
  font-size: clamp(2rem, 3.5vw, 3.5rem);
  font-weight: 700;
  line-height: 1.1;
}

h3 {
  font-family: "Fredoka", sans-serif;
  font-size: 1.5rem;
  font-weight: 600;
}

body {
  font-family: "Nunito", sans-serif;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.65;
  color: #4B463F;
}
```

---

## 5. Illustration Style

The rabbit and goose in the existing logo define the illustration style for the brand.

All future illustrations should use:

- Watercolour or realistic hand-painted treatment.
- Soft, feathered edges.
- Gentle natural colours.
- Slightly vintage children's-book appearance.
- Warm cream, brown, pink, blue and sage tones.
- Minimal hard outlines.
- Natural shading.
- Soft expressions.
- Simple accessories such as bows, hats or boots where appropriate.
- Plenty of white or light neutral space around the artwork.

Avoid:

- Flat vector cartoon animals.
- Thick black outlines.
- Highly glossy 3D characters.
- Anime or comic-book styling.
- Highly saturated children's graphics.
- Generic clip art.

---

## 6. Brand Characters

The **rabbit** and **goose** should be treated as recurring brand characters.

They may be used independently for:

- Product category graphics.
- Section illustrations.
- Packaging.
- Stickers.
- Social media graphics.
- Empty states.
- Thank-you pages.
- Newsletter graphics.
- Decorative website elements.

Do not distort, recolour aggressively or redraw them in a conflicting visual style.

---

## 7. Logo Usage

The logo combines:

- Watercolour animal characters.
- Large rounded typography.
- Sage green, blush pink and powder blue.
- Strong white space.

### Logo Rules

- Keep sufficient clear space around the logo.
- Prefer white or very light neutral backgrounds.
- Do not place the logo over busy photography.
- Do not stretch or compress the logo.
- Do not add shadows, gradients or hard outlines.
- Do not replace the logo colours with unrelated colours.
- Maintain the playful spacing and proportion of the existing design.

---

## 8. Shape Language

Website components should use soft, rounded forms.

Recommended:

```css
--radius-small: 12px;
--radius-medium: 18px;
--radius-large: 28px;
--radius-pill: 999px;
```

Use:

- Rounded buttons.
- Rounded cards.
- Soft pill-shaped tags.
- Rounded image frames.
- Organic curves where suitable.
- Generous whitespace.

Avoid:

- Sharp square corners.
- Aggressive diagonals.
- Hard industrial borders.
- Dense grid systems with minimal breathing room.

---

## 9. Buttons

### Primary Button

Use sage green:

```css
.button-primary {
  background: #878F60;
  color: #FFFFFF;
  border-radius: 999px;
  font-family: "Nunito", sans-serif;
  font-weight: 700;
  padding: 0.9rem 1.5rem;
}
```

Hover state:

- Slightly darker sage.
- Do not change to a completely different colour.
- Use subtle motion only.

### Secondary Button

Use:

- Blush pink background with dark text.
- Powder blue background with dark text.
- White background with sage green border.

Buttons should feel soft and friendly, not heavy or corporate.

---

## 10. Cards and Content Blocks

Cards should use:

- White or warm cream backgrounds.
- Rounded corners.
- Light borders or very subtle shadows.
- Generous padding.
- Simple, uncluttered layouts.

Suggested style:

```css
.card {
  background: #FFFFFF;
  border: 1px solid #EDE4D8;
  border-radius: 24px;
  padding: 1.5rem;
  box-shadow: 0 8px 24px rgba(75, 70, 63, 0.06);
}
```

Do not use strong dark drop shadows.

---

## 11. Background Treatments

Preferred page backgrounds:

- White.
- Warm cream.
- Very pale blush.
- Very pale powder blue.

Use sage green primarily as an accent rather than as the dominant full-page background.

Alternating light section backgrounds are encouraged to create a gentle rhythm.

---

## 12. Photography

If photography is used, it should feel:

- Natural.
- Bright but soft.
- Warm.
- Authentic.
- Calm.
- Lightly styled rather than overly commercial.

Suitable settings include:

- Linen.
- Cotton.
- Light timber.
- Natural baskets.
- Soft blankets.
- Nursery environments.
- Neutral painted walls.
- Gentle outdoor settings.
- Warm daylight.

Avoid:

- Harsh studio lighting.
- Deep black backgrounds.
- High-contrast filters.
- Strong neon props.
- Overly polished luxury styling.

---

## 13. Icons

Use icons with:

- Rounded line work.
- Moderate stroke width.
- Simple forms.
- Sage green, soft brown or muted accent colours.

Avoid:

- Sharp technical icons.
- Filled black icon sets.
- Highly detailed illustrations used as UI icons.

---

## 14. Navigation

The navigation should be:

- Simple.
- Spacious.
- Easy to read.
- Rounded and friendly.
- Visually light.

Recommended:

- White or warm cream header.
- Sage green text.
- Soft hover effects.
- Rounded cart/account/search controls.
- Avoid heavy dark navigation bars.

---

## 15. Hero Section

The home page hero should immediately communicate the Hasies & Gansies identity.

Recommended composition:

- Large rounded heading.
- Short friendly supporting text.
- One clear call-to-action.
- Rabbit, goose or both as supporting artwork.
- Plenty of white space.
- Soft cream, blush or white background.
- Optional pale organic shapes behind the characters.

The hero should not feel crowded.

---

## 16. Product Presentation

Product cards should use:

- Large clean product images.
- White or cream backgrounds.
- Rounded cards or image frames.
- Product name in dark brown.
- Price in sage or dark brown.
- Small blush or powder-blue labels where useful.
- Sage green primary action button.

Keep product pages clean and image-led.

---

## 17. Decorative Elements

Suitable decorative motifs include:

- Tiny flowers.
- Leaves.
- Soft dots.
- Small bows.
- Gentle clouds.
- Watercolour foliage.
- Soft organic blobs.
- Subtle gingham or hand-painted patterns.
- Rabbit or goose footprints used very sparingly.

Decorative elements must remain subtle and should never overwhelm products or content.

---

## 18. Motion and Interaction

Animation should be understated.

Recommended:

- Gentle fades.
- Small vertical movement.
- Soft scale effects.
- Light hover movement.
- Slow decorative floating effects.

Avoid:

- Fast bouncing.
- Large spinning animations.
- Flashing elements.
- Aggressive parallax.
- Excessive movement.

Suggested transition:

```css
transition: all 180ms ease;
```

---

## 19. UI Design Principles

When creating or modifying any page:

1. Use plenty of whitespace.
2. Keep layouts simple and readable.
3. Prefer rounded shapes.
4. Use sage green as the main functional brand colour.
5. Use blush pink and powder blue as softer accents.
6. Use dark brown rather than black for text.
7. Use watercolour illustrations only where illustration is required.
8. Do not introduce unrelated colours without a clear reason.
9. Avoid overly dense sections.
10. Maintain a gentle, warm and cohesive appearance.

---

## 20. CSS Brand Variables

Use these variables as the central design tokens:

```css
:root {
  --brand-sage: #878F60;
  --brand-pink: #F3D2D9;
  --brand-blue: #CAD7E8;
  --brand-white: #FFFFFF;

  --brand-cream: #FAF7F1;
  --brand-beige: #EDE4D8;
  --brand-taupe: #B9AA98;
  --brand-brown-light: #A9876A;
  --brand-text: #4B463F;

  --radius-sm: 12px;
  --radius-md: 18px;
  --radius-lg: 28px;
  --radius-pill: 999px;

  --font-heading: "Fredoka", sans-serif;
  --font-body: "Nunito", sans-serif;
}
```

---

## 21. Overall Brand Summary

**Hasies & Gansies** should visually feel like a gentle illustrated children's storybook translated into a modern website.

The core identity is built around:

- Sage green.
- Blush pink.
- Powder blue.
- White and warm neutral backgrounds.
- Rounded typography.
- Watercolour rabbit and goose characters.
- Natural textures.
- Soft shapes.
- Generous whitespace.
- Warm, friendly presentation.

Every website change should reinforce this identity rather than introduce a competing visual style.

---

## 22. Instruction for Website Design or Development Chat

When working on the Hasies & Gansies website, use this document as the primary visual design reference.

Before making changes:

- Preserve the existing website functionality unless specifically instructed otherwise.
- Align new sections and components with this brand identity.
- Reuse the defined colours, fonts, radius values and component styling.
- Maintain consistency across desktop, tablet and mobile.
- Do not introduce new visual styles that conflict with this guide.
- Keep the website playful and child-friendly while still looking polished and professional.
- Prioritise clarity, whitespace and visual consistency.
- Use the rabbit and goose illustration style as the reference for any new visual assets.
