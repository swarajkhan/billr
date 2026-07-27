# ShopFlow Pro — AI POS & Stock Management Web App

**ShopFlow Pro** is a lightweight, ultra-fast, offline-first Point-of-Sale (POS) and inventory management system designed specifically for small physical retail shops. It operates at $0 running cost using a free-tier Supabase backend hosted statically on GitHub Pages.

---

## Key Features

- **⚡ Lightning-Fast POS**: Process sales in under 15 seconds with quick-pick product grid, barcode scanner integration (USB & Camera), and full keyboard shortcuts.
- **📡 Offline-First Architecture**: Powered by IndexedDB (via Dexie.js). Record sales, update stock, and manage customers even when offline — automatically syncs to cloud when connection restores.
- **👥 Customer CRM & Smart Lookup**: Real-time typeahead lookup by customer name or phone. Track purchase histories, visit counts, and lifetime value. Duplicate phone detection and customer merging support.
- **📦 Inventory Management**: Full product catalog, low-stock alerts, EAN-13 barcode generation, real-time profit margin calculator, and manual stock adjustment logging.
- **📊 Reports & Analytics**: Real-time KPIs (Revenue, COGS, Gross Profit, Expenses, Net Profit), interactive sales trend charts, payment method breakdown (Cash, UPI, Card, Split), EOD cash reconciliation, and CSV export.
- **🧾 Receipts & Sharing**: Generate A4 PDF invoices client-side or share clean text receipts directly via WhatsApp. Thermal printing CSS supported.
- **🔒 Free Cloud Backup**: Free-tier Supabase PostgreSQL backend with Row Level Security (RLS) policies and automatic sequence triggers.

---

## Prerequisites

1. A free **GitHub Account** (for GitHub Pages hosting and Actions).
2. A free **Supabase Account** ([supabase.com](https://supabase.com)).
3. Any modern web browser (Chrome, Edge, Safari, Firefox).

---

## Step-by-Step Setup & Deployment

### 1. Database Setup (Supabase)

1. Log into [Supabase](https://supabase.com) and create a **New Project**.
2. Open the **SQL Editor** from the left navigation menu.
3. Paste and execute the following complete database schema script:

```sql
-- =========================================================
-- SHOPFLOW PRO — COMPLETE DATABASE SCHEMA
-- =========================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- TABLE: shop_profiles
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
CREATE TABLE IF NOT EXISTS expense_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL DEFAULT 'General',
  description TEXT NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  expense_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- TRIGGERS & FUNCTIONS
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
```

4. Go to **Supabase Dashboard → Authentication → URL Configuration**:
   - Set **Site URL**: `https://<YOUR_GITHUB_USERNAME>.github.io/<YOUR_REPO_NAME>/`
   - Add **Redirect URLs**: `https://<YOUR_GITHUB_USERNAME>.github.io/<YOUR_REPO_NAME>/*`

---

### 2. Configure Credentials

Open `index.html` and update the constants at the top of the `<script type="module">` block:

```javascript
// ===== SECTION: Config & Constants =====
const SUPABASE_URL = "https://YOUR_PROJECT_ID.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_ANON_PUBLIC_KEY_HERE";
```

---

### 3. Deploy to GitHub Pages

1. Push all files (`index.html`, `sw.js`, `manifest.json`, `suggestions.json`, `.nojekyll`, `icons/`, `.github/`) to your GitHub repository.
2. In GitHub, go to **Settings → Pages**.
3. Under **Build and deployment → Source**, select `Deploy from a branch` and choose `main` / `/ (root)`.
4. Click **Save**. Your site will be live at `https://<YOUR_USERNAME>.github.io/<YOUR_REPO_NAME>/`.

---

### 4. Supabase Keep-Alive Secrets

To prevent Supabase from pausing your free-tier project after 7 days of inactivity:
1. Go to GitHub Repo → **Settings → Secrets and variables → Actions**.
2. Add secret `SUPABASE_URL`: Your Supabase Project URL.
3. Add secret `SUPABASE_ANON_KEY`: Your Supabase Anon Public Key.
4. The automated GitHub Action (`.github/workflows/keep-alive.yml`) will ping your API every 3 days.

---

## Keyboard Shortcuts (POS Screen)

| Key | Action |
|---|---|
| `Space` | Focus product search bar |
| `Enter` | Complete sale (when payment is selected) |
| `Escape` | Clear current cart |
| `F2` | Cycle payment method (Cash → UPI → Card) |
| `F3` | Open Returns / Refund modal |
| `F4` | Focus customer lookup search field |
| `+` | Increment quantity of last cart item |
| `-` | Decrement quantity of last cart item |

---

## Tech Stack & CDN Dependencies

- **Structure & Logic**: HTML5 + Vanilla CSS + ES2022 JavaScript (consolidated in single `index.html`).
- **Database**: Supabase PostgreSQL + Dexie.js IndexedDB.
- **Libraries**:
  - [Font Awesome 6](https://fontawesome.com) icons.
  - [Google Fonts](https://fonts.google.com) ("Outfit", "Inter", "JetBrains Mono").
  - [Dexie.js](https://dexie.org) 3.2.4 for IndexedDB.
  - [Supabase JS Client](https://supabase.com/docs/reference/javascript) v2 UMD.
  - [QuaggaJS](https://serratus.github.io/quaggaJS/) for barcode camera scanning.
  - [html2pdf.js](https://github.com/eKoopmans/html2pdf.js) for PDF invoice rendering.
  - [Chart.js](https://www.chartjs.org/) for analytics charts.

---

## License

Distributed under the MIT License.
