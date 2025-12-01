"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DebitTable } from "@/components/debit-table"
import { AddDebitForm } from "@/components/add-debit-form"
import { DebitDetailsModal } from "@/components/debit-details-modal"
import type { Debit } from "@/lib/types"
import { useTranslation } from "react-i18next"
import "../i18n.client"

interface DebitsTabProps {
  debits: Debit[]
  isLoading: boolean
  refetch: () => void
}

export function DebitsTab({ debits, isLoading, refetch }: DebitsTabProps) {
  const [showDebitForm, setShowDebitForm] = useState(false)
  const [selectedDebitForModal, setSelectedDebitForModal] = useState<Debit | null>(null)
  const { t } = useTranslation()

  // Filter out any corrupted debit records
  const validDebits = debits.filter(debit => debit && debit.receiver && debit.receiver.client_name)

  const handleDeleteDebit = async (id: number) => {
    await fetch(`/api/debits/${id}`, { method: "DELETE" })
    refetch()
  }

  const handleUpdateDebit = async (id: number, updates: Partial<Debit>) => {
    await fetch(`/api/debits/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    })
    refetch()
  }

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-end">
        <Button onClick={() => setShowDebitForm(!showDebitForm)} className="gap-2 w-full md:w-auto">
          <Plus className="w-4 h-4" />
          {showDebitForm ? t("Cancel") : t("Add Transaction")}
        </Button>
      </div>

      {showDebitForm && (
        <div className="mb-8">
          <AddDebitForm
            onSuccess={() => {
              setShowDebitForm(false)
              refetch()
            }}
          />
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : validDebits.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            {t("No financial transactions found. Start by adding a transaction!")}
          </p>
        </div>
      ) : (
        <DebitTable
          debits={validDebits}
          onDelete={handleDeleteDebit}
          onUpdate={handleUpdateDebit}
          onViewDetail={(debit) => setSelectedDebitForModal(debit)}
        />
      )}

      <DebitDetailsModal
        debit={selectedDebitForModal}
        open={!!selectedDebitForModal}
        onOpenChange={(open) => {
          if (!open) setSelectedDebitForModal(null)
        }}
      />
    </>
  )
}
