"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useTranslation } from "react-i18next"
import type { Client } from "@/lib/types"
import "../i18n.client"

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
              <label className="text-sm font-medium text-muted-foreground text-start block">{t("Client ID")}</label>
              <p className="text-sm font-semibold text-start">#{client.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground text-start block">{t("Client Name")}</label>
              <p className="text-lg font-bold text-start">{client.client_name}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground text-start block">{t("Phone Number")}</label>
              <p className="text-sm text-start">{client.phone_number || t("N/A")}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground text-start block">{t("Shipping ID")}</label>
              <p className="text-sm text-start">{client.shipping_id || t("None")}</p>
            </div>
          </div>

          {/* Financial Information - Total Debts only */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground text-start block">{t("Total Debts")}</label>
              <p className={`text-sm font-bold text-start ${(client.total_debts ?? 0) >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                ${(client.total_debts ?? 0).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Client History - Prominently displayed */}
          <div className="border-t pt-4">
            <label className="text-sm font-medium text-muted-foreground block mb-2 text-start">{t("Client History")}</label>
            <div className="bg-muted p-4 rounded-lg min-h-[100px]">
              {client.history ? (
                <p className="text-sm whitespace-pre-wrap leading-relaxed text-start">{client.history}</p>
              ) : (
                <p className="text-sm text-muted-foreground italic text-start">{t("No history recorded")}</p>
              )}
            </div>
          </div>

          {/* Shipping Information */}
          {client.shipping && (
            <div className="border-t pt-4">
              <h3 className="text-md font-semibold mb-3">{t("Related Shipping Information")}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground text-start block">{t("Shipping Type")}</label>
                  <p className="text-sm text-start">{t(client.shipping.type) || client.shipping.type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground text-start block">{t("Receiver")}</label>
                  <p className="text-sm text-start">{client.shipping.receiver}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground text-start block">{t("Shipping Date")}</label>
                  <p className="text-sm text-start">{new Date(client.shipping.shipping_date).toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground text-start block">{t("Receiving Date")}</label>
                  <p className="text-sm text-start">{new Date(client.shipping.receiving_date).toLocaleString()}</p>
                </div>
              </div>
              {client.shipping.file_path && (
                <div className="mt-3">
                  <label className="text-sm font-medium text-muted-foreground text-start block">{t("File Path")}</label>
                  <p className="text-sm text-blue-600 truncate text-start">{client.shipping.file_path}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
