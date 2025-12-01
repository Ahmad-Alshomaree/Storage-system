"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, X, Upload, Truck, Link } from "lucide-react"
import { useTranslation } from "react-i18next"
import "../i18n.client"

interface AddProductFormProps {
  onSuccess: (product: any) => void
}

export function AddProductForm({ onSuccess }: AddProductFormProps) {
  const { t } = useTranslation()
  // Product data
  const [productData, setProductData] = useState({
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
    currency: "Dollar",
    note: "",
  })

  // Clients and shipping data
  const [clients, setClients] = useState<any[]>([])
  const [shippingData, setShippingData] = useState({
    type: "coming",
    shippingDate: "",
    receivingDate: "",
    receiver: "",
    sender: "",
    paid: 0,
    shipPrice: 0,
    currency: "Dollar",
    note: "",
  })

  // Existing shipping data for linking
  const [existingShippings, setExistingShippings] = useState<any[]>([])
  const [selectedShippingId, setSelectedShippingId] = useState<number | null>(null)
  const [useExistingShipping, setUseExistingShipping] = useState(false)

  // UI State
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [showNewClientForm, setShowNewClientForm] = useState<"sender" | "receiver" | null>(null)
  const [newClientName, setNewClientName] = useState("")

  useEffect(() => {
    fetchClients()
    fetchShippings()
  }, [])

  const fetchClients = async () => {
    try {
      const response = await fetch("/api/clients")
      if (response.ok) {
        const data = await response.json()
        setClients(data)
      }
    } catch (error) {
      console.error("Error fetching clients:", error)
    }
  }

  const fetchShippings = async () => {
    try {
      const response = await fetch("/api/shipping")
      if (response.ok) {
        const data = await response.json()
        setExistingShippings(data)
      }
    } catch (error) {
      console.error("Error fetching shipping options:", error)
    }
  }

  const createClient = async (clientName: string): Promise<string> => {
    try {
      const response = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_name: clientName,
          phone_number: "",
          history: "",
          debt: 0,
        }),
      })

      if (response.ok) {
        const newClient = await response.json()
        setClients(prev => [...prev, newClient])
        return newClient.client_name
      } else {
        throw new Error(t("Failed to add client"))
      }
    } catch (error) {
      console.error("Error creating client:", error)
      throw error
    }
  }

  const createShipping = async (): Promise<number | null> => {
    try {
      const shippingPayload = {
        type: shippingData.type, // Use the actual selected type
        shipping_date: shippingData.shippingDate || new Date().toISOString().split('T')[0],
        receiving_date: shippingData.receivingDate || null,
        receiver_client_id: clients.find(c => c.client_name === shippingData.receiver)?.id || null,
        sender_client_id: clients.find(c => c.client_name === shippingData.sender)?.id || null,
        paid: shippingData.paid || 0,
        ship_price: shippingData.shipPrice || 0,
        currency: shippingData.currency,
        note: shippingData.note || null,
      }
      console.log("Sending to shipping API:", shippingPayload)

      const response = await fetch("/api/shipping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(shippingPayload),
      })

      if (response.ok) {
        const newShipping = await response.json()
        return newShipping.id
      } else {
        throw new Error("Failed to create shipping")
      }
    } catch (error) {
      console.error("Error creating shipping:", error)
      throw error
    }
  }

  const uploadImage = async (): Promise<string | null> => {
    if (!selectedImage) return null

    try {
      const formDataObj = new FormData()
      formDataObj.append("image", selectedImage)

      const response = await fetch("/api/upload/image", {
        method: "POST",
        body: formDataObj,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || t("Failed to upload file"))
      }

      const result = await response.json()
      return result.imageUrl
    } catch (error) {
      console.error("Error uploading image:", error)
      throw error
    }
  }

  const handleProductDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setProductData((prev) => ({
      ...prev,
      [name]: name.includes("price") || ["weight", "pice_per_box", "size_of_box", "total_box_size", "number_of_boxes", "extracted_pieces", "group_item_price"].includes(name)
        ? Number.parseFloat(value) || 0
        : value,
    }))
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    setProductData(prev => ({ ...prev, image: "" }))
  }

  const handleClientChange = async (field: "sender" | "receiver", value: string) => {
    if (value === "create-new") {
      setShowNewClientForm(field)
      return
    }

    const selectedClient = clients.find(c => c.id.toString() === value)
    if (selectedClient) {
      setShippingData(prev => ({ ...prev, [field]: selectedClient.client_name }))
    }
  }

  const handleCreateClient = async () => {
    if (!newClientName.trim()) return

    try {
      const clientName = await createClient(newClientName)
      setShippingData(prev => ({ ...prev, [showNewClientForm!]: clientName }))
      setShowNewClientForm(null)
      setNewClientName("")
    } catch (error) {
      setError(t("Failed to add client"))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      let shippingId = null

      if (useExistingShipping && selectedShippingId) {
        // Link to existing shipping record
        shippingId = selectedShippingId
      } else if (!useExistingShipping && (shippingData.sender || shippingData.receiver || shippingData.shippingDate)) {
        // Create new shipping record if any shipping data is provided
        shippingId = await createShipping()
        if (!shippingId) {
          throw new Error("Failed to create shipping record")
        }
      }

      // Upload image if selected
      let imageUrl = productData.image
      if (selectedImage) {
        try {
          const uploadedImageUrl = await uploadImage()
          if (uploadedImageUrl) {
            imageUrl = uploadedImageUrl
          }
        } catch (uploadError) {
          setError(t("Failed to upload file") + ". " + t("Please try again."))
          setIsLoading(false)
          return
        }
      }

      // Create product
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...productData,
          image: imageUrl,
          shipping_id: shippingId,
        }),
      })

      if (!response.ok) {
        throw new Error(t("Failed to create product"))
      }

      const newProduct = await response.json()

      // Reset form
      setProductData({
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
        currency: "Dollar",
        note: "",
      })
      setShippingData({
        type: "coming",
        shippingDate: "",
        receivingDate: "",
        receiver: "",
        sender: "",
        paid: 0,
        shipPrice: 0,
        currency: "Dollar",
        note: "",
      })
      setUseExistingShipping(false)
      setSelectedShippingId(null)
      setSelectedImage(null)
      setImagePreview(null)

      onSuccess(newProduct)
    } catch (err) {
      setError(err instanceof Error ? err.message : t("An error occurred"))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-6 space-y-6">
      <h2 className="text-xl font-semibold text-foreground">{t("Add New Product")}</h2>

      {error && <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg">{error}</div>}

      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-foreground">{t("Basic Information")}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t("Box Code")} *</label>
            <input
              type="text"
              name="box_code"
              value={productData.box_code}
              onChange={handleProductDataChange}
              placeholder="e.g., BOX-001"
              className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t("Product Name")}</label>
            <input
              type="text"
              name="product_name"
              value={productData.product_name}
              onChange={handleProductDataChange}
              placeholder="Enter product name"
              className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t("Storage")} *</label>
            <input
              type="text"
              name="storage"
              value={productData.storage}
              onChange={handleProductDataChange}
              placeholder="e.g., Warehouse A, Shelf 3"
              className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t("Status")}</label>
            <select
              name="status"
              value={productData.status}
              onChange={handleProductDataChange}
              className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="available">{t("Available")}</option>
              <option value="out_of_stock">{t("Out of Stock")}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Pricing Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-foreground">{t("Pricing Information")}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t("Original Price")} *</label>
            <input
              type="number"
              name="original_price"
              value={productData.original_price || ""}
              onChange={handleProductDataChange}
              step="0.01"
              placeholder="0.00"
              className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t("Selling Price")} *</label>
            <input
              type="number"
              name="selling_price"
              value={productData.selling_price || ""}
              onChange={handleProductDataChange}
              step="0.01"
              placeholder="0.00"
              className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t("Currency")}</label>
            <select
              name="currency"
              value={productData.currency}
              onChange={handleProductDataChange}
              className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="Dollar">{t("Dollar")}</option>
              <option value="Iraqi Dinar">{t("Iraqi Dinar")}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t("Group Item Price")}</label>
            <input
              type="number"
              name="group_item_price"
              value={productData.group_item_price || ""}
              onChange={handleProductDataChange}
              step="0.01"
              placeholder="0.00"
              className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-2">{t("Total Original Price")} ({t("Auto-calculated: Pieces per box × Number of boxes")})</label>
            <input
              type="number"
              value={((productData.number_of_boxes || 0) * (productData.pice_per_box || 0) * (productData.original_price || 0)).toFixed(2)}
              readOnly
              step="0.01"
              placeholder="0.00"
              className="w-full px-3 py-2 border border-input rounded-lg bg-muted text-muted-foreground"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {t("Calculated as: (Number of Boxes × Pieces Per Box × Original Price)")}
            </p>
          </div>
        </div>
      </div>

      {/* Quantity & Packaging */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-foreground">{t("Quantity & Packaging")}</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t("Pieces per box")}</label>
            <input
              type="number"
              name="pice_per_box"
              value={productData.pice_per_box || ""}
              onChange={handleProductDataChange}
              placeholder="0"
              className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t("Number of boxes")} *</label>
            <input
              type="number"
              name="number_of_boxes"
              value={productData.number_of_boxes || ""}
              onChange={handleProductDataChange}
              step="0.01"
              placeholder="0.00"
              className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-2">{t("Total Pieces")} ({t("Auto-calculated: Pieces per box × Number of boxes")})</label>
            <input
              type="number"
              value={Math.round((productData.pice_per_box || 0) * (productData.number_of_boxes || 0))}
              readOnly
              placeholder="0"
              className="w-full px-3 py-2 border border-input rounded-lg bg-muted text-muted-foreground"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {t("Calculated as: (Pieces Per Box × Number of Boxes)")}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t("Size of Box")} *</label>
            <input
              type="number"
              name="size_of_box"
              value={productData.size_of_box || ""}
              onChange={handleProductDataChange}
              step="0.01"
              placeholder="0.00"
              className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t("Total Box Size")} *</label>
            <input
              type="number"
              name="total_box_size"
              value={productData.total_box_size || ""}
              onChange={handleProductDataChange}
              step="0.01"
              placeholder="0.00"
              className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t("Weight in kg")}</label>
            <input
              type="number"
              name="weight"
              value={productData.weight || ""}
              onChange={handleProductDataChange}
              step="0.01"
              placeholder="0.00"
              className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t("Extracted Pieces")}</label>
            <input
              type="number"
              name="extracted_pieces"
              value={productData.extracted_pieces || ""}
              onChange={handleProductDataChange}
              placeholder="0"
              min="0"
              className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* Shipping Information - Conditional Display */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-foreground">{t("Shipping Information (Optional)")}</h3>
        <p className="text-muted-foreground">
          {t("Choose whether to create new shipping or link to existing shipment.")}
        </p>

        {/* Shipping Mode Switch */}
        <div className="border-t pt-4 space-y-4">
          <div className="flex items-center justify-center">
            <div className="bg-muted rounded-lg p-1 flex items-center">
              <button
                type="button"
                onClick={() => setUseExistingShipping(false)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  !useExistingShipping
                    ? 'bg-primary text-primary-foreground shadow'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Truck className="w-4 h-4" />
                {t("Create New Shipping")}
              </button>
              <button
                type="button"
                onClick={() => setUseExistingShipping(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  useExistingShipping
                    ? 'bg-primary text-primary-foreground shadow'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Link className="w-4 h-4" />
                {t("Link Existing Shipping")}
              </button>
            </div>
          </div>

          {!useExistingShipping ? (
            <div className="space-y-4">
              <div className="text-center">
                <h4 className="text-sm font-medium text-foreground mb-3">{t("Add Shipping Record")}</h4>
                <p className="text-xs text-muted-foreground">{t("Fill in the shipping details below to create a new shipping record for this product.")}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t("Shipping Type")}</label>
                  <select
                    value={shippingData.type}
                    onChange={(e) => setShippingData(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="coming">{t("Coming")}</option>
                    <option value="going">{t("Going")}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t("Shipping Date")}</label>
                  <input
                    type="date"
                    value={shippingData.shippingDate}
                    onChange={(e) => setShippingData(prev => ({ ...prev, shippingDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t("Receiving Date")}</label>
                  <input
                    type="date"
                    value={shippingData.receivingDate}
                    onChange={(e) => setShippingData(prev => ({ ...prev, receivingDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t("Receiver")}</label>
                  <select
                    value={clients.find(c => c.client_name === shippingData.receiver)?.id || ""}
                    onChange={(e) => {
                      const selectedClient = clients.find(c => c.id.toString() === e.target.value)
                      if (selectedClient) {
                        setShippingData(prev => ({ ...prev, receiver: selectedClient.client_name }))
                      }
                    }}
                    className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">{t("Select Receiver")}</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id.toString()}>
                        {client.client_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t("Sender")}</label>
                  <select
                    value={clients.find(c => c.client_name === shippingData.sender)?.id || ""}
                    onChange={(e) => {
                      const selectedClient = clients.find(c => c.id.toString() === e.target.value)
                      if (selectedClient) {
                        setShippingData(prev => ({ ...prev, sender: selectedClient.client_name }))
                      }
                    }}
                    className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">{t("Select Sender")}</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id.toString()}>
                        {client.client_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t("Currency")}</label>
                  <select
                    value={shippingData.currency}
                    onChange={(e) => setShippingData(prev => ({ ...prev, currency: e.target.value }))}
                    className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Dollar">{t("Dollar")}</option>
                    <option value="Iraqi Dinar">{t("Iraqi Dinar")}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t("Ship Price")}</label>
                  <input
                    type="number"
                    step="0.01"
                    value={shippingData.shipPrice || ""}
                    onChange={(e) => setShippingData(prev => ({ ...prev, shipPrice: parseFloat(e.target.value) || 0 }))}
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t("Paid")}</label>
                  <input
                    type="number"
                    step="0.01"
                    value={shippingData.paid || ""}
                    onChange={(e) => setShippingData(prev => ({ ...prev, paid: parseFloat(e.target.value) || 0 }))}
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">{t("Notes")}</label>
                <textarea
                  value={shippingData.note}
                  onChange={(e) => setShippingData(prev => ({ ...prev, note: e.target.value }))}
                  placeholder={t("Notes")}
                  rows={2}
                  className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {(shippingData.sender || shippingData.receiver) && (
                <div className="text-sm text-muted-foreground bg-blue-50/30 dark:bg-blue-950/30 p-3 rounded-lg border">
                  {shippingData.sender && shippingData.receiver ?
                    `${t("Preview")}: ${shippingData.sender} → ${shippingData.receiver} (${t(shippingData.type)})` :
                    t("Partial shipping info entered")
                  }
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-center">
                <h4 className="text-sm font-medium text-foreground mb-1">{t("Link to Existing Shipping Record")}</h4>
                <p className="text-xs text-muted-foreground">{t("Choose existing shipping record...")}</p>
              </div>

              {existingShippings.length > 0 ? (
                <div className="space-y-3">
                  <select
                    value={selectedShippingId || ""}
                    onChange={(e) => setSelectedShippingId(Number(e.target.value) || null)}
                    className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">{t("Choose existing shipping record...")}</option>
                    {existingShippings.map(shipping => (
                      <option key={shipping.id} value={shipping.id}>
                        #{shipping.id} - {t(shipping.type)} - {new Date(shipping.shipping_date).toLocaleDateString()} to {new Date(shipping.receiving_date).toLocaleDateString()} - {shipping.sender?.client_name} → {shipping.receiver?.client_name} - ${shipping.ship_price || 0}
                      </option>
                    ))}
                  </select>

                  {selectedShippingId && (
                    <div className="text-sm text-muted-foreground bg-green-50/30 dark:bg-green-950/30 p-3 rounded-lg border">
                      {t("Product will be linked to shipping record")} #{selectedShippingId}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 text-center text-muted-foreground border border-dashed border-border rounded-lg bg-muted/30">
                  <p className="mb-2">{t("No existing shipping records found.")}</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setUseExistingShipping(false)}
                  >
                    <Truck className="w-4 h-4 mr-2" />
                    {t("Create New Shipping Instead")}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Image Upload */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-foreground">{t("Product Image")}</h3>
        {imagePreview && (
          <div className="relative mb-3 w-32 h-32">
            <img
              src={imagePreview}
              alt="Product preview"
              className="w-full h-full object-cover rounded-lg border border-border"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/80"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {!imagePreview && (
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center bg-muted/30 hover:bg-muted/50 transition-colors">
            <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer text-sm text-muted-foreground hover:text-foreground"
            >
              {t("Click to upload image or drag and drop")}
            </label>
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">{t("Or enter Image URL")}</label>
          <input
            type="text"
            name="image"
            value={productData.image}
            onChange={handleProductDataChange}
            placeholder="https://example.com/image.jpg"
            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-foreground">{t("Additional Information")}</h3>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">{t("Notes")}</label>
          <textarea
            name="note"
            value={productData.note}
            onChange={handleProductDataChange}
            placeholder={t("Enter any additional notes")}
            rows={3}
            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <Button type="submit" disabled={isLoading} className="w-full py-3">
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          {t("Create Product")}
        </Button>
      </div>
    </form>
  )
}
