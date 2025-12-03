"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useTranslation } from "react-i18next"
import "../i18n.client"

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
  total_debit?: number | null
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

interface DebitDetailsModalProps {
  debit: Debit | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DebitDetailsModal({ debit, open, onOpenChange }: DebitDetailsModalProps) {
  const { t } = useTranslation()

  if (!debit) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{t("Debit Transaction Details")}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6">
          {/* Basic Transaction Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">{t("Transaction ID")}</label>
              <p className="text-sm font-semibold">#{debit.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">{t("Amount")}</label>
              <p className="text-lg font-bold">{debit.amount.toFixed(2)} {t(debit.currency)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">{t("Currency")}</label>
              <p className="text-sm">{t(debit.currency)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">{t("Transaction Date")}</label>
              <p className="text-sm">{new Date(debit.transaction_date).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Parties Involved */}
          {debit.sender ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  {debit.total_debit && debit.total_debit < 0 ? t("Debtor") : t("Creditor")}
                </label>
                <p className="text-sm font-semibold">{debit.sender.client_name}</p>
                {debit.sender.phone_number && (
                  <p className="text-xs text-muted-foreground">{debit.sender.phone_number}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  {debit.total_debit && debit.total_debit < 0 ? t("Creditor") : t("Debtor")}
                </label>
                <p className="text-sm font-semibold">{debit.receiver.client_name}</p>
                {debit.receiver.phone_number && (
                  <p className="text-xs text-muted-foreground">{debit.receiver.phone_number}</p>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">{t("Client")}</label>
                <p className="text-sm font-semibold">{debit.receiver.client_name}</p>
                {debit.receiver.phone_number && (
                  <p className="text-xs text-muted-foreground">{debit.receiver.phone_number}</p>
                )}
              </div>
            </div>
          )}

          {/* Note */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">{t("Note")}</label>
            <div className="bg-muted p-3 rounded-lg min-h-[60px]">
              {debit.note ? (
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{debit.note}</p>
              ) : (
                <p className="text-sm text-muted-foreground italic">{t("No note")}</p>
              )}
            </div>
          </div>

          {/* Related Shipping Information */}
          {debit.shipping && (
            <div className="border-t pt-4">
              <h3 className="text-md font-semibold mb-3">{t("Related Shipping Information")}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t("Shipping ID")}</label>
                  <p className="text-sm font-semibold">#{debit.shipping.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t("Shipping Type")}</label>
                  <p className="text-sm">{t(debit.shipping.type) || debit.shipping.type}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t("Shipping Date")}</label>
                  <p className="text-sm">{new Date(debit.shipping.shipping_date).toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t("Receiver")}</label>
                  <p className="text-sm">{debit.shipping.receiver}</p>
                </div>
              </div>
              {debit.shipping.file_path && (
                <div className="mt-3">
                  <label className="text-sm font-medium text-muted-foreground">{t("File Path")}</label>
                  <p className="text-sm text-blue-600 truncate">{debit.shipping.file_path}</p>
                </div>
              )}
            </div>
          )}

          {/* Timestamps */}
          <div className="border-t pt-4 grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">{t("Created At")}</label>
              <p className="text-sm">{new Date(debit.created_at).toLocaleString()}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">{t("Transaction Date")}</label>
              <p className="text-sm">{new Date(debit.transaction_date).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
