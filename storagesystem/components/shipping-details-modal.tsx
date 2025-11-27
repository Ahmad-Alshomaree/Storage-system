"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Product {
  id: number
  box_code: string
  product_name?: string | null
  original_price: number
  selling_price: number
  Total_pices?: number | null
  number_of_boxes: number
  size_of_box: number
  total_box_size: number
  weight?: number | null
  image?: string | null
}

interface Shipping {
  id: number
  type: string
  shipping_date: string
  receiving_date: string
  receiver: string
  created_at: string
  file_path?: string | null
  products?: Product[]
}

interface ShippingDetailsModalProps {
  shipping: Shipping | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ShippingDetailsModal({ shipping, open, onOpenChange }: ShippingDetailsModalProps) {
  if (!shipping) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Shipping Details</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6">
          {/* Basic Shipping Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Shipping ID</label>
              <p className="text-sm font-semibold">#{shipping.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Type</label>
              <p className="text-lg font-bold capitalize">{shipping.type}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Receiver</label>
              <p className="text-sm">{shipping.receiver}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Created At</label>
              <p className="text-sm">{new Date(shipping.created_at).toLocaleString()}</p>
            </div>
          </div>

          {/* Date Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Shipping Date</label>
              <p className="text-sm font-semibold">{new Date(shipping.shipping_date).toLocaleString()}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Receiving Date</label>
              <p className="text-sm font-semibold">{new Date(shipping.receiving_date).toLocaleString()}</p>
            </div>
          </div>

          {/* File Path - if exists */}
          {shipping.file_path && (
            <div className="border-t pt-4">
              <label className="text-sm font-medium text-muted-foreground block mb-2">Attached Document</label>
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm text-blue-600 break-all">{shipping.file_path}</p>
              </div>
            </div>
          )}

          {/* Products Information */}
          {shipping.products && shipping.products.length > 0 && (
            <div className="border-t pt-4">
              <label className="text-sm font-medium text-muted-foreground block mb-3">Products in Shipment ({shipping.products.length})</label>
              <div className="space-y-3">
                {shipping.products.map((product) => (
                  <div key={product.id} className="bg-muted p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Product Name</label>
                        <p className="text-sm font-medium">{product.product_name || product.box_code}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Box Code</label>
                        <p className="text-sm">{product.box_code}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 mt-3">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Boxes</label>
                        <p className="text-sm font-bold">{product.number_of_boxes}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Pieces</label>
                        <p className="text-sm font-bold">{product.Total_pices ?? 0}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Price</label>
                        <p className="text-sm font-bold">${(product.selling_price || product.original_price).toFixed(2)}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Total</label>
                        <p className="text-sm font-bold">
                          ${(((product.selling_price || product.original_price) * product.Total_pices!) || 0).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Information Display */}
          <div className="border-t pt-4">
            <label className="text-sm font-medium text-muted-foreground block mb-2">Shipping Summary</label>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm">
                <span className="font-medium">Type:</span> {shipping.type} •
                <span className="font-medium"> Receiver:</span> {shipping.receiver} •
                <span className="font-medium"> Duration:</span> {Math.ceil((new Date(shipping.receiving_date).getTime() - new Date(shipping.shipping_date).getTime()) / (1000 * 60 * 60 * 24))} days •
                <span className="font-medium"> Products:</span> {shipping.products?.length || 0}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
