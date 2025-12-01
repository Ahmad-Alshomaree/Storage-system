"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { useAppData } from "@/lib/useAppData"
import type { Product } from "@/lib/types"
import { useTranslation } from "react-i18next"
import "../../i18n.client"

export default function StorePage() {
  const { storeProducts, isLoading, error } = useAppData()
  const { t } = useTranslation()

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
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground text-balance">{t("Store Overview")}</h1>
            <p className="text-muted-foreground mt-1">{t("View your available products in storage")}</p>
          </div>
          <Link href="/" passHref>
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              {t("Back to Management")}
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : storeProducts.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg mb-2">{t("No products available in storage")}</p>
            <p className="text-sm text-muted-foreground">{t("Products with 'Available' status will appear here")}</p>
            <Link href="/" passHref>
              <Button className="mt-4">{t("Go to Product Management")}</Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto border border-border rounded-lg">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">{t("Product Name")}</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">{t("Number of Items")}</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">{t("Individual Selling Price")}</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">{t("Group Item Price")}</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">{t("Entered At")}</th>
                </tr>
              </thead>
              <tbody>
                {storeProducts.map((product) => (
                  <tr key={product.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground text-xs">{product.product_name}</td>
                    <td className="px-4 py-3 text-foreground text-xs">{product.number_of_items}</td>
                    <td className="px-4 py-3 text-foreground text-xs">{product.individual_item_selling_price.toFixed(2)}</td>
                    <td className="px-4 py-3 text-foreground text-xs">{product.group_item_price?.toFixed(2) || t('N/A')}</td>
                    <td className="px-4 py-3 text-foreground text-xs">{new Date(product.entered_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
