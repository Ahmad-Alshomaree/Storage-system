"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useTranslation } from "react-i18next"
import "../i18n.client"

interface Client {
  id: number
  client_name: string
  phone_number?: string | null
  shipping_id?: number | null
  history?: string | null
  total_debts: number
  shipping?: {
    id: number
    type: string
    shipping_date: string
    receiving_date: string
    receiver: string
    file_path?: string | null
    created_at: string
  }
}

interface ClientDetailsModalProps {
  client: Client | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ClientDetailsModal({ client, open, onOpenChange }: ClientDetailsModalProps) {
  const { t } = useTranslation()

  if (!client) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{t("Client Details")}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6">
          {/* Basic Client Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">{t("Client ID")}</label>
              <p className="text-sm font-semibold">#{client.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">{t("Client Name")}</label>
              <p className="text-lg font-bold">{client.client_name}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">{t("Phone Number")}</label>
              <p className="text-sm">{client.phone_number || t("N/A")}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">{t("Shipping ID")}</label>
              <p className="text-sm">{client.shipping_id || t("None")}</p>
            </div>
          </div>

          {/* Financial Information - Total Debts only */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">{t("Total Debts")}</label>
              <p className={`text-sm font-bold ${(client.total_debts ?? 0) >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                ${(client.total_debts ?? 0).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Client History - Prominently displayed */}
          <div className="border-t pt-4">
            <label className="text-sm font-medium text-muted-foreground block mb-2">{t("Client History")}</label>
            <div className="bg-muted p-4 rounded-lg min-h-[100px]">
              {client.history ? (
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{client.history}</p>
              ) : (
                <p className="text-sm text-muted-foreground italic">{t("No history recorded")}</p>
              )}
            </div>
          </div>

          {/* Shipping Information */}
          {client.shipping && (
            <div className="border-t pt-4">
              <h3 className="text-md font-semibold mb-3">{t("Related Shipping Information")}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t("Shipping Type")}</label>
                  <p className="text-sm">{t(client.shipping.type) || client.shipping.type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t("Receiver")}</label>
                  <p className="text-sm">{client.shipping.receiver}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t("Shipping Date")}</label>
                  <p className="text-sm">{new Date(client.shipping.shipping_date).toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t("Receiving Date")}</label>
                  <p className="text-sm">{new Date(client.shipping.receiving_date).toLocaleString()}</p>
                </div>
              </div>
              {client.shipping.file_path && (
                <div className="mt-3">
                  <label className="text-sm font-medium text-muted-foreground">{t("File Path")}</label>
                  <p className="text-sm text-blue-600 truncate">{client.shipping.file_path}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
