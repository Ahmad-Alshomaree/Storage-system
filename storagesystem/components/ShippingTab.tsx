"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ShippingTable, ShippingTableClient } from "@/components/shipping-table"

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
  products?: any[]
}
import { ShippingForm } from "@/components/shipping-form"
import { tauriApi } from "@/lib/tauri-api"
import { useTranslation } from "react-i18next"
import "../i18n.client"

interface Client {
  id: number
  client_name: string
  phone_number?: string | null
  shipping_id?: number | null
  history?: string | null
  debt: number
  total_debts: number
}

interface ShippingTabProps {
  shipping: Shipping[]
  clients: Client[]
  isLoading: boolean
  refetch: () => void
}

export function ShippingTab({ shipping, clients, isLoading, refetch }: ShippingTabProps) {
  const [showShippingForm, setShowShippingForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const { t } = useTranslation()

  const handleDeleteShipping = async (id: number) => {
    if (confirm(t("Are you sure you want to delete this shipping record?"))) {
      await tauriApi.deleteShipping(id)
      refetch()
    }
  }

  const handleUpdateShipping = async (id: number, updates: Partial<Shipping>) => {
    await tauriApi.updateShipping(id, updates)
    refetch()
  }

  const filteredShipping = shipping.filter((record) =>
    (record.receiver?.client_name || "").toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <input
          type="text"
          placeholder={t("Search by receiver...")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <Button onClick={() => setShowShippingForm(!showShippingForm)} className="gap-2 w-full md:w-auto">
          <Plus className="w-4 h-4" />
          {showShippingForm ? t("Cancel") : t("Add Shipping")}
        </Button>
      </div>

      {showShippingForm && (
        <div className="mb-8">
          <ShippingForm
            onSuccess={() => {
              setShowShippingForm(false)
              refetch()
            }}
          />
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : filteredShipping.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            {t("No shipping records found. Start by adding a shipping record!")}
          </p>
        </div>
      ) : (
        <ShippingTable
          shipping={filteredShipping}
          clients={clients}
          onDelete={handleDeleteShipping}
          onUpdate={handleUpdateShipping}
        />
      )}
    </>
  )
}
