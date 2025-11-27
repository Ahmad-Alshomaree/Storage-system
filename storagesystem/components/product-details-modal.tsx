"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Product {
  id: number
  shipping_id?: number | null
  box_code: string
  product_name?: string
  product_type?: string
  original_price: number
  total_original_price: number
  selling_price: number
  storage?: string
  weight?: number
  image?: string | null
  pice_per_box?: number | null
  Total_pices?: number | null
  size_of_box: number
  total_box_size: number
  number_of_boxes: number
  created_at?: string
  updated_at?: string
  shipping?: {
    id: number
    type: string
    shipping_date: string
    receiver: string
    file_path?: string | null
    created_at: string
  }
}

interface ProductDetailsModalProps {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductDetailsModal({ product, open, onOpenChange }: ProductDetailsModalProps) {
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
              <p className="text-sm font-semibold">{product.box_code}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Product Name</label>
              <p className="text-sm">{product.product_name || "N/A"}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Product Type</label>
              <p className="text-sm">{product.product_type || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Storage Location</label>
              <p className="text-sm">{product.storage || "N/A"}</p>
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Original Price</label>
              <p className="text-sm font-semibold text-green-600">${product.original_price.toFixed(2)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Selling Price</label>
              <p className="text-sm font-semibold text-blue-600">${product.selling_price.toFixed(2)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Total Original Price</label>
              <p className="text-sm">${product.total_original_price?.toFixed(2) || "N/A"}</p>
            </div>
          </div>

          {/* Quantity & Packaging */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Pieces Per Box</label>
              <p className="text-sm">{product.pice_per_box || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Total Pieces</label>
              <p className="text-sm">{product.Total_pices || "N/A"}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Number of Boxes</label>
              <p className="text-sm">{product.number_of_boxes || "N/A"}</p>
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
              <p className="text-sm">{product.weight ? `${product.weight} kg` : "N/A"}</p>
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

          {/* Timestamps */}
          <div className="grid grid-cols-2 gap-4 border-t pt-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Created At</label>
              <p className="text-sm">{product.created_at ? new Date(product.created_at).toLocaleString() : "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Updated At</label>
              <p className="text-sm">{product.updated_at ? new Date(product.updated_at).toLocaleString() : "N/A"}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
