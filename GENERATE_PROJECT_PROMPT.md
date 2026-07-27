# ShopFlow Pro — AI Agent Project Generation Prompt

> **HOW TO USE THIS FILE**
> Copy everything below the horizontal rule (`---`) and paste it verbatim as a single prompt into any capable agentic AI coding assistant (e.g., Claude, Gemini, GPT-4o, Cursor Agent, Windsurf, etc.). The agent will generate the entire project in one shot.

---

## YOUR TASK

You are an expert full-stack developer. Your job is to **build a complete, production-ready, mobile-first retail Stock Management Web App called "ShopFlow Pro"** from scratch as a single-page application (SPA). This is an **entirely new, standalone project** — do not reference or depend on any pre-existing code.

**Read every section of this prompt carefully before writing a single line of code.** Your output must be a working project that can be deployed immediately.

---

## 1. PROJECT OVERVIEW & PHILOSOPHY

**ShopFlow Pro** is a lightweight, ultra-fast, offline-capable Point-of-Sale (POS) and inventory management system designed for small physical retail shops. Every design and technical decision must prioritize:

- **Speed**: A transaction must be completable in under 15 seconds.
- **Simplicity**: A non-technical shop owner should be able to use it with zero training.
- **Reliability**: Must work even when internet goes down (offline-first PWA).
- **Cost**: $0 running cost forever using free-tier Supabase + GitHub Pages / Vercel / Netlify.

---

## 2. TECH STACK (MANDATORY — DO NOT DEVIATE)

| Layer | Technology | Notes |
|---|---|---|
| **Structure** | HTML5 (Semantic) | Single `index.html` — ALL app code lives here |
| **Styling** | Vanilla CSS (no Tailwind, no Bootstrap) | All styles in a `<style>` block inside `index.html` |
| **Logic** | Vanilla JavaScript (ES2022+, no bundler) | All JS in `<script>` blocks inside `index.html` |
| **Database** | Supabase (PostgreSQL) | Free tier, no server required |
| **Auth** | Supabase Auth | Email/password + Google OAuth |
| **Offline** | PWA + IndexedDB via Dexie.js (CDN) | Service Worker (`sw.js`) for asset caching |
| **Barcode** | QuaggaJS or ZXing via CDN | Camera-based barcode scanning |
| **PDF** | html2pdf.js via CDN | Client-side PDF generation |
| **Icons** | Font Awesome 6 via CDN | |
| **Fonts** | Google Fonts: "Inter" + "Outfit" | |
| **Hosting** | GitHub Pages | Static hosting — works perfectly with a single HTML file |

---

## 3. FILE & DIRECTORY STRUCTURE

Create exactly this structure. **All application code (HTML, CSS, JavaScript) lives inside `index.html`.** The only separate files are static data/config assets that the browser fetches at runtime — this pattern is fully compatible with GitHub Pages.

```
shopflow-pro/
├── index.html                  # ★ THE ENTIRE APP — HTML structure + <style> + <script>
│                               #   Contains: all screens, design system CSS, Supabase client,
│                               #   Dexie/IndexedDB setup, POS logic, inventory, invoices,
│                               #   customers, reports, settings, scanner, auth, router, SW registration
├── sw.js                       # Service Worker (MUST be a separate file — browser requirement)
├── manifest.json               # PWA web app manifest (fetched by browser from <link> tag)
├── suggestions.json            # Product/category autocomplete data (fetched via fetch() at runtime)
├── .nojekyll                   # REQUIRED: empty file that tells GitHub Pages to skip Jekyll processing.
│                               # Without this, GitHub's Jekyll engine may corrupt your JSON files or
│                               # silently ignore files it considers "special". Create it as an empty file.
├── icons/
│   ├── icon-192.png            # PWA icon 192x192
│   └── icon-512.png            # PWA icon 512x512
├── .github/
│   └── workflows/
│       └── keep-alive.yml      # GitHub Actions cron to prevent Supabase free-tier pause
└── README.md                   # Setup + deployment guide
```

> **Why this works on GitHub Pages:** GitHub Pages serves all files as static assets. The browser fetches `sw.js`, `manifest.json`, `suggestions.json`, and icons the same way it fetches any other file — via standard HTTP GET. No server-side rendering or module bundler is required.

### `index.html` Internal Structure

Organize `index.html` in this order:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ShopFlow Pro</title>
  <link rel="manifest" href="./manifest.json">
  <meta name="theme-color" content="#6366f1">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  <script src="https://cdn.jsdelivr.net/npm/dexie@3.2.4/dist/dexie.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/quagga@0.12.1/dist/quagga.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <!-- NOTE: UMD scripts above attach globals: window.Dexie, window.supabase, window.Quagga, window.html2pdf, window.Chart -->
  <style>
    /* ===== DESIGN SYSTEM ===== */
    /* :root CSS custom properties */
    /* Reset & base typography */
    /* Layout utilities */
    /* Component styles: buttons, cards, modals, toasts, nav, etc. */
    /* Screen-specific styles (one comment block per screen) */
    /* Animations & keyframes */
    /* Responsive media queries (640px, 1024px breakpoints) */
    /* @media print styles for thermal receipts */
  </style>
</head>
<body>
  <!-- ===== APP SCREENS (hidden/shown via JS) ===== -->
  <!-- Screen: Welcome/Auth -->
  <!-- Screen: Shop Setup -->
  <!-- Screen: POS/Billing -->
  <!-- Screen: Inventory -->
  <!-- Screen: Invoices -->
  <!-- Screen: Customers -->
  <!-- Screen: Reports & Expenses -->
  <!-- Screen: Settings -->
  <!-- ===== SHARED UI COMPONENTS ===== -->
  <!-- Toast container -->
  <!-- Modal overlays -->
  <!-- Camera scanner overlay -->
  <!-- Confirm dialog -->

  <script type="module">
    // ===== MODULE SECTIONS (use // ===== SECTION: Name ===== comment headers) =====
    // SECTION: Config & Constants
    // CRITICAL: <script type="module"> has its own scope. UMD globals loaded via plain <script> tags
    // attach to `window`, NOT to the module scope as bare names. You MUST reference them as:
    //   window.Dexie          → for Dexie
    //   window.supabase.createClient  → for Supabase
    //   window.Quagga         → for QuaggaJS
    //   window.html2pdf       → for html2pdf.js
    //   window.Chart          → for Chart.js
    // OR destructure them at the very top of your script:
    const { Dexie } = window;
    const { createClient } = window.supabase;
    const { Quagga } = window;
    const { Chart } = window;
    // html2pdf() is called as window.html2pdf() directly

    const SUPABASE_URL     = 'YOUR_SUPABASE_URL_HERE';
    const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY_HERE';
    const supabaseClient   = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    // SECTION: Supabase Client     (supabase.createClient init)
    // SECTION: Dexie / IndexedDB   (db schema, version, stores)
    // SECTION: App State           (currentUser, currentSale, shopProfile, etc.)
    // SECTION: Auth                (login, signup, logout, session handling)
    // SECTION: Router              (showScreen(), navigation, bottom tab handlers)
    // SECTION: Sync Engine         (sync queue, online/offline handlers, indicator)
    // SECTION: POS                 (search, cart, billing, customer typeahead, sale completion)
    // SECTION: Scanner             (USB barcode heuristic, camera QuaggaJS/ZXing)
    // SECTION: Inventory           (product list, add/edit modal, stock adjustment)
    // SECTION: Invoices            (list, filters, detail modal, returns, cancel)
    // SECTION: Customers           (list, add/edit, detail panel, merge duplicate)
    // SECTION: Reports             (summary cards, charts, EOD reconciliation, CSV export)
    // SECTION: Expenses            (expense list, add/edit modal)
    // SECTION: Settings            (shop profile, POS prefs, data management, account)

    // SECTION: Suggestions Loader
    // IMPORTANT: Use './suggestions.json' (relative path) — NOT '/suggestions.json'.
    // A leading slash would point to the domain root and will 404 on GitHub Pages
    // project pages (https://user.github.io/repo-name/).
    // A relative path always resolves to the same folder as index.html, regardless of host.
    let suggestions = { categories: [], units: [], products: [], expense_categories: [] };
    async function loadSuggestions() {
      try {
        const res = await fetch('./suggestions.json');
        suggestions = await res.json();
      } catch (e) { console.warn('suggestions.json not loaded', e); }
    }

    // SECTION: Bootstrap
    // Service Worker registration:
    // Use './sw.js' (relative) — NOT '/sw.js'. The relative path resolves correctly
    // on both GitHub Pages project pages AND custom domains without any config changes.
    document.addEventListener('DOMContentLoaded', async () => {
      await loadSuggestions();
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js')
          .then(reg => console.log('SW registered, scope:', reg.scope))
          .catch(err => console.error('SW registration failed:', err));
      }
      // ... init auth, show first screen, etc.
    });
  </script>
</body>
</html>
```

---

## 4. SUPABASE SETUP (EXTERNAL PLATFORM)

### 4A. Create the Project
1. Go to https://supabase.com → New Project.
2. Set a strong database password, choose a region close to your users.
3. Copy the **Project URL** and **anon public key** — you will paste them into `index.html` (see Section 4D).

### 4B. Run This SQL in the Supabase SQL Editor

```sql
-- =========================================================
-- SHOPFLOW PRO — COMPLETE DATABASE SCHEMA
-- Run this entire block in Supabase SQL Editor
-- =========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- TABLE: shop_profiles
-- Stores per-user shop configuration
CREATE TABLE IF NOT EXISTS shop_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  shop_name TEXT NOT NULL DEFAULT 'My Shop',
  owner_name TEXT,
  phone TEXT,
  address TEXT,
  gstin TEXT,
  currency_symbol TEXT DEFAULT '₹',
  low_stock_threshold INT DEFAULT 5,
  receipt_footer TEXT DEFAULT 'Thank you for your purchase!',
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- TABLE: products
-- The central inventory catalog
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  barcode TEXT,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'General',
  unit TEXT DEFAULT 'pcs',
  cost_price NUMERIC(12, 2) NOT NULL DEFAULT 0,
  sale_price NUMERIC(12, 2) NOT NULL DEFAULT 0,
  mrp NUMERIC(12, 2),
  stock_quantity INT DEFAULT 0,
  min_stock_alert INT DEFAULT 5,
  is_active BOOLEAN DEFAULT TRUE,
  image_url TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, barcode)
);

-- TABLE: customers
-- Tracks customer profiles for history
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  address TEXT,
  total_purchases NUMERIC(14, 2) DEFAULT 0,
  visit_count INT DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- TABLE: invoices
-- Master record per transaction / sale
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  invoice_number TEXT UNIQUE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  customer_name TEXT,
  customer_phone TEXT,
  subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0,
  discount_type TEXT CHECK (discount_type IN ('flat', 'percent', 'none')) DEFAULT 'none',
  discount_value NUMERIC(10, 2) DEFAULT 0,
  tax_percent NUMERIC(5, 2) DEFAULT 0,
  tax_amount NUMERIC(12, 2) DEFAULT 0,
  total_amount NUMERIC(12, 2) NOT NULL,
  amount_paid NUMERIC(12, 2) DEFAULT 0,
  change_due NUMERIC(12, 2) DEFAULT 0,
  payment_method TEXT CHECK (payment_method IN ('cash', 'card', 'upi', 'split', 'credit')) DEFAULT 'cash',
  payment_split JSONB,
  status TEXT CHECK (status IN ('completed', 'returned', 'partial_return', 'cancelled')) DEFAULT 'completed',
  notes TEXT,
  synced BOOLEAN DEFAULT FALSE,
  is_return BOOLEAN DEFAULT FALSE,
  original_invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- TABLE: invoice_items
-- Line items for each invoice
CREATE TABLE IF NOT EXISTS invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  barcode TEXT,
  quantity INT NOT NULL CHECK (quantity != 0),
  unit_price NUMERIC(12, 2) NOT NULL,
  cost_price NUMERIC(12, 2) DEFAULT 0,
  discount NUMERIC(10, 2) DEFAULT 0,
  total NUMERIC(12, 2) NOT NULL
);

-- TABLE: stock_adjustments
-- Manual stock-in, adjustments, losses
CREATE TABLE IF NOT EXISTS stock_adjustments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  adjustment_type TEXT CHECK (adjustment_type IN ('stock_in', 'stock_out', 'correction', 'return', 'damage', 'expiry')) NOT NULL,
  quantity_change INT NOT NULL,
  stock_before INT,
  stock_after INT,
  cost_per_unit NUMERIC(12, 2),
  reference_note TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- TABLE: expense_entries
-- Track daily shop expenses
CREATE TABLE IF NOT EXISTS expense_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL DEFAULT 'General',
  description TEXT NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  expense_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- FUNCTION + TRIGGER: Auto-deduct stock on sale
CREATE OR REPLACE FUNCTION deduct_stock_on_sale()
RETURNS TRIGGER AS $$
DECLARE
  v_stock_before INT;
BEGIN
  IF NEW.quantity > 0 THEN
    SELECT stock_quantity INTO v_stock_before FROM products WHERE id = NEW.product_id;
    UPDATE products
      SET stock_quantity = stock_quantity - NEW.quantity,
          updated_at = now()
      WHERE id = NEW.product_id;
    INSERT INTO stock_adjustments (user_id, product_id, adjustment_type, quantity_change, stock_before, stock_after, cost_per_unit, reference_note)
      SELECT p.user_id, NEW.product_id, 'stock_out', -NEW.quantity, v_stock_before, v_stock_before - NEW.quantity, NEW.cost_price, CONCAT('Invoice: ', i.invoice_number)
      FROM invoices i JOIN products p ON p.id = NEW.product_id
      WHERE i.id = NEW.invoice_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_deduct_stock
AFTER INSERT ON invoice_items
FOR EACH ROW EXECUTE FUNCTION deduct_stock_on_sale();

-- FUNCTION + TRIGGER: Update customer totals on new invoice
CREATE OR REPLACE FUNCTION update_customer_on_invoice()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.customer_id IS NOT NULL THEN
    UPDATE customers
      SET total_purchases = total_purchases + NEW.total_amount,
          visit_count = visit_count + 1,
          updated_at = now()
      WHERE id = NEW.customer_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_update_customer
AFTER INSERT ON invoices
FOR EACH ROW EXECUTE FUNCTION update_customer_on_invoice();

-- ROW LEVEL SECURITY (RLS)
ALTER TABLE shop_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_adjustments ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own profile" ON shop_profiles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own products" ON products FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own customers" ON customers FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own invoices" ON invoices FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own invoice items" ON invoice_items FOR ALL
  USING (EXISTS (SELECT 1 FROM invoices WHERE invoices.id = invoice_items.invoice_id AND invoices.user_id = auth.uid()));
CREATE POLICY "Users manage own adjustments" ON stock_adjustments FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own expenses" ON expense_entries FOR ALL USING (auth.uid() = user_id);

-- Auto-generate sequential invoice numbers
CREATE SEQUENCE IF NOT EXISTS invoice_seq START 1001;
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.invoice_number IS NULL THEN
    NEW.invoice_number := 'INV-' || LPAD(nextval('invoice_seq')::TEXT, 6, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_invoice_number
BEFORE INSERT ON invoices
FOR EACH ROW EXECUTE FUNCTION generate_invoice_number();

-- STORAGE: Run these separately in SQL editor after creating your project
-- INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);
-- CREATE POLICY "Allow auth uploads" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'product-images');
-- CREATE POLICY "Allow public reads" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
```

### 4C. Configure Supabase Auth Redirect URLs for GitHub Pages

**This step is critical for login to work after deployment.**

In your **Supabase Dashboard → Authentication → URL Configuration**:

1. **Site URL** → set to: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`
2. **Redirect URLs** → add: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/*`
   (The wildcard `*` covers all paths under your app)

In **Google Cloud Console** (if using Google OAuth) → OAuth 2.0 Client → Authorized redirect URIs → add:
```
https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback
```
(This is the Supabase callback URL, not your GitHub Pages URL — it never changes.)

In `index.html`, when calling `signInWithOAuth`, pass `redirectTo` explicitly:
```js
await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: window.location.origin + window.location.pathname
    // Using window.location makes this work on both localhost AND GitHub Pages
    // without hardcoding any URL.
  }
});
```

### 4D. Configure Credentials in Code

In `index.html`, find the **`// SECTION: Config & Constants`** block at the top of the `<script type="module">` tag and replace the placeholders:
```js
// ===== SECTION: Config & Constants =====
const SUPABASE_URL  = "https://YOUR_PROJECT_ID.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_ANON_PUBLIC_KEY_HERE";
```

> **Do NOT put these in a separate `.env` file** — GitHub Pages serves raw files, so `.env` is not processed. The anon key is safe to be public (it is designed for browser use and protected by Row Level Security).

---

## 5. GITHUB ACTIONS KEEP-ALIVE (PREVENTS SUPABASE FREE-TIER PAUSE)

Create `.github/workflows/keep-alive.yml` with this exact content:

```yaml
# Pings Supabase every 3 days to prevent free-tier project from pausing.
# Supabase pauses inactive projects after 7 days. This runs every 3 days.

name: Supabase Keep-Alive Ping

on:
  schedule:
    - cron: '0 9 */3 * *'   # Every 3 days at 09:00 UTC
  workflow_dispatch:          # Allow manual trigger from GitHub UI

jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - name: Ping Supabase REST API
        run: |
          HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
            -H "apikey: ${{ secrets.SUPABASE_ANON_KEY }}" \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_ANON_KEY }}" \
            "${{ secrets.SUPABASE_URL }}/rest/v1/products?limit=1")
          echo "Supabase ping returned HTTP $HTTP_STATUS"
          if [ "$HTTP_STATUS" -ge 200 ] && [ "$HTTP_STATUS" -lt 400 ]; then
            echo "Supabase is alive."
          else
            echo "Unexpected response: $HTTP_STATUS"
          fi
```

**Setup Steps:**
1. Go to your GitHub repo → Settings → Secrets and variables → Actions → New repository secret.
2. Add secret `SUPABASE_URL` → value: your Supabase Project URL.
3. Add secret `SUPABASE_ANON_KEY` → value: your Supabase anon public key.

---

## 6. PWA MANIFEST & SERVICE WORKER

### `manifest.json`

> **GitHub Pages critical:** `start_url` MUST be `"."` (relative), NOT `"/"`. An absolute `/` points to the GitHub Pages root domain, not your repo subfolder. Icon paths must also be relative (no leading slash).

```json
{
  "name": "ShopFlow Pro",
  "short_name": "ShopFlow",
  "description": "Fast, offline-ready POS and Stock Management for retail shops",
  "start_url": ".",
  "scope": ".",
  "display": "standalone",
  "background_color": "#0f172a",
  "theme_color": "#6366f1",
  "orientation": "portrait-primary",
  "icons": [
    { "src": "icons/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any maskable" },
    { "src": "icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable" }
  ]
}
```

### `sw.js` — Service Worker

> **Note:** `sw.js` MUST remain a separate file. Service Workers cannot be inline in HTML — the browser requires them to be registered from a standalone `.js` file at a specific URL path.

> **GitHub Pages critical:** GitHub Pages hosts project repos at `https://username.github.io/repo-name/` — a subdirectory, **not** the root. All absolute paths (`/index.html`) resolve to the domain root and will 404. The solution is to derive the base path dynamically from `self.location` so the same `sw.js` works on any host (localhost, GitHub Pages, custom domain).

```js
const CACHE_NAME = 'shopflow-v1';

// Derive the base path from where sw.js is located.
// On GitHub Pages: self.location.pathname = '/repo-name/sw.js' → base = '/repo-name/'
// On custom domain: self.location.pathname = '/sw.js'           → base = '/'
// On localhost:     self.location.pathname = '/sw.js'           → base = '/'
const BASE = self.location.pathname.replace(/sw\.js$/, '');

// All paths are relative to BASE so this works on every host automatically.
const ASSETS_TO_CACHE = [
  BASE,
  BASE + 'index.html',
  BASE + 'suggestions.json',
  BASE + 'manifest.json',
  BASE + 'icons/icon-192.png',
  BASE + 'icons/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  // Let CDN requests (fonts, libraries) pass through with network-first.
  // Cache app shell and local data files with cache-first strategy.
  const url = new URL(event.request.url);
  const isExternal = url.origin !== self.location.origin;
  if (isExternal) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      });
    })
  );
});
```

---

## 7. SUGGESTIONS JSON FILE

Create `suggestions.json` with this complete structure. Populate all categories with realistic items:

```json
{
  "categories": [
    "Groceries", "Beverages", "Snacks", "Dairy", "Personal Care",
    "Cleaning", "Electronics", "Stationery", "Clothing", "Hardware",
    "Medicines", "Baby Products", "Pet Supplies", "Confectionery", "General"
  ],
  "units": [
    "pcs", "kg", "g", "L", "mL", "box", "pack", "pair", "dozen",
    "bundle", "roll", "sheet", "bottle", "can", "sachet"
  ],
  "products": [
    { "name": "Amul Butter 100g", "category": "Dairy", "unit": "pcs", "sale_price": 55 },
    { "name": "Amul Butter 500g", "category": "Dairy", "unit": "pcs", "sale_price": 260 },
    { "name": "Amul Gold Full Cream Milk 1L", "category": "Dairy", "unit": "pcs", "sale_price": 66 },
    { "name": "Amul Taaza Toned Milk 500ml", "category": "Dairy", "unit": "pcs", "sale_price": 27 },
    { "name": "Britannia Good Day Biscuits 100g", "category": "Snacks", "unit": "pcs", "sale_price": 20 },
    { "name": "Parle-G Biscuits 800g", "category": "Snacks", "unit": "pcs", "sale_price": 60 },
    { "name": "Lay's Classic Salted 26g", "category": "Snacks", "unit": "pcs", "sale_price": 20 },
    { "name": "Kurkure Masala Munch 90g", "category": "Snacks", "unit": "pcs", "sale_price": 30 },
    { "name": "Haldirams Aloo Bhujia 200g", "category": "Snacks", "unit": "pcs", "sale_price": 75 },
    { "name": "Maggi 2-Minute Noodles 70g", "category": "Groceries", "unit": "pcs", "sale_price": 14 },
    { "name": "Maggi Masala Noodles 12-Pack", "category": "Groceries", "unit": "pack", "sale_price": 160 },
    { "name": "Surf Excel Easy Wash 500g", "category": "Cleaning", "unit": "pcs", "sale_price": 85 },
    { "name": "Surf Excel Matic Liquid 1L", "category": "Cleaning", "unit": "pcs", "sale_price": 290 },
    { "name": "Ariel Washing Powder 1kg", "category": "Cleaning", "unit": "pcs", "sale_price": 210 },
    { "name": "Vim Dishwash Bar 300g", "category": "Cleaning", "unit": "pcs", "sale_price": 40 },
    { "name": "Colgate Strong Teeth 200g", "category": "Personal Care", "unit": "pcs", "sale_price": 70 },
    { "name": "Colgate MaxFresh 150g", "category": "Personal Care", "unit": "pcs", "sale_price": 90 },
    { "name": "Listerine Cool Mint 500ml", "category": "Personal Care", "unit": "pcs", "sale_price": 260 },
    { "name": "Dove Body Wash 250ml", "category": "Personal Care", "unit": "pcs", "sale_price": 180 },
    { "name": "Dettol Handwash 250ml", "category": "Personal Care", "unit": "pcs", "sale_price": 95 },
    { "name": "Lifebuoy Total 10 Hand Wash 190ml", "category": "Personal Care", "unit": "pcs", "sale_price": 75 },
    { "name": "Pantene Anti-Hairfall Shampoo 340ml", "category": "Personal Care", "unit": "pcs", "sale_price": 295 },
    { "name": "Head & Shoulders 340ml", "category": "Personal Care", "unit": "pcs", "sale_price": 310 },
    { "name": "Nivea Men Face Wash 100ml", "category": "Personal Care", "unit": "pcs", "sale_price": 145 },
    { "name": "Gillette Mach3 Razor", "category": "Personal Care", "unit": "pcs", "sale_price": 199 },
    { "name": "Coca-Cola 750ml", "category": "Beverages", "unit": "pcs", "sale_price": 45 },
    { "name": "Coca-Cola 2L", "category": "Beverages", "unit": "pcs", "sale_price": 95 },
    { "name": "Pepsi 750ml", "category": "Beverages", "unit": "pcs", "sale_price": 45 },
    { "name": "Sprite 750ml", "category": "Beverages", "unit": "pcs", "sale_price": 45 },
    { "name": "Limca 750ml", "category": "Beverages", "unit": "pcs", "sale_price": 45 },
    { "name": "Minute Maid Pulpy Orange 1L", "category": "Beverages", "unit": "pcs", "sale_price": 90 },
    { "name": "Real Fruit Power Apple 1L", "category": "Beverages", "unit": "pcs", "sale_price": 95 },
    { "name": "Red Bull 250ml", "category": "Beverages", "unit": "pcs", "sale_price": 130 },
    { "name": "Bisleri Water 1L", "category": "Beverages", "unit": "pcs", "sale_price": 20 },
    { "name": "Bisleri Water 500ml", "category": "Beverages", "unit": "pcs", "sale_price": 15 },
    { "name": "Kinley Soda 750ml", "category": "Beverages", "unit": "pcs", "sale_price": 35 },
    { "name": "Nescafe Classic 50g", "category": "Beverages", "unit": "pcs", "sale_price": 210 },
    { "name": "Tata Tea Gold 250g", "category": "Beverages", "unit": "pcs", "sale_price": 120 },
    { "name": "Bru Instant Coffee 50g", "category": "Beverages", "unit": "pcs", "sale_price": 100 },
    { "name": "Rooh Afza Sharbat 700ml", "category": "Beverages", "unit": "pcs", "sale_price": 185 },
    { "name": "Fortune Sunflower Oil 1L", "category": "Groceries", "unit": "pcs", "sale_price": 140 },
    { "name": "Fortune Sunflower Oil 5L", "category": "Groceries", "unit": "pcs", "sale_price": 670 },
    { "name": "Aashirvaad Atta 5kg", "category": "Groceries", "unit": "pcs", "sale_price": 280 },
    { "name": "India Gate Basmati Rice 1kg", "category": "Groceries", "unit": "pcs", "sale_price": 130 },
    { "name": "India Gate Basmati Rice 5kg", "category": "Groceries", "unit": "pcs", "sale_price": 620 },
    { "name": "Tata Salt 1kg", "category": "Groceries", "unit": "pcs", "sale_price": 28 },
    { "name": "MDH Chicken Masala 100g", "category": "Groceries", "unit": "pcs", "sale_price": 75 },
    { "name": "Everest Garam Masala 50g", "category": "Groceries", "unit": "pcs", "sale_price": 52 },
    { "name": "Kissan Mixed Fruit Jam 500g", "category": "Groceries", "unit": "pcs", "sale_price": 145 },
    { "name": "Britannia Brown Bread 400g", "category": "Groceries", "unit": "pcs", "sale_price": 50 },
    { "name": "Hajmola Regular 120 Tablets", "category": "Medicines", "unit": "pcs", "sale_price": 70 },
    { "name": "Digene Gel 200ml", "category": "Medicines", "unit": "pcs", "sale_price": 130 },
    { "name": "Band-Aid Standard Pack of 10", "category": "Medicines", "unit": "pack", "sale_price": 40 },
    { "name": "Burnol Cream 20g", "category": "Medicines", "unit": "pcs", "sale_price": 55 },
    { "name": "Electral ORS Sachet 21g", "category": "Medicines", "unit": "pcs", "sale_price": 20 },
    { "name": "Pudin Hara 10 Capsules", "category": "Medicines", "unit": "pcs", "sale_price": 30 },
    { "name": "Vicks VapoRub 25ml", "category": "Medicines", "unit": "pcs", "sale_price": 70 },
    { "name": "Dettol Antiseptic Liquid 250ml", "category": "Medicines", "unit": "pcs", "sale_price": 130 },
    { "name": "Reynolds Ball Pen Blue 10-Pack", "category": "Stationery", "unit": "pack", "sale_price": 80 },
    { "name": "Notebook Single Line 200 pages", "category": "Stationery", "unit": "pcs", "sale_price": 60 },
    { "name": "A4 Paper 500 Sheets Ream", "category": "Stationery", "unit": "pcs", "sale_price": 350 },
    { "name": "Stapler with 1000 Pins", "category": "Stationery", "unit": "pcs", "sale_price": 120 },
    { "name": "Scotch Tape 24mm x 50m", "category": "Stationery", "unit": "pcs", "sale_price": 55 },
    { "name": "Fevicol SH 250g", "category": "Stationery", "unit": "pcs", "sale_price": 95 },
    { "name": "Eveready Battery AA Pack of 4", "category": "Electronics", "unit": "pack", "sale_price": 80 },
    { "name": "Eveready Battery AAA Pack of 4", "category": "Electronics", "unit": "pack", "sale_price": 80 },
    { "name": "Wipro LED Bulb 9W", "category": "Electronics", "unit": "pcs", "sale_price": 130 },
    { "name": "Philips LED Bulb 7W", "category": "Electronics", "unit": "pcs", "sale_price": 110 },
    { "name": "Extension Cord 4-Socket 3m", "category": "Electronics", "unit": "pcs", "sale_price": 450 },
    { "name": "USB-C Cable 1m", "category": "Electronics", "unit": "pcs", "sale_price": 200 },
    { "name": "USB-A to Micro-USB Cable 1m", "category": "Electronics", "unit": "pcs", "sale_price": 150 },
    { "name": "M-Seal Epoxy Compound 50g", "category": "Hardware", "unit": "pcs", "sale_price": 75 },
    { "name": "Harpic Power Plus Toilet Cleaner 1L", "category": "Cleaning", "unit": "pcs", "sale_price": 140 },
    { "name": "Colin Glass Cleaner 500ml", "category": "Cleaning", "unit": "pcs", "sale_price": 110 },
    { "name": "Good Knight Liquid Refill 45ml", "category": "Personal Care", "unit": "pcs", "sale_price": 90 },
    { "name": "Hit Cockroach Spray 200ml", "category": "Cleaning", "unit": "pcs", "sale_price": 155 },
    { "name": "Odonil Air Freshener 75g", "category": "Cleaning", "unit": "pcs", "sale_price": 60 },
    { "name": "Plastic Carry Bag Large 50pcs", "category": "General", "unit": "pack", "sale_price": 80 },
    { "name": "Disposable Cups 100ml 50pcs", "category": "General", "unit": "pack", "sale_price": 60 },
    { "name": "Aluminum Foil Roll 9m", "category": "General", "unit": "pcs", "sale_price": 75 },
    { "name": "Pampers Baby Dry S 32 Diapers", "category": "Baby Products", "unit": "pack", "sale_price": 560 },
    { "name": "Johnson Baby Powder 100g", "category": "Baby Products", "unit": "pcs", "sale_price": 99 },
    { "name": "Mamy Poko Pants XL 36 Diapers", "category": "Baby Products", "unit": "pack", "sale_price": 820 },
    { "name": "Cadbury Dairy Milk 36g", "category": "Confectionery", "unit": "pcs", "sale_price": 20 },
    { "name": "Cadbury Dairy Milk Silk 60g", "category": "Confectionery", "unit": "pcs", "sale_price": 55 },
    { "name": "KitKat 2-Finger 13.5g", "category": "Confectionery", "unit": "pcs", "sale_price": 20 },
    { "name": "5 Star Chocolate 22g", "category": "Confectionery", "unit": "pcs", "sale_price": 20 },
    { "name": "Perk Chocolate 13g", "category": "Confectionery", "unit": "pcs", "sale_price": 10 },
    { "name": "Chewing Gum Center Fresh 5pcs", "category": "Confectionery", "unit": "pcs", "sale_price": 5 }
  ],
  "expense_categories": [
    "Rent", "Electricity", "Staff Salary", "Transport", "Packaging",
    "Marketing", "Repairs & Maintenance", "Fuel", "Miscellaneous", "Taxes & Fees",
    "Water Bill", "Internet & Phone", "Shop Supplies", "Security"
  ]
}
```

---

## 8. COMPLETE FEATURE SPECIFICATION

### 8A. AUTHENTICATION & ONBOARDING

**Screen 0 — Welcome / Gatekeeper**
- Animated app logo with gradient glow effect.
- Tagline: "Your shop, at your fingertips."
- Options: **Login / Sign Up** | **Continue as Guest (Local Offline)**.
- **Session Memory Persistence (CRITICAL)**: Store authentication or guest choice in `localStorage` (`shopflow_session`). On page load / refresh, if a session exists, bypass Screen 0 entirely, show the app shell (sidebar & topbar), and navigate directly to the active tab (`#/pos`). If no session exists, hide the sidebar, topbar, and bottom nav completely — show ONLY Screen 0.

**Auth Modal**
- Email/password login and signup tabs.
- Google OAuth button.
- Forgot password → sends email reset link via Supabase.
- On login/signup success → store session in `localStorage` and launch app shell.

**Screen 1 — Shop Setup (First-time only)**
- Required: Shop Name. Optional: Owner Name, Phone, Address, GSTIN/Tax Number, Currency Symbol (default ₹), Default low-stock threshold, Receipt footer text.
- Logo upload field (stores to Supabase Storage bucket `product-images`).
- Live preview card shows how shop name appears on receipts as user types.
- "Save & Enter My Shop" button.

---

### 8B. MAIN APP SHELL & STRICT SCREEN ISOLATION

**Navigation — Bottom Tab Bar (mobile, visible when authenticated):**
- POS (cart icon) | Inventory (box icon) | Invoices (receipt icon) | Reports (chart icon) | Settings (gear icon)

**Navigation — Left Sidebar (desktop, visible when authenticated):**
- Same 5 tabs + Settings + Profile
- App logo at top, user avatar + shop name at bottom.

**Top Bar (visible when authenticated):**
- Shop logo/name (left).
- Online indicator: 🟢 dot when connected, 🟠 dot + "X queued" when offline.
- User avatar button → dropdown: Edit Shop Profile, Settings, Logout.
- **Strict Screen Isolation (CRITICAL)**: All navigation uses JS screen switching with hash-based routing (`#/pos`, `#/inventory`, `#/invoices`, `#/customers`, `#/reports`, `#/settings`). When a screen is selected, ALL OTHER SCREENS are strictly hidden (`display: none !important`). Exactly one screen is visible at any given time.

---

### 8C. SCREEN: POS / BILLING (PRIMARY SCREEN — LOADS BY DEFAULT FOR RETURNING USERS)

**Layout: Split Panel**
- **Desktop**: Left 60% = cart area. Right 40% = billing summary panel.
- **Mobile**: Top = search + cart. Bottom = billing summary (collapsible drawer).

**Product Search Area**
- Large search bar, always auto-focused. Placeholder: "Scan barcode or search product..."
- `Spacebar` refocuses search from anywhere on the POS screen.
- Instant fuzzy search (checks IndexedDB first for speed). Results appear below the search bar.
- USB barcode scanner support: if input arrives in < 80ms burst ending with Enter, treat as barcode scan — look up product by barcode field.
- Camera scan button opens a full-screen overlay using QuaggaJS or ZXing for rear-camera scanning.
- Each result card shows: product name, category, sale price, stock badge (🔴 if low/out, 🟢 if ample).
- Clicking/tapping a result adds 1 quantity to cart. Clicking again adds another.

**Cart**
- Each row: product name (truncated), category chip, [−] qty input [+], unit price, row total (qty × price), ✕ remove.
- Qty input is directly editable — user can type any number.
- Cart is persisted to `sessionStorage` (survives F5 refresh).
- Swipe-to-delete gesture on mobile cart rows.

**Quick-Pick Grid**
- Displayed below search on mobile / above search results on desktop.
- Shows the 12 most-sold products (computed from invoice_items history, cached in IndexedDB).
- Each tile: color-coded initial avatar (if no image), short name, sale price, [+] button.
- Horizontally scrollable strip on mobile, 3-column grid on desktop.

**Billing Summary Panel**
- **Customer Smart-Lookup Field (CRITICAL — implement this exactly):**
  - A single input field labeled "Customer name or phone..." sitting at the top of the billing panel.
  - As the user types (debounced 250ms), perform a **live search** against the `customers` table in IndexedDB first (for speed), then fall back to Supabase if no local results are found.
  - Search matches on both `name` (case-insensitive substring) and `phone` (prefix match).
  - Results appear in a styled dropdown below the field — each row shows: customer name (bold), phone number (muted), and a small "↩ Select" pill button on the right.
  - **Existing customer selected:** When the user taps a dropdown result, the field fills with their name, a green "✔ Linked" badge appears next to the field, and an internal `currentSale.customer_id` variable is set to that customer's UUID. The phone number is auto-populated into a read-only display chip. The dropdown dismisses.
  - **No match / user ignores dropdown:** If the user finishes typing and presses Tab, clicks elsewhere, or taps "+ New Customer" — treat the typed text as a **new customer name**. Set `currentSale.customer_id = null` and `currentSale.customer_name = typedText`. A new customer record will be auto-created on sale completion (see below).
  - **"+ New Customer" button:** Always visible at the bottom of the search dropdown (even when results exist). Opens the Quick-Create Customer modal (name pre-filled from what was typed). On save, the new customer's UUID is immediately set as `currentSale.customer_id` and the field updates to show the new customer's name with the green badge.
  - **Walk-in Sale:** If the customer field is left completely blank, `customer_id = null` and `customer_name = 'Walk-in'` — this is perfectly valid.
  - **On Sale Completion — Customer ID Attachment Logic:**
    ```
    IF currentSale.customer_id IS NOT NULL:
      → Write invoice with customer_id = currentSale.customer_id
      → The Postgres trigger auto-updates customer totals
    ELSE IF currentSale.customer_name is non-empty (typed but not selected):
      → Auto-create a new customers record with { name: typedName, phone: typedPhone if any }
      → Get the new customer's UUID
      → Write invoice with customer_id = newCustomer.id
      → Also queue the new customer insert to sync_queue if offline
    ELSE (walk-in):
      → Write invoice with customer_id = NULL, customer_name = 'Walk-in'
    ```
  - The invoice always stores both `customer_id` (UUID FK, nullable) and `customer_name` (TEXT snapshot) so receipts remain readable even if a customer record is deleted later.
- Discount: toggle between Flat (₹) and Percent (%).
- Tax: numeric % input (populated from shop settings default, overridable per sale).
- Live computed: Subtotal → Discount → Tax → **Total** (large bold text).
- Payment method buttons: 💵 Cash | 💳 Card | 📱 UPI | ✂️ Split
  - Cash mode: "Amount Tendered" input → displays Change Due.
  - Split mode: Two inputs for Cash + Digital amounts. Must sum to total. Shows warning if mismatch.
  - UPI mode: Shows shop's UPI ID with a Copy button.
- Notes field (optional, for this invoice).
- **Complete Sale** button: large (min 56px), full width on mobile, vibrant gradient (indigo/violet). Disabled state when cart is empty.
- `Enter` key = Complete Sale (when payment method is selected and cart has items).

**On Successful Sale**
- Green checkmark animation + "Sale Complete!" toast.
- Invoice record written to IndexedDB immediately, then Supabase (or queued if offline).
- Stock quantities updated in IndexedDB immediately.
- Modal pops up immediately displaying a live receipt preview with four action buttons: **Download PDF** | **Share via WhatsApp** | **Print** | **Close / New Sale**.

**Receipt Preview & PDF Options**
- **Live Receipt Preview Modal**: Renders clean invoice receipt with shop title, invoice #, date, itemized table, subtotal, discount, tax, total, and customer info.
- **Download PDF**: Direct download button using `html2pdf.js` to render and save the receipt as a PDF file directly to the user's device.
- **WhatsApp**: Opens `https://wa.me/[CUSTOMER_PHONE]?text=[ENCODED_RECEIPT_TEXT]` with a plain-text receipt pre-filled.
- **Thermal (58mm or 80mm)**: Printable directly from browser via `window.print()` with a special `@media print` CSS class.

**Returns / Refunds**
- "Return Item" button in POS header opens the Returns Modal.
- Enter invoice number (or scan barcode of a printed receipt's barcode).
- App fetches the invoice details (from IndexedDB first, then Supabase).
- User selects which items and quantities to return (checkboxes + qty inputs).
- Select refund method: cash back | store credit.
- Creates a new `invoices` record with `is_return = true`, `original_invoice_id`, and negative quantities in `invoice_items`.
- The Postgres trigger auto-restores stock quantities on insert.
- "Confirm Return" button finalizes.

---

### 8D. SCREEN: INVENTORY MANAGEMENT

**Products List**
- Search bar (by name or barcode).
- Filter chips: All | Low Stock | Out of Stock | Inactive.
- Sort by: Name A–Z | Price High–Low | Stock Low–High | Recently Updated.
- Product card: color-coded initial avatar, name, category chip, barcode (monospace), sale price, stock badge.
  - 🔴 Red badge: stock ≤ min_stock_alert
  - 🟡 Amber badge: stock ≤ 2 × min_stock_alert
  - 🟢 Green badge: stock is adequate
- Long-press or checkbox for bulk-select mode → bulk delete / bulk export CSV.
- Floating Action Button (FAB): circular "+" button bottom-right → opens Add Product modal.

**Add / Edit Product Modal (Full-screen on mobile, centered dialog on desktop)**
- Name: text input with autocomplete from `suggestions.json > products`. Suggestions appear as a dropdown.
- Barcode / SKU: text input + camera scan icon button (opens scanner overlay).
- "Generate EAN-13" button: auto-generates a random 13-digit barcode and fills the field.
- Category: dropdown populated from `suggestions.json > categories`.
- Unit: dropdown from `suggestions.json > units`.
- Cost Price and Sale Price: numeric inputs. Margin % auto-calculated and shown in real-time: `((sale - cost) / sale × 100).toFixed(1)%`.
- MRP: optional numeric input.
- Current Stock Qty: integer input.
- Min Stock Alert Threshold: integer input (default from shop settings).
- Description: optional textarea.
- Image upload (optional): shows preview thumbnail.
- "Save Product" button → upsert to `products` table in Supabase + update IndexedDB.
- "Delete Product" button (edit mode only) → confirm dialog → soft delete (set `is_active = false`).

**Stock Adjustment Modal**
- Triggered from "Adjust Stock" button on each product card.
- Adjustment Type: Stock In | Damage/Loss | Expiry | Manual Correction | Return from Customer.
- Quantity: integer input (positive = add, negative = subtract for correction).
- Cost per unit (for stock-in purchases).
- Reference Note.
- Saves to `stock_adjustments` + updates `products.stock_quantity` in both Supabase and IndexedDB.

**Low Stock Alert Banner**
- Sticky panel at the top of Inventory screen listing all products below threshold.
- Each row: product name, current stock, threshold, [+ Stock] quick button.
- Dismissible per session (stores dismissed state in `sessionStorage`).

---

### 8E. SCREEN: INVOICE HISTORY

**Invoice List**
- Date range filter (Today / Week / Month / Custom) using a date picker.
- Filter by: Payment Method | Status (completed / returned / cancelled).
- Search by invoice number or customer name/phone.
- Paginated list (20 per page), newest first.
- Each row: invoice # (monospace), date/time, customer name or "Walk-in", total amount, payment method badge (color-coded), status badge.

**Invoice Detail Modal (slide-in panel)**
- Full receipt view: shop header, invoice #, date, customer info, itemized table, subtotal/discount/tax/total, payment details, notes.
- Download as PDF button.
- Share via WhatsApp button (with customer's phone pre-filled if available).
- "Process Return" button (only for `status = 'completed'` invoices).
- "Cancel Invoice" button → confirm dialog → sets `status = 'cancelled'` and restores stock via a Supabase RPC or via manual stock adjustment.

---

### 8F. SCREEN: CUSTOMER RECORDS

**Customer List**
- Search bar: real-time filter by name or phone across IndexedDB first, then Supabase.
- Sort by: Name A–Z | Total Spent (high–low) | Number of Visits | Last Visit (newest first).
- Each card shows: color-coded avatar (initials), full name (bold), phone number, total lifetime spend badge, visit count chip, last purchase date.
- [+ Add Customer] button (top right).
- Tapping a card opens the Customer Detail Panel.

**Add / Edit Customer Modal**
- Fields: Full Name (required), Phone (optional but strongly encouraged — used for WhatsApp receipts and duplicate detection), Email (optional), Address (optional), Notes (optional).
- **Duplicate detection**: Before saving, query IndexedDB for any existing customer with the same phone number. If found, show an inline warning: "⚠️ A customer named [Name] already has this phone number. Are you sure you want to create a duplicate?" with Proceed / Cancel buttons.
- On save: upsert to `customers` table in Supabase and IndexedDB. If offline, push to `sync_queue`.
- Returns the new/updated customer's UUID to the caller (so the POS screen can immediately attach it to the active sale).

**Quick-Create Customer Modal (triggered from POS)**
- A lightweight version of the Add Customer modal: only Name and Phone fields.
- "Save & Link" button → creates the customer record, attaches their UUID to the active invoice, closes the modal, and returns focus to the POS billing panel.
- This modal must open without navigating away from the POS screen.

**Customer Detail Side Panel (slide-in from right on desktop, full-screen modal on mobile)**
- Header: avatar (large, color-coded), full name, phone (tappable — opens tel: link on mobile), email, address.
- Edit button (pencil icon) → opens the full Add/Edit Customer modal pre-populated.
- **Stats Row**: Total Spent | Average Basket Size | Total Visits | Days Since Last Visit.
- **Purchase History Tab**: Paginated list (10 per page, newest first) of all invoices where `customer_id = this customer's UUID`. Each row: invoice # (monospace), date, items count, total amount, payment badge, status badge. Tapping a row opens the Invoice Detail modal.
- **Top Products Tab**: Aggregated from `invoice_items` joined through this customer's invoices — shows the top 5 most purchased products (name, total qty, total spend).
- **Merge Duplicate** button: If admin identifies two records for the same person, this modal lets them pick a "keep" record and a "merge from" record. All invoices from the merge-from record are re-assigned to the keep record, customer totals recalculated, and the duplicate is deleted.
- "Delete Customer" button → custom confirm dialog: "This will unlink [Name] from all their invoices (receipts will still show their name as a text snapshot). This cannot be undone." → on confirm: delete from `customers` table; all linked `invoices.customer_id` FK values set to NULL (the `customer_name` text snapshot is preserved).

---

### 8G. SCREEN: REPORTS & ANALYTICS

**Date Range Selector (sticky at top)**
- Quick pick pills: Today | Yesterday | Last 7 Days | This Month | Last Month | Custom.
- Custom: two date inputs (from/to).

**Summary Card Row (horizontally scrollable on mobile)**
- Total Revenue (₹)
- Total COGS (cost of goods sold = sum of `invoice_items.cost_price × quantity`)
- Gross Profit (Revenue − COGS)
- Total Expenses (from `expense_entries` for the period)
- Net Profit (Gross Profit − Expenses)
- Total Transactions
- Average Basket Size
- Items Sold

**Payment Breakdown**
- Donut chart showing Cash / UPI / Card / Split / Credit proportions (actual ₹ amounts + %).
- Data computed from `invoices.payment_method` grouped sum.
- Implemented as a hand-coded SVG donut chart (no external chart library required; if complex, use Chart.js via CDN).

**Daily Revenue Trend**
- Line or bar chart: one bar/point per day for the selected range, showing daily revenue.
- X-axis: dates. Y-axis: ₹ amount.
- Use Chart.js via CDN (https://cdn.jsdelivr.net/npm/chart.js).

**Top 10 Best-Selling Products (by quantity sold)**
- Table: Rank | Product Name | Units Sold | Revenue | Profit.
- Computed from `invoice_items` grouped by `product_id` for the date range.

**Hourly Heatmap (for Today / single-day views)**
- A simple grid showing which hours of the day had the most transactions. Darker = more sales.

**Low-Stock Snapshot**
- List of products currently below threshold (from IndexedDB for speed).

**EOD Cash Reconciliation (Today only)**
- Cash Collected today.
- UPI / Digital Collected today.
- Total Cash Expenses today (from `expense_entries` where payment was cash).
- Expected Cash in Drawer = Cash Collected − Cash Expenses.
- Net Digital Received = UPI + Card.

**Export Button**
- "Export CSV" → generates a CSV file of all invoices in the date range with invoice #, date, customer, payment method, subtotal, discount, tax, total.
- "Export PDF Report" → generates a printable A4 PDF of the current report view.

---

### 8H. EXPENSE TRACKER (ACCESSIBLE VIA REPORTS SCREEN TAB OR MORE MENU)

- Date picker (defaults to today).
- List of expenses for that date.
- "Add Expense" button → modal with: Category (dropdown from suggestions.json), Description, Amount (₹), Date.
- Inline edit and delete per entry (confirmation dialog for delete).
- Daily total shown prominently at the top.

---

### 8I. SCREEN: SETTINGS

- **Shop Info Tab**: Edit all shop_profile fields. Logo upload + preview. Save button.
- **POS Preferences Tab**: Default payment method, default tax %, receipt format selector (A4 / 58mm / 80mm thermal), show/hide MRP on receipt toggle, auto-open print dialog on sale toggle.
- **Stock Preferences Tab**: Default low-stock threshold, currency symbol, default unit.
- **Data Management Tab**: Export all products as CSV, Import products from CSV (with column mapping UI), Export all invoices as JSON backup, Clear local IndexedDB cache (with warning).
- **Account Tab**: Change display name, change email (requires re-auth), change password. Delete Account button — requires typing "DELETE" in a confirmation input.
- **About Tab**: App name, version "1.0.0", GitHub repository link, "Made with ❤️" credit, MIT license note.

---

## 9. OFFLINE-FIRST ARCHITECTURE (CRITICAL — IMPLEMENT FULLY)

### IndexedDB Schema (inside the `<script type="module">` in `index.html`)

Place this code in the **// SECTION: Dexie / IndexedDB** block of the single script tag. Since there is only one `index.html`, there is no separate `db.js` — all Dexie setup is inline.

```js
// Dexie is loaded via CDN <script> tag in <head>, so it is globally available.
// Do NOT use import — use the global `Dexie` object from the CDN script.
const db = new Dexie('ShopFlowPro');

db.version(1).stores({
  products:      '&id, barcode, name, category, stock_quantity, is_active, updated_at',
  customers:     '&id, name, phone, updated_at',
  invoices:      '&id, invoice_number, customer_id, created_at, synced',
  invoice_items: '&id, invoice_id, product_id',
  sync_queue:    '++localId, table_name, operation, payload, created_at, retries',
  shop_profile:  '&id'
});
```

> **CDN Note:** Load Dexie via `<script src="https://cdn.jsdelivr.net/npm/dexie@3.2.4/dist/dexie.min.js"></script>` in `<head>` (non-module UMD build). Then use `new Dexie(...)` directly — no `import` needed.

### Sync Flow

**On App Load (when online):**
1. Fetch all active products from Supabase → bulk upsert into `db.products`.
2. Fetch **all customers** from Supabase → bulk upsert into `db.customers` (this populates the POS customer typeahead while offline).
3. Fetch the last 200 invoices + their items from Supabase → upsert into `db.invoices` and `db.invoice_items`.
4. Fetch shop_profile → upsert into `db.shop_profile`.

**During a Sale (customer-linking flow):**
1. Resolve the customer:
   - If `currentSale.customer_id` is already set (user selected existing) → proceed.
   - If `currentSale.customer_name` is non-empty but no ID → auto-create a new customer row locally in IndexedDB first (generates a client-side UUID via `crypto.randomUUID()`), then push a `{ table_name: 'customers', operation: 'insert', payload: newCustomer }` to `sync_queue`. Set `currentSale.customer_id` to the new local UUID.
   - If both are empty → `customer_id = null`, `customer_name = 'Walk-in'`.
2. Write invoice + items to IndexedDB immediately (optimistic update), with the resolved `customer_id` included.
3. Update `db.customers` record locally: increment `visit_count` and `total_purchases`.
4. Update product stock quantities in IndexedDB immediately.
5. If `navigator.onLine` is true: push the new customer (if any) to Supabase first, then push the invoice + items. Mark `invoices.synced = true` on success.
6. If offline: push all operations (`customers` insert if new, `invoices` insert, `invoice_items` inserts) to `db.sync_queue` in correct dependency order.

**On Connectivity Restore:**
```js
window.addEventListener('online', async () => {
  const queue = await db.sync_queue.toArray();
  for (const item of queue) {
    try {
      if (item.operation === 'insert') {
        await supabase.from(item.table_name).insert(item.payload);
      } else if (item.operation === 'update') {
        await supabase.from(item.table_name).update(item.payload).eq('id', item.payload.id);
      } else if (item.operation === 'delete') {
        await supabase.from(item.table_name).delete().eq('id', item.payload.id);
      }
      await db.sync_queue.delete(item.localId);
    } catch (err) {
      await db.sync_queue.update(item.localId, { retries: (item.retries || 0) + 1 });
      if ((item.retries || 0) >= 3) {
        // Flag as permanently failed — log for user review
      }
    }
  }
  updateSyncIndicator();
});
```

**Offline Indicator Logic:**
- On any state change, run: `const pendingCount = await db.sync_queue.count();`
- If offline OR pendingCount > 0: show orange dot + "X pending sync" label in top bar.
- If online AND pendingCount === 0: show green dot.

---

## 10. DESIGN SYSTEM (MANDATORY — USE DARK MODE)

### CSS Custom Properties (in `index.css`)

```css
:root {
  --clr-bg:          #0f172a;
  --clr-surface:     #1e293b;
  --clr-surface-2:   #273549;
  --clr-border:      #334155;
  --clr-text-1:      #f1f5f9;
  --clr-text-2:      #94a3b8;
  --clr-text-3:      #64748b;
  --clr-accent:      #6366f1;
  --clr-accent-h:    #818cf8;
  --clr-success:     #22c55e;
  --clr-warning:     #f59e0b;
  --clr-danger:      #ef4444;
  --clr-info:        #38bdf8;
  --clr-cash:        #4ade80;
  --clr-upi:         #a78bfa;
  --clr-card:        #60a5fa;
  --radius-sm:       6px;
  --radius-md:       10px;
  --radius-lg:       16px;
  --radius-xl:       24px;
  --shadow-md:       0 4px 12px rgba(0, 0, 0, 0.5);
  --shadow-lg:       0 10px 30px rgba(0, 0, 0, 0.6);
  --transition:      all 0.18s ease;
}
```

### Typography
```css
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

body            { font-family: 'Inter', sans-serif; background: var(--clr-bg); color: var(--clr-text-1); }
h1, h2, h3, .heading { font-family: 'Outfit', sans-serif; }
.mono           { font-family: 'JetBrains Mono', monospace; }
```

### Key Design Rules

1. **Dark mode by default** — the entire app uses the dark palette above. No light mode toggle needed.
2. **Mobile-first responsive** — base styles for 320px, media queries at 640px and 1024px.
3. **Touch targets minimum 44×44px** — every button, tab, chip meets this requirement.
4. **Glassmorphism for modals**: `background: rgba(30, 41, 59, 0.88); backdrop-filter: blur(20px); border: 1px solid var(--clr-border);`
5. **Button micro-animations**: `transform: scale(0.97)` on `:active`, `translateY(-1px)` on `:hover`.
6. **Card hover**: `box-shadow: 0 8px 24px rgba(99, 102, 241, 0.15); border-color: var(--clr-accent);` on hover.
7. **Primary CTA gradient**: `background: linear-gradient(135deg, var(--clr-accent), #8b5cf6);`
8. **Success animation**: SVG checkmark circle that draws itself using `stroke-dasharray` animation.
9. **Loading skeleton**: CSS shimmer animation (`background: linear-gradient(90deg, ...)`) on placeholder elements.
10. **Bottom sheet on mobile**: Modals slide up from the bottom using `transform: translateY(100%)` → `translateY(0)` transition. Draggable dismiss is a bonus.
11. **Smooth scroll-snap** for horizontal strips (quick-pick products).
12. **Empty states**: Each screen when empty shows a large icon + heading + subtext + CTA button. Make these illustrative and friendly.
13. **Toast system**: Self-dismissing (3 seconds) toasts in bottom-right (desktop) or bottom-center (mobile). Types: success (green), error (red), warning (amber), info (blue). Never use `window.alert()`.
14. **No placeholder images**: Use vibrant color-coded avatar initials for products/customers without images. Generate color from the name string hash.

---

## 11. KEYBOARD SHORTCUTS (POS SCREEN)

| Key | Action |
|---|---|
| `Space` | Focus product search bar |
| `Enter` | Complete the sale (if cart non-empty and payment selected) |
| `Escape` | Clear cart (with custom confirm dialog) |
| `F2` | Cycle payment method: Cash → UPI → Card |
| `F3` | Open returns/refund modal |
| `F4` | Focus customer search field |
| `+` | Increment quantity of last cart item |
| `-` | Decrement quantity of last cart item |
| `Ctrl+P` | Download/print last receipt PDF |

- Show a hoverable `?` icon in the POS header that reveals a keyboard shortcut cheat-sheet tooltip.

---

## 12. ACCESSIBILITY & POLISH

- All buttons and interactive elements must have descriptive `aria-label` attributes.
- Color-blind safe: never rely on color alone — always pair with icon or text.
- Custom confirmation dialogs (not `window.confirm`) for all destructive actions.
- Inline form validation (error message appears below the field, not as popups).
- All async operations show a loading spinner inside the button, disabling it to prevent double-submit.
- Auto-save product edits to IndexedDB while user types (debounced 1200ms).
- Scroll position restored when returning to list screens from detail views.

---

## 13. README.md

Write a complete `README.md` including:
1. Project name, tagline, and feature overview.
2. Screenshot section (placeholder: `<!-- Add screenshot here -->`).
3. Prerequisites (a Supabase account, a GitHub account, a web browser).
4. Step-by-step setup:
   a. Fork/clone the repository.
   b. Run the SQL script in Supabase SQL Editor.
   c. Enable Storage and run storage policies.
   d. (Optional) Enable Google OAuth.
   e. Open `index.html` in a text editor and replace `YOUR_PROJECT_ID` and `YOUR_ANON_PUBLIC_KEY_HERE` in the **// SECTION: Config & Constants** block near the top of the `<script>` tag.
   f. Add GitHub secrets for the keep-alive workflow.
   g. Deploy to Vercel/Netlify (drag-and-drop the project folder).
5. Usage guide: POS walkthrough in 5 steps.
6. Offline mode explanation.
7. Data export guide.
8. Tech stack table.
9. Contributing section.
10. License: MIT.

---

## 14. FINAL CHECKLIST — DO NOT MARK COMPLETE UNTIL ALL PASS

- [ ] **Single-file architecture**: All CSS is inside `<style>` in `index.html`. All JS is inside `<script type="module">` in `index.html`. No separate `.css` or `.js` app files exist (only `sw.js`, `manifest.json`, `suggestions.json`, `icons/`, `.nojekyll`).
- [ ] **`.nojekyll` file exists** in the repo root — it is an empty file (no content). Without it GitHub Pages runs Jekyll which can corrupt JSON files.
- [ ] **UMD globals are accessed via `window`**: `window.Dexie`, `window.supabase.createClient`, `window.Quagga`, `window.Chart` — destructured at the top of the module script. Never used as bare names without `window.`.
- [ ] **`<link rel="manifest" href="./manifest.json">`** uses a relative path (`./` prefix) — not `/manifest.json`.
- [ ] **Service worker registered with `./sw.js`** (relative path) — not `/sw.js`. Registered inside `DOMContentLoaded` in `index.html`'s script block.
- [ ] Supabase credentials (`SUPABASE_URL`, `SUPABASE_ANON_KEY`) are in the Config section of `index.html`'s script block — easy to find and replace.
- [ ] **Supabase Auth → URL Configuration**: Site URL and Redirect URLs set to `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/*` before deploying.
- [ ] App passes Chrome PWA installability audit (has manifest, service worker, HTTPS, icons).
- [ ] All 9 screens (Welcome, Auth/Setup, POS, Inventory, Invoices, Customers, Reports, Expenses, Settings) are implemented and navigable.
- [ ] POS: barcode scan detection (USB timing heuristic) works correctly.
- [ ] POS: camera scan overlay opens and decodes a barcode.
- [ ] POS: offline sale saves to IndexedDB, stock updates locally, added to sync_queue.
- [ ] POS: on going back online, sync_queue drains to Supabase.
- [ ] POS: Returns flow creates negative invoice, restores stock.
- [ ] POS: Split payment requires cash + digital amounts to sum to total.
- [ ] POS: PDF receipt downloads with correct shop header + items.
- [ ] POS: WhatsApp receipt opens correct wa.me URL with encoded text.
- [ ] Inventory: barcode camera scan works in Add Product modal.
- [ ] Inventory: "Generate EAN-13" button fills the barcode field.
- [ ] Inventory: stock adjustment logs to `stock_adjustments` table.
- [ ] Inventory: low-stock alert banner shows correct items.
- [ ] Reports: all 8 summary cards compute correctly.
- [ ] Reports: payment donut chart percentages sum to 100%.
- [ ] Reports: CSV export produces a valid, parseable file.
- [ ] Reports: EOD cash reconciliation math is correct.
- [ ] Customers: purchase history loads correctly for a specific customer.
- [ ] Settings: shop profile saves and immediately reflects in receipts.
- [ ] Settings: "Delete Account" requires typing "DELETE" and then signs out.
- [ ] All destructive actions use custom confirm dialogs (not window.confirm).
- [ ] Toast notifications appear and auto-dismiss for all async operations.
- [ ] App renders correctly at 320px width with no horizontal overflow.
- [ ] All touch targets are at least 44×44px.
- [ ] `suggestions.json` is fetched at app startup via `fetch('./suggestions.json')` and the result is stored in a module-level variable for use by autocomplete. Works on GitHub Pages because it is a simple static file GET request.
- [ ] `suggestions.json` powers autocomplete in product name field with a fuzzy dropdown.
- [ ] Sync indicator shows correct online/offline state and pending count.
- [ ] **Customer Linking — POS typeahead searches IndexedDB customers by name AND phone as user types.**
- [ ] **Customer Linking — Selecting an existing customer from the dropdown sets customer_id on the active sale.**
- [ ] **Customer Linking — Green "✔ Linked" badge appears when an existing customer is attached.**
- [ ] **Customer Linking — Typing a name and NOT selecting a dropdown result auto-creates a new customer record on sale completion.**
- [ ] **Customer Linking — Auto-created new customers are written to IndexedDB immediately and queued for Supabase sync.**
- [ ] **Customer Linking — Every completed invoice in Supabase has customer_id populated (or NULL for walk-ins), never missing.**
- [ ] **Customer Linking — Walk-in sales (empty customer field) work correctly with customer_id = NULL.**
- [ ] **Customer Linking — "+ New Customer" button in POS dropdown opens the Quick-Create modal without leaving the POS screen.**
- [ ] **Customer Linking — Quick-Create modal pre-fills name from what was typed in the POS customer field.**
- [ ] **Customer Linking — After Quick-Create, the POS field updates to show the new customer's name with the green badge.**
- [ ] **Customer Linking — Duplicate phone number detection warns the user before creating a new customer.**
- [ ] **Customer Linking — Invoice Detail view shows the linked customer's name as a clickable link that opens their Customer Detail panel.**
- [ ] **Customer Linking — Customer Detail panel shows correct total_purchases and visit_count, updated after each sale.**
- [ ] **Customer Linking — Offline customer auto-create: new customer UUID generated client-side, synced to Supabase on reconnect before the invoice is synced.**
- [ ] **Customer Linking — Merge Duplicate customer feature re-assigns all invoices from the duplicate to the kept record.**

---

*End of Prompt — Begin Building ShopFlow Pro*
