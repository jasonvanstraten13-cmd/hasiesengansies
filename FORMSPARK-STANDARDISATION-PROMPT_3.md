# StratStudios — Formspark Contact Form & Email Template Standardisation Prompt

> **Purpose:** Copy this prompt into any AI assistant when setting up a Formspark-powered contact form and email notification template for a new StratStudios client website. Replace all `{{PLACEHOLDER}}` values with the client's details.

---

## The Prompt

```
Set up a Formspark contact form and custom HTML email notification template for a new StratStudios client website using the following standardised architecture. Follow every specification exactly.

---

### 1. CLIENT DETAILS (replace these)

- Client/Business Name: {{CLIENT_NAME}}
- Formspark Form ID: {{FORMSPARK_ID}}
- Client Phone: {{CLIENT_PHONE}}
- Client Email: {{CLIENT_EMAIL}}
- Client Location: {{CLIENT_LOCATION}}
- Website URL: {{WEBSITE_URL}}
- Industry/Service: {{INDUSTRY}} (e.g. "Piano Lessons", "Dog Grooming", "Personal Training")
- Brand Accent Colour (hex): {{ACCENT_COLOUR}} (default: #2C8F80)

---

### 2. FORM FIELDS

Standard fields (adjust per client — add/remove as needed):

| Field Label     | `name` attr  | `id` attr   | Type       | Required | Notes                                      |
|-----------------|-------------- |------------- |----------- |--------- |--------------------------------------------|
| Name            | `name`        | `name`       | `text`     | Yes      |                                             |
| Email           | `email`       | `email`      | `email`    | Yes      |                                             |
| Tel             | `phone`       | `phone`      | `tel`      | Yes      |                                             |
| {{CUSTOM_1}}    | `{{custom1}}` | `{{custom1}}`| `text`     | Yes/No   | Client-specific field (e.g. "age", "breed") |
| Comments        | `comments`    | `comments`   | `textarea` | No       | Placeholder: contextual to industry         |

---

### 3. CONTACT FORM HTML (contact.html)

Place the form inside a `<form>` element. The critical architecture:

```html
<form id="contactForm" class="contact-form" method="POST" action="https://submit-form.com/{{FORMSPARK_ID}}">
    <!-- HIDDEN FIELDS — these control Formspark behaviour -->
    <input type="hidden" name="_redirect" value="thank-you">
    <input type="hidden" name="_email.from" value="StratStudios Lead">
    <input type="hidden" name="_email.subject" value="New Lead • {{CLIENT_NAME}}">
    <input type="hidden" id="whatsapp" name="whatsapp" value="">

    <!-- VISIBLE FIELDS -->
    <div class="form-group">
        <label for="name">Name *</label>
        <input type="text" id="name" name="name" required>
    </div>
    <div class="form-group">
        <label for="email">Email *</label>
        <input type="email" id="email" name="email" required>
    </div>
    <div class="form-group">
        <label for="phone">Tel *</label>
        <input type="tel" id="phone" name="phone" required>
    </div>
    <!-- Add any client-specific fields here with matching name/id -->
    <div class="form-group">
        <label for="comments">Comments</label>
        <textarea id="comments" name="comments" rows="6" placeholder="Tell us about..."></textarea>
    </div>
    <button type="submit" class="cta-button primary">Submit Enquiry</button>
    <p class="form-note" id="formNote"></p>
</form>
```

#### HIDDEN FIELD RULES:
- `_redirect` → value is the filename of the thank-you page WITHOUT the `.html` extension (Formspark strips the extension). Value: `thank-you`
- `_email.from` → always `"StratStudios Lead"` — this is the sender display name in the notification email
- `_email.subject` → format: `"New Lead • {{CLIENT_NAME}}"` — uses bullet character `•` (not a dot)
- `whatsapp` → hidden field, populated by inline JavaScript (see section 4). The `name` and `id` must both be `whatsapp`

---

### 4. WHATSAPP AUTO-FORMAT SCRIPT (inline in contact.html)

Place this script AFTER `<script src="js/main.js"></script>` at the bottom of contact.html, inside its own `<script>` tag. It formats the phone number for WhatsApp by:
1. Stripping all spaces, dashes, brackets, plus signs
2. Converting leading `0` to South Africa country code `27`
3. Adding `27` prefix if not already present

```html
<script>
  var phoneInput = document.getElementById('phone');
  var whatsappField = document.getElementById('whatsapp');

  function formatWhatsApp(value) {
    var num = value.replace(/[\s\-\(\)\+]/g, '');
    if (num.startsWith('0')) num = '27' + num.substring(1);
    else if (!num.startsWith('27')) num = '27' + num;
    return num;
  }

  phoneInput.addEventListener('input', function() {
    whatsappField.value = formatWhatsApp(this.value);
  });

  phoneInput.addEventListener('change', function() {
    whatsappField.value = formatWhatsApp(this.value);
  });

  document.getElementById('contactForm').addEventListener('submit', function() {
    whatsappField.value = formatWhatsApp(phoneInput.value);
  });
</script>
```

**IMPORTANT — Country code adaptation:**
- The default above is for South Africa (`27`). For other countries, replace `'27'` with the correct country code and adjust the local prefix (e.g. `'0'` → `'44'` for UK, `'1'` for US).
- The `submit` event listener is essential as a final safety net — it ensures the whatsapp field is always populated even if the user pastes a number without triggering input/change events.

---

### 5. FORM VALIDATION (js/main.js)

Include this `initFormHandling()` function in main.js, called from `DOMContentLoaded`:

```javascript
function initFormHandling() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            const inputs = this.querySelectorAll('input[required], textarea[required]');
            let allValid = true;

            inputs.forEach(input => {
                if (!validateField(input)) {
                    allValid = false;
                }
            });

            if (!allValid) {
                e.preventDefault();
                const formNote = document.getElementById('formNote');
                formNote.textContent = 'Please fix the errors in your form.';
                formNote.className = 'form-note error';
                return;
            }
            
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';
            }
            
            // Allow natural form submission — do NOT preventDefault() here
        });

        const inputs = contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
        });
    }
}

function validateField(field) {
    let isValid = true;
    const value = field.value.trim();

    if (field.hasAttribute('required') && value === '') {
        isValid = false;
    }

    if (field.type === 'email' && value !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = emailRegex.test(value);
    }

    if (field.type === 'tel' && value !== '') {
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        isValid = phoneRegex.test(value);
    }

    field.style.borderColor = isValid ? '#000000' : '#cb2431';
    return isValid;
}
```

**Key rules:**
- Validation runs on `submit` (blocking) AND on `blur` (real-time visual feedback)
- On failed validation: `preventDefault()` stops submission, shows error message
- On successful validation: the form submits NATURALLY via browser POST — **never use `fetch()` or `preventDefault()` on success** — Formspark handles the redirect via `_redirect`
- Submit button changes to "Sending..." and is disabled to prevent double-submit

---

### 6. EMAIL TEMPLATE (email-template.html)

This is the custom HTML email that Formspark sends when a submission is received. It is uploaded to the Formspark dashboard under the form's "Email notification" → "Custom template" setting.

#### CRITICAL RULE — Handlebars Variable Syntax:
Formspark uses Handlebars templating. ALL form field variables MUST use the `data.` prefix:
- ✅ `{{data.name}}`, `{{data.email}}`, `{{data.phone}}`, `{{data.comments}}`, `{{data.whatsapp}}`
- ❌ `{{name}}`, `{{email}}` — these will render BLANK
- The `name` attribute on each form `<input>` becomes the variable key after `data.`
- Hidden fields are also available: `{{data.whatsapp}}`, `{{data._email.subject}}` etc.

#### Built-in Formspark variables (no `data.` prefix):
- `{{submittedAt}}` — timestamp of submission
- `{{submissionId}}` — unique ID

#### Template structure:

```html
<!doctype html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta http-equiv="x-ua-compatible" content="ie=edge" />
    <meta name="color-scheme" content="light dark" />
    <meta name="supported-color-schemes" content="light dark" />
    <title>New Lead • {{CLIENT_NAME}}</title>

    <style type="text/css">
      :root {
        color-scheme: light dark;
        supported-color-schemes: light dark;
      }

      @media only screen and (max-width: 640px) {
        .container { width: 100% !important; }
        .px-28 { padding-left: 20px !important; padding-right: 20px !important; }
        .stack { display:block !important; width:100% !important; }
        .center-sm { text-align:center !important; }
        .btn { width:100% !important; }
        .hero-text { font-size: 28px !important; line-height: 34px !important; }
        .mb-sm { margin-bottom: 16px !important; }
        .no-stack { display:table-cell !important; width:auto !important; }
        .logo-mobile { max-width: 100px !important; width: 100px !important; }
        .badge-mobile { font-size: 9px !important; padding: 8px 12px !important; }
        .badge-time { font-size: 10px !important; }
      }

      @media (prefers-color-scheme: dark) {
        .light-img { display: none !important; }
        .dark-img { display: block !important; max-width: 140px !important; }
        .bg-white { background-color: #1a1a1a !important; }
        .bg-gray-light { background-color: #2d2d2d !important; }
        .bg-gray-ultralight { background-color: #252525 !important; }
        .bg-footer { background-color: #1f1f1f !important; }
        .text-dark { color: #e5e5e5 !important; }
        .text-gray { color: #b0b0b0 !important; }
        .text-gray-light { color: #888888 !important; }
        .border-light { border-color: #404040 !important; }
        .border-ultralight { border-color: #333333 !important; }
        .preserve-color { background-color: {{ACCENT_COLOUR}} !important; color: #ffffff !important; }
      }

      [data-ogsc] .bg-white { background-color: #1a1a1a !important; }
      [data-ogsc] .bg-gray-light { background-color: #2d2d2d !important; }
      [data-ogsc] .text-dark { color: #e5e5e5 !important; }
      [data-ogsc] .text-gray { color: #b0b0b0 !important; }
    </style>
  </head>

  <body style="margin:0; padding:0; background-color:#f5f7fa; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
    <!-- Preheader (preview text in email clients) -->
    <div style="display:none; font-size:1px; color:#f5f7fa; line-height:1px; max-height:0; max-width:0; opacity:0; overflow:hidden;">
      {{data.name}} sent a booking enquiry • {{CUSTOM_PREHEADER_DETAIL}} • {{data.email}}
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f5f7fa;">
      <tr>
        <td align="center" style="padding:40px 20px;">
          <table role="presentation" width="620" cellpadding="0" cellspacing="0" border="0" class="container bg-white" style="background-color:#ffffff; border-radius:16px; box-shadow:0 4px 20px rgba(0,0,0,0.08); overflow:hidden;">

            <!-- HEADER: StratStudios logo + timestamp badge -->
            <tr>
              <td style="padding:32px 32px 24px 32px; border-bottom:1px solid #e8ecf1;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td>
                      <img src="https://stratstudios.co.za/assets/img/logo2.jpg" width="140" alt="StratStudios" style="display:block;">
                    </td>
                    <td align="right">
                      <div style="background:#f0fdf9; border:1px solid #d1f4ea; border-radius:8px; padding:10px 16px;">
                        <div style="font-size:10px; color:{{ACCENT_COLOUR}}; text-transform:uppercase; font-weight:900;">
                          New Lead
                        </div>
                        <div style="font-size:12px; color:#64748b; font-weight:600;">
                          {{#if submittedAt}}{{submittedAt}}{{else}}Just now{{/if}}
                        </div>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- HERO: Action badge, name greeting, WhatsApp + Email buttons -->
            <tr>
              <td style="padding:36px 32px;">
                <span style="display:inline-block; background:{{ACCENT_COLOUR}}; color:#fff; padding:6px 14px; border-radius:6px; font-size:11px; font-weight:800;">
                  🎯 Action Required
                </span>

                <h1 style="margin:20px 0 12px; font-size:36px; font-weight:800; color:#1e293b;">
                  New enquiry from<br>
                  <span style="color:{{ACCENT_COLOUR}};">{{data.name}}</span>
                </h1>

                <p style="font-size:16px; color:#64748b;">
                  A new booking enquiry has been received. {{CUSTOM_SUMMARY_LINE}}. Respond promptly to secure the booking.
                </p>

                <!-- WhatsApp button — uses formatted whatsapp hidden field -->
                <a href="https://wa.me/{{data.whatsapp}}" style="display:inline-block; margin-top:20px; background:#25D366; color:#fff; padding:16px 32px; border-radius:10px; text-decoration:none; font-weight:700;">
                  WhatsApp {{data.name}}
                </a>
                <!-- Email button — uses data.email with pre-filled subject -->
                <a href="mailto:{{data.email}}?subject=Re: Your {{INDUSTRY}} Enquiry" style="display:inline-block; margin-top:12px; margin-left:12px; background:#ffffff; color:#475569; padding:14px 32px; border:2px solid #e2e8f0; border-radius:10px; text-decoration:none; font-weight:700;">
                  Email {{data.name}}
                </a>
              </td>
            </tr>

            <!-- CONTACT CARDS: Quick-glance email + phone + custom field -->
            <tr>
              <td style="padding:0 32px 32px;">
                <table width="100%" cellpadding="12" cellspacing="0">
                  <tr>
                    <td style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px;">
                      <div style="font-size:11px; color:#94a3b8; text-transform:uppercase; font-weight:700;">Email Address</div>
                      <a href="mailto:{{data.email}}" style="font-size:15px; color:{{ACCENT_COLOUR}}; font-weight:700; text-decoration:none;">{{data.email}}</a>
                    </td>
                    <td style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px;">
                      <div style="font-size:11px; color:#94a3b8; text-transform:uppercase; font-weight:700;">Phone Number</div>
                      <a href="tel:{{data.phone}}" style="font-size:15px; color:{{ACCENT_COLOUR}}; font-weight:700; text-decoration:none;">{{data.phone}}</a>
                    </td>
                  </tr>
                  <!-- Add client-specific quick-glance card rows here -->
                  <tr>
                    <td colspan="2" style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; margin-top:12px;">
                      <div style="font-size:11px; color:#94a3b8; text-transform:uppercase; font-weight:700;">{{CUSTOM_FIELD_LABEL}}</div>
                      <div style="font-size:15px; color:{{ACCENT_COLOUR}}; font-weight:700;">{{data.CUSTOM_FIELD_NAME}}</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- FULL DETAILS: All fields listed out -->
            <tr>
              <td style="padding:32px;">
                <h2 style="font-size:18px; font-weight:800; color:#1e293b;">Full Details</h2>

                <div style="margin-top:16px; padding:16px 0; border-bottom:1px solid #f1f5f9;">
                  <div style="font-size:12px; color:#94a3b8; text-transform:uppercase; font-weight:700;">Contact Name</div>
                  <div style="font-size:16px; font-weight:700; color:#1e293b;">{{data.name}}</div>
                </div>

                <div style="margin-top:4px; padding:16px 0; border-bottom:1px solid #f1f5f9;">
                  <div style="font-size:12px; color:#94a3b8; text-transform:uppercase; font-weight:700;">Email</div>
                  <a href="mailto:{{data.email}}" style="font-size:15px; color:{{ACCENT_COLOUR}}; font-weight:700; text-decoration:none;">{{data.email}}</a>
                </div>

                <div style="margin-top:4px; padding:16px 0; border-bottom:1px solid #f1f5f9;">
                  <div style="font-size:12px; color:#94a3b8; text-transform:uppercase; font-weight:700;">Phone</div>
                  <a href="tel:{{data.phone}}" style="font-size:15px; color:{{ACCENT_COLOUR}}; font-weight:700; text-decoration:none;">{{data.phone}}</a>
                </div>

                <!-- Repeat this block for each custom field -->
                <div style="margin-top:4px; padding:16px 0; border-bottom:1px solid #f1f5f9;">
                  <div style="font-size:12px; color:#94a3b8; text-transform:uppercase; font-weight:700;">{{CUSTOM_FIELD_LABEL}}</div>
                  <div style="font-size:16px; font-weight:700; color:#1e293b;">{{data.CUSTOM_FIELD_NAME}}</div>
                </div>

                <!-- Comments field with conditional rendering -->
                <div style="margin-top:4px; padding:16px 0;">
                  <div style="font-size:12px; color:#94a3b8; text-transform:uppercase; font-weight:700;">Comments</div>
                  <div style="margin-top:10px; background:#f8fafc; border-left:4px solid {{ACCENT_COLOUR}}; border-radius:8px; padding:16px;">
                    {{#if data.comments}}
                    <div style="font-size:15px; line-height:24px; color:#475569;">
                      {{data.comments}}
                    </div>
                    {{else}}
                    <div style="font-size:15px; line-height:24px; color:#cbd5e1; font-style:italic;">
                      No comments included
                    </div>
                    {{/if}}
                  </div>
                </div>
              </td>
            </tr>

            <!-- NEXT STEPS: Coaching tips for the client -->
            <tr>
              <td style="padding:0 32px 32px;">
                <div style="background:linear-gradient(135deg, #f0fdf9 0%, #e8f9f3 100%); border:1px solid #d1f4ea; border-radius:12px; padding:20px 24px;">
                  <div style="margin-bottom:12px;">
                    <span style="display:inline-block; background:{{ACCENT_COLOUR}}; color:#ffffff; padding:4px 10px; border-radius:6px; font-size:10px; font-weight:800; letter-spacing:1.2px; text-transform:uppercase;">
                      💡 Next Steps
                    </span>
                  </div>
                  <div style="font-size:14px; line-height:22px; color:#0f766e; margin-bottom:12px;">
                    <strong>Stand out from competitors:</strong>
                  </div>
                  <ul style="margin:0; padding-left:20px; font-size:14px; line-height:22px; color:#115e59;">
                    <li style="margin-bottom:6px;">Respond within 5 minutes for maximum impact</li>
                    <li style="margin-bottom:0;">Offer a specific next step (call, meeting, proposal)</li>
                  </ul>
                </div>
              </td>
            </tr>

            <!-- DIVIDER -->
            <tr>
              <td style="padding:0;">
                <div style="height:1px; background-color:#e2e8f0;"></div>
              </td>
            </tr>

            <!-- FOOTER: StratStudios branding -->
            <tr>
              <td style="padding:28px 32px; text-align:center; background:#fafbfc;">
                <div style="background:{{ACCENT_COLOUR}}; color:#fff; display:inline-block; padding:6px 14px; border-radius:20px; font-size:10px; font-weight:800;">
                  StratStudios
                </div>
                <div style="margin-top:12px; font-size:13px; color:#94a3b8;">
                  Your clients are online, are you?
                </div>
                <div style="font-size:12px; color:#cbd5e1;">
                  © {{YEAR}} StratStudios. All rights reserved.
                </div>
                {{#if submissionId}}
                <div style="font-size:10px; color:#cbd5e1; font-family:Courier New,monospace;">
                  Submission ID: {{submissionId}}
                </div>
                {{/if}}
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
```

---

### 7. THANK-YOU PAGE (thank-you.html)

After successful submission, Formspark redirects to this page via the `_redirect` hidden field.

Key requirements:
- `<meta name="robots" content="noindex, nofollow">` — prevent indexing
- Thank-you card with success icon, heading, message, "What Happens Next" steps
- Direct call/email links for urgency
- CTA buttons: "Return Home" + "Learn More About Us" (or contextual secondary)
- Same nav/footer as all other pages

---

### 8. FORMSPARK DASHBOARD CONFIGURATION

After building the files, configure Formspark via the dashboard:

1. **Create form** at https://formspark.io → copy the Form ID
2. **Email notification** → Enable → Set recipient to client's email
3. **Custom email template** → Paste the full email-template.html content
4. **Redirect URL** → Should match `_redirect` hidden field value (`thank-you`)
5. **Test** → Submit a test entry and verify:
   - Email arrives with all fields populated (no blank `{{data.xxx}}` variables)
   - WhatsApp button links to `https://wa.me/27XXXXXXXXX` (correct format)
   - Email button opens mailto with pre-filled subject
   - Redirect lands on thank-you page
   - Comments conditional shows "No comments included" when empty
   - Timestamp and Submission ID render in footer

---

### 9. FIELD NAME ↔ TEMPLATE VARIABLE MAPPING

This is the most error-prone part. Every form input's `name` attribute becomes `data.NAME` in the template.

| Form `name` attr | Template Variable          | Used In                                          |
|-------------------|---------------------------|--------------------------------------------------|
| `name`            | `{{data.name}}`           | Preheader, hero heading, WhatsApp btn, Email btn, Full Details |
| `email`           | `{{data.email}}`          | Preheader, contact cards, Email btn, Full Details |
| `phone`           | `{{data.phone}}`          | Contact cards, Full Details                      |
| `whatsapp`        | `{{data.whatsapp}}`       | WhatsApp button href                             |
| `comments`        | `{{data.comments}}`       | Full Details (with `{{#if}}` conditional)        |
| `_email.subject`  | N/A (Formspark internal)  | Sets email subject line                          |
| `_email.from`     | N/A (Formspark internal)  | Sets sender display name                         |
| `_redirect`       | N/A (Formspark internal)  | Post-submit redirect URL                         |

**Add rows for any client-specific fields** (e.g. `age` → `{{data.age}}`).

---

### 10. COMMON PITFALLS & DEBUGGING

1. **Blank variables in email** → You used `{{name}}` instead of `{{data.name}}`. ALL form fields need the `data.` prefix.
2. **WhatsApp link broken** → The hidden `whatsapp` field wasn't populated. Check that the inline JS runs AFTER the form exists in the DOM and the phone field `id` matches.
3. **Redirect not working** → The `_redirect` value must be a relative path without `.html` extension. Value `thank-you` redirects to `thank-you.html` on the same domain.
4. **Double submission** → Ensure the submit button is disabled on valid submission (the JS sets `disabled = true` and changes text to "Sending...").
5. **Form submits but no email** → Check Formspark dashboard: is notification enabled? Is the custom template valid HTML? Malformed Handlebars (unclosed `{{#if}}`) will silently fail.
6. **Comments shows raw Handlebars** → The `{{#if data.comments}}` block has a typo. Ensure the conditional exactly matches: `{{#if data.comments}}...{{else}}...{{/if}}`
7. **Validation not blocking** → `preventDefault()` must ONLY fire when validation fails. On success, the form must submit naturally (no `fetch()`, no `preventDefault()`).
8. **Country code wrong on WhatsApp** → The `formatWhatsApp()` function defaults to `27` (South Africa). Adjust for the client's country.

---

### 11. CHECKLIST BEFORE GOING LIVE

- [ ] Formspark form ID replaced in `action` URL
- [ ] `_email.subject` updated with client name
- [ ] All form field `name` attributes match template `{{data.xxx}}` variables
- [ ] Hidden `whatsapp` field present with matching inline JS
- [ ] Country code in `formatWhatsApp()` correct for client's country
- [ ] Email template uploaded to Formspark dashboard
- [ ] Email notification enabled and recipient set
- [ ] Test submission: all fields render in email (including empty comments)
- [ ] Test submission: WhatsApp button opens correct chat
- [ ] Test submission: Email button opens mailto with correct subject
- [ ] Test submission: redirect lands on thank-you page
- [ ] Thank-you page has `noindex, nofollow` meta tag
- [ ] Submit button shows "Sending..." and disables on submit
- [ ] Validation blocks empty required fields
- [ ] Email validation rejects malformed addresses
- [ ] Phone validation accepts digits, spaces, dashes, brackets, plus
- [ ] Accent colour replaced throughout email template (search for `#2C8F80`)
- [ ] StratStudios logo URL correct: `https://stratstudios.co.za/assets/img/logo2.jpg`
- [ ] Copyright year correct in email footer
```

---

## Quick Reference — The Zebra's Piano (Reference Implementation)

| Item                  | Value                                              |
|-----------------------|----------------------------------------------------|
| Formspark ID          | `Fb6AMkRZv`                                        |
| Email Subject         | `New Lead • The Zebra's Piano`                     |
| Custom Fields         | `age` (Age of Student)                             |
| Country Code          | `27` (South Africa)                                |
| Accent Colour         | `#2C8F80`                                          |
| Redirect              | `thank-you`                                        |
| Template Variables    | `data.name`, `data.email`, `data.phone`, `data.age`, `data.comments`, `data.whatsapp` |
