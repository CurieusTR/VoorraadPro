-- ===========================================
-- VoorraadPro Database Schema
-- Version: 1.0.0
-- ===========================================

-- ===========================================
-- CORE TABLES
-- ===========================================

-- Gebruikersprofiel (uitbreiding van Supabase Auth)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  business_type TEXT CHECK (business_type IN ('handelaar', 'horeca', 'bakkerij', 'slagerij', 'supermarkt', 'overig')),
  owner_name TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'BE',
  btw_nummer TEXT,
  currency TEXT DEFAULT 'EUR',
  date_format TEXT DEFAULT 'DD/MM/YYYY',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categorieën (hiërarchisch)
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  color TEXT,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, name, parent_id)
);

-- Locaties/Magazijnen
CREATE TABLE IF NOT EXISTS locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  address TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, name)
);

-- Leveranciers
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  whatsapp TEXT,
  address TEXT,
  city TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'BE',
  btw_nummer TEXT,
  payment_terms INTEGER DEFAULT 30,
  notes TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, name)
);

-- ===========================================
-- PRODUCT TABLES
-- ===========================================

-- Producten
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sku TEXT,
  barcode TEXT,
  description TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  unit TEXT NOT NULL DEFAULT 'stuk',
  unit_size DECIMAL(10,3),
  purchase_price DECIMAL(10,2),
  selling_price DECIMAL(10,2),
  margin_percentage DECIMAL(5,2) GENERATED ALWAYS AS (
    CASE WHEN purchase_price > 0
    THEN ((selling_price - purchase_price) / purchase_price * 100)
    ELSE NULL END
  ) STORED,
  current_stock DECIMAL(10,3) DEFAULT 0,
  min_stock DECIMAL(10,3) DEFAULT 0,
  max_stock DECIMAL(10,3),
  reorder_quantity DECIMAL(10,3),
  track_expiry BOOLEAN DEFAULT FALSE,
  default_shelf_life_days INTEGER,
  default_supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
  supplier_sku TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  image_url TEXT,
  notes TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, name)
);

-- Unique constraints for sku and barcode (allowing null)
CREATE UNIQUE INDEX IF NOT EXISTS idx_products_sku_unique ON products(user_id, sku) WHERE sku IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_products_barcode_unique ON products(user_id, barcode) WHERE barcode IS NOT NULL;

-- Product-Locatie voorraad (voorraad per locatie)
CREATE TABLE IF NOT EXISTS product_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  current_stock DECIMAL(10,3) DEFAULT 0,
  min_stock DECIMAL(10,3),
  shelf_position TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, location_id)
);

-- ===========================================
-- STOCK MOVEMENT TABLES
-- ===========================================

-- Voorraadmutaties
CREATE TABLE IF NOT EXISTS stock_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
  movement_type TEXT NOT NULL CHECK (movement_type IN (
    'purchase',
    'sale',
    'adjustment_plus',
    'adjustment_minus',
    'transfer_in',
    'transfer_out',
    'waste',
    'return_supplier',
    'return_customer',
    'inventory_count'
  )),
  quantity DECIMAL(10,3) NOT NULL CHECK (quantity > 0),
  unit TEXT NOT NULL,
  unit_price DECIMAL(10,2),
  total_price DECIMAL(10,2),
  supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
  order_id UUID,
  transfer_location_id UUID REFERENCES locations(id),
  expiry_date DATE,
  batch_number TEXT,
  reference TEXT,
  notes TEXT,
  movement_date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Batch/Lot tracking (voor vervaldatum per batch)
CREATE TABLE IF NOT EXISTS stock_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
  batch_number TEXT,
  quantity DECIMAL(10,3) NOT NULL DEFAULT 0,
  expiry_date DATE,
  purchase_date DATE,
  supplier_id UUID REFERENCES suppliers(id),
  unit_price DECIMAL(10,2),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- ORDER TABLES
-- ===========================================

-- Bestellingen bij leveranciers
CREATE TABLE IF NOT EXISTS purchase_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE RESTRICT,
  location_id UUID REFERENCES locations(id),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
    'draft',
    'sent',
    'confirmed',
    'partial',
    'received',
    'cancelled'
  )),
  order_date DATE DEFAULT CURRENT_DATE,
  expected_date DATE,
  received_date DATE,
  subtotal DECIMAL(10,2) DEFAULT 0,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) DEFAULT 0,
  reference TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bestelregels
CREATE TABLE IF NOT EXISTS purchase_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity_ordered DECIMAL(10,3) NOT NULL,
  quantity_received DECIMAL(10,3) DEFAULT 0,
  unit TEXT NOT NULL,
  unit_price DECIMAL(10,2),
  total_price DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- INVENTORY COUNT (Stocktelling)
-- ===========================================

-- Voorraadtelling sessies
CREATE TABLE IF NOT EXISTS inventory_counts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  location_id UUID REFERENCES locations(id),
  name TEXT NOT NULL,
  status TEXT DEFAULT 'in_progress' CHECK (status IN (
    'in_progress',
    'completed',
    'cancelled'
  )),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  notes TEXT,
  total_products INTEGER,
  products_counted INTEGER,
  discrepancies_found INTEGER,
  total_adjustment_value DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Telregels
CREATE TABLE IF NOT EXISTS inventory_count_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  count_id UUID NOT NULL REFERENCES inventory_counts(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  expected_quantity DECIMAL(10,3),
  counted_quantity DECIMAL(10,3),
  difference DECIMAL(10,3) GENERATED ALWAYS AS (counted_quantity - expected_quantity) STORED,
  is_counted BOOLEAN DEFAULT FALSE,
  counted_at TIMESTAMPTZ,
  notes TEXT,
  UNIQUE(count_id, product_id)
);

-- ===========================================
-- TRIGGERS & FUNCTIONS
-- ===========================================

-- Trigger: Update product stock na mutatie
CREATE OR REPLACE FUNCTION update_product_stock()
RETURNS TRIGGER AS $$
DECLARE
  stock_change DECIMAL(10,3);
BEGIN
  -- Bepaal de richting van de voorraadwijziging
  stock_change := CASE
    WHEN NEW.movement_type IN ('purchase', 'adjustment_plus', 'transfer_in', 'return_customer', 'inventory_count')
    THEN NEW.quantity
    WHEN NEW.movement_type IN ('sale', 'adjustment_minus', 'transfer_out', 'waste', 'return_supplier')
    THEN -NEW.quantity
    ELSE 0
  END;

  -- Update product voorraad
  UPDATE products
  SET current_stock = current_stock + stock_change,
      updated_at = NOW()
  WHERE id = NEW.product_id;

  -- Update locatie voorraad indien van toepassing
  IF NEW.location_id IS NOT NULL THEN
    INSERT INTO product_locations (product_id, location_id, current_stock)
    VALUES (NEW.product_id, NEW.location_id, stock_change)
    ON CONFLICT (product_id, location_id)
    DO UPDATE SET
      current_stock = product_locations.current_stock + stock_change,
      updated_at = NOW();
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_stock_movement ON stock_movements;
CREATE TRIGGER on_stock_movement
  AFTER INSERT ON stock_movements
  FOR EACH ROW
  EXECUTE FUNCTION update_product_stock();

-- Trigger: Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_products_timestamp ON products;
CREATE TRIGGER update_products_timestamp
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_suppliers_timestamp ON suppliers;
CREATE TRIGGER update_suppliers_timestamp
  BEFORE UPDATE ON suppliers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_user_profiles_timestamp ON user_profiles;
CREATE TRIGGER update_user_profiles_timestamp
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_purchase_orders_timestamp ON purchase_orders;
CREATE TRIGGER update_purchase_orders_timestamp
  BEFORE UPDATE ON purchase_orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ===========================================
-- ROW LEVEL SECURITY
-- ===========================================

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_counts ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_count_items ENABLE ROW LEVEL SECURITY;

-- User profiles policies
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Categories policies
DROP POLICY IF EXISTS "Users can view own categories" ON categories;
CREATE POLICY "Users can view own categories" ON categories
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own categories" ON categories;
CREATE POLICY "Users can insert own categories" ON categories
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own categories" ON categories;
CREATE POLICY "Users can update own categories" ON categories
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own categories" ON categories;
CREATE POLICY "Users can delete own categories" ON categories
  FOR DELETE USING (auth.uid() = user_id);

-- Locations policies
DROP POLICY IF EXISTS "Users can view own locations" ON locations;
CREATE POLICY "Users can view own locations" ON locations
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own locations" ON locations;
CREATE POLICY "Users can insert own locations" ON locations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own locations" ON locations;
CREATE POLICY "Users can update own locations" ON locations
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own locations" ON locations;
CREATE POLICY "Users can delete own locations" ON locations
  FOR DELETE USING (auth.uid() = user_id);

-- Suppliers policies
DROP POLICY IF EXISTS "Users can view own suppliers" ON suppliers;
CREATE POLICY "Users can view own suppliers" ON suppliers
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own suppliers" ON suppliers;
CREATE POLICY "Users can insert own suppliers" ON suppliers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own suppliers" ON suppliers;
CREATE POLICY "Users can update own suppliers" ON suppliers
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own suppliers" ON suppliers;
CREATE POLICY "Users can delete own suppliers" ON suppliers
  FOR DELETE USING (auth.uid() = user_id);

-- Products policies
DROP POLICY IF EXISTS "Users can view own products" ON products;
CREATE POLICY "Users can view own products" ON products
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own products" ON products;
CREATE POLICY "Users can insert own products" ON products
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own products" ON products;
CREATE POLICY "Users can update own products" ON products
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own products" ON products;
CREATE POLICY "Users can delete own products" ON products
  FOR DELETE USING (auth.uid() = user_id);

-- Product locations policies
DROP POLICY IF EXISTS "Users can view own product locations" ON product_locations;
CREATE POLICY "Users can view own product locations" ON product_locations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM products WHERE products.id = product_locations.product_id AND products.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert own product locations" ON product_locations;
CREATE POLICY "Users can insert own product locations" ON product_locations
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM products WHERE products.id = product_locations.product_id AND products.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update own product locations" ON product_locations;
CREATE POLICY "Users can update own product locations" ON product_locations
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM products WHERE products.id = product_locations.product_id AND products.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete own product locations" ON product_locations;
CREATE POLICY "Users can delete own product locations" ON product_locations
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM products WHERE products.id = product_locations.product_id AND products.user_id = auth.uid()
    )
  );

-- Stock movements policies
DROP POLICY IF EXISTS "Users can view own stock movements" ON stock_movements;
CREATE POLICY "Users can view own stock movements" ON stock_movements
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own stock movements" ON stock_movements;
CREATE POLICY "Users can insert own stock movements" ON stock_movements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Stock batches policies
DROP POLICY IF EXISTS "Users can view own stock batches" ON stock_batches;
CREATE POLICY "Users can view own stock batches" ON stock_batches
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM products WHERE products.id = stock_batches.product_id AND products.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert own stock batches" ON stock_batches;
CREATE POLICY "Users can insert own stock batches" ON stock_batches
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM products WHERE products.id = stock_batches.product_id AND products.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update own stock batches" ON stock_batches;
CREATE POLICY "Users can update own stock batches" ON stock_batches
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM products WHERE products.id = stock_batches.product_id AND products.user_id = auth.uid()
    )
  );

-- Purchase orders policies
DROP POLICY IF EXISTS "Users can view own purchase orders" ON purchase_orders;
CREATE POLICY "Users can view own purchase orders" ON purchase_orders
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own purchase orders" ON purchase_orders;
CREATE POLICY "Users can insert own purchase orders" ON purchase_orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own purchase orders" ON purchase_orders;
CREATE POLICY "Users can update own purchase orders" ON purchase_orders
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own purchase orders" ON purchase_orders;
CREATE POLICY "Users can delete own purchase orders" ON purchase_orders
  FOR DELETE USING (auth.uid() = user_id);

-- Purchase order items policies
DROP POLICY IF EXISTS "Users can view own purchase order items" ON purchase_order_items;
CREATE POLICY "Users can view own purchase order items" ON purchase_order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM purchase_orders WHERE purchase_orders.id = purchase_order_items.order_id AND purchase_orders.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert own purchase order items" ON purchase_order_items;
CREATE POLICY "Users can insert own purchase order items" ON purchase_order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM purchase_orders WHERE purchase_orders.id = purchase_order_items.order_id AND purchase_orders.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update own purchase order items" ON purchase_order_items;
CREATE POLICY "Users can update own purchase order items" ON purchase_order_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM purchase_orders WHERE purchase_orders.id = purchase_order_items.order_id AND purchase_orders.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete own purchase order items" ON purchase_order_items;
CREATE POLICY "Users can delete own purchase order items" ON purchase_order_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM purchase_orders WHERE purchase_orders.id = purchase_order_items.order_id AND purchase_orders.user_id = auth.uid()
    )
  );

-- Inventory counts policies
DROP POLICY IF EXISTS "Users can view own inventory counts" ON inventory_counts;
CREATE POLICY "Users can view own inventory counts" ON inventory_counts
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own inventory counts" ON inventory_counts;
CREATE POLICY "Users can insert own inventory counts" ON inventory_counts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own inventory counts" ON inventory_counts;
CREATE POLICY "Users can update own inventory counts" ON inventory_counts
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own inventory counts" ON inventory_counts;
CREATE POLICY "Users can delete own inventory counts" ON inventory_counts
  FOR DELETE USING (auth.uid() = user_id);

-- Inventory count items policies
DROP POLICY IF EXISTS "Users can view own inventory count items" ON inventory_count_items;
CREATE POLICY "Users can view own inventory count items" ON inventory_count_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM inventory_counts WHERE inventory_counts.id = inventory_count_items.count_id AND inventory_counts.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert own inventory count items" ON inventory_count_items;
CREATE POLICY "Users can insert own inventory count items" ON inventory_count_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM inventory_counts WHERE inventory_counts.id = inventory_count_items.count_id AND inventory_counts.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update own inventory count items" ON inventory_count_items;
CREATE POLICY "Users can update own inventory count items" ON inventory_count_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM inventory_counts WHERE inventory_counts.id = inventory_count_items.count_id AND inventory_counts.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete own inventory count items" ON inventory_count_items;
CREATE POLICY "Users can delete own inventory count items" ON inventory_count_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM inventory_counts WHERE inventory_counts.id = inventory_count_items.count_id AND inventory_counts.user_id = auth.uid()
    )
  );

-- ===========================================
-- INDEXES
-- ===========================================

CREATE INDEX IF NOT EXISTS idx_products_user ON products(user_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_name ON products(user_id, name);
CREATE INDEX IF NOT EXISTS idx_products_low_stock ON products(user_id) WHERE current_stock <= min_stock;

CREATE INDEX IF NOT EXISTS idx_stock_movements_product ON stock_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_date ON stock_movements(movement_date);
CREATE INDEX IF NOT EXISTS idx_stock_movements_type ON stock_movements(movement_type);
CREATE INDEX IF NOT EXISTS idx_stock_movements_user ON stock_movements(user_id);

CREATE INDEX IF NOT EXISTS idx_stock_batches_expiry ON stock_batches(expiry_date) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_stock_batches_product ON stock_batches(product_id);

CREATE INDEX IF NOT EXISTS idx_purchase_orders_supplier ON purchase_orders(supplier_id);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_status ON purchase_orders(status);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_user ON purchase_orders(user_id);

CREATE INDEX IF NOT EXISTS idx_categories_user ON categories(user_id);
CREATE INDEX IF NOT EXISTS idx_locations_user ON locations(user_id);
CREATE INDEX IF NOT EXISTS idx_suppliers_user ON suppliers(user_id);
