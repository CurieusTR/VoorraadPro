export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          business_name: string
          business_type: 'handelaar' | 'horeca' | 'bakkerij' | 'slagerij' | 'supermarkt' | 'overig' | null
          owner_name: string | null
          email: string | null
          phone: string | null
          address: string | null
          city: string | null
          postal_code: string | null
          country: string
          btw_nummer: string | null
          currency: string
          date_format: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          business_name: string
          business_type?: 'handelaar' | 'horeca' | 'bakkerij' | 'slagerij' | 'supermarkt' | 'overig' | null
          owner_name?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          postal_code?: string | null
          country?: string
          btw_nummer?: string | null
          currency?: string
          date_format?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_name?: string
          business_type?: 'handelaar' | 'horeca' | 'bakkerij' | 'slagerij' | 'supermarkt' | 'overig' | null
          owner_name?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          postal_code?: string | null
          country?: string
          btw_nummer?: string | null
          currency?: string
          date_format?: string
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          user_id: string
          name: string
          parent_id: string | null
          color: string | null
          icon: string | null
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          parent_id?: string | null
          color?: string | null
          icon?: string | null
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          parent_id?: string | null
          color?: string | null
          icon?: string | null
          sort_order?: number
          created_at?: string
        }
      }
      locations: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          address: string | null
          is_default: boolean
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          address?: string | null
          is_default?: boolean
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          address?: string | null
          is_default?: boolean
          is_active?: boolean
          created_at?: string
        }
      }
      suppliers: {
        Row: {
          id: string
          user_id: string
          name: string
          contact_person: string | null
          email: string | null
          phone: string | null
          whatsapp: string | null
          address: string | null
          city: string | null
          postal_code: string | null
          country: string
          btw_nummer: string | null
          payment_terms: number
          notes: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          contact_person?: string | null
          email?: string | null
          phone?: string | null
          whatsapp?: string | null
          address?: string | null
          city?: string | null
          postal_code?: string | null
          country?: string
          btw_nummer?: string | null
          payment_terms?: number
          notes?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          contact_person?: string | null
          email?: string | null
          phone?: string | null
          whatsapp?: string | null
          address?: string | null
          city?: string | null
          postal_code?: string | null
          country?: string
          btw_nummer?: string | null
          payment_terms?: number
          notes?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          user_id: string
          name: string
          sku: string | null
          barcode: string | null
          description: string | null
          category_id: string | null
          unit: string
          unit_size: number | null
          purchase_price: number | null
          selling_price: number | null
          margin_percentage: number | null
          current_stock: number
          min_stock: number
          max_stock: number | null
          reorder_quantity: number | null
          track_expiry: boolean
          default_shelf_life_days: number | null
          default_supplier_id: string | null
          supplier_sku: string | null
          is_active: boolean
          image_url: string | null
          notes: string | null
          tags: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          sku?: string | null
          barcode?: string | null
          description?: string | null
          category_id?: string | null
          unit?: string
          unit_size?: number | null
          purchase_price?: number | null
          selling_price?: number | null
          current_stock?: number
          min_stock?: number
          max_stock?: number | null
          reorder_quantity?: number | null
          track_expiry?: boolean
          default_shelf_life_days?: number | null
          default_supplier_id?: string | null
          supplier_sku?: string | null
          is_active?: boolean
          image_url?: string | null
          notes?: string | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          sku?: string | null
          barcode?: string | null
          description?: string | null
          category_id?: string | null
          unit?: string
          unit_size?: number | null
          purchase_price?: number | null
          selling_price?: number | null
          current_stock?: number
          min_stock?: number
          max_stock?: number | null
          reorder_quantity?: number | null
          track_expiry?: boolean
          default_shelf_life_days?: number | null
          default_supplier_id?: string | null
          supplier_sku?: string | null
          is_active?: boolean
          image_url?: string | null
          notes?: string | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      product_locations: {
        Row: {
          id: string
          product_id: string
          location_id: string
          current_stock: number
          min_stock: number | null
          shelf_position: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          location_id: string
          current_stock?: number
          min_stock?: number | null
          shelf_position?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          location_id?: string
          current_stock?: number
          min_stock?: number | null
          shelf_position?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      stock_movements: {
        Row: {
          id: string
          user_id: string
          product_id: string
          location_id: string | null
          movement_type: 'purchase' | 'sale' | 'adjustment_plus' | 'adjustment_minus' | 'transfer_in' | 'transfer_out' | 'waste' | 'return_supplier' | 'return_customer' | 'inventory_count'
          quantity: number
          unit: string
          unit_price: number | null
          total_price: number | null
          supplier_id: string | null
          order_id: string | null
          transfer_location_id: string | null
          expiry_date: string | null
          batch_number: string | null
          reference: string | null
          notes: string | null
          movement_date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          location_id?: string | null
          movement_type: 'purchase' | 'sale' | 'adjustment_plus' | 'adjustment_minus' | 'transfer_in' | 'transfer_out' | 'waste' | 'return_supplier' | 'return_customer' | 'inventory_count'
          quantity: number
          unit: string
          unit_price?: number | null
          total_price?: number | null
          supplier_id?: string | null
          order_id?: string | null
          transfer_location_id?: string | null
          expiry_date?: string | null
          batch_number?: string | null
          reference?: string | null
          notes?: string | null
          movement_date?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          location_id?: string | null
          movement_type?: 'purchase' | 'sale' | 'adjustment_plus' | 'adjustment_minus' | 'transfer_in' | 'transfer_out' | 'waste' | 'return_supplier' | 'return_customer' | 'inventory_count'
          quantity?: number
          unit?: string
          unit_price?: number | null
          total_price?: number | null
          supplier_id?: string | null
          order_id?: string | null
          transfer_location_id?: string | null
          expiry_date?: string | null
          batch_number?: string | null
          reference?: string | null
          notes?: string | null
          movement_date?: string
          created_at?: string
        }
      }
      stock_batches: {
        Row: {
          id: string
          product_id: string
          location_id: string | null
          batch_number: string | null
          quantity: number
          expiry_date: string | null
          purchase_date: string | null
          supplier_id: string | null
          unit_price: number | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          location_id?: string | null
          batch_number?: string | null
          quantity?: number
          expiry_date?: string | null
          purchase_date?: string | null
          supplier_id?: string | null
          unit_price?: number | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          location_id?: string | null
          batch_number?: string | null
          quantity?: number
          expiry_date?: string | null
          purchase_date?: string | null
          supplier_id?: string | null
          unit_price?: number | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      purchase_orders: {
        Row: {
          id: string
          user_id: string
          supplier_id: string
          location_id: string | null
          status: 'draft' | 'sent' | 'confirmed' | 'partial' | 'received' | 'cancelled'
          order_date: string
          expected_date: string | null
          received_date: string | null
          subtotal: number
          tax_amount: number
          total_amount: number
          reference: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          supplier_id: string
          location_id?: string | null
          status?: 'draft' | 'sent' | 'confirmed' | 'partial' | 'received' | 'cancelled'
          order_date?: string
          expected_date?: string | null
          received_date?: string | null
          subtotal?: number
          tax_amount?: number
          total_amount?: number
          reference?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          supplier_id?: string
          location_id?: string | null
          status?: 'draft' | 'sent' | 'confirmed' | 'partial' | 'received' | 'cancelled'
          order_date?: string
          expected_date?: string | null
          received_date?: string | null
          subtotal?: number
          tax_amount?: number
          total_amount?: number
          reference?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      purchase_order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity_ordered: number
          quantity_received: number
          unit: string
          unit_price: number | null
          total_price: number | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity_ordered: number
          quantity_received?: number
          unit: string
          unit_price?: number | null
          total_price?: number | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity_ordered?: number
          quantity_received?: number
          unit?: string
          unit_price?: number | null
          total_price?: number | null
          notes?: string | null
          created_at?: string
        }
      }
      inventory_counts: {
        Row: {
          id: string
          user_id: string
          location_id: string | null
          name: string
          status: 'in_progress' | 'completed' | 'cancelled'
          started_at: string
          completed_at: string | null
          notes: string | null
          total_products: number | null
          products_counted: number | null
          discrepancies_found: number | null
          total_adjustment_value: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          location_id?: string | null
          name: string
          status?: 'in_progress' | 'completed' | 'cancelled'
          started_at?: string
          completed_at?: string | null
          notes?: string | null
          total_products?: number | null
          products_counted?: number | null
          discrepancies_found?: number | null
          total_adjustment_value?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          location_id?: string | null
          name?: string
          status?: 'in_progress' | 'completed' | 'cancelled'
          started_at?: string
          completed_at?: string | null
          notes?: string | null
          total_products?: number | null
          products_counted?: number | null
          discrepancies_found?: number | null
          total_adjustment_value?: number | null
          created_at?: string
        }
      }
      inventory_count_items: {
        Row: {
          id: string
          count_id: string
          product_id: string
          expected_quantity: number | null
          counted_quantity: number | null
          difference: number | null
          is_counted: boolean
          counted_at: string | null
          notes: string | null
        }
        Insert: {
          id?: string
          count_id: string
          product_id: string
          expected_quantity?: number | null
          counted_quantity?: number | null
          is_counted?: boolean
          counted_at?: string | null
          notes?: string | null
        }
        Update: {
          id?: string
          count_id?: string
          product_id?: string
          expected_quantity?: number | null
          counted_quantity?: number | null
          is_counted?: boolean
          counted_at?: string | null
          notes?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Helper types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Convenience types
export type Product = Tables<'products'>
export type Category = Tables<'categories'>
export type Location = Tables<'locations'>
export type Supplier = Tables<'suppliers'>
export type StockMovement = Tables<'stock_movements'>
export type StockBatch = Tables<'stock_batches'>
export type PurchaseOrder = Tables<'purchase_orders'>
export type PurchaseOrderItem = Tables<'purchase_order_items'>
export type InventoryCount = Tables<'inventory_counts'>
export type InventoryCountItem = Tables<'inventory_count_items'>
export type UserProfile = Tables<'user_profiles'>
export type ProductLocation = Tables<'product_locations'>

// Product with relations
export type ProductWithCategory = Product & {
  category: Category | null
}

export type ProductWithSupplier = Product & {
  supplier: Supplier | null
}

export type ProductFull = Product & {
  category: Category | null
  supplier: Supplier | null
}

// Stock movement with product
export type StockMovementWithProduct = StockMovement & {
  product: Product
}

// Movement types
export type MovementType = StockMovement['movement_type']

// Units
export const UNITS = [
  { value: 'stuk', label: 'Stuk' },
  { value: 'kg', label: 'Kilogram' },
  { value: 'gram', label: 'Gram' },
  { value: 'liter', label: 'Liter' },
  { value: 'ml', label: 'Milliliter' },
  { value: 'doos', label: 'Doos' },
  { value: 'kist', label: 'Kist' },
  { value: 'krat', label: 'Krat' },
  { value: 'zak', label: 'Zak' },
  { value: 'bos', label: 'Bos' },
  { value: 'tros', label: 'Tros' },
  { value: 'fles', label: 'Fles' },
  { value: 'pot', label: 'Pot' },
  { value: 'blik', label: 'Blik' },
  { value: 'pak', label: 'Pak' },
] as const

// Movement type labels
export const MOVEMENT_TYPE_LABELS: Record<MovementType, string> = {
  purchase: 'Inkoop',
  sale: 'Verkoop',
  adjustment_plus: 'Correctie +',
  adjustment_minus: 'Correctie -',
  transfer_in: 'Transfer IN',
  transfer_out: 'Transfer OUT',
  waste: 'Afval',
  return_supplier: 'Retour leverancier',
  return_customer: 'Retour klant',
  inventory_count: 'Voorraadtelling',
}

// Business types
export const BUSINESS_TYPES = [
  { value: 'handelaar', label: 'Handelaar' },
  { value: 'horeca', label: 'Horeca' },
  { value: 'bakkerij', label: 'Bakkerij' },
  { value: 'slagerij', label: 'Slagerij' },
  { value: 'supermarkt', label: 'Supermarkt' },
  { value: 'overig', label: 'Overig' },
] as const
