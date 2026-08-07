import type { Product, Client, Shipping, Debit, Room, StoreProduct } from "./types"

function isTauriEnvironment(): boolean {
  return typeof window !== 'undefined' && !!(window as any).__TAURI_INTERNALS__
}

async function invokeTauri<T>(command: string, payload?: Record<string, unknown>): Promise<T> {
  if (!isTauriEnvironment()) {
    throw new Error('Not in Tauri environment')
  }
  // @ts-ignore
  const { invoke } = await import('@tauri-apps/api/core')
  return invoke(command, payload)
}

function getStorageItem<T>(key: string, defaultVal: T): T {
  if (typeof window === 'undefined') return defaultVal
  try {
    const data = localStorage.getItem(`app_${key}`)
    return data ? JSON.parse(data) : defaultVal
  } catch {
    return defaultVal
  }
}

function setStorageItem<T>(key: string, val: T): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(`app_${key}`, JSON.stringify(val))
  } catch (e) {
    console.error('Failed to set localStorage item', e)
  }
}

export const tauriApi = {
  isTauri: isTauriEnvironment,

  initializeDatabase: async (): Promise<void> => {
    if (isTauriEnvironment()) {
      const storagePath = localStorage.getItem('storagePath')
      return invokeTauri('initialize_database', { storagePath })
    }
    if (!localStorage.getItem('app_products')) setStorageItem('products', [])
    if (!localStorage.getItem('app_clients')) setStorageItem('clients', [])
    if (!localStorage.getItem('app_shipping')) setStorageItem('shipping', [])
    if (!localStorage.getItem('app_debits')) setStorageItem('debits', [])
    if (!localStorage.getItem('app_rooms')) setStorageItem('rooms', [])
    if (!localStorage.getItem('app_store_products')) setStorageItem('store_products', [])
  },

  getProducts: async (): Promise<Product[]> => {
    if (isTauriEnvironment()) return invokeTauri('get_products')
    return getStorageItem<Product[]>('products', [])
  },

  createProduct: async (product: any): Promise<Product> => {
    if (isTauriEnvironment()) return invokeTauri('create_product', { productData: product })
    const list = getStorageItem<Product[]>('products', [])
    const newProduct: Product = {
      ...product,
      id: Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    setStorageItem('products', [newProduct, ...list])
    return newProduct
  },

  updateProduct: async (id: number, updates: any): Promise<Product> => {
    if (isTauriEnvironment()) return invokeTauri('update_product', { id, productData: updates })
    const list = getStorageItem<Product[]>('products', [])
    let updated: Product | null = null
    const newList = list.map(p => {
      if (p.id === id) {
        updated = { ...p, ...updates, updated_at: new Date().toISOString() }
        return updated
      }
      return p
    })
    setStorageItem('products', newList)
    if (!updated) throw new Error("Product not found")
    return updated
  },

  deleteProduct: async (id: number): Promise<void> => {
    if (isTauriEnvironment()) return invokeTauri('delete_product', { id })
    const list = getStorageItem<Product[]>('products', [])
    setStorageItem('products', list.filter(p => p.id !== id))
  },

  getClients: async (): Promise<Client[]> => {
    if (isTauriEnvironment()) return invokeTauri('get_clients')
    return getStorageItem<Client[]>('clients', [])
  },

  createClient: async (client: any): Promise<Client> => {
    if (isTauriEnvironment()) return invokeTauri('create_client', { clientData: client })
    const list = getStorageItem<Client[]>('clients', [])
    const newClient: Client = {
      ...client,
      id: Date.now(),
      debt: client.debt || 0,
      total_debts: client.debt || 0
    }
    setStorageItem('clients', [newClient, ...list])
    return newClient
  },

  updateClient: async (id: number, updates: any): Promise<Client> => {
    if (isTauriEnvironment()) return invokeTauri('update_client', { id, clientData: updates })
    const list = getStorageItem<Client[]>('clients', [])
    let updated: Client | null = null
    const newList = list.map(c => {
      if (c.id === id) {
        updated = { ...c, ...updates }
        return updated
      }
      return c
    })
    setStorageItem('clients', newList)
    if (!updated) throw new Error("Client not found")
    return updated
  },

  deleteClient: async (id: number): Promise<void> => {
    if (isTauriEnvironment()) return invokeTauri('delete_client', { id })
    const list = getStorageItem<Client[]>('clients', [])
    setStorageItem('clients', list.filter(c => c.id !== id))
  },

  getShipping: async (): Promise<Shipping[]> => {
    if (isTauriEnvironment()) return invokeTauri('get_shipping')
    return getStorageItem<Shipping[]>('shipping', [])
  },

  createShipping: async (shipping: any): Promise<Shipping> => {
    if (isTauriEnvironment()) return invokeTauri('create_shipping', { shippingData: shipping })
    const list = getStorageItem<Shipping[]>('shipping', [])
    const clients = getStorageItem<Client[]>('clients', [])
    const receiver = clients.find(c => c.id === shipping.receiver_client_id)
    const sender = clients.find(c => c.id === shipping.sender_client_id)

    const newShipping: Shipping = {
      ...shipping,
      id: Date.now(),
      receiver: receiver ? { id: receiver.id, client_name: receiver.client_name, phone_number: receiver.phone_number } : { id: shipping.receiver_client_id, client_name: '' },
      sender: sender ? { id: sender.id, client_name: sender.client_name, phone_number: sender.phone_number } : { id: shipping.sender_client_id, client_name: '' },
      created_at: new Date().toISOString()
    }
    setStorageItem('shipping', [newShipping, ...list])
    return newShipping
  },

  updateShipping: async (id: number, updates: any): Promise<Shipping> => {
    if (isTauriEnvironment()) return invokeTauri('update_shipping', { id, shippingData: updates })
    const list = getStorageItem<Shipping[]>('shipping', [])
    let updated: Shipping | null = null
    const newList = list.map(s => {
      if (s.id === id) {
        updated = { ...s, ...updates }
        return updated
      }
      return s
    })
    setStorageItem('shipping', newList)
    if (!updated) throw new Error("Shipping not found")
    return updated
  },

  deleteShipping: async (id: number): Promise<void> => {
    if (isTauriEnvironment()) return invokeTauri('delete_shipping', { id })
    const list = getStorageItem<Shipping[]>('shipping', [])
    setStorageItem('shipping', list.filter(s => s.id !== id))
  },

  getDebits: async (): Promise<Debit[]> => {
    if (isTauriEnvironment()) return invokeTauri('get_debits')
    return getStorageItem<Debit[]>('debits', [])
  },

  createDebit: async (debit: any): Promise<Debit> => {
    if (isTauriEnvironment()) return invokeTauri('create_debit', { debitData: debit })
    const list = getStorageItem<Debit[]>('debits', [])
    const clients = getStorageItem<Client[]>('clients', [])
    const receiver = clients.find(c => c.id === debit.receiver_id)
    const sender = clients.find(c => c.id === debit.sender_id)

    const newDebit: Debit = {
      ...debit,
      id: Date.now(),
      receiver: receiver ? { id: receiver.id, client_name: receiver.client_name, phone_number: receiver.phone_number } : undefined,
      sender: sender ? { id: sender.id, client_name: sender.client_name, phone_number: sender.phone_number } : undefined,
      created_at: new Date().toISOString()
    }
    setStorageItem('debits', [newDebit, ...list])
    return newDebit
  },

  updateDebit: async (id: number, updates: any): Promise<Debit> => {
    if (isTauriEnvironment()) return invokeTauri('update_debit', { id, debitData: updates })
    const list = getStorageItem<Debit[]>('debits', [])
    let updated: Debit | null = null
    const newList = list.map(d => {
      if (d.id === id) {
        updated = { ...d, ...updates }
        return updated
      }
      return d
    })
    setStorageItem('debits', newList)
    if (!updated) throw new Error("Debit not found")
    return updated
  },

  deleteDebit: async (id: number): Promise<void> => {
    if (isTauriEnvironment()) return invokeTauri('delete_debit', { id })
    const list = getStorageItem<Debit[]>('debits', [])
    setStorageItem('debits', list.filter(d => d.id !== id))
  },

  getRooms: async (): Promise<Room[]> => {
    if (isTauriEnvironment()) return invokeTauri('get_rooms')
    return getStorageItem<Room[]>('rooms', [])
  },

  createRoom: async (room: any): Promise<Room> => {
    if (isTauriEnvironment()) return invokeTauri('create_room', { roomData: room })
    const list = getStorageItem<Room[]>('rooms', [])
    const newRoom: Room = {
      ...room,
      id: Date.now()
    }
    setStorageItem('rooms', [newRoom, ...list])
    return newRoom
  },

  getStoreProducts: async (): Promise<StoreProduct[]> => {
    if (isTauriEnvironment()) return invokeTauri('get_store_products')
    return getStorageItem<StoreProduct[]>('store_products', [])
  },

  uploadFile: async (filePath: string): Promise<string> => {
    if (isTauriEnvironment()) return invokeTauri('upload_file', { filePath })
    return filePath
  },

  selectStorageDirectory: async (): Promise<string> => {
    if (isTauriEnvironment()) return invokeTauri('select_storage_directory')
    return "/web/storage"
  },

  backupDatabase: async (targetPath: string): Promise<string> => {
    if (isTauriEnvironment()) return invokeTauri('backup_database', { targetPath })
    return "Backup completed (web fallback)"
  },
}
