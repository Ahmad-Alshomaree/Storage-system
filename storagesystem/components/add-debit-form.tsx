"use client"

import React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useTranslation } from "react-i18next"
import "../i18n.client"

interface Client {
  id: number
  client_name: string
  phone_number?: string | null
}

interface Shipping {
  id: number
  type: string
  receiver: {
    id: number
    client_name: string
    phone_number?: string | null
    shipping_id?: number | null
    history?: string | null
  }
  shipping_date: string
}

interface AddDebitFormProps {
  onSuccess: (debit: any) => void
}

export function AddDebitForm({ onSuccess }: AddDebitFormProps) {
  const [formData, setFormData] = useState({
    sender_id: "",
    receiver_id: "",
    shipping_id: "",
    amount: 0,
    currency: "Dollar",
    note: "",
    transaction_date: new Date().toISOString().split('T')[0], // Today's date
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [clients, setClients] = useState<Client[]>([])
  const [shipping, setShipping] = useState<Shipping[]>([])
  const [confirmedTransactionDate, setConfirmedTransactionDate] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    fetchClients()
    fetchShipping()
  }, [])

  const fetchClients = async () => {
    try {
      const response = await fetch("/api/clients")
      if (response.ok) {
        const data = await response.json()
        setClients(data)
      }
    } catch (error) {
      console.error("Error fetching clients:", error)
    }
  }

  const fetchShipping = async () => {
    try {
      const response = await fetch("/api/shipping")
      if (response.ok) {
        const data = await response.json()
        setShipping(data)
      }
    } catch (error) {
      console.error("Error fetching shipping:", error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount"
        ? Number.parseFloat(value) || 0
        : name === "sender_id" || name === "receiver_id" || name === "shipping_id"
          ? Number.parseInt(value) || ""
          : value,
    }))
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e)
    // Force close date picker immediately after selection
    setTimeout(() => e.target.blur(), 0)
  }

  // Close date picker when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      // If clicking outside any input, blur all date inputs to close pickers
      if (!target.closest('input[type="date"]')) {
        const dateInputs = document.querySelectorAll('input[type="date"]') as NodeListOf<HTMLInputElement>
        dateInputs.forEach(input => input.blur())
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (!formData.receiver_id) {
      setError(t("Please select a creditor"))
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/debits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error(t("Failed to add debit"))
      }

      const newDebit = await response.json()
      setFormData({
        sender_id: "",
        receiver_id: "",
        shipping_id: "",
        amount: 0,
        currency: "Dollar",
        note: "",
        transaction_date: new Date().toISOString().split('T')[0],
      })
      setConfirmedTransactionDate(false)
      onSuccess(newDebit)
    } catch (err) {
      setError(err instanceof Error ? err.message : t("An error occurred"))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-6 space-y-4">
      <h2 className="text-lg font-semibold text-foreground">{t("Add New Transaction")}</h2>

      {error && <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2 text-start">{t("Debtor")}</label>
          <select
            name="sender_id"
            value={formData.sender_id}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">{t("Select Debtor")} ({t("Optional")})</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.client_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2 text-start">{t("Creditor")} *</label>
          <select
            name="receiver_id"
            value={formData.receiver_id}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">{t("Select Creditor")}</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.client_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2 text-start">{t("Shipping")}</label>
          <select
            name="shipping_id"
            value={formData.shipping_id}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">{t("Select Shipping (Optional)")}</option>
            {shipping.map((ship) => (
              <option key={ship.id} value={ship.id}>
                {ship.type} - {ship.receiver.client_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2 text-start">{t("Amount")} *</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            step="0.01"
            min="0"
            required
            placeholder="0.00"
            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2 text-start">{t("Currency")}</label>
          <input
            type="text"
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            placeholder={t("Dollar")}
            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2 text-start">{t("Transaction Date")} ({t("Optional")})</label>
          <div className="flex gap-2">
            <input
              type="date"
              name="transaction_date"
              value={formData.transaction_date}
              onChange={handleDateChange}
              disabled={confirmedTransactionDate}
              className={`flex-1 px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${confirmedTransactionDate ? 'opacity-60 cursor-not-allowed' : ''
                }`}
            />
            {!confirmedTransactionDate ? (
              <Button
                type="button"
                onClick={() => {
                  if (formData.transaction_date) {
                    setConfirmedTransactionDate(true)
                  }
                }}
                disabled={!formData.transaction_date}
                variant="outline"
                className="px-4"
              >
                {t("Confirm")}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={() => setConfirmedTransactionDate(false)}
                variant="outline"
                className="px-4"
              >
                {t("Edit")}
              </Button>
            )}
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-foreground mb-2 text-start">{t("Note")}</label>
          <textarea
            name="note"
            value={formData.note}
            onChange={handleChange}
            placeholder={t("Enter transaction note")}
            rows={3}
            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={isLoading} className="gap-2">
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          {t("Add Transaction")}
        </Button>
      </div>
    </form>
  )
}
