"use client"

import { useState, useEffect } from "react"
import { Trash2, Edit2, Check, X, Eye } from "lucide-react"
import { ShippingDetailsModal } from "./shipping-details-modal"
import { useTranslation } from "react-i18next"
import "../i18n.client"

export interface ShippingTableClient {
  id: number
  client_name: string
  phone_number?: string | null
}

interface Product {
  id: number
  shipping_id?: number | null
  item_no?: string | null
  box_code: string
  product_name?: string | null
  cost: number
  selling_price: number
  storage?: string | null
  weight?: number | null
  image?: string | null
  pice_per_box: number
  total_pices: number
  total_cost: number
  size_of_box: number
  total_box_size: number
  number_of_boxes: number
  extracted_pieces: number
  status: string
  grope_item_price?: number | null
  currency: string
  note?: string | null
  created_at?: string | null
  updated_at?: string | null
}

interface Shipping {
  id: number
  type: string
  shipping_date: string
  receiving_date: string
  receiver_client_id?: number
  sender_client_id?: number
  receiver: ShippingTableClient
  sender: ShippingTableClient
  paid?: number
  ship_price?: number
  currency?: string
  note?: string | null
  created_at: string
  file_path?: string | null
  products?: Product[]
}

interface ShippingTableProps {
  shipping: Shipping[]
  clients: ShippingTableClient[]
  onDelete: (id: number) => void
  onUpdate: (id: number, updates: Partial<Shipping>) => void
}

export function ShippingTable({ shipping, clients, onDelete, onUpdate }: ShippingTableProps) {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editValues, setEditValues] = useState<Partial<Shipping>>({})
  const [selectedShipping, setSelectedShipping] = useState<Shipping | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [confirmedShippingDate, setConfirmedShippingDate] = useState(false)
  const [confirmedReceivingDate, setConfirmedReceivingDate] = useState(false)
  const [filters, setFilters] = useState({
    type: '',
    receiver: '',
    shippingDate: '',
  })
  const { t } = useTranslation()

  const filteredShipping = shipping.filter(record => {
    const receiverName = record.receiver?.client_name || ""
    return (
      (filters.type === '' || record.type === filters.type) &&
      (filters.receiver === '' || receiverName.toLowerCase().includes(filters.receiver.toLowerCase())) &&
      (filters.shippingDate === '' || formatDate(record.shipping_date).toLowerCase().includes(filters.shippingDate.toLowerCase()))
    )
  })

  // adapt any stored date/time string into something suitable for
  // `<input type="datetime-local" />` when performing inline edits.
  const convertToDateInput = (dateString: string) => {
    try {
      const dt = new Date(dateString)
      if (!isNaN(dt.getTime())) {
        // keep minutes precision
        return dt.toISOString().slice(0, 16)
      }
      if (dateString.includes("/")) {
        const [month, day, year] = dateString.split('/')
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T00:00`
      }
      return new Date().toISOString().slice(0, 16)
    } catch {
      return new Date().toISOString().slice(0, 16)
    }
  }

  const startEdit = (record: Shipping) => {
    setEditingId(record.id)
    setEditValues({
      ...record,
      shipping_date: convertToDateInput(record.shipping_date),
      receiving_date: convertToDateInput(record.receiving_date),
    })
    setConfirmedShippingDate(false)
    setConfirmedReceivingDate(false)
  }

  const saveEdit = async (id: number) => {
    await onUpdate(id, editValues)
    setEditingId(null)
    setEditValues({})
    setConfirmedShippingDate(false)
    setConfirmedReceivingDate(false)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditValues({})
    setConfirmedShippingDate(false)
    setConfirmedReceivingDate(false)
  }  }

  // show both date and time in table cells
  const formatDate = (dateString: string) => {
    const dt = new Date(dateString)
    return isNaN(dt.getTime()) ? '' : dt.toLocaleString()
  }

  const getShippingTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'input load':
        // Green for incoming/arrival
        return 'px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-xs font-medium'
      case 'output load':
        // Orange/amber for outgoing/departure
        return 'px-2 py-1 bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 rounded-full text-xs font-medium'
      case 'comming':
      case 'coming':
        // Blue for general coming shipments
        return 'px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-xs font-medium'
      case 'going':
        // Purple for going shipments
        return 'px-2 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-full text-xs font-medium'
      default:
        // Default gray for unknown types
        return 'px-2 py-1 bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 rounded-full text-xs font-medium'
    }
  }

  return (
    <>
      <div className="mb-4 p-4 bg-muted rounded-lg">
        <h3 className="text-sm font-semibold mb-3">{t("Filter Shipping")}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <select
            className="w-full px-2 py-1 bg-input text-foreground text-xs rounded"
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          >
            <option value="">{t("All Types")}</option>
            <option value="input load">{t("Input Load")}</option>
            <option value="output load">{t("Output Load")}</option>
            <option value="comming">{t("Coming")}</option>
          </select>
          <input
            type="text"
            placeholder={t("Receiver")}
            className="w-full px-2 py-1 bg-input text-foreground text-xs rounded"
            value={filters.receiver}
            onChange={(e) => setFilters({ ...filters, receiver: e.target.value })}
          />
          <input
            type="text"
            placeholder={t("Shipping Date/Time")}
            className="w-full px-2 py-1 bg-input text-foreground text-xs rounded"
            value={filters.shippingDate}
            onChange={(e) => setFilters({ ...filters, shippingDate: e.target.value })}
          />
        </div>
        <button
          className="mt-3 px-3 py-1 bg-black text-white text-xs rounded hover:bg-gray-800"
          onClick={() => setFilters({ type: '', receiver: '', shippingDate: '' })}
        >
          {t("Clear Filters")}
        </button>
      </div>
    <div className="overflow-x-auto border border-border rounded-lg">
      <table className="w-full text-sm min-w-[1200px]">
        <thead>
          <tr className="border-b border-border bg-muted">
            <th className="px-2 py-3 text-left text-xs font-semibold text-foreground">{t("Type")}</th>
            <th className="px-2 py-3 text-left text-xs font-semibold text-foreground">{t("Shipping Date/Time")}</th>
            <th className="px-2 py-3 text-left text-xs font-semibold text-foreground">{t("Receiving Date")}</th>
            <th className="px-2 py-3 text-left text-xs font-semibold text-foreground">{t("Receiver")}</th>
            <th className="px-2 py-3 text-left text-xs font-semibold text-foreground">{t("Sender")}</th>
            <th className="px-2 py-3 text-left text-xs font-semibold text-foreground">{t("Products")}</th>
            <th className="px-2 py-3 text-left text-xs font-semibold text-foreground">{t("Paid")}</th>
            <th className="px-2 py-3 text-left text-xs font-semibold text-foreground">{t("Ship Price")}</th>
            <th className="px-2 py-3 text-left text-xs font-semibold text-foreground">{t("Currency")}</th>
            <th className="px-2 py-3 text-left text-xs font-semibold text-foreground">{t("Note")}</th>
            <th className="px-2 py-3 text-left text-xs font-semibold text-foreground">{t("Actions")}</th>
          </tr>
        </thead>
        <tbody>
          {filteredShipping.map((record) => (
            <tr key={record.id} className="border-b border-border hover:bg-muted/50 transition-colors">
              {editingId === record.id ? (
                <>
                  <td className="px-2 py-3">
                    <select
                      value={editValues.type || ""}
                      onChange={(e) => setEditValues({ ...editValues, type: e.target.value })}
                      className="w-full px-2 py-1 bg-input text-foreground text-xs rounded"
                    >
                      <option value="input load">{t("Input Load")}</option>
                      <option value="output load">{t("Output Load")}</option>
                      <option value="comming">{t("Coming")}</option>
                    </select>
                  </td>
                  <td className="px-2 py-3">
                    <div className="flex gap-1 items-center">
                      <input
                        type="datetime-local"
                        value={editValues.shipping_date || ""}
                        onChange={(e) => setEditValues({ ...editValues, shipping_date: e.target.value })}
                        disabled={confirmedShippingDate}
                        className={`flex-1 px-2 py-1 bg-input text-foreground text-xs rounded ${
                          confirmedShippingDate ? 'opacity-60 cursor-not-allowed' : ''
                        }`}
                      />
                      {!confirmedShippingDate ? (
                        <button
                          onClick={() => setConfirmedShippingDate(true)}
                          disabled={!editValues.shipping_date}
                          className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                          title={t("Confirm")}
                        >
                          ✓
                        </button>
                      ) : (
                        <button
                          onClick={() => setConfirmedShippingDate(false)}
                          className="px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded hover:opacity-90"
                          title={t("Edit")}
                        >
                          ✎
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-2 py-3">
                    <div className="flex gap-1 items-center">
                      <input
                        type="datetime-local"
                        value={editValues.receiving_date || ""}
                        onChange={(e) => setEditValues({ ...editValues, receiving_date: e.target.value })}
                        disabled={confirmedReceivingDate}
                        className={`flex-1 px-2 py-1 bg-input text-foreground text-xs rounded ${
                          confirmedReceivingDate ? 'opacity-60 cursor-not-allowed' : ''
                        }`}
                      />
                      {!confirmedReceivingDate ? (
                        <button
                          onClick={() => setConfirmedReceivingDate(true)}
                          disabled={!editValues.receiving_date}
                          className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                          title={t("Confirm")}
                        >
                          ✓
                        </button>
                      ) : (
                        <button
                          onClick={() => setConfirmedReceivingDate(false)}
                          className="px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded hover:opacity-90"
                          title={t("Edit")}
                        >
                          ✎
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-2 py-3">
                    <select
                      value={editValues.receiver_client_id || ""}
                      onChange={(e) => setEditValues({ ...editValues, receiver_client_id: parseInt(e.target.value) || undefined })}
                      className="w-full px-2 py-1 bg-input text-foreground text-xs rounded"
                    >
                      <option value="">{t("Select Receiver")}</option>
                      {clients.map((client) => (
                        <option key={client.id} value={client.id}>
                          {client.client_name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-2 py-3">
                    <select
                      value={editValues.sender_client_id || ""}
                      onChange={(e) => setEditValues({ ...editValues, sender_client_id: parseInt(e.target.value) || undefined })}
                      className="w-full px-2 py-1 bg-input text-foreground text-xs rounded"
                    >
                      <option value="">{t("Select Sender")}</option>
                      {clients.map((client) => (
                        <option key={client.id} value={client.id}>
                          {client.client_name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-2 py-3">
                    <div className="text-xs text-muted-foreground">
                      {record.products && record.products.length > 0
                        ? record.products.map(p =>
                            `${p.product_name || p.box_code} (${p.number_of_boxes} boxes${p.total_pices ? `, ${p.total_pices} pcs` : ''})`
                          ).join("; ")
                        : "No products"
                      }
                    </div>
                  </td>
                  <td className="px-2 py-3">
                    <input
                      type="number"
                      step="0.01"
                      value={editValues.paid || ""}
                      onChange={(e) => setEditValues({ ...editValues, paid: parseFloat(e.target.value) || 0 })}
                      className="w-full px-2 py-1 bg-input text-foreground text-xs rounded"
                      placeholder="0.00"
                    />
                  </td>
                  <td className="px-2 py-3">
                    <input
                      type="number"
                      step="0.01"
                      value={editValues.ship_price || ""}
                      onChange={(e) => setEditValues({ ...editValues, ship_price: parseFloat(e.target.value) || 0 })}
                      className="w-full px-2 py-1 bg-input text-foreground text-xs rounded"
                      placeholder="0.00"
                    />
                  </td>
                  <td className="px-2 py-3">
                    <select
                      value={editValues.currency || ""}
                      onChange={(e) => setEditValues({ ...editValues, currency: e.target.value })}
                      className="w-full px-2 py-1 bg-input text-foreground text-xs rounded"
                    >
                      <option value="Dollar">Dollar</option>
                      <option value="Iraqi Dinar">Iraqi Dinar</option>
                    </select>
                  </td>
                  <td className="px-2 py-3">
                    <textarea
                      value={editValues.note || ""}
                      onChange={(e) => setEditValues({ ...editValues, note: e.target.value })}
                      rows={2}
                      className="w-full px-2 py-1 bg-input text-foreground text-xs rounded"
                      placeholder="Notes"
                    />
                  </td>
                  <td className="px-2 py-3">
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
                  <td className="px-2 py-3">
                    <span className={getShippingTypeColor(record.type)}>
                      {t(record.type === 'comming' ? 'Coming' : record.type)}
                    </span>
                  </td>
                  <td className="px-2 py-3 text-foreground text-xs">{formatDate(record.shipping_date)}</td>
                  <td className="px-2 py-3 text-foreground text-xs">{formatDate(record.receiving_date)}</td>
                  <td className="px-2 py-3 text-foreground text-xs">{record.receiver?.client_name || ""}</td>
                  <td className="px-2 py-3 text-foreground text-xs">{record.sender?.client_name || ""}</td>
                  <td className="px-2 py-3 text-foreground text-xs">
                    <div className="text-xs max-w-xs truncate">
                      {record.products && record.products.length > 0
                        ? record.products.map(p =>
                            `${p.product_name || p.box_code} (${p.number_of_boxes} boxes${p.total_pices ? `, ${p.total_pices} pcs` : ''})`
                          ).join("; ")
                        : "No products"
                      }
                    </div>
                  </td>
                  <td className="px-2 py-3 text-foreground text-xs">{record.paid ?? 0}</td>
                  <td className="px-2 py-3 text-foreground text-xs">{record.ship_price ?? 0}</td>
                  <td className="px-2 py-3 text-foreground text-xs">{record.currency || "Dollar"}</td>
                  <td className="px-2 py-3 text-foreground text-xs max-w-xs truncate">{record.note || ""}</td>
                  <td className="px-2 py-3">
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
        clients={clients}
        open={showDetailsModal}
        onOpenChange={setShowDetailsModal}
        onEdit={onUpdate}
        onDelete={onDelete}
      />
    </div>
    </>
  )
}
