"use client"

import { useState } from "react"
import { Trash2, Edit2, Check, X, Eye, DollarSign } from "lucide-react"
import type { Debit } from "@/lib/types"
import { useTranslation } from "react-i18next"
import "../i18n.client"

interface DebitTableProps {
  debits: Debit[]
  onDelete: (id: number) => void
  onUpdate: (id: number, updates: Partial<Debit>) => void
  onViewDetail?: (debit: Debit) => void
}

export function DebitTable({ debits, onDelete, onUpdate, onViewDetail }: DebitTableProps) {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editValues, setEditValues] = useState<Partial<Debit>>({})
  const [filters, setFilters] = useState({
    sender: '',
    receiver: '',
    currency: '',
    transactionDate: '',
  })
  const { t } = useTranslation()


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

  // Calculate total debits for each sender-receiver pair
  const totalDebits = debits.reduce((acc, debit) => {
    const key = `${debit.sender_id ?? 'null'}-${debit.receiver_id}`
    acc[key] = (acc[key] || 0) + debit.amount
    return acc
  }, {} as Record<string, number>)

  const filteredDebits = debits.filter(debit => {
    return (
      (filters.sender === '' || (debit.sender?.client_name || '').toLowerCase().includes(filters.sender.toLowerCase())) &&
      (filters.receiver === '' || (debit.receiver?.client_name || '').toLowerCase().includes(filters.receiver.toLowerCase())) &&
      (filters.currency === '' || debit.currency.toLowerCase().includes(filters.currency.toLowerCase())) &&
      (filters.transactionDate === '' || new Date(debit.transaction_date).toLocaleDateString().toLowerCase().includes(filters.transactionDate.toLowerCase()))
    )
  })

  return (
    <>
      <div className="mb-4 p-4 bg-muted rounded-lg">
        <h3 className="text-sm font-semibold mb-3">{t("Filter Debits")}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <input
            type="text"
            placeholder={t("Sender")}
            className="w-full px-2 py-1 bg-input text-foreground text-xs rounded"
            value={filters.sender}
            onChange={(e) => setFilters({ ...filters, sender: e.target.value })}
          />
          <input
            type="text"
            placeholder={t("Receiver")}
            className="w-full px-2 py-1 bg-input text-foreground text-xs rounded"
            value={filters.receiver}
            onChange={(e) => setFilters({ ...filters, receiver: e.target.value })}
          />
          <select
            className="w-full px-2 py-1 bg-input text-foreground text-xs rounded"
            value={filters.currency}
            onChange={(e) => setFilters({ ...filters, currency: e.target.value })}
          >
            <option value="">{t("All Currencies")}</option>
            <option value="Dollar">{t("Dollar")}</option>
            <option value="Iraqi Dinar">{t("Iraqi Dinar")}</option>
          </select>
          <input
            type="text"
            placeholder={t("Transaction Date")}
            className="w-full px-2 py-1 bg-input text-foreground text-xs rounded"
            value={filters.transactionDate}
            onChange={(e) => setFilters({ ...filters, transactionDate: e.target.value })}
          />
        </div>
        <button
          className="mt-3 px-3 py-1 bg-black text-white text-xs rounded hover:bg-gray-800"
          onClick={() => setFilters({ sender: '', receiver: '', currency: '', transactionDate: '' })}
        >
          {t("Clear Filters")}
        </button>
      </div>
    <div className="overflow-x-auto border border-border rounded-lg">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted">
            <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">{t("Sender")}</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">{t("Receiver")}</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">{t("Shipping ID")}</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">{t("Amount")}</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">{t("Total Debits")}</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">{t("Currency")}</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">{t("Note")}</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">{t("Transaction Date")}</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">{t("Actions")}</th>
          </tr>
        </thead>
        <tbody>
          {filteredDebits.map((debit) => (
            <tr key={debit.id} className="border-b border-border hover:bg-muted/50 transition-colors">
              {editingId === debit.id ? (
                <>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {debit.sender?.client_name || t("None")}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {debit.receiver?.client_name || t("Receiver Missing")}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {debit.shipping?.id || debit.shipping_id || t("None")}
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
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {(totalDebits[`${debit.sender_id ?? 'null'}-${debit.receiver_id}`] || 0).toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={editValues.currency || ""}
                      onChange={(e) => setEditValues({ ...editValues, currency: e.target.value })}
                      className="w-full px-2 py-1 bg-input text-foreground text-xs rounded"
                      placeholder={t("Dollar")}
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
                  <td className="px-4 py-3 font-medium text-foreground text-xs">{debit.sender?.client_name || t("None")}</td>
                  <td className="px-4 py-3 font-medium text-foreground text-xs">{debit.receiver?.client_name || t("Receiver Missing")}</td>
                  <td className="px-4 py-3 text-foreground text-xs">{debit.shipping?.id || t("None")}</td>
                  <td className="px-4 py-3 text-foreground text-xs font-bold">{debit.amount.toFixed(2)}</td>
                  <td className="px-4 py-3 text-foreground text-xs font-semibold text-primary">
                    {(totalDebits[`${debit.sender_id ?? 'null'}-${debit.receiver_id}`] || 0).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-foreground text-xs">{debit.currency}</td>
                  <td className="px-4 py-3 text-foreground text-xs truncate max-w-xs" title={debit.note || undefined}>
                    {debit.note || t("No note")}
                  </td>
                  <td className="px-4 py-3 text-foreground text-xs">
                    {new Date(debit.transaction_date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {onViewDetail && (
                        <button
                          onClick={() => onViewDetail(debit)}
                          className="p-1 hover:bg-secondary/10 rounded text-muted-foreground transition-colors"
                          title={t("View Details")}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
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
    </>
  )
}
