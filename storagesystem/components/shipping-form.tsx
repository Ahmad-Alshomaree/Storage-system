"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface ShippingFormProps {
  onSuccess: (shipping: any) => void
}

export function ShippingForm({ onSuccess }: ShippingFormProps) {
  const [formData, setFormData] = useState({
    type: "input load",
    shipping_date: "",
    receiver: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/shipping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to create shipping record")
      }

      const newShipping = await response.json()
      setFormData({
        type: "input load",
        shipping_date: "",
        receiver: "",
      })
      onSuccess(newShipping)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-6 space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Add Shipping Record</h2>

      {error && <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Shipping Type *</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="input load">Input Load</option>
            <option value="output load">Output Load</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Shipping Date *</label>
          <input
            type="datetime-local"
            name="shipping_date"
            value={formData.shipping_date}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Receiver *</label>
          <input
            type="text"
            name="receiver"
            value={formData.receiver}
            onChange={handleChange}
            required
            placeholder="Receiver name or location"
            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={isLoading} className="gap-2">
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          Create Shipping Record
        </Button>
      </div>
    </form>
  )
}
