import { buildOrder, makeOrderRef, toYocoCheckout, OrderError } from '../lib/order.mjs';
import { yocoRequest } from '../lib/yoco.mjs';

const json = (status, data) => new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });

export default async (request) => {
  if (request.method !== 'POST') return json(405, { error: 'Method not allowed.' });
  if (!process.env.YOCO_SECRET_KEY || !process.env.SITE_URL) {
    console.error('Checkout is missing YOCO_SECRET_KEY or SITE_URL.');
    return json(503, { error: 'Online payment is not available right now. Please try again later or contact us.' });
  }
  let order;
  try {
    order = buildOrder(await request.json());
  } catch (error) {
    if (error instanceof OrderError) return json(400, { error: error.message });
    return json(400, { error: 'Invalid order.' });
  }
  const ref = makeOrderRef();
  try {
    const checkout = await yocoRequest('/checkouts', { method: 'POST', body: toYocoCheckout(order, ref, process.env.SITE_URL), idempotencyKey: ref });
    return json(200, { redirectUrl: checkout.redirectUrl, ref });
  } catch (error) {
    console.error(error);
    return json(502, { error: 'We could not start the payment. Please try again in a moment.' });
  }
};

export const config = { path: '/api/create-checkout' };
