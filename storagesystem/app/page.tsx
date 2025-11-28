"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { ProductsTab } from "@/components/ProductsTab"
import { ShippingTab } from "@/components/ShippingTab"
import { ClientsTab } from "@/components/ClientsTab"
import { DebitsTab } from "@/components/DebitsTab"
import { Package, Truck, Users, CreditCard } from "lucide-react"
import { useAppData } from "@/lib/useAppData"
import type { TabType } from "@/lib/types"

export default function Home() {
  const { products, shipping, clients, debits, isLoading, error, refetch } = useAppData()
  const [activeTab, setActiveTab] = useState<TabType>("products")

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto py-8 px-4">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-destructive text-lg mb-4">Failed to load data</p>
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
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground text-balance">Product Storage System</h1>
            <p className="text-muted-foreground mt-1">Manage products, shipping, clients, and financial records efficiently</p>
          </div>
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
            <Package className="inline w-4 h-4 mr-2" />
            Products
          </button>
          <button
            onClick={() => setActiveTab("shipping")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "shipping"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Truck className="inline w-4 h-4 mr-2" />
            Shipping
          </button>
          <button
            onClick={() => setActiveTab("clients")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "clients"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="inline w-4 h-4 mr-2" />
            Clients
          </button>
          <button
            onClick={() => setActiveTab("debits")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "debits"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <CreditCard className="inline w-4 h-4 mr-2" />
            Debit
          </button>
        </div>

        {activeTab === "products" && (
          <ProductsTab products={products} isLoading={isLoading} refetch={refetch} />
        )}

        {activeTab === "shipping" && (
          <ShippingTab shipping={shipping} isLoading={isLoading} refetch={refetch} />
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
