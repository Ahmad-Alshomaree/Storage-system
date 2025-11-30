"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Loader2, Plus, Trash2 } from "lucide-react"

interface Product {
  id: number
  box_code: string
  product_name?: string
  product_type?: string
  original_price: number
  selling_price: number
  Total_pices?: number | null
  total_original_price?: number | null
  storage?: string
  number_of_boxes: number
  size_of_box: number
  total_box_size: number
  weight?: number | null
  status: string
  shipping_id?: number | null
  currency?: string
  note?: string | null
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
  Total_pices: number
  total_original_price: number
  currency: string
  note: string
  isSaved?: boolean
  savedProductId?: number
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

interface OutputLoadProductSelection {
  productId: number
  quantityType: 'pieces' | 'kilos'
  quantity: number
  sellingPrice: number
  product?: Product
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
    currency: "Dollar",
    note: "",
    shipToStore: false,
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
  const [currentShippingId, setCurrentShippingId] = useState<number | null>(null)
  const [savingProductId, setSavingProductId] = useState<string | null>(null)
  const [selectedOutputProducts, setSelectedOutputProducts] = useState<OutputLoadProductSelection[]>([])
  const [productDialogOpen, setProductDialogOpen] = useState(false)
  const [currentProductSelection, setCurrentProductSelection] = useState<OutputLoadProductSelection | null>(null)

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

  const openProductSelectionDialog = (product: Product) => {
    const existingSelection = selectedOutputProducts.find(s => s.productId === product.id)
    setCurrentProductSelection(existingSelection || {
      productId: product.id,
      quantityType: 'pieces',
      quantity: 1,
      sellingPrice: product.selling_price,
      product: product
    })
    setProductDialogOpen(true)
  }

  const saveProductSelection = () => {
    if (!currentProductSelection) return

    const existingIndex = selectedOutputProducts.findIndex(s => s.productId === currentProductSelection.productId)
    if (existingIndex >= 0) {
      setSelectedOutputProducts(prev => prev.map((s, i) =>
        i === existingIndex ? currentProductSelection : s
      ))
    } else {
      setSelectedOutputProducts(prev => [...prev, currentProductSelection])
    }

    // Also update selectedProductIds for backward compatibility with the form submission
    if (!selectedProductIds.includes(currentProductSelection.productId)) {
      setSelectedProductIds(prev => [...prev, currentProductSelection.productId])
    }

    setProductDialogOpen(false)
    setCurrentProductSelection(null)
  }

  const closeProductSelectionDialog = () => {
    setProductDialogOpen(false)
    setCurrentProductSelection(null)
  }

  const removeProductSelection = (productId: number) => {
    setSelectedOutputProducts(prev => prev.filter(s => s.productId !== productId))
    setSelectedProductIds(prev => prev.filter(id => id !== productId))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
      Total_pices: 1,
      total_original_price: 0,
      currency: "Dollar",
      note: "",
    }
    setNewProducts(prev => [...prev, newProduct])
    setNextProductId(prev => prev + 1)
  }

  const removeNewProduct = (id: string) => {
    setNewProducts(prev => prev.filter(p => p.id !== id))
  }

  const ensureShippingRecord = async () => {
    // If shipping record already exists, return it
    if (currentShippingId) {
      return currentShippingId
    }

    // Validate that required fields are filled
    if (!formData.shipping_date || !formData.receiving_date || !formData.receiver || !formData.sender) {
      throw new Error("Please fill in all required shipping information (dates, receiver, sender) before saving products")
    }

    // Find client IDs
    const receiverClient = existingClients.find(client => client.client_name === formData.receiver)
    const senderClient = existingClients.find(client => client.client_name === formData.sender)

    if (!receiverClient || !senderClient) {
      throw new Error("Please select valid clients for both receiver and sender")
    }

    // Create shipping record
    const shippingData = {
      type: formData.type,
      shipping_date: formData.shipping_date,
      receiving_date: formData.receiving_date,
      receiver_client_id: receiverClient.id,
      sender_client_id: senderClient.id,
      paid: formData.paid || 0,
      ship_price: formData.ship_price || 0,
      currency: formData.currency,
      note: formData.note || null,
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
    setCurrentShippingId(newShipping.id)
    return newShipping.id
  }

  const saveIndividualProduct = async (product: NewProductItem) => {
    setSavingProductId(product.id)

    try {
      // Ensure shipping record exists
      const shippingId = await ensureShippingRecord()

      // Prepare product data
      const productData = {
        product_name: product.product_name,
        box_code: product.box_code,
        original_price: product.original_price,
        selling_price: product.selling_price,
        storage: product.storage,
        number_of_boxes: product.number_of_boxes,
        size_of_box: product.size_of_box,
        total_box_size: product.total_box_size,
        weight: product.weight,
        pice_per_box: product.pice_per_box,
        grope_item_price: product.grope_item_price,
        image: product.image || null,
        Total_pices: product.Total_pices,
        total_original_price: product.total_original_price,
        currency: product.currency,
        note: product.note || null,
        shipping_id: shippingId,
      }

      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      })

      if (!response.ok) {
        throw new Error("Failed to save product")
      }

      const savedProduct = await response.json()

      // Update the product in the list to mark it as saved
      setNewProducts(prev => prev.map(p =>
        p.id === product.id
          ? { ...p, isSaved: true, savedProductId: savedProduct.id }
          : p
      ))

    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save product")
    } finally {
      setSavingProductId(null)
    }
  }

  const updateNewProduct = (id: string, field: keyof NewProductItem, value: string | number) => {
    setNewProducts(prev => prev.map(p => {
      if (p.id === id) {
        const updated = { ...p, [field]: value }

        // Recalculate derived fields
        if (field === 'number_of_boxes' || field === 'pice_per_box' || field === 'original_price' || field === 'size_of_box') {
          updated.Total_pices = updated.number_of_boxes * updated.pice_per_box
          updated.total_original_price = updated.original_price * updated.number_of_boxes
          updated.total_box_size = updated.size_of_box * updated.number_of_boxes
        }

        return updated
      }
      return p
    }))
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
        currency: formData.currency,
        note: formData.note || null,
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
            total_box_size: product.total_box_size,
            weight: product.weight,
            pice_per_box: product.pice_per_box,
            grope_item_price: product.grope_item_price,
            image: product.image || null,
            Total_pices: product.Total_pices,
            total_original_price: product.total_original_price,
            currency: product.currency,
            note: product.note || null,
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

        // If shipping to store, populate store_products table
        if (formData.receiver === "STORE" && selectedProductIds.length > 0) {
          // Get the full product details for selected products
          const productsResponse = await fetch("/api/products")
          if (productsResponse.ok) {
            const allProducts = await productsResponse.json()
            const storeProductsToAdd = allProducts
              .filter((product: any) => selectedProductIds.includes(product.id))
              .map((product: any) => ({
                product_id: product.id,
                product_name: product.product_name || "",
                individual_item_selling_price: product.selling_price,
                image: product.image,
                group_item_price: product.Grope_Item_price,
                number_of_items: (product.pice_per_box || 1) * product.number_of_boxes,
              }))

            const storeProductsPromises = storeProductsToAdd.map((storeProduct: any) =>
              fetch("/api/store-products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(storeProduct),
              })
            )

            await Promise.all(storeProductsPromises)
          }
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
        currency: "Dollar",
        note: "",
        shipToStore: false,
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
      setCurrentShippingId(null)
      setSavingProductId(null)

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

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Currency *</label>
          <select
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="Dollar">Dollar</option>
            <option value="Iraqi Dinar">Iraqi Dinar</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Ship Price</label>
          <input
            type="number"
            step="0.01"
            name="ship_price"
            value={formData.ship_price || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Paid</label>
          <input
            type="number"
            step="0.01"
            name="paid"
            value={formData.paid || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Note</label>
        <textarea
          name="note"
          value={formData.note}
          onChange={handleChange}
          rows={2}
          placeholder="Optional notes about the shipping"
          className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
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
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">Currency *</label>
                      <select
                        value={product.currency}
                        onChange={(e) => updateNewProduct(product.id, 'currency', e.target.value)}
                        className="px-3 py-2 border border-input rounded bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary w-full"
                        required
                      >
                        <option value="Dollar">Dollar</option>
                        <option value="Iraqi Dinar">Iraqi Dinar</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">Total Pieces</label>
                      <input
                        type="number"
                        placeholder="Total Pieces"
                        value={product.Total_pices || ''}
                        className="px-3 py-2 border border-input rounded bg-background text-foreground text-xs w-full"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">Total Original Price</label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Total Original Price"
                        value={product.total_original_price || ''}
                        className="px-3 py-2 border border-input rounded bg-background text-foreground text-xs w-full"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">Total Box Size</label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Total Box Size"
                        value={product.total_box_size || ''}
                        className="px-3 py-2 border border-input rounded bg-background text-foreground text-xs w-full"
                        readOnly
                      />
                    </div>
                    <div className="md:col-span-2 lg:col-span-3">
                      <label className="block text-xs font-medium text-foreground mb-1">Note</label>
                      <textarea
                        placeholder="Product notes"
                        value={product.note}
                        onChange={(e) => updateNewProduct(product.id, 'note', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-input rounded bg-background text-foreground text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  {/* Save Product Button */}
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className={`text-xs ${product.isSaved ? 'text-green-600' : 'text-muted-foreground'}`}>
                      {product.isSaved ? `✓ Saved to products table (ID: ${product.savedProductId})` : 'Not saved yet'}
                    </div>
                    <Button
                      type="button"
                      onClick={() => saveIndividualProduct(product)}
                      disabled={product.isSaved || savingProductId === product.id}
                      variant="outline"
                      size="sm"
                      className={`gap-1 ${product.isSaved ? 'bg-green-50 border-green-200 hover:bg-green-100' : ''}`}
                    >
                      {savingProductId === product.id ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin" />
                          Saving...
                        </>
                      ) : product.isSaved ? (
                        'Saved ✓'
                      ) : (
                        'Save Product'
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Select Products for Shipment</label>
            {isLoadingProducts ? (
              <div className="p-4 text-center text-muted-foreground">Loading products...</div>
            ) : availableProducts.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground border border-dashed border-border rounded-lg">
                No available products to select for output load
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableProducts.map((product) => {
                  const selection = selectedOutputProducts.find(s => s.productId === product.id)
                  return (
                    <div key={product.id} className="border border-border rounded-lg p-4 bg-muted/30">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-sm font-medium text-foreground">{product.box_code}</h4>
                          <p className="text-xs text-muted-foreground">{product.product_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {product.number_of_boxes} boxes • {product.Total_pices} pieces total
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => openProductSelectionDialog(product)}
                          className="text-primary hover:text-primary/80"
                        >
                          {selection ? 'Edit' : 'Select'}
                        </button>
                      </div>

                      {selection && (
                        <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                          <div>Quantity: {selection.quantity} {selection.quantityType}</div>
                          <div>Selling Price: ${selection.sellingPrice}</div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Selected Products Summary */}
          {selectedOutputProducts.length > 0 && (
            <div className="border-t pt-4">
              <label className="block text-sm font-medium text-foreground mb-3">Selected Products ({selectedOutputProducts.length})</label>
              <div className="space-y-2">
                {selectedOutputProducts.map((selection) => (
                  <div key={selection.productId} className="flex items-center justify-between bg-muted p-3 rounded">
                    <div className="flex-1">
                      <span className="font-medium text-sm">{selection.product?.box_code} - {selection.product?.product_name}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {selection.quantity} {selection.quantityType} @ ${selection.sellingPrice}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeProductSelection(selection.productId)}
                      className="text-destructive hover:text-destructive/80 ml-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Product Selection Dialog */}
          <Dialog open={productDialogOpen} onOpenChange={closeProductSelectionDialog}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {currentProductSelection?.product?.product_name || 'Select Product Quantity'}
                </DialogTitle>
              </DialogHeader>
              {currentProductSelection && (
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="quantity-type" className="text-right">
                      Type
                    </label>
                    <select
                      id="quantity-type"
                      value={currentProductSelection.quantityType}
                      onChange={(e) => setCurrentProductSelection({
                        ...currentProductSelection,
                        quantityType: e.target.value as 'pieces' | 'kilos'
                      })}
                      className="col-span-3 px-3 py-2 border border-input rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="pieces">Pieces</option>
                      <option value="kilos">Kilos</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="quantity" className="text-right">
                      Quantity
                    </label>
                    <input
                      id="quantity"
                      type="number"
                      min="0.1"
                      step="0.1"
                      value={currentProductSelection.quantity}
                      onChange={(e) => setCurrentProductSelection({
                        ...currentProductSelection,
                        quantity: parseFloat(e.target.value) || 0
                      })}
                      className="col-span-3 px-3 py-2 border border-input rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="selling-price" className="text-right">
                      Price
                    </label>
                    <input
                      id="selling-price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={currentProductSelection.sellingPrice}
                      onChange={(e) => setCurrentProductSelection({
                        ...currentProductSelection,
                        sellingPrice: parseFloat(e.target.value) || 0
                      })}
                      className="col-span-3 px-3 py-2 border border-input rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={closeProductSelectionDialog}>
                      Cancel
                    </Button>
                    <Button type="button" onClick={saveProductSelection}>
                      {selectedOutputProducts.find(s => s.productId === currentProductSelection.productId) ? 'Update' : 'Add'} Product
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
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
