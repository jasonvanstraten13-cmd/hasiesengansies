# Hasies en Gansies

A static HTML, CSS and JavaScript website with an integrated shop. Payments go through Yoco Checkout, run by two small serverless functions hosted on Netlify.

## Run locally

```powershell
npm start
```

Then open `http://localhost:8888/`. This serves the site and runs the `/api` functions with no install. It reads `.env` if one exists (copy `.env.example`). `npx netlify dev` also works and is closer to production.

```powershell
npm test
```

runs the order, pricing and webhook-signature tests.

## How the shop works

- Shop: `/shop/`. Cart: `/shop/cart.html`. Checkout: `/shop/checkout.html`. Thank-you page: `/shop/order-success.html`
- Products: `shop/data/products.json`. Prices are in **cents** (`22000` = R220.00). Set `"inStock": false` to stop sales of an item. Set `"customisable": true` to make checkout ask for personalisation details.
- Product images: `shop/assets/`
- Delivery options and fees: `shop/data/delivery.json`, also in cents. `freeDeliveryThreshold` makes options marked `freeOverThreshold` free above that order subtotal.
- The cart lives in the browser (`localStorage` key `site_ecommerce_cart_v1`).

### Checkout flow

1. The customer fills in their details, delivery choice and any personalisation on `checkout.html`.
2. `netlify/functions/create-checkout.mjs` (`POST /api/create-checkout`) recalculates every price and delivery fee from the JSON files and ignores any prices sent by the browser. It then creates a Yoco checkout and returns Yoco's payment page URL.
3. The customer pays on Yoco's hosted page. Card details never touch this site.
4. Yoco sends a signed `payment.succeeded` webhook to `netlify/functions/yoco-webhook.mjs` (`/api/yoco-webhook`). This checks the signature and emails the order to the shop and a confirmation to the customer, using Resend.
5. If a paid order can't be matched to its details, the shop still gets an alert email so the order can be checked in the Yoco portal.

The contact form posts to `/api/contact` (`netlify/functions/contact.mjs`), which emails the message to `ORDER_EMAIL_TO` with the same Resend setup.

Shared code lives in `netlify/lib/`.

## Going live

1. **Yoco**: sign up at yoco.com, then copy the secret keys from the Yoco portal: Selling Online > Payment Gateway. Use the `sk_test_...` key until testing is done.
2. **Resend**: create a free account at resend.com, verify the `hasiesengansies.co.za` domain (DNS records), and create an API key.
3. **Netlify**: connect this Git repository (no build command; publish directory `.`). Point the domain at Netlify. Under Site configuration > Environment variables, add everything listed in `.env.example`.
4. **Webhook**: once the site is live on https, run this once and save the printed secret as `YOCO_WEBHOOK_SECRET` in Netlify, then redeploy:

   ```powershell
   $env:YOCO_SECRET_KEY="sk_test_..."; $env:SITE_URL="https://hasiesengansies.co.za"; npm run register-webhook
   ```

   Do this separately for the test key and the live key. Each key has its own webhooks.
5. **Test**: with test keys, place an order using Yoco's test card. Confirm you reach the thank-you page and that both emails arrive. Also try cancelling on the Yoco page.
6. Switch `YOCO_SECRET_KEY` to the live key, register the webhook for it, and update `YOCO_WEBHOOK_SECRET`.

## Known limitations

- Stock isn't tracked automatically. Update `inStock` in `products.json` when items sell out.
- Orders are recorded in Yoco and in the emails. There is no separate order database.
- If Yoco retries a webhook, the same order email can arrive twice. Check the order reference.

## Project documents

Brand guides, legal templates and agency prompts live in `docs/`. That folder is blocked from the public site by `netlify.toml`.
