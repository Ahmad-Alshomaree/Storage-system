"use client"

import { useState } from "react"
import { Plus, Upload as UploadIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductTable } from "@/components/product-table"
import { AddProductForm } from "@/components/add-product-form"
import { UploadExcelForm } from "@/components/upload-excel-form"
import type { Product } from "@/lib/types"
import { useTranslation } from "react-i18next"
import "../i18n.client"

interface ProductsTabProps {
  products: Product[]
  isLoading: boolean
  refetch: () => void
}

export function ProductsTab({ products, isLoading, refetch }: ProductsTabProps) {
  const [showProductForm, setShowProductForm] = useState(false)
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const { t } = useTranslation()

  const handleDeleteProduct = async (id: number) => {
    if (confirm(t("Are you sure you want to delete this product?"))) {
      await fetch(`/api/products/${id}`, { method: "DELETE" })
      refetch()
    }
  }

  const handleUpdateProduct = async (id: number, updates: Partial<Product>) => {
    await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    })
    refetch()
  }

  const filteredProducts = products.filter(
    (product) =>
      product.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.box_code.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <input
          type="text"
          placeholder={t("Search by product name or box code...")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <Button onClick={() => setShowProductForm(!showProductForm)} className="gap-2">
            <Plus className="w-4 h-4" />
            {showProductForm ? t("Cancel") : t("Add Product")}
          </Button>
          <Button variant="outline" onClick={() => setShowUploadForm(!showUploadForm)} className="gap-2">
            <UploadIcon className="w-4 h-4" />
            {showUploadForm ? t("Cancel Upload") : t("Upload Excel")}
          </Button>
        </div>
      </div>

      {showProductForm && (
        <div className="mb-8">
          <AddProductForm
            onSuccess={() => {
              setShowProductForm(false)
              refetch()
            }}
          />
        </div>
      )}

      {showUploadForm && (
        <div className="mb-8">
          <UploadExcelForm onSuccess={() => {
            setShowUploadForm(false)
            refetch()
          }} />
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">{t("No products found. Start by adding your first product!")}</p>
        </div>
      ) : (
        <ProductTable products={filteredProducts} onDelete={handleDeleteProduct} onUpdate={handleUpdateProduct} />
      )}
    </>
  )
}
