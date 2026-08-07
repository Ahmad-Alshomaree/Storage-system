"use client"

import React from "react"
import { useTranslation } from "react-i18next"
import "../i18n.client"
import type { Product, Shipping, Client, Debit, TabType } from "@/lib/types"
import {
  Package,
  Truck,
  Users,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Warehouse,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface DashboardTabProps {
  products: Product[]
  shipping: Shipping[]
  clients: Client[]
  debits: Debit[]
  onNavigateTab: (tab: TabType) => void
  onOpenAddProduct?: () => void
  onOpenAddShipping?: () => void
  onOpenAddDebit?: () => void
}

export function DashboardTab({
  products,
  shipping,
  clients,
  debits,
  onNavigateTab,
}: DashboardTabProps) {
  const { t } = useTranslation()

  // Calculate Metrics
  const totalCost = products.reduce((acc, p) => acc + (p.total_cost || (p.cost * p.number_of_boxes) || 0), 0)
  const totalSellingValue = products.reduce((acc, p) => acc + ((p.selling_price * (p.Total_pices || (p.number_of_boxes * p.size_of_box))) || 0), 0)
  const potentialProfit = Math.max(0, totalSellingValue - totalCost)

  // Stock status counts
  const availableCount = products.filter(p => p.status === "available" || p.status === "متوفر").length
  const outOfStockCount = products.filter(p => p.status === "out_of_stock" || p.status === "غير متوفر").length
  
  // Low stock calculation: remaining pieces <= 10 or number of boxes <= 2
  const lowStockProducts = products.filter(p => {
    const totalPieces = p.Total_pices || (p.number_of_boxes * p.size_of_box)
    const remainingPieces = totalPieces - (p.extracted_pieces || 0)
    return p.status === "available" && (remainingPieces <= 10 || p.number_of_boxes <= 2)
  })

  // Debts summary by currency
  const dollarDebts = debits
    .filter(d => d.currency === "Dollar" || d.currency === "دولار" || d.currency === "USD")
    .reduce((acc, d) => acc + d.amount, 0)

  const dinarDebts = debits
    .filter(d => d.currency === "Iraqi Dinar" || d.currency === "دينار عراقي" || d.currency === "IQD")
    .reduce((acc, d) => acc + d.amount, 0)

  // Shipping type breakdown
  const inputLoadsCount = shipping.filter(s => s.type === "input_load" || s.type === "حمل دخول" || s.type === "Coming").length
  const outputLoadsCount = shipping.filter(s => s.type === "output_load" || s.type === "حمل خروج" || s.type === "Going").length

  return (
    <div className="space-y-6">
      {/* Top Executive KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Inventory Value */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">{t("Inventory Cost Value")}</span>
            <div className="p-2.5 bg-primary/10 text-primary rounded-lg">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-foreground">${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
            <p className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              {t("Est. Selling Value")}: ${totalSellingValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Card 2: Stock Health Overview */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">{t("Products & Inventory")}</span>
            <div className="p-2.5 bg-emerald-500/10 text-emerald-600 rounded-lg">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-foreground">{products.length} {t("Items")}</h3>
            <div className="flex items-center gap-3 text-xs mt-1">
              <span className="text-emerald-600 font-medium">{availableCount} {t("Available")}</span>
              {lowStockProducts.length > 0 && (
                <span className="text-amber-600 font-medium">{lowStockProducts.length} {t("Low Stock")}</span>
              )}
            </div>
          </div>
        </div>

        {/* Card 3: Shipping Summary */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">{t("Shipping Operations")}</span>
            <div className="p-2.5 bg-blue-500/10 text-blue-600 rounded-lg">
              <Truck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-foreground">{shipping.length} {t("Shipments")}</h3>
            <div className="flex items-center gap-3 text-xs mt-1">
              <span className="text-blue-600 font-medium flex items-center gap-0.5">
                <ArrowDownLeft className="w-3 h-3" /> {inputLoadsCount} {t("Input Load")}
              </span>
              <span className="text-purple-600 font-medium flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" /> {outputLoadsCount} {t("Output Load")}
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Financial Transactions & Debts */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">{t("Outstanding Debts")}</span>
            <div className="p-2.5 bg-amber-500/10 text-amber-600 rounded-lg">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-foreground">${dollarDebts.toLocaleString()}</h3>
            {dinarDebts > 0 && (
              <p className="text-xs text-muted-foreground font-medium mt-1">
                {dinarDebts.toLocaleString()} IQD
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Section: Low Stock Warning Alert & Quick Operations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Low Stock Alerts & Inventory Health */}
        <div className="lg:col-span-2 space-y-6">
          {/* Low Stock Warning Box */}
          {lowStockProducts.length > 0 ? (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-semibold">
                  <AlertTriangle className="w-5 h-5" />
                  <span>{t("Low Stock Alert")} ({lowStockProducts.length} {t("Products")})</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onNavigateTab("products")}
                  className="border-amber-500/40 hover:bg-amber-500/10 text-amber-700 dark:text-amber-300"
                >
                  {t("View Products")}
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                {lowStockProducts.slice(0, 4).map(p => {
                  const totalPieces = p.Total_pices || (p.number_of_boxes * p.size_of_box)
                  const remainingPieces = totalPieces - (p.extracted_pieces || 0)
                  return (
                    <div key={p.id} className="bg-background/80 rounded-lg p-3 border border-amber-500/20 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-sm text-foreground truncate">{p.product_name || p.box_code}</p>
                        <p className="text-xs text-muted-foreground">{t("Code")}: {p.box_code}</p>
                      </div>
                      <span className="px-2.5 py-1 text-xs font-bold bg-amber-500/20 text-amber-800 dark:text-amber-300 rounded-full">
                        {remainingPieces} {t("pcs left")}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-5 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <h4 className="font-semibold text-emerald-800 dark:text-emerald-300">{t("Inventory Health Excellent")}</h4>
                <p className="text-xs text-emerald-700 dark:text-emerald-400">{t("All available products have sufficient stock levels.")}</p>
              </div>
            </div>
          )}

          {/* Quick Navigation Cards */}
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <h3 className="text-lg font-bold text-foreground">{t("Quick Modules Navigation")}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => onNavigateTab("products")}
                className="p-4 rounded-xl border border-border bg-background hover:bg-accent/50 text-start transition-all group"
              >
                <Package className="w-6 h-6 text-primary mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold text-sm text-foreground">{t("Products")}</h4>
                <p className="text-xs text-muted-foreground">{products.length} {t("items")}</p>
              </button>

              <button
                onClick={() => onNavigateTab("shipping")}
                className="p-4 rounded-xl border border-border bg-background hover:bg-accent/50 text-start transition-all group"
              >
                <Truck className="w-6 h-6 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold text-sm text-foreground">{t("Shipping")}</h4>
                <p className="text-xs text-muted-foreground">{shipping.length} {t("records")}</p>
              </button>

              <button
                onClick={() => onNavigateTab("clients")}
                className="p-4 rounded-xl border border-border bg-background hover:bg-accent/50 text-start transition-all group"
              >
                <Users className="w-6 h-6 text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold text-sm text-foreground">{t("Clients")}</h4>
                <p className="text-xs text-muted-foreground">{clients.length} {t("clients")}</p>
              </button>

              <button
                onClick={() => onNavigateTab("debits")}
                className="p-4 rounded-xl border border-border bg-background hover:bg-accent/50 text-start transition-all group"
              >
                <CreditCard className="w-6 h-6 text-amber-600 mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold text-sm text-foreground">{t("Debits")}</h4>
                <p className="text-xs text-muted-foreground">{debits.length} {t("debits")}</p>
              </button>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Recent Activity Timeline & System Summary */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <h3 className="text-lg font-bold text-foreground">{t("Recent Activity")}</h3>
            
            <div className="space-y-3">
              {products.slice(0, 3).map(p => (
                <div key={`p-${p.id}`} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-accent/40 transition-colors border border-transparent hover:border-border">
                  <div className="p-2 bg-primary/10 text-primary rounded-lg shrink-0 mt-0.5">
                    <Package className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{p.product_name || p.box_code}</p>
                    <p className="text-[11px] text-muted-foreground">{t("Product Added")} • {p.number_of_boxes} {t("boxes")}</p>
                  </div>
                </div>
              ))}

              {shipping.slice(0, 3).map(s => (
                <div key={`s-${s.id}`} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-accent/40 transition-colors border border-transparent hover:border-border">
                  <div className="p-2 bg-blue-500/10 text-blue-600 rounded-lg shrink-0 mt-0.5">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">#{s.id} - {s.type}</p>
                    <p className="text-[11px] text-muted-foreground">{s.receiver?.client_name || t("N/A")}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
