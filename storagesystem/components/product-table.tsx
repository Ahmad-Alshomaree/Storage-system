"use client"

import { useState } from "react"
import { Trash2, Edit2, Check, X, Eye } from "lucide-react"
import { ProductDetailsModal } from "./product-details-modal"
import type { Product } from "@/lib/types"
import { ProductImage } from "@/components/ui/product-image"
import { useTranslation } from "react-i18next"
import "../i18n.client"

interface ProductTableProps {
  products: Product[]
  onDelete: (id: number) => void
  onUpdate: (id: number, updates: Partial<Product>) => void
}

export function ProductTable({ products, onDelete, onUpdate }: ProductTableProps) {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editValues, setEditValues] = useState<Partial<Product>>({})
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [filters, setFilters] = useState({
    storage: '',
    shippingId: '',
    status: '',
    productName: '',
  })
  const { t } = useTranslation()

  const filteredProducts = products.filter(product => {
    const totalPieces = product.total_pieces ?? product.total_pices ?? product.Total_pices ?? (product.number_of_boxes * product.size_of_box)
    const remainingPieces = totalPieces - (product.extracted_pieces || 0)
    const isLowStock = product.status === "available" && (remainingPieces <= 10 || product.number_of_boxes <= 2)

    return (
      (filters.storage === '' || product.storage?.toLowerCase().includes(filters.storage.toLowerCase())) &&
      (filters.shippingId === '' || product.shipping_id?.toString().includes(filters.shippingId)) &&
      (filters.status === '' || (filters.status === 'low_stock' ? isLowStock : product.status === filters.status)) &&
      (filters.productName === '' || product.product_name?.toLowerCase().includes(filters.productName.toLowerCase()))
    )
  })

  const startEdit = (product: Product) => {
    setEditingId(product.id)
    setEditValues({ ...product })
  }

  const saveEdit = async (id: number) => {
    await onUpdate(id, editValues)
    setEditingId(null)
    setEditValues({})
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditValues({})
  }

  return (
    <>
      <div className="mb-4 p-4 bg-muted rounded-lg">
        <h3 className="text-sm font-semibold mb-3">{t("Filter Products")}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          <input
            type="text"
            placeholder={t("Product Name")}
            className="w-full px-2 py-1 bg-input text-foreground text-xs rounded"
            value={filters.productName}
            onChange={(e) => setFilters({ ...filters, productName: e.target.value })}
          />
          <input
            type="text"
            placeholder={t("Storage")}
            className="w-full px-2 py-1 bg-input text-foreground text-xs rounded"
            value={filters.storage}
            onChange={(e) => setFilters({ ...filters, storage: e.target.value })}
          />
          <input
            type="text"
            placeholder={t("Shipping ID")}
            className="w-full px-2 py-1 bg-input text-foreground text-xs rounded"
            value={filters.shippingId}
            onChange={(e) => setFilters({ ...filters, shippingId: e.target.value })}
          />
          <select
            className="w-full px-2 py-1 bg-input text-foreground text-xs rounded"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">{t("All Status")}</option>
            <option value="available">{t("Available")}</option>
            <option value="low_stock">{t("Low Stock")}</option>
            <option value="depleted">{t("Depleted")}</option>
            <option value="out_of_stock">{t("Out of Stock")}</option>
          </select>
        </div>
        <div className="flex gap-2 mt-3">
          <button
            className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded hover:bg-primary/90 transition-colors"
            onClick={() => setFilters({ storage: '', shippingId: '', status: '', productName: '' })}
          >
            {t("Clear Filters")}
          </button>
          <button
            className="px-3 py-1 bg-emerald-600 text-white text-xs font-medium rounded hover:bg-emerald-700 transition-colors flex items-center gap-1"
            onClick={() => {
              import("@/lib/export-utils").then(mod => {
                const headers = ["Box Code", "Product Name", "Selling Price", "Group Price", "Storage", "Boxes", "Pieces/Box", "Extracted", "Status", "Shipping ID"]
                const rows = filteredProducts.map(p => [p.box_code, p.product_name || "", p.selling_price, p.Grope_Item_price || 0, p.storage || "", p.number_of_boxes, p.pice_per_box || 0, p.extracted_pieces || 0, p.status, p.shipping_id || ""])
                mod.exportToCSV("products_export", headers, rows)
              })
            }}
          >
            {t("Export CSV")}
          </button>
        </div>
      </div>
    <div className="overflow-x-auto border border-border rounded-lg">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted">
            <th className="px-3 py-3 text-start text-xs font-semibold text-foreground">{t("Image")}</th>
            <th className="px-3 py-3 text-start text-xs font-semibold text-foreground">{t("Box Code")}</th>
            <th className="px-3 py-3 text-start text-xs font-semibold text-foreground">{t("Product Name")}</th>
            <th className="px-3 py-3 text-start text-xs font-semibold text-foreground">{t("Selling Price")}</th>
            <th className="px-3 py-3 text-start text-xs font-semibold text-foreground">{t("Group Item Price")}</th>
            <th className="px-3 py-3 text-start text-xs font-semibold text-foreground">{t("Storage")}</th>
            <th className="px-3 py-3 text-start text-xs font-semibold text-foreground">{t("Number of boxes")}</th>
            <th className="px-3 py-3 text-start text-xs font-semibold text-foreground">{t("Pieces per box")}</th>
            <th className="px-3 py-3 text-start text-xs font-semibold text-foreground">{t("Extracted Pieces")}</th>
            <th className="px-3 py-3 text-start text-xs font-semibold text-foreground">{t("Status")}</th>
            <th className="px-3 py-3 text-start text-xs font-semibold text-foreground">{t("Shipping ID")}</th>
            <th className="px-3 py-3 text-start text-xs font-semibold text-foreground">{t("Actions")}</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product.id} className="border-b border-border hover:bg-muted/50 transition-colors">
              {editingId === product.id ? (
                <>
                  <td className="px-3 py-3">
                    <div className="w-10 h-10 rounded overflow-hidden border border-border bg-muted shrink-0">
                      <ProductImage
                        src={editValues.image || product.image}
                        alt={product.product_name || "Product"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <input
                      type="text"
                      value={editValues.box_code || ""}
                      onChange={(e) => setEditValues({ ...editValues, box_code: e.target.value })}
                      className="w-full px-2 py-1 bg-input text-foreground text-xs rounded"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <input
                      type="text"
                      value={editValues.product_name || ""}
                      onChange={(e) => setEditValues({ ...editValues, product_name: e.target.value })}
                      className="w-full px-2 py-1 bg-input text-foreground text-xs rounded"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <input
                      type="number"
                      value={editValues.selling_price || 0}
                      onChange={(e) =>
                        setEditValues({ ...editValues, selling_price: Number.parseFloat(e.target.value) })
                      }
                      step="0.01"
                      className="w-full px-2 py-1 bg-input text-foreground text-xs rounded"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <input
                      type="number"
                      value={editValues.Grope_Item_price || 0}
                      onChange={(e) =>
                        setEditValues({ ...editValues, Grope_Item_price: Number.parseFloat(e.target.value) })
                      }
                      step="0.01"
                      className="w-full px-2 py-1 bg-input text-foreground text-xs rounded"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <input
                      type="text"
                      value={editValues.storage || ""}
                      onChange={(e) => setEditValues({ ...editValues, storage: e.target.value })}
                      className="w-full px-2 py-1 bg-input text-foreground text-xs rounded"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <input
                      type="number"
                      value={editValues.number_of_boxes || 0}
                      onChange={(e) => setEditValues({ ...editValues, number_of_boxes: Number.parseFloat(e.target.value) })}
                      step="0.01"
                      className="w-full px-2 py-1 bg-input text-foreground text-xs rounded"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <input
                      type="number"
                      value={editValues.pice_per_box || 0}
                      onChange={(e) => setEditValues({ ...editValues, pice_per_box: Number.parseInt(e.target.value) })}
                      className="w-full px-2 py-1 bg-input text-foreground text-xs rounded"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <input
                      type="number"
                      value={editValues.extracted_pieces || 0}
                      onChange={(e) => setEditValues({ ...editValues, extracted_pieces: Number.parseInt(e.target.value) })}
                      className="w-full px-2 py-1 bg-input text-foreground text-xs rounded"
                      min="0"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <select
                      value={editValues.status || "available"}
                      onChange={(e) => setEditValues({ ...editValues, status: e.target.value })}
                      className="w-full px-2 py-1 bg-input text-foreground text-xs rounded"
                    >
                      <option value="available">{t("Available")}</option>
                      <option value="out_of_stock">{t("Out of Stock")}</option>
                    </select>
                  </td>
                  <td className="px-3 py-3 text-xs text-muted-foreground">{product.shipping_id || t("None")}</td>
                  <td className="px-3 py-3">
                    <div className="flex gap-1">
                      <button
                        onClick={() => saveEdit(product.id)}
                        className="p-1 hover:bg-primary/10 rounded text-primary"
                      >
                        <Check className="w-3 h-3" />
                      </button>
                      <button onClick={cancelEdit} className="p-1 hover:bg-destructive/10 rounded text-destructive">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </>
              ) : (
                <>
                  <td className="px-3 py-3">
                    <div
                      className="w-10 h-10 rounded overflow-hidden border border-border bg-muted shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => {
                        setSelectedProduct(product)
                        setShowDetailsModal(true)
                      }}
                    >
                      <ProductImage
                        src={product.image}
                        alt={product.product_name || "Product"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-3 py-3 font-medium text-foreground text-xs">{product.box_code}</td>
                  <td className="px-3 py-3 text-foreground text-xs">{product.product_name}</td>
                  <td className="px-3 py-3 text-foreground text-xs font-medium">{product.selling_price ? product.selling_price.toFixed(2) : "0.00"}</td>
                  <td className="px-3 py-3 text-foreground text-xs">{product.Grope_Item_price ? product.Grope_Item_price.toFixed(2) : "0.00"}</td>
                  <td className="px-3 py-3 text-foreground text-xs">{product.storage}</td>
                  <td className="px-3 py-3 text-foreground text-xs">{product.number_of_boxes}</td>
                  <td className="px-3 py-3 text-foreground text-xs">{product.pice_per_box}</td>
                  <td className="px-3 py-3 text-foreground text-xs">{product.extracted_pieces || 0}</td>
                  <td className="px-3 py-3 text-xs">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.status === 'available'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : product.status === 'depleted'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {product.status === 'available' ? t('Available') : product.status === 'depleted' ? t('Depleted') : t('Out of Stock')}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-xs text-muted-foreground">{product.shipping_id || t("None")}</td>
                  <td className="px-3 py-3">
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          setSelectedProduct(product)
                          setShowDetailsModal(true)
                        }}
                        className="p-1 hover:bg-primary/10 rounded text-primary transition-colors"
                      >
                        <Eye className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => startEdit(product)}
                        className="p-1 hover:bg-primary/10 rounded text-primary transition-colors"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => onDelete(product.id)}
                        className="p-1 hover:bg-destructive/10 rounded text-destructive transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <ProductDetailsModal
        product={selectedProduct}
        open={showDetailsModal}
        onOpenChange={setShowDetailsModal}
        onEdit={async (updatedProduct) => {
          await onUpdate(updatedProduct.id, updatedProduct)
        }}
        onDelete={(productId) => {
          onDelete(productId)
          setShowDetailsModal(false)
        }}
      />
    </>
  )
}
