"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useTranslation } from "react-i18next"
import "../i18n.client"

interface AddClientFormProps {
  onSuccess: (client: any) => void
}

export function AddClientForm({ onSuccess }: AddClientFormProps) {
  const [formData, setFormData] = useState({
    client_name: "",
    phone_number: "",
    shipping_id: "",
    history: "",
    debt: 0,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [shippingOptions, setShippingOptions] = useState<any[]>([])
  const { t } = useTranslation()

  useEffect(() => {
    fetchShippingOptions()
  }, [])

  const fetchShippingOptions = async () => {
    try {
      const response = await fetch("/api/shipping")
      if (response.ok) {
        const data = await response.json()
        setShippingOptions(data)
      }
    } catch (error) {
      console.error("Error fetching shipping options:", error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "debt"
        ? Number.parseFloat(value) || 0
        : name === "shipping_id"
          ? value === ""
            ? null
            : Number.parseInt(value)
          : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error(t("Failed to add client"))
      }

      const newClient = await response.json()
      setFormData({
        client_name: "",
        phone_number: "",
        shipping_id: "",
        history: "",
        debt: 0,
      })
      onSuccess(newClient)
    } catch (err) {
      setError(err instanceof Error ? err.message : t("An error occurred"))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-6 space-y-4">
      <h2 className="text-lg font-semibold text-foreground">{t("Add New Client")}</h2>

      {error && <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">{t("Client Name")} *</label>
          <input
            type="text"
            name="client_name"
            value={formData.client_name}
            onChange={handleChange}
            required
            placeholder={t("Client Name")}
            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">{t("Phone Number")}</label>
          <input
            type="text"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            placeholder={t("Phone Number")}
            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">{t("Shipping")}</label>
          <select
            name="shipping_id"
            value={formData.shipping_id}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">{t("Select Shipping (Optional)")}</option>
            {shippingOptions.map((shipping) => (
              <option key={shipping.id} value={shipping.id}>
                {t(shipping.type) || shipping.type} - {typeof shipping.receiver === 'object' && shipping.receiver !== null ? shipping.receiver.client_name : shipping.receiver}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">{t("Debt")}</label>
          <input
            type="number"
            name="debt"
            value={formData.debt}
            onChange={handleChange}
            step="0.01"
            placeholder="0.00"
            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-foreground mb-2">{t("History")}</label>
          <textarea
            name="history"
            value={formData.history}
            onChange={handleChange}
            placeholder={t("Client History")}
            rows={3}
            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={isLoading} className="gap-2">
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          {t("Add Client")}
        </Button>
      </div>
    </form>
  )
}
