"use client"

import { useState, useEffect } from "react"
import { Edit2, Trash2, Download, Check, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface Client {
  id: number
  client_name: string
  phone_number?: string | null
}

interface Product {
  id: number
  box_code: string
  product_name?: string | null
  product_type?: string | null
  original_price: number
  selling_price: number
  Total_pices?: number | null
  total_original_price?: number | null
  number_of_boxes: number
  size_of_box: number
  total_box_size: number
  weight?: number | null
  image?: string | null
  currency?: string | null
  note?: string | null
}

interface Shipping {
  id: number
  type: string
  shipping_date: string
  receiving_date: string
  receiver_client_id?: number
  sender_client_id?: number
  receiver: Client
  sender: Client
  paid?: number
  ship_price?: number
  currency?: string
  note?: string | null
  created_at: string
  file_path?: string | null
  products?: Product[]
}

interface ShippingDetailsModalProps {
  shipping: Shipping | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit?: (id: number, updates: Partial<Shipping>) => void
  onDelete?: (id: number) => void
}

export function ShippingDetailsModal({ shipping, open, onOpenChange, onEdit, onDelete }: ShippingDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValues, setEditValues] = useState<Partial<Shipping>>({})
  const [clients, setClients] = useState<Client[]>([])
  const [loadingClients, setLoadingClients] = useState(true)

  // Fetch clients on component mount
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch('/api/clients')
        if (response.ok) {
          const data = await response.json()
          setClients(data)
        }
      } catch (error) {
        console.error('Error fetching clients:', error)
      } finally {
        setLoadingClients(false)
      }
    }

    if (open) {
      fetchClients()
    }
  }, [open])

  if (!shipping) return null

  // Helper function to convert date to date format
  const convertToDateInput = (dateString: string) => {
    try {
      if (dateString.includes("/")) {
        const [month, day, year] = dateString.split('/')
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      } else if (dateString.includes("-") && !dateString.includes("T")) {
        return dateString
      } else if (dateString.includes("T")) {
        return dateString.slice(0, 10)
      }
      return new Date().toISOString().slice(0, 10)
    } catch {
      return new Date().toISOString().slice(0, 10)
    }
  }

  const startEdit = () => {
    setIsEditing(true)
    setEditValues({
      ...shipping,
      shipping_date: convertToDateInput(shipping.shipping_date),
      receiving_date: convertToDateInput(shipping.receiving_date),
    })
  }

  const saveEdit = async () => {
    if (onEdit) {
      await onEdit(shipping.id, editValues)
    }
    setIsEditing(false)
    setEditValues({})
  }

  const cancelEdit = () => {
    setIsEditing(false)
    setEditValues({})
  }

  const handleDelete = async () => {
    if (onDelete && confirm("Are you sure you want to delete this shipping record?")) {
      await onDelete(shipping.id)
      onOpenChange(false)
    }
  }

  const handleDownload = () => {
    // Generate receipt content
    const receiptContent = `
SHIPPING RECEIPT

Shipping ID: #${shipping.id}
Type: ${shipping.type}
Receiver: ${shipping.receiver.client_name}
Sender: ${shipping.sender.client_name}

Dates:
- Shipping Date: ${new Date(shipping.shipping_date).toLocaleString()}
- Receiving Date: ${new Date(shipping.receiving_date).toLocaleString()}

Financial Information:
- Currency: ${shipping.currency || "Dollar"}
- Paid: ${shipping.paid ?? 0} ${shipping.currency || "Dollar"}
- Ship Price: ${shipping.ship_price ?? 0} ${shipping.currency || "Dollar"}

Products (${shipping.products?.length || 0}):
${shipping.products?.map(product =>
  `- ${product.product_name || product.box_code} (${product.number_of_boxes} boxes, ${product.Total_pices ?? 0} pcs)`
).join('\n') || 'No products'}

Notes: ${shipping.note || "No notes"}

Generated on: ${new Date().toLocaleString()}
    `.trim()

    // Create and download file
    const blob = new Blob([receiptContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `shipping-receipt-${shipping.id}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Shipping Details</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6">
          {/* Basic Shipping Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Shipping ID</label>
              <p className="text-sm font-semibold">#{shipping.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Type</label>
              {isEditing ? (
                <select
                  value={editValues.type || ""}
                  onChange={(e) => setEditValues({ ...editValues, type: e.target.value })}
                  className="w-full px-2 py-1 bg-input text-foreground text-sm rounded"
                >
                  <option value="input load">Input Load</option>
                  <option value="output load">Output Load</option>
                  <option value="comming">Coming</option>
                </select>
              ) : (
                <p className="text-lg font-bold capitalize">{shipping.type}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Receiver</label>
              {isEditing ? (
                <select
                  value={editValues.receiver_client_id || shipping.receiver_client_id || ""}
                  onChange={(e) => setEditValues({ ...editValues, receiver_client_id: parseInt(e.target.value) })}
                  className="w-full px-2 py-1 bg-input text-foreground text-sm rounded"
                  disabled={loadingClients}
                >
                  <option value="">Select Receiver</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.client_name}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-sm">{shipping.receiver.client_name}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Sender</label>
              {isEditing ? (
                <select
                  value={editValues.sender_client_id || shipping.sender_client_id || ""}
                  onChange={(e) => setEditValues({ ...editValues, sender_client_id: parseInt(e.target.value) })}
                  className="w-full px-2 py-1 bg-input text-foreground text-sm rounded"
                  disabled={loadingClients}
                >
                  <option value="">Select Sender</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.client_name}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-sm">{shipping.sender.client_name}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Currency</label>
              {isEditing ? (
                <select
                  value={editValues.currency || ""}
                  onChange={(e) => setEditValues({ ...editValues, currency: e.target.value })}
                  className="w-full px-2 py-1 bg-input text-foreground text-sm rounded"
                >
                  <option value="Dollar">Dollar</option>
                  <option value="Iraqi Dinar">Iraqi Dinar</option>
                </select>
              ) : (
                <p className="text-sm">{shipping.currency || "Dollar"}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Paid</label>
              {isEditing ? (
                <input
                  type="number"
                  step="0.01"
                  value={editValues.paid || ""}
                  onChange={(e) => setEditValues({ ...editValues, paid: parseFloat(e.target.value) || 0 })}
                  className="w-full px-2 py-1 bg-input text-foreground text-sm rounded"
                  placeholder="0.00"
                />
              ) : (
                <p className="text-sm">{shipping.paid ?? 0} {shipping.currency || "Dollar"}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Ship Price</label>
              {isEditing ? (
                <input
                  type="number"
                  step="0.01"
                  value={editValues.ship_price || ""}
                  onChange={(e) => setEditValues({ ...editValues, ship_price: parseFloat(e.target.value) || 0 })}
                  className="w-full px-2 py-1 bg-input text-foreground text-sm rounded"
                  placeholder="0.00"
                />
              ) : (
                <p className="text-sm">{shipping.ship_price ?? 0} {shipping.currency || "Dollar"}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Created At</label>
              <p className="text-sm">{new Date(shipping.created_at).toLocaleString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Note</label>
              {isEditing ? (
                <textarea
                  value={editValues.note || ""}
                  onChange={(e) => setEditValues({ ...editValues, note: e.target.value })}
                  rows={3}
                  className="w-full px-2 py-1 bg-input text-foreground text-sm rounded"
                  placeholder="Notes"
                />
              ) : (
                <p className="text-sm">{shipping.note || "No notes"}</p>
              )}
            </div>
          </div>

          {/* Date Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Shipping Date</label>
              {isEditing ? (
                <input
                  type="date"
                  value={editValues.shipping_date || ""}
                  onChange={(e) => setEditValues({ ...editValues, shipping_date: e.target.value })}
                  className="w-full px-2 py-1 bg-input text-foreground text-sm rounded"
                />
              ) : (
                <p className="text-sm font-semibold">{new Date(shipping.shipping_date).toLocaleDateString()}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Receiving Date</label>
              {isEditing ? (
                <input
                  type="date"
                  value={editValues.receiving_date || ""}
                  onChange={(e) => setEditValues({ ...editValues, receiving_date: e.target.value })}
                  className="w-full px-2 py-1 bg-input text-foreground text-sm rounded"
                />
              ) : (
                <p className="text-sm font-semibold">{new Date(shipping.receiving_date).toLocaleDateString()}</p>
              )}
            </div>
          </div>

          {/* File Path - if exists */}
          {shipping.file_path && (
            <div className="border-t pt-4">
              <label className="text-sm font-medium text-muted-foreground block mb-2">Attached Document</label>
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm text-blue-600 break-all">{shipping.file_path}</p>
              </div>
            </div>
          )}

          {/* Products Information */}
          {shipping.products && shipping.products.length > 0 && (
            <div className="border-t pt-4">
              <label className="text-sm font-medium text-muted-foreground block mb-3">Products in Shipment ({shipping.products.length})</label>
              <div className="space-y-3">
                {shipping.products.map((product) => (
                  <div key={product.id} className="bg-muted p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Product Name</label>
                        <p className="text-sm font-medium">{product.product_name || product.box_code}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Box Code</label>
                        <p className="text-sm">{product.box_code}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Product Type</label>
                        <p className="text-sm">{product.product_type || "N/A"}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Currency</label>
                        <p className="text-sm">{product.currency || "Dollar"}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 mt-3">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Boxes</label>
                        <p className="text-sm font-bold">{product.number_of_boxes}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Total Pieces</label>
                        <p className="text-sm font-bold">{product.Total_pices ?? 0}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Original Price</label>
                        <p className="text-sm font-bold">{(product.original_price).toFixed(2)}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Total Original Price</label>
                        <p className="text-sm font-bold">{(product.total_original_price ?? 0).toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 mt-3">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Selling Price</label>
                        <p className="text-sm font-bold">{product.selling_price.toFixed(2)}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Box Size</label>
                        <p className="text-sm font-bold">{product.size_of_box}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Total Box Size</label>
                        <p className="text-sm font-bold">{product.total_box_size}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Weight</label>
                        <p className="text-sm font-bold">{product.weight ?? 0}</p>
                      </div>
                    </div>

                    {product.note && (
                      <div className="mt-3">
                        <label className="text-xs font-medium text-muted-foreground">Note</label>
                        <p className="text-sm mt-1">{product.note}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Information Display */}
          <div className="border-t pt-4">
            <label className="text-sm font-medium text-muted-foreground block mb-2">Shipping Summary</label>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm">
                <span className="font-medium">Type:</span> {shipping.type} •
                <span className="font-medium"> Receiver:</span> {shipping.receiver.client_name} •
                <span className="font-medium"> Duration:</span> {Math.ceil((new Date(shipping.receiving_date).getTime() - new Date(shipping.shipping_date).getTime()) / (1000 * 60 * 60 * 24))} days •
                <span className="font-medium"> Products:</span> {shipping.products?.length || 0}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={isEditing ? saveEdit : startEdit}
            className="flex items-center gap-2"
          >
            {isEditing ? <Check className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
            {isEditing ? "Save" : "Edit"}
          </Button>
          {isEditing ? (
            <Button
              variant="outline"
              size="sm"
              onClick={cancelEdit}
              className="flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </Button>
          ) : (
            <>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                className="flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleDownload}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Receipt
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
