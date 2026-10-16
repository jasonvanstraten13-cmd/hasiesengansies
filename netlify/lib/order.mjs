// Builds an order from trusted catalogue and delivery data.
// Prices, delivery fees and totals are always computed here, never taken from the browser.
import products from '../../shop/data/products.json' with { type: 'json' };
import delivery from '../../shop/data/delivery.json' with { type: 'json' };

const MAX_LINES = 20;
const MAX_QUANTITY = 20;

export class OrderError extends Error {}

function text(value, max, field, required) {
  const result = typeof value === 'string' ? value.trim() : '';
  if (required && !result) throw new OrderError(`Please fill in ${field}.`);
  if (result.length > max) throw new OrderError(`${field} is too long.`);
  return result;
}

export function makeOrderRef(now = new Date()) {
  const date = now.toISOString().slice(2, 10).replace(/-/g, '');
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `HG-${date}-${random}`;
}

export function deliveryFee(option, subtotal) {
  if (option.freeOverThreshold && delivery.freeDeliveryThreshold && subtotal >= delivery.freeDeliveryThreshold) return 0;
  return option.price;
}

export function buildOrder(input, catalogue = products) {
  if (!input || typeof input !== 'object') throw new OrderError('Invalid order.');
  const requested = Array.isArray(input.items) ? input.items : [];
  if (!requested.length) throw new OrderError('Your cart is empty.');
  if (requested.length > MAX_LINES) throw new OrderError('Too many items in one order.');

  const items = requested.map((entry) => {
    const product = catalogue.find((candidate) => candidate.id === entry?.id);
    if (!product) throw new OrderError('One of the items in your cart is no longer available.');
    if (!product.inStock) throw new OrderError(`${product.name} is currently unavailable.`);
    const quantity = Number(entry.quantity);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) {
      throw new OrderError(`Please choose a quantity between 1 and ${MAX_QUANTITY} for ${product.name}.`);
    }
    return { id: product.id, name: product.name, unitPrice: product.price, quantity, lineTotal: product.price * quantity, customisable: Boolean(product.customisable) };
  });

  const subtotal = items.reduce((total, item) => total + item.lineTotal, 0);
  const option = delivery.options.find((candidate) => candidate.id === input.delivery?.method);
  if (!option) throw new OrderError('Please choose a delivery option.');
  const shipping = deliveryFee(option, subtotal);

  const raw = input.customer || {};
  const customer = {
    name: text(raw.name, 120, 'your name', true),
    email: text(raw.email, 200, 'your email', true),
    phone: text(raw.phone, 40, 'your phone number', true)
  };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) throw new OrderError('Please enter a valid email address.');

  const rawAddress = input.delivery || {};
  const address = option.needsAddress ? {
    street: text(rawAddress.street, 200, 'your street address', true),
    suburb: text(rawAddress.suburb, 120, 'your suburb', false),
    city: text(rawAddress.city, 120, 'your city', true),
    province: text(rawAddress.province, 60, 'your province', true),
    postalCode: text(rawAddress.postalCode, 10, 'your postal code', true)
  } : null;
  const locker = option.needsLocker ? text(rawAddress.locker, 200, 'your preferred PUDO locker', true) : '';

  const personalisation = text(input.personalisation, 1000, 'personalisation details', items.some((item) => item.customisable));
  const notes = text(input.notes, 1000, 'order notes', false);
  if (input.acceptTerms !== true) throw new OrderError('Please accept the terms to continue.');

  return {
    items,
    subtotal,
    delivery: { method: option.id, name: option.name, fee: shipping, address, locker },
    total: subtotal + shipping,
    customer,
    personalisation,
    notes
  };
}

export function toYocoCheckout(order, ref, siteUrl) {
  const lineItems = order.items.map((item) => ({ displayName: item.name, quantity: item.quantity, pricingDetails: { price: item.unitPrice } }));
  if (order.delivery.fee > 0) lineItems.push({ displayName: order.delivery.name, quantity: 1, pricingDetails: { price: order.delivery.fee } });
  const base = siteUrl.replace(/\/$/, '');
  return {
    amount: order.total,
    currency: 'ZAR',
    externalId: ref,
    subtotalAmount: order.total,
    lineItems,
    successUrl: `${base}/shop/order-success.html?ref=${encodeURIComponent(ref)}`,
    cancelUrl: `${base}/shop/checkout.html?status=cancelled`,
    failureUrl: `${base}/shop/checkout.html?status=failed`,
    metadata: { orderRef: ref, order: JSON.stringify(order) }
  };
}
