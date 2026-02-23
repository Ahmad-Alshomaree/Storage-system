// Database commands - works in both development and Tauri environments
// Using dynamic imports and type assertions to avoid build-time issues

export const tauriApi = {
  // Check if running in Tauri environment
  isTauri: () => {
    return typeof window !== 'undefined' && !!(window as any).__TAURI_INTERNALS__
  },

  // Initialize database
  initializeDatabase: async () => {
    console.log('tauriApi: __TAURI_INTERNALS__ present?', tauriApi.isTauri())
    // In Tauri environment
    if (tauriApi.isTauri()) {
      try {
        console.log('tauriApi: Running in Tauri, calling initialize_database')
        // @ts-ignore
        const { invoke } = await import('@tauri-apps/api/core')
        const storagePath = localStorage.getItem('storagePath')
        return await invoke('initialize_database', { storagePath })
      } catch (error) {
        console.error('tauriApi: Failed to initialize database in Tauri:', error)
        // Fallback to no-op in development
        return Promise.resolve()
      }
    }
    console.log('tauriApi: Running in web mode, skipping database initialization')
    // In development, just resolve
    return Promise.resolve()
  },

  // Products
  getProducts: async (): Promise<any[]> => {
    // In Tauri environment
    if (tauriApi.isTauri()) {
      try {
        console.log('tauriApi: Fetching products via Tauri')
        // @ts-ignore
        const { invoke } = await import('@tauri-apps/api/core')
        return await invoke('get_products')
      } catch (error) {
        console.error('tauriApi: Failed to fetch products via Tauri:', error)
        throw new Error('Failed to fetch products')
      }
    }
    // In development, use API routes
    console.log('tauriApi: Fetching products via HTTP API')
    const response = await fetch('/api/products')
    if (!response.ok) throw new Error('Failed to fetch products')
    return response.json()
  },

  createProduct: async (product: any) => {
    // In Tauri environment
    if (tauriApi.isTauri()) {
      try {
        console.log('tauriApi: Creating product via Tauri')
        // @ts-ignore
        const { invoke } = await import('@tauri-apps/api/core')
        return await invoke('create_product', { productData: product })
      } catch (error) {
        console.error('tauriApi: Failed to create product via Tauri:', error)
        throw new Error('Failed to create product')
      }
    }
    // In development, use API routes
    console.log('tauriApi: Creating product via HTTP API')
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    })
    if (!response.ok) throw new Error('Failed to create product')
    return response.json()
  },

  updateProduct: async (id: number, updates: any) => {
    // In Tauri environment
    if (tauriApi.isTauri()) {
      try {
        console.log('tauriApi: Updating product via Tauri')
        // @ts-ignore
        const { invoke } = await import('@tauri-apps/api/core')
        return await invoke('update_product', { id, productData: updates })
      } catch (error) {
        console.error('tauriApi: Failed to update product via Tauri:', error)
        throw new Error('Failed to update product')
      }
    }
    // In development, use API routes
    console.log('tauriApi: Updating product via HTTP API')
    const response = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
    if (!response.ok) throw new Error('Failed to update product')
    return response.json()
  },

  deleteProduct: async (id: number) => {
    // In Tauri environment
    if (tauriApi.isTauri()) {
      try {
        console.log('tauriApi: Deleting product via Tauri')
        // @ts-ignore
        const { invoke } = await import('@tauri-apps/api/core')
        return await invoke('delete_product', { id })
      } catch (error) {
        console.error('tauriApi: Failed to delete product via Tauri:', error)
        throw new Error('Failed to delete product')
      }
    }
    // In development, use API routes
    console.log('tauriApi: Deleting product via HTTP API')
    const response = await fetch(`/api/products/${id}`, { method: 'DELETE' })
    if (!response.ok) throw new Error('Failed to delete product')
  },

  // Clients
  getClients: async (): Promise<any[]> => {
    // In Tauri environment
    if (tauriApi.isTauri()) {
      try {
        console.log('tauriApi: Fetching clients via Tauri')
        // @ts-ignore
        const { invoke } = await import('@tauri-apps/api/core')
        return await invoke('get_clients')
      } catch (error) {
        console.error('tauriApi: Failed to fetch clients via Tauri:', error)
        throw new Error('Failed to fetch clients')
      }
    }
    // In development, use API routes
    console.log('tauriApi: Fetching clients via HTTP API')
    const response = await fetch('/api/clients')
    if (!response.ok) throw new Error('Failed to fetch clients')
    return response.json()
  },

  createClient: async (client: any) => {
    // In Tauri environment
    if (tauriApi.isTauri()) {
      try {
        console.log('tauriApi: Creating client via Tauri', client)
        // @ts-ignore
        const { invoke } = await import('@tauri-apps/api/core')
        return await invoke('create_client', { clientData: client })
      } catch (error) {
        console.error('tauriApi: Failed to create client via Tauri:', error)
        throw new Error(`Failed to create client: ${error}`)
      }
    }
    // In development, use API routes
    console.log('tauriApi: Creating client via HTTP API')
    const response = await fetch('/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(client),
    })
    if (!response.ok) throw new Error('Failed to create client')
    return response.json()
  },

  updateClient: async (id: number, updates: any) => {
    // In Tauri environment
    if (tauriApi.isTauri()) {
      try {
        console.log('tauriApi: Updating client via Tauri')
        // @ts-ignore
        const { invoke } = await import('@tauri-apps/api/core')
        return await invoke('update_client', { id, clientData: updates })
      } catch (error) {
        console.error('tauriApi: Failed to update client via Tauri:', error)
        throw new Error('Failed to update client')
      }
    }
    // In development, use API routes
    console.log('tauriApi: Updating client via HTTP API')
    const response = await fetch(`/api/clients/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
    if (!response.ok) throw new Error('Failed to update client')
    return response.json()
  },

  deleteClient: async (id: number) => {
    // In Tauri environment
    if (tauriApi.isTauri()) {
      try {
        console.log('tauriApi: Deleting client via Tauri')
        // @ts-ignore
        const { invoke } = await import('@tauri-apps/api/core')
        return await invoke('delete_client', { id })
      } catch (error) {
        console.error('tauriApi: Failed to delete client via Tauri:', error)
        throw new Error('Failed to delete client')
      }
    }
    // In development, use API routes
    console.log('tauriApi: Deleting client via HTTP API')
    const response = await fetch(`/api/clients/${id}`, { method: 'DELETE' })
    if (!response.ok) throw new Error('Failed to delete client')
  },

  // Shipping
  getShipping: async (): Promise<any[]> => {
    // In Tauri environment
    if (tauriApi.isTauri()) {
      try {
        console.log('tauriApi: Fetching shipping via Tauri')
        // @ts-ignore
        const { invoke } = await import('@tauri-apps/api/core')
        return await invoke('get_shipping')
      } catch (error) {
        console.error('tauriApi: Failed to fetch shipping via Tauri:', error)
        throw new Error('Failed to fetch shipping')
      }
    }
    // In development, use API routes
    console.log('tauriApi: Fetching shipping via HTTP API')
    const response = await fetch('/api/shipping')
    if (!response.ok) throw new Error('Failed to fetch shipping')
    return response.json()
  },

  createShipping: async (shipping: any) => {
    // In Tauri environment
    if (tauriApi.isTauri()) {
      try {
        console.log('tauriApi: Creating shipping via Tauri', shipping)
        // @ts-ignore
        const { invoke } = await import('@tauri-apps/api/core')
        return await invoke('create_shipping', { shippingData: shipping })
      } catch (error) {
        console.error('tauriApi: Failed to create shipping via Tauri:', error)
        throw new Error(`Failed to create shipping: ${error}`)
      }
    }
    // In development, use API routes
    console.log('tauriApi: Creating shipping via HTTP API')
    const response = await fetch('/api/shipping', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(shipping),
    })
    if (!response.ok) throw new Error('Failed to create shipping')
    return response.json()
  },

  updateShipping: async (id: number, updates: any) => {
    // In Tauri environment
    if (tauriApi.isTauri()) {
      try {
        console.log('tauriApi: Updating shipping via Tauri')
        // @ts-ignore
        const { invoke } = await import('@tauri-apps/api/core')
        return await invoke('update_shipping', { id, shippingData: updates })
      } catch (error) {
        console.error('tauriApi: Failed to update shipping via Tauri:', error)
        throw new Error('Failed to update shipping')
      }
    }
    // In development, use API routes
    console.log('tauriApi: Updating shipping via HTTP API')
    const response = await fetch(`/api/shipping/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
    if (!response.ok) throw new Error('Failed to update shipping')
    return response.json()
  },

  deleteShipping: async (id: number) => {
    // In Tauri environment
    if (tauriApi.isTauri()) {
      try {
        console.log('tauriApi: Deleting shipping via Tauri')
        // @ts-ignore
        const { invoke } = await import('@tauri-apps/api/core')
        return await invoke('delete_shipping', { id })
      } catch (error) {
        console.error('tauriApi: Failed to delete shipping via Tauri:', error)
        throw new Error('Failed to delete shipping')
      }
    }
    // In development, use API routes
    console.log('tauriApi: Deleting shipping via HTTP API')
    const response = await fetch(`/api/shipping/${id}`, { method: 'DELETE' })
    if (!response.ok) throw new Error('Failed to delete shipping')
  },

  // Debits
  getDebits: async (): Promise<any[]> => {
    // In Tauri environment
    if (tauriApi.isTauri()) {
      try {
        console.log('tauriApi: Fetching debits via Tauri')
        // @ts-ignore
        const { invoke } = await import('@tauri-apps/api/core')
        return await invoke('get_debits')
      } catch (error) {
        console.error('tauriApi: Failed to fetch debits via Tauri:', error)
        throw new Error('Failed to fetch debits')
      }
    }
    // In development, use API routes
    console.log('tauriApi: Fetching debits via HTTP API')
    const response = await fetch('/api/debits')
    if (!response.ok) throw new Error('Failed to fetch debits')
    return response.json()
  },

  updateDebit: async (id: number, updates: any) => {
    // In Tauri environment
    if (tauriApi.isTauri()) {
      try {
        console.log('tauriApi: Updating debit via Tauri')
        // @ts-ignore
        const { invoke } = await import('@tauri-apps/api/core')
        return await invoke('update_debit', { id, debitData: updates })
      } catch (error) {
        console.error('tauriApi: Failed to update debit via Tauri:', error)
        throw new Error('Failed to update debit')
      }
    }
    // In development, use API routes
    console.log('tauriApi: Updating debit via HTTP API')
    const response = await fetch(`/api/debits/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
    if (!response.ok) throw new Error('Failed to update debit')
    return response.json()
  },

  deleteDebit: async (id: number) => {
    // In Tauri environment
    if (tauriApi.isTauri()) {
      try {
        console.log('tauriApi: Deleting debit via Tauri')
        // @ts-ignore
        const { invoke } = await import('@tauri-apps/api/core')
        return await invoke('delete_debit', { id })
      } catch (error) {
        console.error('tauriApi: Failed to delete debit via Tauri:', error)
        throw new Error('Failed to delete debit')
      }
    }
    // In development, use API routes
    console.log('tauriApi: Deleting debit via HTTP API')
    const response = await fetch(`/api/debits/${id}`, { method: 'DELETE' })
    if (!response.ok) throw new Error('Failed to delete debit')
  },

  // Rooms
  getRooms: async (): Promise<any[]> => {
    // In Tauri environment
    if (tauriApi.isTauri()) {
      try {
        console.log('tauriApi: Fetching rooms via Tauri')
        // @ts-ignore
        const { invoke } = await import('@tauri-apps/api/core')
        return await invoke('get_rooms')
      } catch (error) {
        console.error('tauriApi: Failed to fetch rooms via Tauri:', error)
        throw new Error('Failed to fetch rooms')
      }
    }
    // In development, use API routes
    console.log('tauriApi: Fetching rooms via HTTP API')
    const response = await fetch('/api/rooms')
    if (!response.ok) throw new Error('Failed to fetch rooms')
    return response.json()
  },

  createRoom: async (room: any) => {
    // In Tauri environment
    if (tauriApi.isTauri()) {
      try {
        console.log('tauriApi: Creating room via Tauri', room)
        // @ts-ignore
        const { invoke } = await import('@tauri-apps/api/core')
        return await invoke('create_room', { roomData: room })
      } catch (error) {
        console.error('tauriApi: Failed to create room via Tauri:', error)
        throw new Error('Failed to create room')
      }
    }
    // In development, use API routes
    console.log('tauriApi: Creating room via HTTP API')
    const response = await fetch('/api/rooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(room),
    })
    if (!response.ok) throw new Error('Failed to create room')
    return response.json()
  },

  // Store Products
  getStoreProducts: async (): Promise<any[]> => {
    // In Tauri environment
    if (tauriApi.isTauri()) {
      try {
        console.log('tauriApi: Fetching store products via Tauri')
        // @ts-ignore
        const { invoke } = await import('@tauri-apps/api/core')
        return await invoke('get_store_products')
      } catch (error) {
        console.error('tauriApi: Failed to fetch store products via Tauri:', error)
        throw new Error('Failed to fetch store products')
      }
    }
    // In development, use API routes
    console.log('tauriApi: Fetching store products via HTTP API')
    const response = await fetch('/api/store-products')
    if (!response.ok) throw new Error('Failed to fetch store products')
    return response.json()
  },

  // File upload
  uploadFile: async (filePath: string) => {
    // In Tauri environment
    if (tauriApi.isTauri()) {
      try {
        console.log('tauriApi: Uploading file via Tauri')
        // @ts-ignore
        const { invoke } = await import('@tauri-apps/api/core')
        return await invoke('upload_file', { filePath })
      } catch (error) {
        console.error('tauriApi: Failed to upload file via Tauri:', error)
        throw new Error('Failed to upload file')
      }
    }
    // In development, this would use API routes, but for now just return the path
    console.log('tauriApi: File upload not supported in web mode')
    return filePath
  },

  // Select storage directory
  selectStorageDirectory: async (): Promise<string> => {
    // In Tauri environment
    if (tauriApi.isTauri()) {
      try {
        console.log('tauriApi: Selecting storage directory via Tauri')
        // @ts-ignore
        const { invoke } = await import('@tauri-apps/api/core')
        return await invoke('select_storage_directory')
      } catch (error) {
        console.error('tauriApi: Failed to select storage directory via Tauri:', error)
        throw new Error('Failed to select storage directory')
      }
    }
    // In development, just return a default path
    console.log('tauriApi: Directory selection not supported in web mode')
    return '/default/storage/path'
  },
}
