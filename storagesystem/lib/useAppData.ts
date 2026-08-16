import { useState, useEffect, useCallback } from "react"
import type { Product, Shipping, Client, Debit, StoreProduct } from "./types"
import { tauriApi } from "./tauri-api"

interface UseAppDataReturn {
  products: Product[]
  shipping: Shipping[]
  clients: Client[]
  debits: Debit[]
  storeProducts: StoreProduct[]
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export function useAppData(): UseAppDataReturn {
  const [products, setProducts] = useState<Product[]>([])
  const [shipping, setShipping] = useState<Shipping[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [debits, setDebits] = useState<Debit[]>([])
  const [storeProducts, setStoreProducts] = useState<StoreProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    console.log('useAppData: Starting data fetch')
    setIsLoading(true)
    setError(null)

    try {
      // Initialize database first
      console.log('useAppData: Initializing database')
      await tauriApi.initializeDatabase()

      // Fetch all data using Tauri API
      console.log('useAppData: Fetching data from APIs')
      const [productsData, shippingData, clientsData, debitsData, storeProductsData] = await Promise.all([
        tauriApi.getProducts(),
        tauriApi.getShipping(),
        tauriApi.getClients(),
        tauriApi.getDebits(),
        tauriApi.getStoreProducts()
      ])

      console.log('useAppData: Data fetched successfully', {
        products: productsData?.length || 0,
        shipping: shippingData?.length || 0,
        clients: clientsData?.length || 0,
        debits: debitsData?.length || 0,
        storeProducts: storeProductsData?.length || 0
      })

      // Process shipping - keep full objects for components that need them
      const processedShipping = Array.isArray(shippingData)
        ? shippingData.map((s: any) => ({
            ...s,
            receiver: (s.receiver && typeof s.receiver === 'object') ? s.receiver : { client_name: '', id: 0 },
            sender: (s.sender && typeof s.sender === 'object') ? s.sender : { client_name: '', id: 0 },
          }))
        : []

      setShipping(processedShipping)

      // Process products & associate matching shipping record
      const shippingMap = new Map(processedShipping.map((s: any) => [s.id, s]))
      setProducts(Array.isArray(productsData) ? productsData.map((p: any) => {
        const matchedShipping = p.shipping || (p.shipping_id ? shippingMap.get(p.shipping_id) : undefined)
        const totalPcs = p.total_pieces ?? p.total_pices ?? p.Total_pices ?? (p.number_of_boxes * p.size_of_box)
        const piecePerBox = p.piece_per_box ?? p.pice_per_box
        const grpPrice = p.group_item_price ?? p.grope_item_price ?? p.Grope_Item_price
        return {
          ...p,
          total_pieces: totalPcs,
          total_pices: totalPcs,
          piece_per_box: piecePerBox,
          pice_per_box: piecePerBox,
          group_item_price: grpPrice,
          grope_item_price: grpPrice,
          shipping: matchedShipping,
        }
      }) : [])

      // Process clients
      setClients(Array.isArray(clientsData) ? clientsData.map((c: any) => ({
        ...c,
        shipping: c.shipping ? {
          ...c.shipping,
          receiver: typeof c.shipping.receiver === 'object' && c.shipping.receiver !== null
            ? c.shipping.receiver.client_name || ""
            : c.shipping.receiver || ""
        } : c.shipping
      })) : [])

      // Process debits
      setDebits(Array.isArray(debitsData) ? debitsData.map((d: any) => ({
        ...d,
        shipping: d.shipping ? {
          ...d.shipping,
          receiver: typeof d.shipping.receiver === 'object' && d.shipping.receiver !== null
            ? d.shipping.receiver.client_name || ""
            : d.shipping.receiver || ""
        } : d.shipping
      })) : [])

      // Process store products
      setStoreProducts(Array.isArray(storeProductsData) ? storeProductsData : [])

    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data")
      console.error("Error fetching data:", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    products,
    shipping,
    clients,
    debits,
    storeProducts,
    isLoading,
    error,
    refetch: fetchData
  }
}
