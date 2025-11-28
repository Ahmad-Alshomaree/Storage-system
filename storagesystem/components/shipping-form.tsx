"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Plus, Trash2 } from "lucide-react"

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

interface NewProductItem {
  id: string
  product_name: string
  product_type: string
  box_code: string
  original_price: number
  selling_price: number
  storage: string
  number_of_boxes: number
  size_of_box: number
  total_box_size: number
  weight: number
  pice_per_box: number
  grope_item_price: number
  image: string
}

interface Client {
  id: number
  client_name: string
  phone_number?: string
  shipping_id?: number
  history?: string
  debt: number
  total_debts: number
}

interface NewClientData {
  client_name: string
  phone_number: string
  history: string
}

export function ShippingForm({ onSuccess }: ShippingFormProps) {
  const [formData, setFormData] = useState({
    type: "input load",
    shipping_date: "",
    receiving_date: "",
    receiver: "",
    sender: "",
    paid: 0,
    ship_price: 0,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [availableProducts, setAvailableProducts] = useState<Product[]>([])
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(false)
  const [newProducts, setNewProducts] = useState<NewProductItem[]>([])
  const [nextProductId, setNextProductId] = useState(1)
  const [existingClients, setExistingClients] = useState<Client[]>([])
  const [isLoadingClients, setIsLoadingClients] = useState(true)
  const [showNewClientForm, setShowNewClientForm] = useState(false)
  const [newClientData, setNewClientData] = useState({
    client_name: "",
    phone_number: "",
    history: "",
  })
  const [isLoadingNewClient, setIsLoadingNewClient] = useState(false)
  const [targetField, setTargetField] = useState<'receiver' | 'sender'>('receiver')

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch("/api/clients")
        if (response.ok) {
          const clients = await response.json()
          setExistingClients(clients)
        }
      } catch (error) {
        console.error("Failed to fetch clients:", error)
      } finally {
        setIsLoadingClients(false)
      }
    }

    fetchClients()
  }, [])

  useEffect(() => {
    if (formData.type === 'output load') {
      setIsLoadingProducts(true)
      const fetchProducts = async () => {
        try {
          const response = await fetch("/api/products")
          if (response.ok) {
            const products = await response.json()
            // Filter products that have status 'available' (can be assigned to output shipping)
            const availableProducts = products.filter((product: Product) =>
              product.status === 'available'
            )
            setAvailableProducts(availableProducts)
          }
        } catch (error) {
          console.error("Failed to fetch products:", error)
        } finally {
          setIsLoadingProducts(false)
        }
      }
      fetchProducts()
    }
  }, [formData.type])

  const handleProductSelection = (productId: number, isSelected: boolean) => {
    setSelectedProductIds(prev =>
      isSelected
        ? [...prev, productId]
        : prev.filter(id => id !== productId)
    )
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }))
  }

  const handleClientSelectChange = (field: 'receiver' | 'sender', value: string) => {
    if (value === 'add-new-client') {
      setTargetField(field)
      setShowNewClientForm(true)
      setFormData(prev => ({ ...prev, [field]: '' }))
    } else {
      setShowNewClientForm(false)
      setFormData(prev => ({ ...prev, [field]: value }))
    }
  }

  const addNewProduct = () => {
    const newProduct: NewProductItem = {
      id: `temp-${nextProductId}`,
      product_name: "",
      product_type: "",
      box_code: "",
      original_price: 0,
      selling_price: 0,
      storage: "",
      number_of_boxes: 1,
      size_of_box: 0,
      total_box_size: 0,
      weight: 0,
      pice_per_box: 1,
      grope_item_price: 0,
      image: "",
    }
    setNewProducts(prev => [...prev, newProduct])
    setNextProductId(prev => prev + 1)
  }

  const removeNewProduct = (id: string) => {
    setNewProducts(prev => prev.filter(p => p.id !== id))
  }

  const updateNewProduct = (id: string, field: keyof NewProductItem, value: string | number) => {
    setNewProducts(prev => prev.map(p =>
      p.id === id ? { ...p, [field]: value } : p
    ))
  }

  const handleNewClientSubmit = async () => {
    if (!newClientData.client_name.trim()) {
      return
    }

    setIsLoadingNewClient(true)
    try {
      const clientData = {
        client_name: newClientData.client_name,
        phone_number: newClientData.phone_number || null,
        shipping_id: null,
        history: newClientData.history || null,
        debt: 0,
        total_debts: 0,
      }

      const response = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clientData),
      })

      if (!response.ok) {
        throw new Error("Failed to create client")
      }

      const newClient = await response.json()

      // Update clients list
      setExistingClients(prev => [...prev, newClient])

      // Set the target field
      setFormData(prev => ({ ...prev, [targetField]: newClient.client_name }))

      // Hide form and reset
      setShowNewClientForm(false)
      setNewClientData({
        client_name: "",
        phone_number: "",
        history: "",
      })
    } catch (err) {
      console.error("Failed to add new client:", err)
      // Optionally set an error state here
    } finally {
      setIsLoadingNewClient(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // For input load, validate that at least one product is added
      if (formData.type === 'input load' && newProducts.length === 0) {
        setError("Please add at least one product for input load shipping")
        setIsLoading(false)
        return
      }

      // For output load, validate that at least one product is selected
      if (formData.type === 'output load' && selectedProductIds.length === 0) {
        setError("Please select at least one product for output load shipping")
        setIsLoading(false)
        return
      }

      // Find client IDs by name
      const receiverClient = existingClients.find(client => client.client_name === formData.receiver)
      const senderClient = existingClients.find(client => client.client_name === formData.sender)

      if (!receiverClient || !senderClient) {
        setError("Please select valid clients for both receiver and sender")
        setIsLoading(false)
        return
      }

      const shippingData = {
        type: formData.type,
        shipping_date: formData.shipping_date,
        receiving_date: formData.receiving_date,
        receiver_client_id: receiverClient.id,
        sender_client_id: senderClient.id,
        paid: formData.paid || 0,
        ship_price: formData.ship_price || 0,
      }

      const response = await fetch("/api/shipping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(shippingData),
      })

      if (!response.ok) {
        throw new Error("Failed to create shipping record")
      }

      const newShipping = await response.json()

      // Handle client assignment
      if (formData.receiver) {
        // Assign client to shipping - find client by name
        const existingClient = existingClients.find(client => client.client_name === formData.receiver)
        if (existingClient) {
          await fetch(`/api/clients/${existingClient.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ shipping_id: newShipping.id }),
          })
        }
      }

      if (formData.type === 'input load') {
        // Create new products and assign to shipping
        const productPromises = newProducts.map(product => {
          const productData = {
            product_name: product.product_name,
            box_code: product.box_code,
            original_price: product.original_price,
            selling_price: product.selling_price,
            storage: product.storage,
            number_of_boxes: product.number_of_boxes,
            size_of_box: product.size_of_box,
            total_box_size: product.size_of_box * product.number_of_boxes,
            weight: product.weight,
            pice_per_box: product.pice_per_box,
            grope_item_price: product.grope_item_price,
            image: product.image || null,
            shipping_id: newShipping.id,
          }

          return fetch("/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(productData),
          })
        })

        await Promise.all(productPromises)
      } else {
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
      }

      // Reset form
      setFormData({
        type: "input load",
        shipping_date: "",
        receiving_date: "",
        receiver: "",
        sender: "",
        paid: 0,
        ship_price: 0,
      })
      setSelectedProductIds([])
      setNewProducts([])
      setNextProductId(1)
      setShowNewClientForm(false)
      setNewClientData({
        client_name: "",
        phone_number: "",
        history: "",
      })

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
            type="date"
            name="shipping_date"
            value={formData.shipping_date}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Receiving Date *</label>
          <input
            type="date"
            name="receiving_date"
            value={formData.receiving_date}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Receiver *</label>
          <select
            value={formData.receiver}
            onChange={(e) => handleClientSelectChange('receiver', e.target.value)}
            required
            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select Receiver</option>
            {!isLoadingClients && existingClients.map((client) => (
              <option key={client.id} value={client.client_name}>
                {client.client_name} {client.phone_number ? `(${client.phone_number})` : ''}
              </option>
            ))}
            <option value="add-new-client" className="font-medium text-primary">+ Add New Client</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Sender *</label>
          <select
            value={formData.sender}
            onChange={(e) => handleClientSelectChange('sender', e.target.value)}
            required
            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select Sender</option>
            {!isLoadingClients && existingClients.map((client) => (
              <option key={client.id} value={client.client_name}>
                {client.client_name} {client.phone_number ? `(${client.phone_number})` : ''}
              </option>
            ))}
            <option value="add-new-client" className="font-medium text-primary">+ Add New Client</option>
          </select>
        </div>
      </div>

      {/* New Client Form - Shows when "Add New Client" is selected */}
      {showNewClientForm && (
        <div className="border border-border rounded-lg p-4 bg-muted/30">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-medium text-foreground">Add New Client</h3>
            <button
              type="button"
              onClick={() => setShowNewClientForm(false)}
              className="text-destructive hover:text-destructive/80"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Client Name *"
              value={newClientData.client_name}
              onChange={(e) => setNewClientData(prev => ({ ...prev, client_name: e.target.value }))}
              className="px-3 py-2 border border-input rounded bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={newClientData.phone_number}
              onChange={(e) => setNewClientData(prev => ({ ...prev, phone_number: e.target.value }))}
              className="px-3 py-2 border border-input rounded bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="md:col-span-2">
              <textarea
                placeholder="History/Notes"
                value={newClientData.history}
                onChange={(e) => setNewClientData(prev => ({ ...prev, history: e.target.value }))}
                rows={2}
                className="w-full px-3 py-2 border border-input rounded bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" onClick={handleNewClientSubmit} disabled={isLoadingNewClient} size="sm">
              {isLoadingNewClient ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Save Client
            </Button>
          </div>
        </div>
      )}

      {/* Product Section - Different based on shipping type */}
      {formData.type === 'input load' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-foreground mb-2">Add New Products</label>
            <Button type="button" onClick={addNewProduct} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </div>

          {newProducts.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground border border-dashed border-border rounded-lg">
              No products added. Click "Add Product" to create new products for this shipment.
            </div>
          ) : (
            <div className="space-y-3">
              {newProducts.map((product) => (
                <div key={product.id} className="border border-border rounded-lg p-4 bg-muted/30">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="text-sm font-medium text-foreground">Product {product.id.split('-')[1]}</h4>
                    <button
                      type="button"
                      onClick={() => removeNewProduct(product.id)}
                      className="text-destructive hover:text-destructive/80"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">Product Name *</label>
                      <input
                        type="text"
                        placeholder="Product Name *"
                        value={product.product_name}
                        onChange={(e) => updateNewProduct(product.id, 'product_name', e.target.value)}
                        className="px-3 py-2 border border-input rounded bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary w-full"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">Product Type</label>
                      <input
                        type="text"
                        placeholder="Product Type"
                        value={product.product_type}
                        onChange={(e) => updateNewProduct(product.id, 'product_type', e.target.value)}
                        className="px-3 py-2 border border-input rounded bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">Box Code *</label>
                      <input
                        type="text"
                        placeholder="Box Code *"
                        value={product.box_code}
                        onChange={(e) => updateNewProduct(product.id, 'box_code', e.target.value)}
                        className="px-3 py-2 border border-input rounded bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary w-full"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">Original Price *</label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Original Price *"
                        value={product.original_price || ''}
                        onChange={(e) => updateNewProduct(product.id, 'original_price', parseFloat(e.target.value) || 0)}
                        className="px-3 py-2 border border-input rounded bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary w-full"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">Selling Price *</label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Selling Price *"
                        value={product.selling_price || ''}
                        onChange={(e) => updateNewProduct(product.id, 'selling_price', parseFloat(e.target.value) || 0)}
                        className="px-3 py-2 border border-input rounded bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary w-full"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">Storage Location</label>
                      <input
                        type="text"
                        placeholder="Storage Location"
                        value={product.storage}
                        onChange={(e) => updateNewProduct(product.id, 'storage', e.target.value)}
                        className="px-3 py-2 border border-input rounded bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">Number of Boxes *</label>
                      <input
                        type="number"
                        placeholder="Number of Boxes *"
                        value={product.number_of_boxes || ''}
                        onChange={(e) => updateNewProduct(product.id, 'number_of_boxes', parseInt(e.target.value) || 1)}
                        className="px-3 py-2 border border-input rounded bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary w-full"
                        required
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">Pieces per Box *</label>
                      <input
                        type="number"
                        placeholder="Pieces per Box *"
                        value={product.pice_per_box || ''}
                        onChange={(e) => updateNewProduct(product.id, 'pice_per_box', parseInt(e.target.value) || 1)}
                        className="px-3 py-2 border border-input rounded bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary w-full"
                        required
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">Size of Box *</label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Size of Box *"
                        value={product.size_of_box || ''}
                        onChange={(e) => updateNewProduct(product.id, 'size_of_box', parseFloat(e.target.value) || 0)}
                        className="px-3 py-2 border border-input rounded bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary w-full"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">Image URL</label>
                      <input
                        type="text"
                        placeholder="Image URL"
                        value={product.image}
                        onChange={(e) => updateNewProduct(product.id, 'image', e.target.value)}
                        className="px-3 py-2 border border-input rounded bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">Weight</label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Weight"
                        value={product.weight || ''}
                        onChange={(e) => updateNewProduct(product.id, 'weight', parseFloat(e.target.value) || 0)}
                        className="px-3 py-2 border border-input rounded bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">Group Item Price</label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Group Item Price"
                        value={product.grope_item_price || ''}
                        onChange={(e) => updateNewProduct(product.id, 'grope_item_price', parseFloat(e.target.value) || 0)}
                        className="px-3 py-2 border border-input rounded bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary w-full"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Select Available Products</label>
            {isLoadingProducts ? (
              <div className="p-4 text-center text-muted-foreground">Loading products...</div>
            ) : availableProducts.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground border border-dashed border-border rounded-lg">
                No available products to select for output load
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
      )}

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={isLoading} className="gap-2">
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          Save Shipping Information
        </Button>
      </div>
    </form>
  )
}
