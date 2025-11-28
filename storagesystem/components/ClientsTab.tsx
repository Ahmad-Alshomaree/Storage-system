"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ClientTable } from "@/components/client-table"
import { AddClientForm } from "@/components/add-client-form"
import type { Client } from "@/lib/types"

interface ClientsTabProps {
  clients: Client[]
  isLoading: boolean
  refetch: () => void
}

export function ClientsTab({ clients, isLoading, refetch }: ClientsTabProps) {
  const [showClientForm, setShowClientForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const handleDeleteClient = async (id: number) => {
    await fetch(`/api/clients/${id}`, { method: "DELETE" })
    refetch()
  }

  const handleUpdateClient = async (id: number, updates: Partial<Client>) => {
    await fetch(`/api/clients/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    })
    refetch()
  }

  const filteredClients = clients.filter((client) =>
    client.client_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <input
          type="text"
          placeholder="Search by client name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <Button onClick={() => setShowClientForm(!showClientForm)} className="gap-2 w-full md:w-auto">
          <Plus className="w-4 h-4" />
          {showClientForm ? "Cancel" : "Add Client"}
        </Button>
      </div>

      {showClientForm && (
        <div className="mb-8">
          <AddClientForm
            onSuccess={() => {
              setShowClientForm(false)
              refetch()
            }}
          />
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            No clients found. Start by adding a client record!
          </p>
        </div>
      ) : (
        <ClientTable
          clients={filteredClients}
          onDelete={handleDeleteClient}
          onUpdate={handleUpdateClient}
        />
      )}
    </>
  )
}
