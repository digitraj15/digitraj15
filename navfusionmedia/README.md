# navfusionmedia.com

Website for Nav Fusion Media. Built with Next.js (App Router) and TypeScript. Hosted on Vercel.

## What's where

| Path | What it is |
| --- | --- |
| `config/site.ts` | **All editable content**: contact, WhatsApp, socials, stats, clients, services, pricing, testimonials, FAQ, form options. |
| `content/work/*.mdx` | Case studies. One file = one page at `/work/<file-name>`. |
| `content/work/_template.mdx` | Copy this to start a new case study. Files starting with `_` are not published. |
| `app/` | Pages and the `/api/lead` form endpoint. |
| `components/` | Header, footer, form, WhatsApp button, analytics. |
| `lib/lead.ts` | Sends form submissions by email and to Google Sheets. |
| `.env.example` | List of settings (keys, IDs). Copy to `.env.local`. |

## Before launch

Search the project for `PLACEHOLDER` and replace each one:

- [ ] `config/site.ts` → `contact.email`, `contact.whatsapp`
- [ ] `config/site.ts` → `socials` (your real channel URLs)
- [ ] `config/site.ts` → `stats` (real numbers, or delete the list to hide the section)
- [ ] `config/site.ts` → `clients` (add logos to `public/clients/`)
- [ ] `config/site.ts` → `pricing` (your real prices)
- [ ] `config/site.ts` → `testimonials` (real quotes, with permission — or empty the list to hide the section)
- [ ] `content/work/*.mdx` → `results` numbers and the "Results" section
- [ ] Optional: add a `cover:` image to each case study (put images in `public/work/`, e.g. `cover: "/work/navodayans-talk.jpg"`)

## Run it on your computer

Needs Node.js 20.9 or newer.

```bash
cd navfusionmedia
npm install
cp .env.example .env.local   # then fill in values
npm run dev                  # http://localhost:3000
```

Check before pushing:

```bash
npm run typecheck
npm run build
```

## Editing content

**Text, prices, links:** edit `config/site.ts` and save. Keep the quotes and commas as they are.

**New case study:**

1. Copy `content/work/_template.mdx` to `content/work/client-name.mdx` (lowercase, dashes, no spaces).
2. Fill in the top section (between the `---` lines) and write the page below it in Markdown.
3. `order:` controls position on the Work page (lower number = first). The home page shows the first 3.

**Hide a section:** empty its list in `config/site.ts`, e.g. `testimonials: []`.

## Contact form

The form posts to `/api/lead`. Each lead is sent to every channel you've set up:

1. **Email** to `LEAD_INBOX` — via Resend if `RESEND_API_KEY` is set, otherwise via SMTP if `SMTP_HOST` is set.
2. **Google Sheet** — if `APPS_SCRIPT_URL` is set.

If at least one works, the visitor sees the success message. If none work, they're asked to email or WhatsApp instead. Errors are logged in Vercel → Project → Logs.

A hidden "honeypot" field blocks basic spam bots.

### Option A: Resend (recommended)

1. Sign up at resend.com and create an API key → `RESEND_API_KEY`.
2. Resend → Domains → add `navfusionmedia.com` and add the DNS records it shows (see DNS below).
3. Set `LEAD_FROM="Nav Fusion Media <leads@navfusionmedia.com>"`.

Until the domain is verified, leave `LEAD_FROM` empty. Resend will then only deliver to the email you signed up with.

### Option B: SMTP (e.g. Gmail)

1. Turn on 2-Step Verification on the Google account.
2. Google Account → Security → App passwords → create one.
3. Set `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=587`, `SMTP_USER=<gmail address>`, `SMTP_PASS=<app password>`, `SMTP_FROM=<gmail address>`.

### Save leads to Google Sheets

1. Create a Google Sheet. Add these headers in row 1:
   `submittedAt | name | email | phone | interest | budget | message | page`
2. Extensions → Apps Script. Replace the code with:

   ```js
   function doPost(e) {
     const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
     const d = JSON.parse(e.postData.contents);
     sheet.appendRow([d.submittedAt, d.name, d.email, d.phone, d.interest, d.budget, d.message, d.page]);
     return ContentService.createTextOutput(JSON.stringify({ ok: true }))
       .setMimeType(ContentService.MimeType.JSON);
   }
   ```

3. Deploy → New deployment → type **Web app**. Execute as: **Me**. Who has access: **Anyone**.
4. Copy the Web app URL → `APPS_SCRIPT_URL`.

If you edit the script later, deploy a new version (Deploy → Manage deployments → Edit → New version).

## Analytics

Both load only if their ID is set.

- `GA4_ID` — Google Analytics → Admin → Data streams → your web stream → Measurement ID (`G-…`).
- `PIXEL_ID` — Meta Events Manager → Data sources → your Pixel → Pixel ID.

A successful form submission sends `generate_lead` to GA4 and `Lead` to Meta. In GA4, mark `generate_lead` as a key event.

These IDs are read at build time. After changing them on Vercel, redeploy.

## Deploy to Vercel

1. Push this repository to GitHub.
2. Go to vercel.com → **Add New… → Project** → import the repository.
3. **Root Directory:** click *Edit* and choose `navfusionmedia`. Framework preset: **Next.js** (auto-detected). Leave build settings as they are.
4. **Environment Variables:** add each value from `.env.example` that you use.
5. Click **Deploy**. You'll get a `*.vercel.app` URL — test the site and the form there first.

Every push to the main branch redeploys the site. Pushes to other branches get their own preview URL.

## Connect navfusionmedia.com

### 1. Add the domain in Vercel

Project → **Settings → Domains**:

1. Add `navfusionmedia.com`.
2. Add `www.navfusionmedia.com` and set it to **redirect to `navfusionmedia.com`** (308).

Vercel will show the exact DNS records to use. If they differ from the ones below, use Vercel's.

### 2. Add DNS records at your registrar

Where you bought the domain (GoDaddy, Hostinger, Namecheap, BigRock, Cloudflare, etc.) → DNS settings:

| Type | Name / Host | Value | TTL |
| --- | --- | --- | --- |
| A | `@` | `76.76.21.21` | Auto / 3600 |
| CNAME | `www` | `cname.vercel-dns.com` | Auto / 3600 |

- Delete any other `A` record on `@` and any other record on `www` (e.g. the registrar's "parked" page). They conflict.
- Don't touch `MX` records if you already get email on this domain.
- **Cloudflare:** set both records to **DNS only** (grey cloud), not proxied.

**Alternative:** point the domain's nameservers to Vercel (`ns1.vercel-dns.com`, `ns2.vercel-dns.com`). Then Vercel manages all DNS, and you must re-create any email (`MX`, `TXT`) records inside Vercel.

### 3. Wait and check

- DNS usually updates within minutes to a few hours (up to 48h).
- Vercel shows **Valid Configuration** when it's working, and issues the HTTPS certificate automatically.
- Check from a terminal: `dig navfusionmedia.com +short` should return `76.76.21.21`.

### 4. Email records for Resend (if using Resend)

Resend → Domains → `navfusionmedia.com` shows 2–3 records (usually `TXT` for SPF/DKIM and an `MX` on a `send` subdomain). Add them at the same DNS provider, exactly as shown. They don't affect the website or your existing inbox.

### 5. After it's live

- Google Search Console → add `navfusionmedia.com` → submit `https://navfusionmedia.com/sitemap.xml`.
- Send a test lead from the live site and confirm it arrives by email and in the Sheet.
