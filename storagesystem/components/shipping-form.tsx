"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface Product {
  id: number
  box_code: string
  product_name?: string
  product_type?: string
  original_price: number
  selling_price: number
  storage?: string
  number_of_boxes: number
  status: string
  shipping_id?: number | null
}

interface ShippingFormProps {
  onSuccess: (shipping: any) => void
}

export function ShippingForm({ onSuccess }: ShippingFormProps) {
  const [formData, setFormData] = useState({
    type: "input load",
    shipping_date: "",
    receiver: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [availableProducts, setAvailableProducts] = useState<Product[]>([])
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products")
        if (response.ok) {
          const products = await response.json()
          // Filter products that are not assigned to any shipping and are available
          const unassignedProducts = products.filter((product: Product) =>
            product.shipping_id === null && product.status === 'available'
          )
          setAvailableProducts(unassignedProducts)
        }
      } catch (error) {
        console.error("Failed to fetch products:", error)
      } finally {
        setIsLoadingProducts(false)
      }
    }

    fetchProducts()
  }, [])

  const handleProductSelection = (productId: number, isSelected: boolean) => {
    setSelectedProductIds(prev =>
      isSelected
        ? [...prev, productId]
        : prev.filter(id => id !== productId)
    )
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/shipping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to create shipping record")
      }

      const newShipping = await response.json()

      // Assign selected products to the new shipping
      if (selectedProductIds.length > 0) {
        const assignPromises = selectedProductIds.map(productId =>
          fetch(`/api/products/${productId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ shipping_id: newShipping.id }),
          })
        )

        await Promise.all(assignPromises)
      }

      setFormData({
        type: "input load",
        shipping_date: "",
        receiver: "",
      })
      setSelectedProductIds([])
      onSuccess(newShipping)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-6 space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Add Shipping Record</h2>

      {error && <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Shipping Type *</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="input load">Input Load</option>
            <option value="output load">Output Load</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Shipping Date *</label>
          <input
            type="datetime-local"
            name="shipping_date"
            value={formData.shipping_date}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Receiver *</label>
          <input
            type="text"
            name="receiver"
            value={formData.receiver}
            onChange={handleChange}
            required
            placeholder="Receiver name or location"
            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Product Selection Section */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Select Products (Optional)</label>
          {isLoadingProducts ? (
            <div className="p-4 text-center text-muted-foreground">Loading products...</div>
          ) : availableProducts.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground border border-dashed border-border rounded-lg">
              No unassigned products available
            </div>
          ) : (
            <div className="border border-border rounded-lg max-h-60 overflow-y-auto">
              <div className="p-3 space-y-2">
                {availableProducts.map((product) => (
                  <div key={product.id} className="flex items-center space-x-3 p-2 hover:bg-muted/50 rounded">
                    <input
                      type="checkbox"
                      id={`product-${product.id}`}
                      checked={selectedProductIds.includes(product.id)}
                      onChange={(e) => handleProductSelection(product.id, e.target.checked)}
                      className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary"
                    />
                    <label htmlFor={`product-${product.id}`} className="flex-1 text-sm cursor-pointer">
                      <div className="font-medium text-foreground">{product.box_code}</div>
                      <div className="text-xs text-muted-foreground">
                        {product.product_name} - {product.product_type} - {product.number_of_boxes} boxes
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
          {selectedProductIds.length > 0 && (
            <div className="mt-2 text-sm text-primary">
              {selectedProductIds.length} product{selectedProductIds.length !== 1 ? 's' : ''} selected
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={isLoading} className="gap-2">
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          Create Shipping Record
        </Button>
      </div>
    </form>
  )
}
