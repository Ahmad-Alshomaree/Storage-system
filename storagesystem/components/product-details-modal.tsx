"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Trash2, Edit2, Check, X } from "lucide-react"
import type { Product } from "@/lib/types"

interface ProductDetailsModalProps {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit?: (product: Product) => void
  onDelete?: (productId: number) => void
}

export function ProductDetailsModal({ product, open, onOpenChange, onEdit, onDelete }: ProductDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedProduct, setEditedProduct] = useState<Partial<Product>>({})

  // Reset editing state when product changes or modal opens/closes
  useEffect(() => {
    setIsEditing(false)
    setEditedProduct({})
  }, [product, open])

  // Start editing
  const handleStartEdit = () => {
    setIsEditing(true)
    setEditedProduct({ ...product })
  }

  // Save changes
  const handleSave = async () => {
    if (onEdit && product) {
      await onEdit(editedProduct as Product)
      setIsEditing(false)
      setEditedProduct({})
    }
  }

  // Cancel editing
  const handleCancel = () => {
    setIsEditing(false)
    setEditedProduct({})
  }

  if (!product) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Product Details</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Box Code</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedProduct.box_code || ""}
                  onChange={(e) => setEditedProduct({ ...editedProduct, box_code: e.target.value })}
                  className="w-full px-2 py-1 bg-input text-foreground text-sm rounded border"
                />
              ) : (
                <p className="text-sm font-semibold">{product.box_code}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Product Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedProduct.product_name || ""}
                  onChange={(e) => setEditedProduct({ ...editedProduct, product_name: e.target.value })}
                  className="w-full px-2 py-1 bg-input text-foreground text-sm rounded border"
                />
              ) : (
                <p className="text-sm">{product.product_name || "N/A"}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Product Type</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedProduct.product_type || ""}
                  onChange={(e) => setEditedProduct({ ...editedProduct, product_type: e.target.value })}
                  className="w-full px-2 py-1 bg-input text-foreground text-sm rounded border"
                />
              ) : (
                <p className="text-sm">{product.product_type || "N/A"}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Storage Location</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedProduct.storage || ""}
                  onChange={(e) => setEditedProduct({ ...editedProduct, storage: e.target.value })}
                  className="w-full px-2 py-1 bg-input text-foreground text-sm rounded border"
                />
              ) : (
                <p className="text-sm">{product.storage || "N/A"}</p>
              )}
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Original Price</label>
              {isEditing ? (
                <input
                  type="number"
                  value={editedProduct.original_price || 0}
                  onChange={(e) => setEditedProduct({ ...editedProduct, original_price: Number.parseFloat(e.target.value) || 0 })}
                  step="0.01"
                  className="w-full px-2 py-1 bg-input text-foreground text-sm rounded border"
                />
              ) : (
                <p className="text-sm font-semibold text-green-600">{product.original_price.toFixed(2)}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Selling Price</label>
              {isEditing ? (
                <input
                  type="number"
                  value={editedProduct.selling_price || 0}
                  onChange={(e) => setEditedProduct({ ...editedProduct, selling_price: Number.parseFloat(e.target.value) || 0 })}
                  step="0.01"
                  className="w-full px-2 py-1 bg-input text-foreground text-sm rounded border"
                />
              ) : (
                <p className="text-sm font-semibold text-blue-600">{product.selling_price.toFixed(2)}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Group Item Price</label>
              {isEditing ? (
                <input
                  type="number"
                  value={editedProduct.group_item_price || 0}
                  onChange={(e) => setEditedProduct({ ...editedProduct, group_item_price: Number.parseFloat(e.target.value) || 0 })}
                  step="0.01"
                  className="w-full px-2 py-1 bg-input text-foreground text-sm rounded border"
                />
              ) : (
                <p className="text-sm font-semibold text-purple-600">{product.group_item_price ? product.group_item_price.toFixed(2) : "N/A"}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Total Original Price</label>
              <p className="text-sm">{product.total_original_price?.toFixed(2) || "N/A"}</p>
            </div>
          </div>

          {/* Quantity & Packaging */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Pieces Per Box</label>
              {isEditing ? (
                <input
                  type="number"
                  value={editedProduct.pice_per_box || 0}
                  onChange={(e) => setEditedProduct({ ...editedProduct, pice_per_box: Number.parseInt(e.target.value) || 0 })}
                  className="w-full px-2 py-1 bg-input text-foreground text-sm rounded border"
                />
              ) : (
                <p className="text-sm">{product.pice_per_box || "N/A"}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Total Pieces</label>
              <p className="text-sm font-semibold">{product.Total_pices || "N/A"}</p>
              <p className="text-xs text-muted-foreground">Auto-calculated: Pieces per box × Number of boxes</p>
            </div>
          </div>

          {/* Inventory Status */}
          <div className="grid grid-cols-3 gap-4 border-t pt-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Extracted Pieces</label>
              {isEditing ? (
                <input
                  type="number"
                  value={editedProduct.extracted_pieces || 0}
                  onChange={(e) => setEditedProduct({ ...editedProduct, extracted_pieces: Number.parseInt(e.target.value) || 0 })}
                  min="0"
                  className="w-full px-2 py-1 bg-input text-foreground text-sm rounded border"
                />
              ) : (
                <p className="text-sm font-semibold">{product.extracted_pieces || 0}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Remaining Pieces</label>
              <p className="text-sm font-semibold">
                {(product.Total_pices || 0) - (product.extracted_pieces || 0)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              {isEditing ? (
                <select
                  value={editedProduct.status || "available"}
                  onChange={(e) => setEditedProduct({ ...editedProduct, status: e.target.value })}
                  className="w-full px-2 py-1 bg-input text-foreground text-sm rounded border"
                >
                  <option value="available">Available</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>
              ) : (
                <p className={`text-sm font-bold ${
                  product.status === 'available'
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}>
                  {product.status === 'available' ? 'Available' : 'Out of Stock'}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Number of Boxes</label>
              {isEditing ? (
                <input
                  type="number"
                  value={editedProduct.number_of_boxes || 0}
                  onChange={(e) => setEditedProduct({ ...editedProduct, number_of_boxes: Number.parseFloat(e.target.value) || 0 })}
                  step="0.01"
                  className="w-full px-2 py-1 bg-input text-foreground text-sm rounded border"
                />
              ) : (
                <p className="text-sm">{product.number_of_boxes || "N/A"}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Size of Box</label>
              <p className="text-sm">{product.size_of_box ? `${product.size_of_box} m³` : "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Total Box Size</label>
              <p className="text-sm">{product.total_box_size ? `${product.total_box_size} m³` : "N/A"}</p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Weight</label>
              {isEditing ? (
                <input
                  type="number"
                  value={editedProduct.weight || 0}
                  onChange={(e) => setEditedProduct({ ...editedProduct, weight: Number.parseFloat(e.target.value) || 0 })}
                  step="0.01"
                  className="w-full px-2 py-1 bg-input text-foreground text-sm rounded border"
                  placeholder="Weight in kg"
                />
              ) : (
                <p className="text-sm">{product.weight ? `${product.weight} kg` : "N/A"}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Image</label>
              <p className="text-sm">{product.image || "No image"}</p>
            </div>
          </div>

          {/* Shipping Info */}
          {product.shipping_id && (
            <div className="grid grid-cols-2 gap-4 border-t pt-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Shipping ID</label>
                <p className="text-sm">{product.shipping_id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Shipping Type</label>
                <p className="text-sm">{product.shipping?.type || "N/A"}</p>
              </div>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-muted-foreground">Shipping Receiver</label>
            <p className="text-sm">{product.shipping?.receiver || "N/A"}</p>
          </div>

          {/* Currency and Note */}
          <div className="grid grid-cols-2 gap-4 border-t pt-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Currency</label>
              <p className="text-sm">{product.currency}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Note</label>
              {isEditing ? (
                <textarea
                  value={editedProduct.note || ""}
                  onChange={(e) => setEditedProduct({ ...editedProduct, note: e.target.value })}
                  rows={2}
                  className="w-full px-2 py-1 bg-input text-foreground text-sm rounded border"
                  placeholder="Enter note..."
                />
              ) : (
                <p className="text-sm">{product.note || "No note"}</p>
              )}
            </div>
          </div>

          {/* Timestamps */}
          <div className="grid grid-cols-2 gap-4 border-t pt-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Received At</label>
              <p className="text-sm">{product.created_at ? new Date(product.created_at).toLocaleString() : "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Updated At</label>
              <p className="text-sm">{product.updated_at ? new Date(product.updated_at).toLocaleString() : "N/A"}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6 border-t pt-4">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={handleCancel}
                className="flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Save
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={handleStartEdit}
                className="flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (confirm('Are you sure you want to delete this product?')) {
                    onDelete?.(product.id)
                    onOpenChange(false)
                  }
                }}
                className="flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
