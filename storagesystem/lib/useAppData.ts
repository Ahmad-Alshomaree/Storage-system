import { useState, useEffect, useCallback } from "react"
import type { Product, Shipping, Client, Debit, StoreProduct } from "./types"

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
    setIsLoading(true)
    setError(null)

    try {
      const [productsRes, shippingRes, clientsRes, debitsRes, storeProductsRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/shipping"),
        fetch("/api/clients"),
        fetch("/api/debits"),
        fetch("/api/store-products")
      ])

      // Process products
      if (productsRes.ok) {
        const data = await productsRes.json()
        setProducts(Array.isArray(data) ? data.map(p => {
          // Ensure only Product properties are included, no nested objects
          const { shipping, ...productData } = p
          return productData
        }) : [])
      }

      // Process shipping - keep full objects for components that need them
      if (shippingRes.ok) {
        const data = await shippingRes.json()
        setShipping(Array.isArray(data) ? data : [])
      }

      // Process clients
      if (clientsRes.ok) {
        const data = await clientsRes.json()
        setClients(Array.isArray(data) ? data.map(c => ({
          ...c,
          shipping: c.shipping ? {
            ...c.shipping,
            receiver: typeof c.shipping.receiver === 'object' && c.shipping.receiver !== null
              ? c.shipping.receiver.client_name || ""
              : c.shipping.receiver || ""
          } : c.shipping
        })) : [])
      }

      // Process debits
      if (debitsRes.ok) {
        const data = await debitsRes.json()
        setDebits(Array.isArray(data) ? data.map(d => ({
          ...d,
          shipping: d.shipping ? {
            ...d.shipping,
            receiver: typeof d.shipping.receiver === 'object' && d.shipping.receiver !== null
              ? d.shipping.receiver.client_name || ""
              : d.shipping.receiver || ""
          } : d.shipping
        })) : [])
      }

      // Process store products
      if (storeProductsRes.ok) {
        const data = await storeProductsRes.json()
        setStoreProducts(Array.isArray(data) ? data : [])
      }
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
