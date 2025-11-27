"use client"

import { useState } from "react"
import { Trash2, Edit2, Check, X, Eye } from "lucide-react"
import { ShippingDetailsModal } from "./shipping-details-modal"

interface Product {
  id: number
  box_code: string
  product_name?: string | null
  original_price: number
  selling_price: number
  Total_pices?: number | null
  number_of_boxes: number
  size_of_box: number
  total_box_size: number
  weight?: number | null
  image?: string | null
}

interface Shipping {
  id: number
  type: string
  shipping_date: string
  receiving_date: string
  receiver: string
  paid?: number
  ship_price?: number
  created_at: string
  file_path?: string | null
  products?: Product[]
}

interface ShippingTableProps {
  shipping: Shipping[]
  onDelete: (id: number) => void
  onUpdate: (id: number, updates: Partial<Shipping>) => void
}

export function ShippingTable({ shipping, onDelete, onUpdate }: ShippingTableProps) {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editValues, setEditValues] = useState<Partial<Shipping>>({})
  const [selectedShipping, setSelectedShipping] = useState<Shipping | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  const convertToDatetimeLocal = (dateString: string) => {
    try {
      // Handle different date formats
      if (dateString.includes("/")) {
        // Format: "12/12/2025" -> convert to ISO
        const [month, day, year] = dateString.split('/')
        return new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T00:00`).toISOString().slice(0, 16)
      } else if (dateString.includes("-") && !dateString.includes("T")) {
        // Format: "2024-01-01" -> add time
        return `${dateString}T00:00`
      } else if (dateString.includes("T")) {
        // Already ISO format
        return dateString.slice(0, 16)
      }
      // Default fallback
      return new Date().toISOString().slice(0, 16)
    } catch {
      return new Date().toISOString().slice(0, 16)
    }
  }

  const startEdit = (record: Shipping) => {
    setEditingId(record.id)
    setEditValues({
      ...record,
      shipping_date: convertToDatetimeLocal(record.shipping_date),
      receiving_date: convertToDatetimeLocal(record.receiving_date),
    })
  }

  const saveEdit = async (id: number) => {
    await onUpdate(id, editValues)
    setEditingId(null)
    setEditValues({})
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditValues({})
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <div className="overflow-x-auto border border-border rounded-lg">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted">
            <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">Type</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">Shipping Date</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">Receiving Date</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">Receiver</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">Products</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">Paid</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">Ship Price</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">Actions</th>
          </tr>
        </thead>
        <tbody>
          {shipping.map((record) => (
            <tr key={record.id} className="border-b border-border hover:bg-muted/50 transition-colors">
              {editingId === record.id ? (
                <>
                  <td className="px-4 py-3">
                    <select
                      value={editValues.type || ""}
                      onChange={(e) => setEditValues({ ...editValues, type: e.target.value })}
                      className="w-full px-2 py-1 bg-input text-foreground text-xs rounded"
                    >
                      <option value="input load">Input Load</option>
                      <option value="output load">Output Load</option>
                      <option value="comming">Coming</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="datetime-local"
                      value={editValues.shipping_date || ""}
                      onChange={(e) => setEditValues({ ...editValues, shipping_date: e.target.value })}
                      className="w-full px-2 py-1 bg-input text-foreground text-xs rounded"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="datetime-local"
                      value={editValues.receiving_date || ""}
                      onChange={(e) => setEditValues({ ...editValues, receiving_date: e.target.value })}
                      className="w-full px-2 py-1 bg-input text-foreground text-xs rounded"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={editValues.receiver || ""}
                      onChange={(e) => setEditValues({ ...editValues, receiver: e.target.value })}
                      className="w-full px-2 py-1 bg-input text-foreground text-xs rounded"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-xs text-muted-foreground">
                      {record.products && record.products.length > 0
                        ? record.products.map(p =>
                            `${p.product_name || p.box_code} (${p.number_of_boxes} boxes${p.Total_pices ? `, ${p.Total_pices} pcs` : ''})`
                          ).join("; ")
                        : "No products"
                      }
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      step="0.01"
                      value={editValues.paid || ""}
                      onChange={(e) => setEditValues({ ...editValues, paid: parseFloat(e.target.value) || 0 })}
                      className="w-full px-2 py-1 bg-input text-foreground text-xs rounded"
                      placeholder="0.00"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      step="0.01"
                      value={editValues.ship_price || ""}
                      onChange={(e) => setEditValues({ ...editValues, ship_price: parseFloat(e.target.value) || 0 })}
                      className="w-full px-2 py-1 bg-input text-foreground text-xs rounded"
                      placeholder="0.00"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveEdit(record.id)}
                        className="p-1 hover:bg-primary/10 rounded text-primary"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button onClick={cancelEdit} className="p-1 hover:bg-destructive/10 rounded text-destructive">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </>
              ) : (
                <>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-xs font-medium">
                      {record.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-foreground text-xs">{formatDate(record.shipping_date)}</td>
                  <td className="px-4 py-3 text-foreground text-xs">{formatDate(record.receiving_date)}</td>
                  <td className="px-4 py-3 text-foreground text-xs">{record.receiver}</td>
                  <td className="px-4 py-3 text-foreground text-xs">
                    <div className="text-xs max-w-xs truncate">
                      {record.products && record.products.length > 0
                        ? record.products.map(p =>
                            `${p.product_name || p.box_code} (${p.number_of_boxes} boxes${p.Total_pices ? `, ${p.Total_pices} pcs` : ''})`
                          ).join("; ")
                        : "No products"
                      }
                    </div>
                  </td>
                  <td className="px-4 py-3 text-foreground text-xs">{record.paid ?? 0}</td>
                  <td className="px-4 py-3 text-foreground text-xs">{record.ship_price ?? 0}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedShipping(record)
                          setShowDetailsModal(true)
                        }}
                        className="p-1 hover:bg-primary/10 rounded text-primary transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => startEdit(record)}
                        className="p-1 hover:bg-primary/10 rounded text-primary transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(record.id)}
                        className="p-1 hover:bg-destructive/10 rounded text-destructive transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <ShippingDetailsModal
        shipping={selectedShipping}
        open={showDetailsModal}
        onOpenChange={setShowDetailsModal}
      />
    </div>
  )
}
