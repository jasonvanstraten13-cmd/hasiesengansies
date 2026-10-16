import { sendEmail } from '../lib/email.mjs';

const json = (status, data) => new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
const escape = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);

function field(value, max) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

export default async (request) => {
  if (request.method !== 'POST') return json(405, { error: 'Method not allowed.' });
  const input = await request.json().catch(() => null);
  if (!input) return json(400, { error: 'Invalid message.' });
  if (input.company) return json(200, { ok: true }); // spam honeypot

  const message = {
    name: field(input.name, 120),
    email: field(input.email, 200),
    phone: field(input.phone, 40),
    whatsapp: field(input.whatsapp, 40),
    message: field(input.message, 4000)
  };
  if (!message.name || !message.phone) return json(400, { error: 'Please fill in your name and phone number.' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(message.email)) return json(400, { error: 'Please enter a valid email address.' });

  try {
    await sendEmail({
      to: process.env.ORDER_EMAIL_TO,
      replyTo: message.email,
      subject: `New enquiry from ${message.name} - Hasies en Gansies`,
      html: `<p><strong>${escape(message.name)}</strong><br>${escape(message.email)}<br>${escape(message.phone)}</p>
        ${/^\d{8,15}$/.test(message.whatsapp) ? `<p><a href="https://wa.me/${message.whatsapp}">Reply on WhatsApp</a></p>` : ''}
        <p>${escape(message.message || '(no message)').replace(/\n/g, '<br>')}</p>`
    });
    return json(200, { ok: true });
  } catch (error) {
    console.error(error);
    return json(502, { error: 'Your message could not be sent right now. Please try again, or contact us on WhatsApp.' });
  }
};

export const config = { path: '/api/contact' };
