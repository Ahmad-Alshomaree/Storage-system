"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { SetupPage } from "@/components/setup-page"
import { DashboardTab } from "@/components/DashboardTab"
import { ProductsTab } from "@/components/ProductsTab"
import { ShippingTab } from "@/components/ShippingTab"
import { ClientsTab } from "@/components/ClientsTab"
import { DebitsTab } from "@/components/DebitsTab"
import { GlobalSearchModal } from "@/components/global-search-modal"
import { LayoutDashboard, Package, Truck, Users, CreditCard } from "lucide-react"
import { useAppData } from "@/lib/useAppData"
import type { TabType } from "@/lib/types"
import { useTranslation } from "react-i18next"
import "../i18n.client"

import { tauriApi } from "@/lib/tauri-api"

export default function Home() {
  const { products, shipping, clients, debits, isLoading, error, refetch } = useAppData()
  const [activeTab, setActiveTab] = useState<TabType>("dashboard")
  const [setupCompleted, setSetupCompleted] = useState<boolean | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const { t } = useTranslation()

  // Check if setup is completed on mount
  useEffect(() => {
    let mounted = true
    tauriApi.checkSetupStatus().then((isReady) => {
      if (mounted) {
        setSetupCompleted(isReady)
      }
    }).catch(() => {
      if (mounted) {
        setSetupCompleted(false)
      }
    })
    return () => {
      mounted = false
    }
  }, [])

  // Listen for Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setSearchOpen(prev => !prev)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handleSetupComplete = () => {
    setSetupCompleted(true)
    refetch()
  }

  const handleSelectSearchEntity = (tab: TabType, id: number) => {
    setActiveTab(tab)
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
        <Header onOpenSearch={() => setSearchOpen(true)} />
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
      <Header onOpenSearch={() => setSearchOpen(true)} />

      <main className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground text-balance">{t("Product Storage System")}</h1>
          <p className="text-muted-foreground mt-1">{t("Manage products, shipping, clients, and financial records efficiently")}</p>
        </div>

        <div className="mb-6 flex gap-2 border-b border-border overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-4 py-2 font-medium transition-colors flex items-center whitespace-nowrap ${
              activeTab === "dashboard"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <LayoutDashboard className="inline w-4 h-4 me-2" />
            {t("Dashboard")}
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`px-4 py-2 font-medium transition-colors flex items-center whitespace-nowrap ${
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
            className={`px-4 py-2 font-medium transition-colors flex items-center whitespace-nowrap ${
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
            className={`px-4 py-2 font-medium transition-colors flex items-center whitespace-nowrap ${
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
            className={`px-4 py-2 font-medium transition-colors flex items-center whitespace-nowrap ${
              activeTab === "debits"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <CreditCard className="inline w-4 h-4 me-2" />
            {t("Debit")}
          </button>
        </div>

        {activeTab === "dashboard" && (
          <DashboardTab
            products={products}
            shipping={shipping}
            clients={clients}
            debits={debits}
            onNavigateTab={setActiveTab}
          />
        )}

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

        <GlobalSearchModal
          open={searchOpen}
          onOpenChange={setSearchOpen}
          products={products}
          shipping={shipping}
          clients={clients}
          debits={debits}
          onSelectEntity={handleSelectSearchEntity}
        />
      </main>
    </div>
  )
}
