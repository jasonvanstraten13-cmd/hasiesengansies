import test from 'node:test';
import assert from 'node:assert/strict';

Object.assign(process.env, { RESEND_API_KEY: 're_x', ORDER_EMAIL_FROM: 'Shop <orders@example.com>', ORDER_EMAIL_TO: 'owner@example.com' });
const contact = (await import('../netlify/functions/contact.mjs')).default;

const sent = [];
globalThis.fetch = async (url, init) => {
  if (url.includes('resend')) { sent.push(JSON.parse(init.body)); return Response.json({ id: 'e' }); }
  throw new Error(`Unexpected fetch ${url}`);
};
const post = (body) => new Request('https://x/api/contact', { method: 'POST', body: JSON.stringify(body) });

test('contact form emails the owner with escaped content', async () => {
  const response = await contact(post({ name: 'Parent', email: 'p@example.com', phone: '082 000 0000', whatsapp: '27820000000', message: 'Hi <script>' }));
  assert.equal(response.status, 200);
  assert.equal(sent.length, 1);
  assert.equal(sent[0].to[0], 'owner@example.com');
  assert.equal(sent[0].reply_to, 'p@example.com');
  assert.ok(sent[0].html.includes('https://wa.me/27820000000'));
  assert.ok(!sent[0].html.includes('<script>'));
});

test('contact form rejects bad input and ignores spam', async () => {
  sent.length = 0;
  assert.equal((await contact(post({ name: 'A', email: 'bad', phone: '1' }))).status, 400);
  assert.equal((await contact(post({ name: '', email: 'a@example.com', phone: '1' }))).status, 400);
  assert.equal((await contact(post({ name: 'Bot', email: 'b@example.com', phone: '1', company: 'spam' }))).status, 200);
  assert.equal(sent.length, 0);
});
