"use client"

import { useState } from "react"
import { Trash2, Edit2, Check, X, Eye, DollarSign } from "lucide-react"

interface Debit {
  id: number
  sender_id?: number | null
  receiver_id: number
  shipping_id?: number | null
  amount: number
  currency: string
  note?: string | null
  transaction_date: string
  created_at: string
  sender?: {
    id: number
    client_name: string
    phone_number?: string | null
  } | null
  receiver: {
    id: number
    client_name: string
    phone_number?: string | null
  }
  shipping?: {
    id: number
    type: string
    shipping_date: string
    receiver: string
    file_path?: string | null
    created_at: string
  }
}

interface DebitTableProps {
  debits: Debit[]
  onDelete: (id: number) => void
  onUpdate: (id: number, updates: Partial<Debit>) => void
}

export function DebitTable({ debits, onDelete, onUpdate }: DebitTableProps) {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editValues, setEditValues] = useState<Partial<Debit>>({})

  const startEdit = (debit: Debit) => {
    setEditingId(debit.id)
    setEditValues({ ...debit })
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
            <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">Sender</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">Receiver</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">Shipping ID</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">Amount</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">Currency</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">Note</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">Transaction Date</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">Actions</th>
          </tr>
        </thead>
        <tbody>
          {debits.map((debit) => (
            <tr key={debit.id} className="border-b border-border hover:bg-muted/50 transition-colors">
              {editingId === debit.id ? (
                <>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {debit.sender?.client_name || "None"}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {debit.receiver.client_name}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {debit.shipping?.id || debit.shipping_id || "None"}
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={editValues.amount || 0}
                      onChange={(e) =>
                        setEditValues({ ...editValues, amount: Number.parseFloat(e.target.value) })
                      }
                      step="0.01"
                      className="w-full px-2 py-1 bg-input text-foreground text-xs rounded"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={editValues.currency || ""}
                      onChange={(e) => setEditValues({ ...editValues, currency: e.target.value })}
                      className="w-full px-2 py-1 bg-input text-foreground text-xs rounded"
                      placeholder="Dollar"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={editValues.note || ""}
                      onChange={(e) => setEditValues({ ...editValues, note: e.target.value })}
                      className="w-full px-2 py-1 bg-input text-foreground text-xs rounded"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="date"
                      value={editValues.transaction_date || ""}
                      onChange={(e) => setEditValues({ ...editValues, transaction_date: e.target.value })}
                      className="w-full px-2 py-1 bg-input text-foreground text-xs rounded"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveEdit(debit.id)}
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
                  <td className="px-4 py-3 font-medium text-foreground text-xs">{debit.sender?.client_name || "None"}</td>
                  <td className="px-4 py-3 font-medium text-foreground text-xs">{debit.receiver.client_name}</td>
                  <td className="px-4 py-3 text-foreground text-xs">{debit.shipping?.id || "None"}</td>
                  <td className="px-4 py-3 text-foreground text-xs font-bold">{debit.amount.toFixed(2)}</td>
                  <td className="px-4 py-3 text-foreground text-xs">{debit.currency}</td>
                  <td className="px-4 py-3 text-foreground text-xs truncate max-w-xs" title={debit.note || undefined}>
                    {debit.note || "No note"}
                  </td>
                  <td className="px-4 py-3 text-foreground text-xs">
                    {new Date(debit.transaction_date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(debit)}
                        className="p-1 hover:bg-primary/10 rounded text-primary transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(debit.id)}
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
