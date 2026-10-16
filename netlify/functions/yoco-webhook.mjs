import { verifyWebhook } from '../lib/yoco.mjs';
import { sendOrderEmails, sendEmail } from '../lib/email.mjs';

export default async (request) => {
  if (request.method !== 'POST') return new Response('Method not allowed', { status: 405 });
  const body = await request.text();
  const valid = verifyWebhook({
    id: request.headers.get('webhook-id'),
    timestamp: request.headers.get('webhook-timestamp'),
    signatureHeader: request.headers.get('webhook-signature'),
    body,
    secret: process.env.YOCO_WEBHOOK_SECRET
  });
  if (!valid) return new Response('Invalid signature', { status: 403 });

  const event = JSON.parse(body);
  if (event.type !== 'payment.succeeded') return new Response('Ignored', { status: 200 });

  // The signed event carries the metadata we attached when creating the checkout.
  const payment = event.payload || {};
  const metadata = payment.metadata || {};
  try {
    const order = metadata.order ? JSON.parse(metadata.order) : null;
    if (metadata.orderRef && order && order.total === payment.amount) {
      await sendOrderEmails(order, metadata.orderRef);
    } else {
      // Never lose a paid order: alert the shop so it can be checked in the Yoco portal.
      await sendEmail({
        to: process.env.ORDER_EMAIL_TO,
        subject: 'Payment received - please check order details in Yoco',
        html: `<p>A payment of R${((payment.amount || 0) / 100).toFixed(2)} succeeded but the order details could not be matched automatically.</p><p>Payment ID: ${String(payment.id || 'unknown').replace(/[<>&]/g, '')}<br>Checkout ID: ${String(metadata.checkoutId || 'unknown').replace(/[<>&]/g, '')}</p>`
      });
    }
    return new Response('OK', { status: 200 });
  } catch (error) {
    // A non-2xx response makes Yoco retry the webhook later.
    console.error(error);
    return new Response('Processing failed', { status: 500 });
  }
};

export const config = { path: '/api/yoco-webhook' };
