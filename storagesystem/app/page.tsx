"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { SetupPage } from "@/components/setup-page"
import { ProductsTab } from "@/components/ProductsTab"
import { ShippingTab } from "@/components/ShippingTab"
import { ClientsTab } from "@/components/ClientsTab"
import { DebitsTab } from "@/components/DebitsTab"
import { Package, Truck, Users, CreditCard, Warehouse } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppData } from "@/lib/useAppData"
import type { TabType } from "@/lib/types"
import { useTranslation } from "react-i18next"
import "../i18n.client"

// HomeContent no longer needs to be wrapped in LanguageProvider here because it's in layout.tsx
export default function Home() {
  const { products, shipping, clients, debits, isLoading, error, refetch } = useAppData()
  const [activeTab, setActiveTab] = useState<TabType>("products")
  const [setupCompleted, setSetupCompleted] = useState<boolean | null>(null)
  const { t } = useTranslation()

  // Check if setup is completed on mount
  useEffect(() => {
    const isSetupCompleted = localStorage.getItem("setupCompleted") === "true"
    console.log("Setup check - setupCompleted:", localStorage.getItem("setupCompleted"), "isSetupCompleted:", isSetupCompleted)
    // TEMPORARY: Force setup as completed for testing
    setSetupCompleted(true)
  }, [])

  const handleSetupComplete = () => {
    setSetupCompleted(true)
  }

  // Show loading while checking setup status
  if (setupCompleted === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">{t("Loading...")}</p>
        </div>
      </div>
    )
  }

  // Show setup page if not completed
  if (!setupCompleted) {
    return <SetupPage onComplete={handleSetupComplete} />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto py-8 px-4">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-destructive text-lg mb-4">{t("Failed to load data")}</p>
              <p className="text-muted-foreground">{error}</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground text-balance">{t("Product Storage System")}</h1>
          <p className="text-muted-foreground mt-1">{t("Manage products, shipping, clients, and financial records efficiently")}</p>
        </div>

        <div className="mb-6 flex gap-2 border-b border-border">
          <button
            onClick={() => setActiveTab("products")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "products"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Package className="inline w-4 h-4 me-2" />
            {t("Products")}
          </button>
          <button
            onClick={() => setActiveTab("shipping")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "shipping"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Truck className="inline w-4 h-4 me-2" />
            {t("Shipping")}
          </button>
          <button
            onClick={() => setActiveTab("clients")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "clients"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="inline w-4 h-4 me-2" />
            {t("Clients")}
          </button>
          <button
            onClick={() => setActiveTab("debits")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "debits"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <CreditCard className="inline w-4 h-4 me-2" />
            {t("Debit")}
          </button>
        </div>

        {activeTab === "products" && (
          <ProductsTab products={products} isLoading={isLoading} refetch={refetch} />
        )}

        {activeTab === "shipping" && (
          <ShippingTab shipping={shipping} clients={clients} isLoading={isLoading} refetch={refetch} />
        )}

        {activeTab === "clients" && (
          <ClientsTab clients={clients} isLoading={isLoading} refetch={refetch} />
        )}

        {activeTab === "debits" && (
          <DebitsTab debits={debits} isLoading={isLoading} refetch={refetch} />
        )}
      </main>
    </div>
  )
}
