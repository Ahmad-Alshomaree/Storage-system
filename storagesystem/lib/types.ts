export interface Product {
  id: number
  shipping_id?: number | null
  box_code: string
  product_name?: string
  product_type?: string
  original_price: number
  total_original_price: number
  selling_price: number
  storage?: string
  weight?: number
  image?: string | null
  pice_per_box?: number | null
  Total_pices?: number | null
  size_of_box: number
  total_box_size: number
  number_of_boxes: number
  extracted_pieces?: number | null
  status: string
  group_item_price?: number | null
  currency: string
  note?: string | null
  created_at?: string
  updated_at?: string
  shipping?: {
    id: number
    type: string
    shipping_date: string
    receiver: string
    file_path?: string | null
    created_at: string
  }
}

export interface Debit {
  id: number
  client_id: number
  shipping_id?: number | null
  amount: number
  description?: string | null
  transaction_date: string
  created_at: string
  client: {
    id: number
    client_name: string
    phone_number?: string | null
  }
  shipping?: {
    id: number
    type: string
    shipping_date: string
    receiver: string
    file_path?: string | null
    created_at: string
  }
}

export interface Shipping {
  id: number
  type: string
  shipping_date: string
  receiving_date: string
  receiver: string
  sender: string
  created_at: string
  file_path?: string | null
}

export interface Client {
  id: number
  client_name: string
  phone_number?: string | null
  shipping_id?: number | null
  history?: string | null
  debt: number
  total_debts: number
}

export interface StoreProduct {
  id: number
  product_id: number
  product_name: string
  individual_item_selling_price: number
  image?: string | null
  group_item_price?: number | null
  number_of_items: number
  entered_at: string
  product?: Product
}

export type TabType = "products" | "shipping" | "clients" | "debits"
