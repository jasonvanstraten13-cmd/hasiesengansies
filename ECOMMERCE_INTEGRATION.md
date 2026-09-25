# Ecommerce Integration Instructions

## Objective

Add a complete ecommerce section to the website that already exists in this VS Code project root.

Do not replace the existing website. Do not rebuild unrelated pages. Inspect the current project first, then integrate the shop using the same framework, routing system, visual language, header, footer, fonts, spacing, buttons, and responsive conventions already used by the site.

Use the open-source Cartfolio storefront as the reference implementation and code source where practical:

- Repository: https://github.com/syn-studios/cartfolio-store
- License: MIT
- Core features to retain: product catalogue, search, category filtering, sorting, product detail pages, persistent cart using localStorage, quantity controls, responsive design, and checkout integration.

Preserve the original MIT license and any required attribution for code copied from the source repository.

## Non-negotiable rules

1. Work inside the current project root.
2. Inspect the existing project before changing anything.
3. Do not overwrite the current homepage or existing routes unless required for a navigation link.
4. Do not remove existing functionality.
5. Do not introduce a second frontend framework if the site already uses one.
6. Reuse the site's existing components and CSS wherever practical.
7. Keep the ecommerce code modular and clearly separated from unrelated site code.
8. Do not hard-code secret Stripe keys into client-side files.
9. Do not claim live payments are enabled unless valid Stripe credentials have been supplied and a checkout test succeeds.
10. All pages must work on desktop and mobile.
11. Fix all console errors introduced by the integration.
12. Do not stop after scaffolding. Complete and test the entire integration.

## Step 1: Inspect the current website

Determine:

- Framework or stack in use, such as plain HTML/CSS/JavaScript, React, Next.js, Vue, Astro, Vite, WordPress theme files, or another structure.
- Existing package manager and scripts.
- Existing routing system.
- Existing global stylesheet and design tokens.
- Existing header and footer components.
- Existing navigation structure.
- Existing deployment assumptions.
- Whether a server-side/API runtime is available.
- Whether Stripe or another payment provider is already configured.

Run the existing site locally before changing it and note the working command.

If Git is already initialized, inspect `git status` before editing. Do not discard existing uncommitted work.

## Step 2: Obtain the reference ecommerce implementation

Clone the reference repository into a temporary folder outside the active application structure, for example:

```bash
git clone https://github.com/syn-studios/cartfolio-store.git .ecommerce-reference
```

Do not make `.ecommerce-reference` part of the final deployed site.

Review the reference implementation and reuse or port only the parts appropriate for the current site's stack.

After the integration is complete, remove the temporary reference folder unless it is intentionally retained for development documentation.

## Step 3: Integrate the store into the existing site

Create a primary shop route using the site's existing routing conventions. Prefer:

```text
/shop
```

Add a visible `Shop` link to the existing main navigation without disturbing the existing layout.

The ecommerce section must include the following.

### Product catalogue

Provide:

- Product image.
- Product name.
- Short description.
- Price.
- Category.
- Availability status.
- Add to Cart control.
- Product detail link or product detail view.

### Search and filtering

Provide:

- Text search across product name and description.
- Category filtering.
- Price sorting from low to high.
- Price sorting from high to low.
- Name sorting where practical.
- A clear filter reset control.
- A useful empty-results state.

### Product details

Each product must have either a dedicated URL or a clearly accessible product detail view containing:

- Larger image.
- Full description.
- Price.
- Category.
- Availability.
- Quantity selector.
- Add to Cart button.

Prefer dedicated URLs if the current framework supports routing cleanly.

### Shopping cart

Provide a cart that supports:

- Add item.
- Remove item.
- Increase quantity.
- Decrease quantity.
- Set quantity.
- Clear cart.
- Product thumbnail.
- Unit price.
- Line total.
- Cart subtotal.
- Total item count.
- Empty-cart state.
- Persistent cart storage after refresh.

Use `localStorage` for cart persistence unless the existing site already has an account/session cart system.

Namespace the storage key so it does not conflict with existing data, for example:

```text
site_ecommerce_cart_v1
```

The cart count in the site header must update immediately after cart changes.

### Currency

Create one central store configuration value for the currency. Do not scatter currency symbols throughout the code.

Default to:

```text
ZAR
```

unless the existing site already defines another ecommerce currency.

## Step 4: Product data

Do not bury product definitions inside UI code.

Create a clearly editable product data file appropriate to the stack, for example:

```text
src/data/products.json
```

or:

```text
data/products.json
```

Each product should support at least:

```json
{
  "id": "product-001",
  "name": "Example Product",
  "slug": "example-product",
  "description": "Example product description.",
  "price": 99900,
  "currency": "ZAR",
  "category": "General",
  "image": "/images/products/example-product.webp",
  "inStock": true
}
```

Store monetary values in the smallest currency unit where practical. For ZAR, `99900` represents R999.00.

Add 6 to 8 clearly identified SAMPLE products if no real product catalogue already exists. Keep all sample product content easy to replace.

Do not use copyrighted commercial product photography from random websites. Use local placeholders, existing site assets, or neutral placeholder imagery until real product assets are supplied.

## Step 5: Checkout architecture

The storefront must have a working cart regardless of whether live payment credentials are currently available.

### Preferred checkout

If the current website supports server-side routes or API endpoints, implement Stripe Checkout using a server-side checkout-session endpoint.

Requirements:

- Use Stripe Checkout Sessions.
- Build the checkout line items server-side from trusted product data.
- Never trust a price supplied by the browser.
- Read the Stripe secret key only from an environment variable.
- Redirect the customer to Stripe's hosted checkout.
- Provide success and cancellation return URLs.
- Include `.env.example` entries for required environment variables.
- Ensure `.env` and `.env.local` are ignored by Git.

Suggested environment variables:

```text
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Adapt the public URL variable name to the existing framework if required.

### Static-only fallback

If the existing site is truly static and has no secure server/API capability, retain the complete product and cart experience but implement checkout using Stripe Payment Links only as a temporary payment method.

In that case:

- Put each Stripe Payment Link in product data or a dedicated configuration file.
- Clearly document the limitation that separate static Payment Links are not equivalent to a normal multi-item Stripe Checkout Session.
- Do not fake a multi-item checkout.
- Structure the code so a server-side Stripe Checkout endpoint can replace the fallback later without rewriting the storefront.

If another secure payment backend already exists in this project, use it instead of adding Stripe unnecessarily.

## Step 6: Visual integration

The store must look like part of the existing website, not like a pasted third-party template.

Reuse the current site's:

- Header.
- Footer.
- Logo.
- Font family.
- Primary and secondary colours.
- Border radius conventions.
- Button styles.
- Container widths.
- Breakpoints.
- Spacing scale.
- Form styling.

Use the Cartfolio repository mainly for ecommerce structure and behavior, not as a reason to overwrite the existing design.

Do not add Tailwind if the existing project does not use Tailwind unless there is a strong technical reason. Prefer the site's current styling approach.

If the site already uses Tailwind, use its current Tailwind configuration and tokens instead of creating a competing configuration.

## Step 7: User experience requirements

Implement:

- Mobile responsive product grid.
- Responsive cart layout.
- Loading states where asynchronous operations exist.
- Disabled Add to Cart behavior for unavailable products.
- Clear feedback after adding a product to the cart.
- Accessible labels for controls.
- Keyboard-accessible interactive elements.
- Visible focus states.
- Useful image alt text.
- Semantic headings.
- Correct button types.

Avoid intrusive popups.

## Step 8: SEO and metadata

For the shop and product pages, add appropriate:

- Page title.
- Meta description.
- Canonical handling if the existing site uses it.
- Open Graph metadata if the site already supports it.

If practical in the existing stack, add Product structured data for dedicated product pages.

## Step 9: Security requirements

Do not:

- Put Stripe secret keys in browser code.
- Accept product prices directly from client requests as authoritative.
- Store raw payment-card data.
- Implement a custom credit-card form.
- Commit real credentials.

Validate any checkout request server-side against the authoritative product data.

## Step 10: Testing

Test the existing website after integration and confirm unrelated pages still work.

Test the ecommerce flow at minimum:

1. Open `/shop`.
2. Products render correctly.
3. Search works.
4. Category filtering works.
5. Sorting works.
6. Product detail view works.
7. Add a product to cart.
8. Add multiple products.
9. Change quantities.
10. Remove an item.
11. Refresh the page and confirm the cart persists.
12. Confirm the cart count is correct.
13. Confirm subtotal calculations are correct.
14. Test empty cart behavior.
15. Test on a narrow mobile viewport.
16. Confirm there are no new browser console errors.
17. Run the project's existing lint/typecheck/test/build scripts where available.
18. Confirm the production build succeeds.
19. If Stripe test credentials are available, perform a Stripe test-mode checkout.
20. Confirm success and cancellation routes work.

Fix failures before considering the work complete.

## Step 11: Documentation

Update or create a short ecommerce section in the project README covering:

- Shop route.
- How to run the site locally.
- Where product data is stored.
- How to add or edit products.
- How images are added.
- Currency configuration location.
- How the cart works.
- Required Stripe environment variables.
- How to test Stripe checkout.
- Any static-site checkout limitation, if applicable.

Also add a short `ECOMMERCE_SOURCE.md` noting that portions of the ecommerce implementation were adapted from:

```text
Cartfolio
https://github.com/syn-studios/cartfolio-store
MIT License
```

Include the source project's license text where required by the MIT license.

## Step 12: Final cleanup

Before finishing:

- Remove unused demo pages and assets copied from the reference repository.
- Remove the temporary clone if no longer needed.
- Remove dead imports and code.
- Ensure all new files follow the existing project's naming conventions.
- Ensure the navigation link works.
- Ensure the shop does not alter existing page styling unexpectedly.
- Ensure the repository contains no secret keys.
- Run the production build again.

## Required final report from the coding agent

When all work is complete, provide a concise report containing:

1. Existing stack detected.
2. Files created.
3. Existing files modified.
4. Shop URL.
5. Product data file location.
6. Cart implementation summary.
7. Checkout implementation used.
8. Environment variables still required from the site owner.
9. Tests/build commands run and their results.
10. Any remaining item that cannot function without external credentials or real product information.

## Definition of done

The task is only complete when the existing website still runs, the new shop is integrated into it, products can be browsed and filtered, the cart works and persists, totals calculate correctly, mobile layout works, the project builds successfully, and checkout is implemented as far as the available server environment and payment credentials allow.
