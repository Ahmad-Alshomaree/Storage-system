"use client"

import { useState } from "react"
import { Trash2, Edit2, Check, X, Eye } from "lucide-react"
import { ClientDetailsModal } from "./client-details-modal"

interface Client {
  id: number
  client_name: string
  phone_number?: string | null
  shipping_id?: number | null
  history?: string | null
  total_debts: number
}

interface ClientTableProps {
  clients: Client[]
  onDelete: (id: number) => void
  onUpdate: (id: number, updates: Partial<Client>) => void
}

export function ClientTable({ clients, onDelete, onUpdate }: ClientTableProps) {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editValues, setEditValues] = useState<Partial<Client>>({})
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  const startEdit = (client: Client) => {
    setEditingId(client.id)
    setEditValues({ ...client })
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
            <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">Client Name</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">Phone Number</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">Shipping ID</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">History</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">Total Debts</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id} className="border-b border-border hover:bg-muted/50 transition-colors">
              {editingId === client.id ? (
                <>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={editValues.client_name || ""}
                      onChange={(e) => setEditValues({ ...editValues, client_name: e.target.value })}
                      className="w-full px-2 py-1 bg-input text-foreground text-xs rounded"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={editValues.phone_number || ""}
                      onChange={(e) => setEditValues({ ...editValues, phone_number: e.target.value })}
                      className="w-full px-2 py-1 bg-input text-foreground text-xs rounded"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={editValues.shipping_id || ""}
                      onChange={(e) =>
                        setEditValues({ ...editValues, shipping_id: e.target.value ? Number.parseInt(e.target.value) : null })
                      }
                      className="w-full px-2 py-1 bg-input text-foreground text-xs rounded"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <textarea
                      value={editValues.history || ""}
                      onChange={(e) => setEditValues({ ...editValues, history: e.target.value })}
                      className="w-full px-2 py-1 bg-input text-foreground text-xs rounded"
                      rows={2}
                    />
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {(client.total_debts ?? 0).toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveEdit(client.id)}
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
                  <td className="px-4 py-3 font-medium text-foreground text-xs">{client.client_name}</td>
                  <td className="px-4 py-3 text-foreground text-xs">{client.phone_number || "N/A"}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{client.shipping_id || "None"}</td>
                  <td className="px-4 py-3 text-foreground text-xs truncate max-w-xs" title={client.history || undefined}>
                    {client.history || "No history"}
                  </td>
                  <td className="px-4 py-3 text-foreground text-xs font-medium">{(client.total_debts ?? 0).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedClient(client)
                          setShowDetailsModal(true)
                        }}
                        className="p-1 hover:bg-primary/10 rounded text-primary transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => startEdit(client)}
                        className="p-1 hover:bg-primary/10 rounded text-primary transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(client.id)}
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
      <ClientDetailsModal
        client={selectedClient}
        open={showDetailsModal}
        onOpenChange={setShowDetailsModal}
      />
    </div>
  )
}
