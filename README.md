# Hasies en Gansies

A static HTML, CSS and JavaScript website with an integrated ecommerce catalogue.

## Run locally

From this folder, run a static server such as:

```powershell
npx --yes http-server -p 8000
```

Then open `http://127.0.0.1:8000/`.

## Ecommerce

- Shop route: `/shop/`
- Product data: `shop/data/products.json`
- Product images: `shop/assets/`
- Store configuration and cart behavior: `shop/shop.js`
- Shop styling: `shop/shop.css`
- Currency: `ZAR`, configured at the top of `shop/shop.js`
- Cart storage: namespaced localStorage key `site_ecommerce_cart_v1`

Products are sample data for Dummy Chains, BIBS Dummies, and Bespoke Customised Baby Toys. Replace the JSON entries and local SVG assets with real catalogue data when ready.

## Checkout status

The product catalogue, product details, persistent cart, quantity controls and subtotal calculations are active. This is currently a static site with no server-side API and no Stripe credentials or Payment Links supplied. The cart therefore uses an order-enquiry fallback that sends the selected items to the existing contact page. It does not claim to process live payments.

To add live Stripe Checkout later, create a server-side checkout-session endpoint that reads trusted prices from `shop/data/products.json`. Required environment variables would be:

```text
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_SITE_URL=http://localhost:8000
```

Never place the Stripe secret key in browser JavaScript.

## Testing

Open `/shop/`, search and filter products, sort by price/name, view a product, add items, change quantities, remove items, clear the cart, and refresh to confirm persistence. The existing homepage, about, contact, thank-you, privacy and terms pages remain static routes.
