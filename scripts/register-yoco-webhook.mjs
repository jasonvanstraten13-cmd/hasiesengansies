// Registers the order webhook with Yoco and prints the signing secret (shown only once).
// Usage: YOCO_SECRET_KEY=sk_... SITE_URL=https://hasiesengansies.co.za npm run register-webhook
import { yocoRequest } from '../netlify/lib/yoco.mjs';

if (!process.env.YOCO_SECRET_KEY || !process.env.SITE_URL?.startsWith('https://')) {
  console.error('Set YOCO_SECRET_KEY and an https SITE_URL first.');
  process.exit(1);
}
const webhook = await yocoRequest('/webhooks', {
  method: 'POST',
  body: { name: 'hasies-en-gansies-orders', url: `${process.env.SITE_URL.replace(/\/$/, '')}/api/yoco-webhook` }
});
console.log('Webhook registered. Save this as YOCO_WEBHOOK_SECRET in Netlify:');
console.log(webhook.secret);
