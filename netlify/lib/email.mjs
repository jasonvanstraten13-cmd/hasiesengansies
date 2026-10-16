// Order emails sent through Resend (https://resend.com).
const money = new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' });
const rand = (cents) => money.format(cents / 100);
const escape = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);

export function orderSummaryHtml(order, ref) {
  const rows = order.items.map((item) => `<tr><td>${escape(item.name)} &times; ${item.quantity}</td><td align="right">${rand(item.lineTotal)}</td></tr>`).join('');
  const address = order.delivery.address
    ? Object.values(order.delivery.address).filter(Boolean).map(escape).join('<br>')
    : escape(order.delivery.locker || 'To be arranged');
  return `
    <p><strong>Order ${escape(ref)}</strong></p>
    <table cellpadding="6" style="border-collapse:collapse;min-width:320px">
      ${rows}
      <tr><td>Subtotal</td><td align="right">${rand(order.subtotal)}</td></tr>
      <tr><td>${escape(order.delivery.name)}</td><td align="right">${order.delivery.fee ? rand(order.delivery.fee) : 'Free'}</td></tr>
      <tr><td><strong>Total paid</strong></td><td align="right"><strong>${rand(order.total)}</strong></td></tr>
    </table>
    <p><strong>Delivery to</strong><br>${address}</p>
    ${order.personalisation ? `<p><strong>Personalisation</strong><br>${escape(order.personalisation).replace(/\n/g, '<br>')}</p>` : ''}
    ${order.notes ? `<p><strong>Notes</strong><br>${escape(order.notes).replace(/\n/g, '<br>')}</p>` : ''}`;
}

export async function sendEmail({ to, subject, html, replyTo }) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: process.env.ORDER_EMAIL_FROM, to: [to], subject, html, reply_to: replyTo })
  });
  if (!response.ok) throw new Error(`Email to ${to} failed (${response.status}): ${await response.text()}`);
}

export async function sendOrderEmails(order, ref) {
  const summary = orderSummaryHtml(order, ref);
  const customer = order.customer;
  await sendEmail({
    to: process.env.ORDER_EMAIL_TO,
    replyTo: customer.email,
    subject: `New paid order ${ref} - ${rand(order.total)}`,
    html: `<p>New paid order from <strong>${escape(customer.name)}</strong> (${escape(customer.email)}, ${escape(customer.phone)}).</p>${summary}`
  });
  await sendEmail({
    to: customer.email,
    replyTo: process.env.ORDER_EMAIL_TO,
    subject: `Thank you for your order ${ref} - Hasies en Gansies`,
    html: `<p>Hi ${escape(customer.name)},</p><p>Thank you for your order! Your payment was successful and we will be in touch soon with delivery details.</p>${summary}<p>With love,<br>Hasies en Gansies</p>`
  });
}
