import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { buildOrder, toYocoCheckout, OrderError } from '../netlify/lib/order.mjs';
import { verifyWebhook } from '../netlify/lib/yoco.mjs';
import { orderSummaryHtml } from '../netlify/lib/email.mjs';

const base = {
  items: [{ id: 'dummy-chain-sage', quantity: 2 }],
  customer: { name: 'Test Parent', email: 'parent@example.com', phone: '0820000000' },
  delivery: { method: 'pudo', locker: 'Test locker' },
  acceptTerms: true
};

test('prices come from the catalogue, not the browser', () => {
  const order = buildOrder({ ...base, items: [{ id: 'dummy-chain-sage', quantity: 2, price: 1 }] });
  assert.equal(order.subtotal, 48000);
  assert.equal(order.delivery.fee, 6500);
  assert.equal(order.total, 54500);
});

test('delivery is free over the threshold', () => {
  const order = buildOrder({ ...base, items: [{ id: 'bespoke-goose', quantity: 2 }], personalisation: 'Name: Mia' });
  assert.equal(order.subtotal, 104000);
  assert.equal(order.delivery.fee, 0);
  assert.equal(order.total, 104000);
});

test('collection is never charged', () => {
  const order = buildOrder({ ...base, delivery: { method: 'collect' } });
  assert.equal(order.delivery.fee, 0);
});

test('rejects bad input', () => {
  assert.throws(() => buildOrder({ ...base, items: [] }), OrderError);
  assert.throws(() => buildOrder({ ...base, items: [{ id: 'nope', quantity: 1 }] }), OrderError);
  assert.throws(() => buildOrder({ ...base, items: [{ id: 'dummy-chain-sage', quantity: 0 }] }), OrderError);
  assert.throws(() => buildOrder({ ...base, items: [{ id: 'dummy-chain-sage', quantity: 1.5 }] }), OrderError);
  assert.throws(() => buildOrder({ ...base, delivery: { method: 'teleport' } }), OrderError);
  assert.throws(() => buildOrder({ ...base, delivery: { method: 'courier' } }), /street address/);
  assert.throws(() => buildOrder({ ...base, delivery: { method: 'pudo' } }), /PUDO locker/);
  assert.throws(() => buildOrder({ ...base, customer: { ...base.customer, email: 'nope' } }), /valid email/);
  assert.throws(() => buildOrder({ ...base, acceptTerms: false }), /terms/);
  assert.throws(() => buildOrder({ ...base, items: [{ id: 'bespoke-bunny', quantity: 1 }] }), /personalisation/);
});

test('rejects out-of-stock products', () => {
  const catalogue = [{ id: 'x', name: 'X', price: 100, inStock: false }];
  assert.throws(() => buildOrder({ ...base, items: [{ id: 'x', quantity: 1 }] }, catalogue), /unavailable/);
});

test('Yoco checkout amount matches line items and carries the order', () => {
  const order = buildOrder({ ...base, delivery: { method: 'courier', street: '1 Main Rd', city: 'Pretoria', province: 'Gauteng', postalCode: '0001' } });
  const checkout = toYocoCheckout(order, 'HG-TEST', 'https://example.co.za/');
  const lineSum = checkout.lineItems.reduce((total, line) => total + line.pricingDetails.price * line.quantity, 0);
  assert.equal(checkout.amount, lineSum);
  assert.equal(checkout.currency, 'ZAR');
  assert.equal(checkout.successUrl, 'https://example.co.za/shop/order-success.html?ref=HG-TEST');
  assert.deepEqual(JSON.parse(checkout.metadata.order), order);
});

test('email summary escapes customer input', () => {
  const order = buildOrder({ ...base, notes: '<script>alert(1)</script>' });
  assert.ok(!orderSummaryHtml(order, 'HG-TEST').includes('<script>'));
});

test('webhook signature verification', () => {
  const secret = 'whsec_' + Buffer.from('test-secret-bytes').toString('base64');
  const body = '{"type":"payment.succeeded"}';
  const timestamp = String(Math.floor(Date.now() / 1000));
  const signature = crypto.createHmac('sha256', Buffer.from('test-secret-bytes')).update(`msg_1.${timestamp}.${body}`).digest('base64');
  const args = { id: 'msg_1', timestamp, body, secret };
  assert.equal(verifyWebhook({ ...args, signatureHeader: `v1,${signature}` }), true);
  assert.equal(verifyWebhook({ ...args, signatureHeader: `v1,bad v1,${signature}` }), true);
  assert.equal(verifyWebhook({ ...args, signatureHeader: 'v1,bad' }), false);
  assert.equal(verifyWebhook({ ...args, body: body + ' ', signatureHeader: `v1,${signature}` }), false);
  assert.equal(verifyWebhook({ ...args, signatureHeader: `v1,${signature}`, now: Date.now() + 10 * 60 * 1000 }), false);
});
