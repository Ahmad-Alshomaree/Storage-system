"use client"

import { useState } from "react"
import { Trash2, Edit2, Check, X } from "lucide-react"

interface Shipping {
  id: number
  type: string
  shipping_date: string
  receiver: string
  created_at: string
}

interface ShippingTableProps {
  shipping: Shipping[]
  onDelete: (id: number) => void
  onUpdate: (id: number, updates: Partial<Shipping>) => void
}

export function ShippingTable({ shipping, onDelete, onUpdate }: ShippingTableProps) {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editValues, setEditValues] = useState<Partial<Shipping>>({})

  const startEdit = (record: Shipping) => {
    setEditingId(record.id)
    setEditValues({ ...record })
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
            <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">Receiver</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">Created At</th>
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
                      type="text"
                      value={editValues.receiver || ""}
                      onChange={(e) => setEditValues({ ...editValues, receiver: e.target.value })}
                      className="w-full px-2 py-1 bg-input text-foreground text-xs rounded"
                    />
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(record.created_at)}</td>
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
                  <td className="px-4 py-3 text-foreground text-xs">{record.receiver}</td>
                  <td className="px-4 py-3 text-foreground text-xs">{formatDate(record.created_at)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
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
    </div>
  )
}
