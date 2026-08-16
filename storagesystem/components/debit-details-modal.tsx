"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useTranslation } from "react-i18next"
import "../i18n.client"
import type { Debit } from "@/lib/types"

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
              <label className="text-sm font-medium text-muted-foreground text-start block">{t("Transaction ID")}</label>
              <p className="text-sm font-semibold text-start">#{debit.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground text-start block">{t("Amount")}</label>
              <p className="text-lg font-bold text-start">{debit.amount.toFixed(2)} {t(debit.currency)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground text-start block">{t("Currency")}</label>
              <p className="text-sm text-start">{t(debit.currency)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground text-start block">{t("Transaction Date")}</label>
              <p className="text-sm text-start">{debit.transaction_date ? new Date(debit.transaction_date).toLocaleDateString() : t("N/A")}</p>
            </div>
          </div>

          {/* Parties Involved */}
          {debit.sender ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground text-start block">
                  {debit.total_debit && debit.total_debit < 0 ? t("Debtor") : t("Creditor")}
                </label>
                <p className="text-sm font-semibold text-start">{debit.sender.client_name}</p>
                {debit.sender.phone_number && (
                  <p className="text-xs text-muted-foreground text-start">{debit.sender.phone_number}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground text-start block">
                  {debit.total_debit && debit.total_debit < 0 ? t("Creditor") : t("Debtor")}
                </label>
                <p className="text-sm font-semibold text-start">{debit.receiver.client_name}</p>
                {debit.receiver.phone_number && (
                  <p className="text-xs text-muted-foreground text-start">{debit.receiver.phone_number}</p>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground text-start block">{t("Client")}</label>
                <p className="text-sm font-semibold text-start">{debit.receiver.client_name}</p>
                {debit.receiver.phone_number && (
                  <p className="text-xs text-muted-foreground text-start">{debit.receiver.phone_number}</p>
                )}
              </div>
            </div>
          )}

          {/* Note */}
          <div>
            <label className="text-sm font-medium text-muted-foreground text-start block">{t("Note")}</label>
            <div className="bg-muted p-3 rounded-lg min-h-[60px]">
              {debit.note ? (
                <p className="text-sm whitespace-pre-wrap leading-relaxed text-start">{debit.note}</p>
              ) : (
                <p className="text-sm text-muted-foreground italic text-start">{t("No note")}</p>
              )}
            </div>
          </div>

          {/* Related Shipping Information */}
          {debit.shipping && (
            <div className="border-t pt-4">
              <h3 className="text-md font-semibold mb-3">{t("Related Shipping Information")}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground text-start block">{t("Shipping ID")}</label>
                  <p className="text-sm font-semibold text-start">#{debit.shipping.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground text-start block">{t("Shipping Type")}</label>
                  <p className="text-sm text-start">{t(debit.shipping.type) || debit.shipping.type}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground text-start block">{t("Shipping Date")}</label>
                  <p className="text-sm text-start">{new Date(debit.shipping.shipping_date).toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground text-start block">{t("Receiver")}</label>
                  <p className="text-sm text-start">{debit.shipping.receiver?.client_name}</p>
                </div>
              </div>
              {debit.shipping.file_path && (
                <div className="mt-3">
                  <label className="text-sm font-medium text-muted-foreground text-start block">{t("File Path")}</label>
                  <p className="text-sm text-blue-600 truncate text-start">{debit.shipping.file_path}</p>
                </div>
              )}
            </div>
          )}

          {/* Timestamps */}
          <div className="border-t pt-4 grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground text-start block">{t("Created At")}</label>
              <p className="text-sm text-start">{new Date(debit.created_at).toLocaleString()}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground text-start block">{t("Transaction Date")}</label>
              <p className="text-sm text-start">{debit.transaction_date ? new Date(debit.transaction_date).toLocaleString() : t("N/A")}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
