"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ShippingTable } from "@/components/shipping-table"
import { ShippingForm } from "@/components/shipping-form"
import type { Shipping } from "@/lib/types"

interface ShippingTabProps {
  shipping: Shipping[]
  isLoading: boolean
  refetch: () => void
}

export function ShippingTab({ shipping, isLoading, refetch }: ShippingTabProps) {
  const [showShippingForm, setShowShippingForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const handleDeleteShipping = async (id: number) => {
    await fetch(`/api/shipping/${id}`, { method: "DELETE" })
    refetch()
  }

  const handleUpdateShipping = async (id: number, updates: Partial<Shipping>) => {
    await fetch(`/api/shipping/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    })
    refetch()
  }

  const filteredShipping = shipping.filter((record) =>
    record.receiver.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <input
          type="text"
          placeholder="Search by receiver..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <Button onClick={() => setShowShippingForm(!showShippingForm)} className="gap-2 w-full md:w-auto">
          <Plus className="w-4 h-4" />
          {showShippingForm ? "Cancel" : "Add Shipping"}
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
            No shipping records found. Start by adding a shipping record!
          </p>
        </div>
      ) : (
        <ShippingTable
          shipping={filteredShipping}
          onDelete={handleDeleteShipping}
          onUpdate={handleUpdateShipping}
        />
      )}
    </>
  )
}
