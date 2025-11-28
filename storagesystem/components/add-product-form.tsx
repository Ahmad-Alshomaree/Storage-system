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
    shipping_id: null as number | null,
    box_code: "",
    product_name: "",
    original_price: 0,
    selling_price: 0,
    storage: "",
    weight: 0,
    image: "",
    pice_per_box: 0,
    size_of_box: 0,
    total_box_size: 0,
    number_of_boxes: 0,
    extracted_pieces: 0,
    status: "available",
    group_item_price: 0,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [shippingOptions, setShippingOptions] = useState<any[]>([])
  const [showNewShippingForm, setShowNewShippingForm] = useState(false)
  const [newShippingData, setNewShippingData] = useState({
    type: "input load",
    shipping_date: "",
    receiving_date: "",
    receiver: "",
    paid: 0,
    ship_price: 0,
  })

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

  const handleShippingChange = (value: string) => {
    if (value === "create-new") {
      setShowNewShippingForm(true)
      setFormData(prev => ({ ...prev, shipping_id: null }))
    } else {
      setShowNewShippingForm(false)
      setFormData(prev => ({ ...prev, shipping_id: value === "" ? null : Number.parseInt(value) }))
    }
  }

  const handleNewShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setNewShippingData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number.parseFloat(value) || 0 : value
    }))
  }

  const createShipping = async (): Promise<number | null> => {
    try {
      const shippingFormData = {
        ...newShippingData,
        receiving_date: newShippingData.receiving_date || new Date(newShippingData.shipping_date).toISOString().replace('T', ' ').split('.')[0], // Use shipping date if receiving date not set
      }
      const response = await fetch("/api/shipping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(shippingFormData),
      })

      if (!response.ok) {
        throw new Error("Failed to create shipping record")
      }

      const newShipping = await response.json()
      setShippingOptions(prev => [...prev, newShipping])
      return newShipping.id
    } catch (error) {
      console.error("Error creating shipping:", error)
      throw error
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        ["original_price", "selling_price", "group_item_price", "weight", "pice_per_box", "size_of_box", "total_box_size", "number_of_boxes", "extracted_pieces"].includes(name)
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
      let shippingId = formData.shipping_id

      // If creating new shipping, create it first
      if (showNewShippingForm) {
        if (!newShippingData.shipping_date || !newShippingData.receiver) {
          setError("Please fill in required shipping fields")
          setIsLoading(false)
          return
        }
        shippingId = await createShipping()
        if (!shippingId) {
          setError("Failed to create shipping record")
          setIsLoading(false)
          return
        }
      }

      const productData = {
        ...formData,
        shipping_id: shippingId,
      }

      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      })

      if (!response.ok) {
        throw new Error("Failed to add product")
      }

      const newProduct = await response.json()
      setFormData({
        shipping_id: null,
        box_code: "",
        product_name: "",
        original_price: 0,
        selling_price: 0,
        storage: "",
        weight: 0,
        image: "",
        pice_per_box: 0,
        size_of_box: 0,
        total_box_size: 0,
        number_of_boxes: 0,
        extracted_pieces: 0,
        status: "available",
        group_item_price: 0,
      })
      setNewShippingData({
        type: "input load",
        shipping_date: "",
        receiving_date: "",
        receiver: "",
        paid: 0,
        ship_price: 0,
      })
      setShowNewShippingForm(false)
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
          <label className="block text-sm font-medium text-foreground mb-2">Product Name</label>
          <input
            type="text"
            name="product_name"
            value={formData.product_name}
            onChange={handleChange}
            placeholder="Enter product name"
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

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Pieces Per Box</label>
          <input
            type="number"
            name="pice_per_box"
            value={formData.pice_per_box}
            onChange={handleChange}
            placeholder="0"
            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Size of Box *</label>
          <input
            type="number"
            name="size_of_box"
            value={formData.size_of_box}
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
          <label className="block text-sm font-medium text-foreground mb-2">Number of Boxes *</label>
          <input
            type="number"
            name="number_of_boxes"
            value={formData.number_of_boxes}
            onChange={handleChange}
            required
            step="0.01"
            placeholder="0.00"
            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Extracted Pieces</label>
          <input
            type="number"
            name="extracted_pieces"
            value={formData.extracted_pieces}
            onChange={handleChange}
            placeholder="0"
            min="0"
            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="available">Available</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Group Item Price</label>
          <input
            type="number"
            name="group_item_price"
            value={formData.group_item_price}
            onChange={handleChange}
            step="0.01"
            placeholder="0.00"
            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Total Pieces (Auto-calculated)</label>
          <input
            type="number"
            value={Math.round((formData.pice_per_box || 0) * (formData.number_of_boxes || 0))}
            readOnly
            placeholder="0"
            className="w-full px-3 py-2 border border-input rounded-lg bg-muted text-muted-foreground"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Calculated as: (Pieces Per Box × Number of Boxes)
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Total Original Price (Auto-calculated)</label>
          <input
            type="number"
            value={((formData.number_of_boxes || 0) * (formData.pice_per_box || 0) * (formData.original_price || 0)).toFixed(2)}
            readOnly
            step="0.01"
            placeholder="0.00"
            className="w-full px-3 py-2 border border-input rounded-lg bg-muted text-muted-foreground"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Calculated as: (Number of Boxes × Pieces Per Box × Original Price)
          </p>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-foreground mb-2">Shipping</label>
          <select
            value={showNewShippingForm ? "create-new" : (formData.shipping_id ?? "")}
            onChange={(e) => handleShippingChange(e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select Shipping (Optional)</option>
            {shippingOptions.map((shipping) => (
              <option key={shipping.id} value={shipping.id.toString()}>
                {shipping.type} - {shipping.receiver}
              </option>
            ))}
            <option value="create-new" className="font-medium text-primary">+ Create New Shipping</option>
          </select>
        </div>
      </div>

      {/* New Shipping Form - Shows when "Create New Shipping" is selected */}
      {showNewShippingForm && (
        <div className="border border-border rounded-lg p-4 bg-muted/30">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-medium text-foreground">Create New Shipping</h3>
            <button
              type="button"
              onClick={() => {
                setShowNewShippingForm(false)
                setFormData(prev => ({ ...prev, shipping_id: null }))
              }}
              className="text-destructive hover:text-destructive/80"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <select
              name="type"
              value={newShippingData.type}
              onChange={handleNewShippingChange}
              className="px-3 py-2 border border-input rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="input load">Input Load</option>
              <option value="output load">Output Load</option>
            </select>
            <input
              type="text"
              name="receiver"
              placeholder="Receiver *"
              value={newShippingData.receiver}
              onChange={handleNewShippingChange}
              className="px-3 py-2 border border-input rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <input
              type="datetime-local"
              name="shipping_date"
              placeholder="Shipping Date *"
              value={newShippingData.shipping_date}
              onChange={handleNewShippingChange}
              className="px-3 py-2 border border-input rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <input
              type="datetime-local"
              name="receiving_date"
              placeholder="Receiving Date"
              value={newShippingData.receiving_date}
              onChange={handleNewShippingChange}
              className="px-3 py-2 border border-input rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="number"
              name="paid"
              placeholder="Paid (0 or 1)"
              value={newShippingData.paid || ''}
              onChange={handleNewShippingChange}
              min="0"
              max="1"
              className="px-3 py-2 border border-input rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="number"
              step="0.01"
              name="ship_price"
              placeholder="Shipping Price"
              value={newShippingData.ship_price || ''}
              onChange={handleNewShippingChange}
              className="px-3 py-2 border border-input rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      )}

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={isLoading} className="gap-2">
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          Add Product
        </Button>
      </div>
    </form>
  )
}
