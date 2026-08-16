export type Currency = "Dollar" | "Euro" | "Turkish Lira" | "Iraqi Dinar" | "SYP" | string
export type ShippingType = "input load" | "output load" | string
export type ProductStatus = "available" | "sold" | "damaged" | "transferred" | string
export type TabType = "dashboard" | "products" | "shipping" | "clients" | "debits"

export interface ClientSummary {
  id: number
  client_name: string
  phone_number?: string | null
  shipping_id?: number | null
  history?: string | null
}

export type ShippingTableClient = ClientSummary

export interface Product {
  id: number
  shipping_id?: number | null
  item_no?: string | null
  box_code: string
  product_name?: string | null
  product_type?: string | null
  cost: number
  total_cost: number
  selling_price: number
  storage?: string | null
  weight?: number | null
  image?: string | null
  pice_per_box?: number | null
  piece_per_box?: number | null
  total_pices?: number | null
  total_pieces?: number | null
  Total_pices?: number | null
  size_of_box: number
  total_box_size: number
  number_of_boxes: number
  extracted_pieces?: number | null
  status: ProductStatus
  grope_item_price?: number | null
  group_item_price?: number | null
  Grope_Item_price?: number | null
  currency: Currency
  note?: string | null
  created_at?: string | null
  updated_at?: string | null
  shipping?: Shipping | null
}

export interface Client {
  id: number
  client_name: string
  phone_number?: string | null
  shipping_id?: number | null
  history?: string | null
  debt?: number | null
  total_debts?: number | null
  created_at?: string | null
  updated_at?: string | null
  shipping?: {
    id: number
    type: string
    shipping_date: string
    receiving_date: string
    receiver?: any
    file_path?: string | null
    created_at?: string
  } | null
}

export interface CreateClientInput {
  client_name: string
  phone_number?: string | null
  shipping_id?: number | null
  history?: string | null
  debt?: number | null
}

export interface ShippingItem {
  id?: number
  shipping_id?: number
  product_id: number
  product_name?: string
  box_code?: string
  quantity: number
  quantity_type: "pieces" | "boxes" | "kilos" | string
  unit_price: number
  total_price: number
  created_at?: string
}

export interface CreateShippingItemInput {
  product_id: number
  quantity: number
  quantity_type: "pieces" | "boxes" | "kilos" | string
  unit_price: number
}

export interface Shipping {
  id: number
  type: ShippingType
  shipping_date: string
  receiving_date: string
  receiver_client_id?: number
  sender_client_id?: number
  receiver: ClientSummary
  sender: ClientSummary
  paid?: number
  ship_price?: number
  currency?: Currency
  note?: string | null
  created_at: string
  file_path?: string | null
  products?: Product[]
  items?: ShippingItem[]
}

export interface CreateShippingInput {
  type: ShippingType
  shipping_date: string
  receiving_date: string
  receiver_client_id: number
  sender_client_id: number
  file_path?: string | null
  paid: number
  ship_price: number
  currency: Currency
  note?: string | null
}

export interface Debit {
  id: number
  sender_id?: number | null
  receiver_id: number
  shipping_id?: number | null
  amount: number
  currency: Currency
  note?: string | null
  transaction_date?: string | null
  total_debit?: number | null
  created_at: string
  sender?: ClientSummary | null
  receiver: ClientSummary
  shipping?: Shipping | null
}

export interface CreateDebitInput {
  sender_id?: number | null
  receiver_id: number
  shipping_id?: number | null
  amount: number
  currency: Currency
  note?: string | null
  transaction_date?: string | null
}

export interface Room {
  id: number
  room_name: string
}

export interface CreateRoomInput {
  room_name: string
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
