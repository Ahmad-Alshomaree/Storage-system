"use client"

import { useState } from "react"
import { Trash2, Edit2, Check, X } from "lucide-react"

interface Product {
  id: number
  product_name: string
  product_type: string
  original_price: number
  selling_price: number
  storage: string
  box_code: string
  box_number: number
  quantity: number
  shipping_id: number | null
  shipping_type?: string
  shipping_receiver?: string
}

interface ProductTableProps {
  products: Product[]
  onDelete: (id: number) => void
  onUpdate: (id: number, updates: Partial<Product>) => void
}

export function ProductTable({ products, onDelete, onUpdate }: ProductTableProps) {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editValues, setEditValues] = useState<Partial<Product>>({})

  const startEdit = (product: Product) => {
    setEditingId(product.id)
    setEditValues({ ...product })
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

  return (
    <div className="overflow-x-auto border border-border rounded-lg">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted">
            <th className="px-3 py-3 text-left text-xs font-semibold text-foreground">Box Code</th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-foreground">Product Name</th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-foreground">Type</th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-foreground">Original Price</th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-foreground">Selling Price</th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-foreground">Storage</th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-foreground">Qty</th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-foreground">Shipping</th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-foreground">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b border-border hover:bg-muted/50 transition-colors">
              {editingId === product.id ? (
                <>
                  <td className="px-3 py-3">
                    <input
                      type="text"
                      value={editValues.box_code || ""}
                      onChange={(e) => setEditValues({ ...editValues, box_code: e.target.value })}
                      className="w-full px-2 py-1 bg-input text-foreground text-xs rounded"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <input
                      type="text"
                      value={editValues.product_name || ""}
                      onChange={(e) => setEditValues({ ...editValues, product_name: e.target.value })}
                      className="w-full px-2 py-1 bg-input text-foreground text-xs rounded"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <input
                      type="text"
                      value={editValues.product_type || ""}
                      onChange={(e) => setEditValues({ ...editValues, product_type: e.target.value })}
                      className="w-full px-2 py-1 bg-input text-foreground text-xs rounded"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <input
                      type="number"
                      value={editValues.original_price || 0}
                      onChange={(e) =>
                        setEditValues({ ...editValues, original_price: Number.parseFloat(e.target.value) })
                      }
                      step="0.01"
                      className="w-full px-2 py-1 bg-input text-foreground text-xs rounded"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <input
                      type="number"
                      value={editValues.selling_price || 0}
                      onChange={(e) =>
                        setEditValues({ ...editValues, selling_price: Number.parseFloat(e.target.value) })
                      }
                      step="0.01"
                      className="w-full px-2 py-1 bg-input text-foreground text-xs rounded"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <input
                      type="text"
                      value={editValues.storage || ""}
                      onChange={(e) => setEditValues({ ...editValues, storage: e.target.value })}
                      className="w-full px-2 py-1 bg-input text-foreground text-xs rounded"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <input
                      type="number"
                      value={editValues.quantity || 0}
                      onChange={(e) => setEditValues({ ...editValues, quantity: Number.parseInt(e.target.value) })}
                      className="w-full px-2 py-1 bg-input text-foreground text-xs rounded"
                    />
                  </td>
                  <td className="px-3 py-3 text-xs text-muted-foreground">{product.shipping_type || "None"}</td>
                  <td className="px-3 py-3">
                    <div className="flex gap-1">
                      <button
                        onClick={() => saveEdit(product.id)}
                        className="p-1 hover:bg-primary/10 rounded text-primary"
                      >
                        <Check className="w-3 h-3" />
                      </button>
                      <button onClick={cancelEdit} className="p-1 hover:bg-destructive/10 rounded text-destructive">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </>
              ) : (
                <>
                  <td className="px-3 py-3 font-medium text-foreground text-xs">{product.box_code}</td>
                  <td className="px-3 py-3 text-foreground text-xs">{product.product_name}</td>
                  <td className="px-3 py-3 text-xs">
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                      {product.product_type}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-foreground text-xs">${product.original_price.toFixed(2)}</td>
                  <td className="px-3 py-3 text-foreground text-xs font-medium">${product.selling_price.toFixed(2)}</td>
                  <td className="px-3 py-3 text-foreground text-xs">{product.storage}</td>
                  <td className="px-3 py-3 text-foreground text-xs">{product.quantity}</td>
                  <td className="px-3 py-3 text-xs text-muted-foreground">{product.shipping_type || "None"}</td>
                  <td className="px-3 py-3">
                    <div className="flex gap-1">
                      <button
                        onClick={() => startEdit(product)}
                        className="p-1 hover:bg-primary/10 rounded text-primary transition-colors"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => onDelete(product.id)}
                        className="p-1 hover:bg-destructive/10 rounded text-destructive transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
