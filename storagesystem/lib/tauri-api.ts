import { invoke } from '@tauri-apps/api/core';

// Type definitions matching the Rust backend
export interface Product {
  id: number;
  shipping_id?: number;
  item_no?: string;
  box_code: string;
  product_name?: string;
  cost: number;
  selling_price: number;
  storage?: string;
  weight?: number;
  image?: string;
  pice_per_box: number;
  total_pices: number;
  total_cost: number;
  size_of_box: number;
  total_box_size: number;
  number_of_boxes: number;
  extracted_pieces: number;
  status: string;
  grope_item_price?: number;
  currency: string;
  note?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Client {
  id: number;
  client_name: string;
  phone_number?: string;
  shipping_id?: number;
  history?: string;
  debt: number;
  total_debts: number;
}

export interface ShippingTableClient {
  id: number;
  client_name: string;
  phone_number?: string;
}

export interface Shipping {
  id: number;
  type: string;
  shipping_date: string;
  receiving_date: string;
  receiver_client_id: number;
  sender_client_id: number;
  receiver: ShippingTableClient;
  sender: ShippingTableClient;
  file_path?: string;
  paid: number;
  ship_price: number;
  currency: string;
  note?: string;
  created_at: string;
}

export interface Debit {
  id: number;
  sender_id?: number;
  receiver_id: number;
  shipping_id?: number;
  amount: number;
  currency: string;
  note?: string;
  transaction_date: string;
  total_debit?: number;
  created_at: string;
  sender?: {
    id: number;
    client_name: string;
    phone_number?: string;
  };
  receiver: {
    id: number;
    client_name: string;
    phone_number?: string;
  };
  shipping?: {
    id: number;
    type: string;
    shipping_date: string;
    receiving_date: string;
    receiver?: {
      id: number;
      client_name: string;
      phone_number?: string;
    };
    sender?: {
      id: number;
      client_name: string;
      phone_number?: string;
    };
    file_path?: string;
    paid: number;
    ship_price: number;
    currency: string;
    note?: string;
    created_at: string;
  };
}

export interface Room {
  id: number;
  room_name: string;
}

export interface StoreProduct {
  id: number;
  product_id: number;
  product_name: string;
  individual_item_selling_price: number;
  image?: string;
  group_item_price?: number;
  number_of_items: number;
  entered_at: string;
}

// API functions that invoke Tauri commands
export const api = {
  // Product operations
  async getProducts(): Promise<Product[]> {
    return invoke('get_products');
  },

  async createProduct(product: Omit<Product, 'id'>): Promise<Product> {
    return invoke('create_product', { productData: product });
  },

  async deleteProduct(id: number): Promise<void> {
    return invoke('delete_product', { id });
  },

  // Client operations
  async getClients(): Promise<Client[]> {
    return invoke('get_clients');
  },

  async createClient(client: Omit<Client, 'id'>): Promise<Client> {
    return invoke('create_client', { clientData: client });
  },

  // Shipping operations
  async getShipping(): Promise<Shipping[]> {
    return invoke('get_shipping');
  },

  // Debit operations
  async getDebits(): Promise<Debit[]> {
    return invoke('get_debits');
  },

  // Room operations
  async getRooms(): Promise<Room[]> {
    return invoke('get_rooms');
  },

  // Store product operations
  async getStoreProducts(): Promise<StoreProduct[]> {
    return invoke('get_store_products');
  },

  // File upload
  async uploadFile(filePath: string): Promise<string> {
    return invoke('upload_file', { filePath });
  },
};

// Helper function to check if running in Tauri environment
export const isTauri = typeof window !== 'undefined' && '__TAURI__' in window;
