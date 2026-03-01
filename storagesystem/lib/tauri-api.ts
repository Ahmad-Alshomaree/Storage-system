async function invokeTauri<T>(command: string, payload?: Record<string, unknown>): Promise<T> {
  if (typeof window === 'undefined' || !(window as any).__TAURI_INTERNALS__) {
    throw new Error('This build is desktop-only and must run inside Tauri')
  }

  // @ts-ignore
  const { invoke } = await import('@tauri-apps/api/core')
  return invoke(command, payload)
}

export const tauriApi = {
  isTauri: () => {
    return typeof window !== 'undefined' && !!(window as any).__TAURI_INTERNALS__
  },

  initializeDatabase: async () => {
    const storagePath = localStorage.getItem('storagePath')
    return invokeTauri('initialize_database', { storagePath })
  },

  getProducts: async (): Promise<any[]> => {
    return invokeTauri('get_products')
  },

  createProduct: async (product: any) => {
    return invokeTauri('create_product', { productData: product })
  },

  updateProduct: async (id: number, updates: any) => {
    return invokeTauri('update_product', { id, productData: updates })
  },

  deleteProduct: async (id: number) => {
    return invokeTauri('delete_product', { id })
  },

  getClients: async (): Promise<any[]> => {
    return invokeTauri('get_clients')
  },

  createClient: async (client: any) => {
    return invokeTauri('create_client', { clientData: client })
  },

  updateClient: async (id: number, updates: any) => {
    return invokeTauri('update_client', { id, clientData: updates })
  },

  deleteClient: async (id: number) => {
    return invokeTauri('delete_client', { id })
  },

  getShipping: async (): Promise<any[]> => {
    return invokeTauri('get_shipping')
  },

  createShipping: async (shipping: any) => {
    return invokeTauri('create_shipping', { shippingData: shipping })
  },

  updateShipping: async (id: number, updates: any) => {
    return invokeTauri('update_shipping', { id, shippingData: updates })
  },

  deleteShipping: async (id: number) => {
    return invokeTauri('delete_shipping', { id })
  },

  getDebits: async (): Promise<any[]> => {
    return invokeTauri('get_debits')
  },


  createDebit: async (debit: any) => {
    return invokeTauri('create_debit', { debitData: debit })
  },

  updateDebit: async (id: number, updates: any) => {
    return invokeTauri('update_debit', { id, debitData: updates })
  },

  deleteDebit: async (id: number) => {
    return invokeTauri('delete_debit', { id })
  },

  getRooms: async (): Promise<any[]> => {
    return invokeTauri('get_rooms')
  },

  createRoom: async (room: any) => {
    return invokeTauri('create_room', { roomData: room })
  },

  getStoreProducts: async (): Promise<any[]> => {
    return invokeTauri('get_store_products')
  },

  uploadFile: async (filePath: string) => {
    return invokeTauri('upload_file', { filePath })
  },

  selectStorageDirectory: async (): Promise<string> => {
    return invokeTauri('select_storage_directory')
  },
}
