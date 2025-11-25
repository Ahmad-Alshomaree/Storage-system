"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface AddProductFormProps {
  onSuccess: (product: any) => void
}

export function AddProductForm({ onSuccess }: AddProductFormProps) {
  const [formData, setFormData] = useState({
    product_name: "",
    product_type: "",
    original_price: 0,
    selling_price: 0,
    storage: "",
    quantity: 0,
    weight: 0,
    sizes: 0,
    colors: "",
    image: "",
    box_number: 0,
    price_per_box: 0,
    shipping_id: "",
    total_original_price: 0,
    size_of_box_at_ship: 0,
    total_box_size: 0,
    box_code: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [shippingOptions, setShippingOptions] = useState<any[]>([])

  useEffect(() => {
    fetchShippingOptions()
  }, [])

  const fetchShippingOptions = async () => {
    try {
      const response = await fetch("/api/shipping")
      if (response.ok) {
        const data = await response.json()
        setShippingOptions(data)
      }
    } catch (error) {
      console.error("Error fetching shipping options:", error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: ["quantity", "box_number", "price_per_box"].includes(name)
        ? Number.parseInt(value) || 0
        : [
              "original_price",
              "selling_price",
              "weight",
              "sizes",
              "total_original_price",
              "size_of_box_at_ship",
              "total_box_size",
            ].includes(name)
          ? Number.parseFloat(value) || 0
          : name === "shipping_id"
            ? value === ""
              ? null
              : Number.parseInt(value)
            : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to add product")
      }

      const newProduct = await response.json()
      setFormData({
        product_name: "",
        product_type: "",
        original_price: 0,
        selling_price: 0,
        storage: "",
        quantity: 0,
        weight: 0,
        sizes: 0,
        colors: "",
        image: "",
        box_number: 0,
        price_per_box: 0,
        shipping_id: "",
        total_original_price: 0,
        size_of_box_at_ship: 0,
        total_box_size: 0,
        box_code: "",
      })
      onSuccess(newProduct)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-6 space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Add New Product</h2>

      {error && <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Product Name *</label>
          <input
            type="text"
            name="product_name"
            value={formData.product_name}
            onChange={handleChange}
            required
            placeholder="Enter product name"
            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Product Type *</label>
          <input
            type="text"
            name="product_type"
            value={formData.product_type}
            onChange={handleChange}
            required
            placeholder="e.g., Electronics, Clothing"
            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Original Price *</label>
          <input
            type="number"
            name="original_price"
            value={formData.original_price}
            onChange={handleChange}
            required
            step="0.01"
            placeholder="0.00"
            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Selling Price *</label>
          <input
            type="number"
            name="selling_price"
            value={formData.selling_price}
            onChange={handleChange}
            required
            step="0.01"
            placeholder="0.00"
            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Storage *</label>
          <input
            type="text"
            name="storage"
            value={formData.storage}
            onChange={handleChange}
            required
            placeholder="e.g., Warehouse A, Shelf 3"
            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="0"
            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Weight (kg)</label>
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            step="0.01"
            placeholder="0.00"
            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Sizes</label>
          <input
            type="number"
            name="sizes"
            value={formData.sizes}
            onChange={handleChange}
            step="0.01"
            placeholder="0.00"
            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Colors</label>
          <input
            type="text"
            name="colors"
            value={formData.colors}
            onChange={handleChange}
            placeholder="e.g., Red, Blue, Green"
            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Box Number *</label>
          <input
            type="number"
            name="box_number"
            value={formData.box_number}
            onChange={handleChange}
            required
            step="0.01"
            placeholder="0.00"
            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Price Per Box *</label>
          <input
            type="number"
            name="price_per_box"
            value={formData.price_per_box}
            onChange={handleChange}
            required
            placeholder="0"
            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Total Original Price *</label>
          <input
            type="number"
            name="total_original_price"
            value={formData.total_original_price}
            onChange={handleChange}
            required
            step="0.01"
            placeholder="0.00"
            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Size of Box at Ship *</label>
          <input
            type="number"
            name="size_of_box_at_ship"
            value={formData.size_of_box_at_ship}
            onChange={handleChange}
            required
            step="0.01"
            placeholder="0.00"
            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Total Box Size *</label>
          <input
            type="number"
            name="total_box_size"
            value={formData.total_box_size}
            onChange={handleChange}
            required
            step="0.01"
            placeholder="0.00"
            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Box Code *</label>
          <input
            type="text"
            name="box_code"
            value={formData.box_code}
            onChange={handleChange}
            required
            placeholder="e.g., BOX-001"
            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Shipping</label>
          <select
            name="shipping_id"
            value={formData.shipping_id}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select Shipping (Optional)</option>
            {shippingOptions.map((shipping) => (
              <option key={shipping.id} value={shipping.id}>
                {shipping.type} - {shipping.receiver}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Image URL</label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={isLoading} className="gap-2">
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          Add Product
        </Button>
      </div>
    </form>
  )
}
