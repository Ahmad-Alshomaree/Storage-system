"use client"

import React, { useState, useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Search, Package, Truck, Users, CreditCard, ArrowRight } from "lucide-react"
import { useTranslation } from "react-i18next"
import "../i18n.client"
import type { Product, Shipping, Client, Debit, TabType } from "@/lib/types"
import { ProductImage } from "@/components/ui/product-image"

interface GlobalSearchModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  products: Product[]
  shipping: Shipping[]
  clients: Client[]
  debits: Debit[]
  onSelectEntity: (tab: TabType, id: number) => void
}

export function GlobalSearchModal({
  open,
  onOpenChange,
  products,
  shipping,
  clients,
  debits,
  onSelectEntity,
}: GlobalSearchModalProps) {
  const [query, setQuery] = useState("")
  const { t } = useTranslation()

  // Reset query on open
  useEffect(() => {
    if (open) setQuery("")
  }, [open])

  const q = query.trim().toLowerCase()

  // Filter matching entities
  const matchedProducts = q ? products.filter(p =>
    (p.product_name && p.product_name.toLowerCase().includes(q)) ||
    (p.box_code && p.box_code.toLowerCase().includes(q)) ||
    (p.product_type && p.product_type.toLowerCase().includes(q)) ||
    (p.item_no && p.item_no.toLowerCase().includes(q))
  ).slice(0, 5) : []

  const matchedShipping = q ? shipping.filter(s =>
    s.id.toString().includes(q) ||
    (s.type && s.type.toLowerCase().includes(q)) ||
    (s.receiver?.client_name && s.receiver.client_name.toLowerCase().includes(q)) ||
    (s.sender?.client_name && s.sender.client_name.toLowerCase().includes(q))
  ).slice(0, 5) : []

  const matchedClients = q ? clients.filter(c =>
    (c.client_name && c.client_name.toLowerCase().includes(q)) ||
    (c.phone_number && c.phone_number.toLowerCase().includes(q))
  ).slice(0, 5) : []

  const matchedDebits = q ? debits.filter(d =>
    d.id.toString().includes(q) ||
    (d.note && d.note.toLowerCase().includes(q)) ||
    (d.receiver?.client_name && d.receiver.client_name.toLowerCase().includes(q)) ||
    (d.sender?.client_name && d.sender.client_name.toLowerCase().includes(q))
  ).slice(0, 5) : []

  const totalResults = matchedProducts.length + matchedShipping.length + matchedClients.length + matchedDebits.length

  const handleSelect = (tab: TabType, id: number) => {
    onSelectEntity(tab, id)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-0 overflow-hidden border-border bg-card shadow-2xl">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 border-b border-border bg-background">
          <Search className="w-5 h-5 text-muted-foreground me-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("Search products, shipments, clients, or debits...")}
            className="w-full py-4 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-base"
            autoFocus
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs text-muted-foreground bg-muted border border-border rounded shadow-sm">
            ESC
          </kbd>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {!q && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              <p>{t("Type to start searching across your entire storage database.")}</p>
            </div>
          )}

          {q && totalResults === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              <p>{t("No results found for")} &quot;{query}&quot;</p>
            </div>
          )}

          {/* Products Category */}
          {matchedProducts.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-primary" />
                {t("Products")}
              </h4>
              <div className="space-y-1">
                {matchedProducts.map(p => (
                  <button
                    key={`prod-${p.id}`}
                    onClick={() => handleSelect("products", p.id)}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-accent/60 text-start group transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-md overflow-hidden border border-border bg-muted shrink-0">
                        <ProductImage
                          src={p.image}
                          alt={p.product_name || "Product"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{p.product_name || p.box_code}</p>
                        <p className="text-xs text-muted-foreground">{t("Code")}: {p.box_code} • {p.number_of_boxes} {t("boxes")}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Shipping Category */}
          {matchedShipping.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-blue-600" />
                {t("Shipping")}
              </h4>
              <div className="space-y-1">
                {matchedShipping.map(s => (
                  <button
                    key={`ship-${s.id}`}
                    onClick={() => handleSelect("shipping", s.id)}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-accent/60 text-start group transition-colors"
                  >
                    <div>
                      <p className="text-sm font-semibold text-foreground">#{s.id} - {s.type}</p>
                      <p className="text-xs text-muted-foreground">{t("Receiver")}: {s.receiver?.client_name || t("N/A")}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Clients Category */}
          {matchedClients.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-emerald-600" />
                {t("Clients")}
              </h4>
              <div className="space-y-1">
                {matchedClients.map(c => (
                  <button
                    key={`cli-${c.id}`}
                    onClick={() => handleSelect("clients", c.id)}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-accent/60 text-start group transition-colors"
                  >
                    <div>
                      <p className="text-sm font-semibold text-foreground">{c.client_name}</p>
                      {c.phone_number && <p className="text-xs text-muted-foreground">{c.phone_number}</p>}
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Debits Category */}
          {matchedDebits.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-amber-600" />
                {t("Debits")}
              </h4>
              <div className="space-y-1">
                {matchedDebits.map(d => (
                  <button
                    key={`deb-${d.id}`}
                    onClick={() => handleSelect("debits", d.id)}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-accent/60 text-start group transition-colors"
                  >
                    <div>
                      <p className="text-sm font-semibold text-foreground">#{d.id} - ${d.amount} ({d.currency})</p>
                      <p className="text-xs text-muted-foreground">{d.receiver?.client_name || t("N/A")}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
