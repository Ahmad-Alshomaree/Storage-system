"use client"

import React, { useState, useEffect } from "react"
import { Edit2, Trash2, Download, Check, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next"
import "../i18n.client"

interface Client {
  id: number
  client_name: string
  phone_number?: string | null
}

interface ShippingTableClient {
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
  clients?: ShippingTableClient[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit?: (id: number, updates: Partial<Shipping>) => void
  onDelete?: (id: number) => void
}

export function ShippingDetailsModal({ shipping, clients: propClients = [], open, onOpenChange, onEdit, onDelete }: ShippingDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValues, setEditValues] = useState<Partial<Shipping>>({})
  const [clients, setClients] = useState<Client[]>(propClients)
  const [loadingClients, setLoadingClients] = useState(propClients.length === 0)
  const [confirmedShippingDate, setConfirmedShippingDate] = useState(false)
  const [confirmedReceivingDate, setConfirmedReceivingDate] = useState(false)
  const { t } = useTranslation()

  // Update clients when prop changes
  useEffect(() => {
    if (propClients.length > 0) {
      setClients(propClients)
      setLoadingClients(false)
    }
  }, [propClients])

  if (!shipping) return null

  // Helper function to convert date to date format
  // convert a stored shipping_date/receiving_date value into something the
  // `<input type="datetime-local" />` understands.  We try to be generous with
  // the accepted formats since the database just stores freeform text.
  const convertToDateInput = (dateString: string) => {
    try {
      const dt = new Date(dateString)
      if (!isNaN(dt.getTime())) {
        // slice to minutes because datetime-local inputs don't support seconds
        return dt.toISOString().slice(0, 16)
      }
      // fallback for slashes or other weird formats
      if (dateString.includes("/")) {
        const [month, day, year] = dateString.split('/')
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T00:00`
      }
      return new Date().toISOString().slice(0, 16)
    } catch {
      return new Date().toISOString().slice(0, 16)
    }
  }

  const startEdit = () => {
    setIsEditing(true)
    setEditValues({
      ...shipping,
      shipping_date: convertToDateInput(shipping.shipping_date),
      receiving_date: convertToDateInput(shipping.receiving_date),
    })
    setConfirmedShippingDate(false)
    setConfirmedReceivingDate(false)
  }

  const saveEdit = async () => {
    if (onEdit) {
      await onEdit(shipping.id, editValues)
    }
    setIsEditing(false)
    setEditValues({})
  }

  // when editing, we sometimes open the native date/time dropdown; clicking
  // outside should close it, otherwise the picker can stay open and block the
  // rest of the UI. this mirrors the behaviour in ShippingForm.
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('input[type="date"], input[type="datetime-local"], input[type="time"]')) {
        const inputs = document.querySelectorAll(
          'input[type="date"], input[type="datetime-local"], input[type="time"]',
        ) as NodeListOf<HTMLInputElement>
        inputs.forEach(input => input.blur())
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const cancelEdit = () => {
    setIsEditing(false)
    setEditValues({})
    setConfirmedShippingDate(false)
    setConfirmedReceivingDate(false)
  }

  // blur the picker after the user selects something so it doesn't stay on top
  const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValues({ ...editValues, [e.target.name]: e.target.value })
    setTimeout(() => {
      if (e.target instanceof HTMLInputElement) {
        e.target.blur()
      }
    }, 0)
  }

  const handleDelete = async () => {
    if (onDelete && confirm(t("Are you sure you want to delete this shipping record?"))) {
      await onDelete(shipping.id)
      onOpenChange(false)
    }
  }

  const handleDownload = () => {
    // Generate receipt content
    const receiptContent = `
${t("SHIPPING RECEIPT")}

${t("Shipping ID")}: #${shipping.id}
${t("Type")}: ${shipping.type}
${t("Receiver")}: ${shipping.receiver.client_name}
${t("Sender")}: ${shipping.sender.client_name}

${t("Dates")}:
- ${t("Shipping Date")}: ${new Date(shipping.shipping_date).toLocaleString()}
- ${t("Receiving Date")}: ${new Date(shipping.receiving_date).toLocaleString()}

${t("Financial Information")}:
- ${t("Currency")}: ${shipping.currency || t("Dollar")}
- ${t("Paid")}: ${shipping.paid ?? 0} ${shipping.currency || t("Dollar")}
- ${t("Ship Price")}: ${shipping.ship_price ?? 0} ${shipping.currency || t("Dollar")}

${t("Products")} (${shipping.products?.length || 0}):
${shipping.products?.map(product =>
      `- ${product.product_name || product.box_code} (${product.number_of_boxes} boxes, ${product.total_pices ?? 0} pcs)`
    ).join('\n') || t('No products')}

${t("Notes")}: ${shipping.note || t("No notes")}

${t("Generated on")}: ${new Date().toLocaleString()}
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
          <DialogTitle className="text-xl font-bold">{t("Shipping Details")}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6">
          {/* Basic Shipping Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground text-start block">{t("Shipping ID")}</label>
              <p className="text-sm font-semibold text-start">#{shipping.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground text-start block">{t("Type")}</label>
              {isEditing ? (
                <select
                  value={editValues.type || ""}
                  onChange={(e) => setEditValues({ ...editValues, type: e.target.value })}
                  className="w-full px-2 py-1 bg-input text-foreground text-sm rounded"
                >
                  <option value="input load">{t("Input Load")}</option>
                  <option value="output load">{t("Output Load")}</option>
                  <option value="comming">{t("Coming")}</option>
                </select>
              ) : (
                <p className="text-lg font-bold capitalize text-start">
                  {t(shipping.type === 'input load' ? 'Input Load' :
                    shipping.type === 'output load' ? 'Output Load' :
                      shipping.type === 'comming' || shipping.type === 'coming' ? 'Coming' :
                        shipping.type.charAt(0).toUpperCase() + shipping.type.slice(1))}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground text-start block">{t("Receiver")}</label>
              {isEditing ? (
                <select
                  value={editValues.receiver_client_id || shipping.receiver_client_id || ""}
                  onChange={(e) => setEditValues({ ...editValues, receiver_client_id: parseInt(e.target.value) })}
                  className="w-full px-2 py-1 bg-input text-foreground text-sm rounded"
                  disabled={loadingClients}
                >
                  <option value="">{t("Select Receiver")}</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.client_name}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-sm text-start">{shipping.receiver.client_name}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground text-start block">{t("Sender")}</label>
              {isEditing ? (
                <select
                  value={editValues.sender_client_id || shipping.sender_client_id || ""}
                  onChange={(e) => setEditValues({ ...editValues, sender_client_id: parseInt(e.target.value) })}
                  className="w-full px-2 py-1 bg-input text-foreground text-sm rounded"
                  disabled={loadingClients}
                >
                  <option value="">{t("Select Sender")}</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.client_name}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-sm text-start">{shipping.sender.client_name}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground text-start block">{t("Currency")}</label>
              {isEditing ? (
                <select
                  value={editValues.currency || ""}
                  onChange={(e) => setEditValues({ ...editValues, currency: e.target.value })}
                  className="w-full px-2 py-1 bg-input text-foreground text-sm rounded"
                >
                  <option value="Dollar">{t("Dollar")}</option>
                  <option value="Iraqi Dinar">{t("Iraqi Dinar")}</option>
                </select>
              ) : (
                <p className="text-sm text-start">{t(shipping.currency || "Dollar")}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground text-start block">{t("Paid")}</label>
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
                <p className="text-sm text-start">{shipping.paid ?? 0} {t(shipping.currency || "Dollar")}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground text-start block">{t("Ship Price")}</label>
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
                <p className="text-sm text-start">{shipping.ship_price ?? 0} {t(shipping.currency || "Dollar")}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground text-start block">{t("Created At")}</label>
              <p className="text-sm text-start">{new Date(shipping.created_at).toLocaleString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">{t("Note")}</label>
              {isEditing ? (
                <textarea
                  value={editValues.note || ""}
                  onChange={(e) => setEditValues({ ...editValues, note: e.target.value })}
                  rows={3}
                  className="w-full px-2 py-1 bg-input text-foreground text-sm rounded"
                  placeholder={t("Notes")}
                />
              ) : (
                <p className="text-sm">{shipping.note || t("No notes")}</p>
              )}
            </div>
          </div>

          {/* Date Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">{t("Shipping Date/Time")}</label>
              {isEditing ? (
                <div className="flex gap-2 mt-1">
                  <input
                    type="datetime-local"
                    name="shipping_date"
                    value={editValues.shipping_date || ""}
                    onChange={handleDateTimeChange}
                    disabled={confirmedShippingDate}
                    className={`flex-1 px-2 py-1 bg-input text-foreground text-sm rounded ${confirmedShippingDate ? 'opacity-60 cursor-not-allowed' : ''
                      }`}
                  />
                  {!confirmedShippingDate ? (
                    <Button
                      type="button"
                      onClick={() => setConfirmedShippingDate(true)}
                      disabled={!editValues.shipping_date}
                      variant="outline"
                      size="sm"
                      className="px-2"
                    >
                      {t("Confirm")}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={() => setConfirmedShippingDate(false)}
                      variant="outline"
                      size="sm"
                      className="px-2"
                    >
                      {t("Edit")}
                    </Button>
                  )}
                </div>
              ) : (
                <p className="text-sm font-semibold">{new Date(shipping.shipping_date).toLocaleString()}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">{t("Receiving Date/Time")}</label>
              {isEditing ? (
                <div className="flex gap-2 mt-1">
                  <input
                    type="datetime-local"
                    name="receiving_date"
                    value={editValues.receiving_date || ""}
                    onChange={handleDateTimeChange}
                    disabled={confirmedReceivingDate}
                    className={`flex-1 px-2 py-1 bg-input text-foreground text-sm rounded ${confirmedReceivingDate ? 'opacity-60 cursor-not-allowed' : ''
                      }`}
                  />
                  {!confirmedReceivingDate ? (
                    <Button
                      type="button"
                      onClick={() => setConfirmedReceivingDate(true)}
                      disabled={!editValues.receiving_date}
                      variant="outline"
                      size="sm"
                      className="px-2"
                    >
                      {t("Confirm")}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={() => setConfirmedReceivingDate(false)}
                      variant="outline"
                      size="sm"
                      className="px-2"
                    >
                      {t("Edit")}
                    </Button>
                  )}
                </div>
              ) : (
                <p className="text-sm font-semibold">{new Date(shipping.receiving_date).toLocaleString()}</p>
              )}
            </div>
          </div>

          {/* File Path - if exists */}
          {shipping.file_path && (
            <div className="border-t pt-4">
              <label className="text-sm font-medium text-muted-foreground block mb-2">{t("Attached Document")}</label>
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm text-blue-600 break-all">{shipping.file_path}</p>
              </div>
            </div>
          )}

          {/* Products Information */}
          {shipping.products && shipping.products.length > 0 && (
            <div className="border-t pt-4">
              <label className="text-sm font-medium text-muted-foreground block mb-3">{t("Products in Shipment")} ({shipping.products.length})</label>
              <div className="space-y-3">
                {shipping.products.map((product) => (
                  <div key={product.id} className="bg-muted p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">{t("Product Name")}</label>
                        <p className="text-sm font-medium">{product.product_name || product.box_code}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">{t("Box Code")}</label>
                        <p className="text-sm">{product.box_code}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-2">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">{t("Currency")}</label>
                        <p className="text-sm">{t(product.currency || "Dollar")}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">{t("Number of boxes")}</label>
                        <p className="text-sm font-bold">{product.number_of_boxes}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">{t("Total Pieces")}</label>
                        <p className="text-sm font-bold">{product.total_pices ?? 0}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-3">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">{t("Cost")}</label>
                        <p className="text-sm font-bold">{(product.cost).toFixed(2)}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">{t("Total Cost")}</label>
                        <p className="text-sm font-bold">{(product.total_cost ?? 0).toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 mt-3">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">{t("Selling Price")}</label>
                        <p className="text-sm font-bold">{product.selling_price.toFixed(2)}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">{t("Size of Box")}</label>
                        <p className="text-sm font-bold">{product.size_of_box}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">{t("Total Box Size")}</label>
                        <p className="text-sm font-bold">{product.total_box_size}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">{t("Weight")}</label>
                        <p className="text-sm font-bold">{product.weight ?? 0}</p>
                      </div>
                    </div>

                    {product.note && (
                      <div className="mt-3">
                        <label className="text-xs font-medium text-muted-foreground">{t("Note")}</label>
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
            <label className="text-sm font-medium text-muted-foreground block mb-2">{t("Shipping Summary")}</label>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm">
                <span className="font-medium">{t("Type")}:</span> {t(shipping.type) || shipping.type} •
                <span className="font-medium"> {t("Receiver")}:</span> {shipping.receiver.client_name} •
                <span className="font-medium"> {t("Duration")}:</span> {Math.ceil((new Date(shipping.receiving_date).getTime() - new Date(shipping.shipping_date).getTime()) / (1000 * 60 * 60 * 24))} {t("days")} •
                <span className="font-medium"> {t("Products")}:</span> {shipping.products?.length || 0}
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
            {isEditing ? t("Save") : t("Edit")}
          </Button>
          {isEditing ? (
            <Button
              variant="outline"
              size="sm"
              onClick={cancelEdit}
              className="flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              {t("Cancel")}
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
                {t("Delete")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                {t("Text Receipt")}
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  import("@/lib/export-utils").then(mod => {
                    mod.printShippingReceipt(shipping)
                  })
                }}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Download className="w-4 h-4" />
                {t("Print PDF")}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
