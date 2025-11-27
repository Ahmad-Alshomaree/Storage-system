"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { ProductTable } from "@/components/product-table"
import { AddProductForm } from "@/components/add-product-form"
import { ShippingTable } from "@/components/shipping-table"
import { ShippingForm } from "@/components/shipping-form"
import { UploadExcelForm } from "@/components/upload-excel-form"
import { Button } from "@/components/ui/button"
import { Plus, Loader2, Package, Truck, Upload } from "lucide-react"

interface Product {
  id: number
  product_name: string
  product_type: string
  original_price: number
  selling_price: number
  storage: string
  box_code: string
  box_number: number
  quantity: number
  shipping_id: number | null
}

interface Shipping {
  id: number
  type: string
  shipping_date: string
  receiver: string
  created_at: string
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [shipping, setShipping] = useState<Shipping[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showProductForm, setShowProductForm] = useState(false)
  const [showShippingForm, setShowShippingForm] = useState(false)
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState<"products" | "shipping">("products")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [productsRes, shippingRes] = await Promise.all([fetch("/api/products"), fetch("/api/shipping")])
      if (productsRes.ok) {
        setProducts(await productsRes.json())
      }
      if (shippingRes.ok) {
        setShipping(await shippingRes.json())
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteProduct = async (id: number) => {
    await fetch(`/api/products/${id}`, { method: "DELETE" })
    fetchData()
  }

  const handleUpdateProduct = async (id: number, updates: Partial<Product>) => {
    await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    })
    fetchData()
  }

  const handleDeleteShipping = async (id: number) => {
    await fetch(`/api/shipping/${id}`, { method: "DELETE" })
    fetchData()
  }

  const handleUpdateShipping = async (id: number, updates: Partial<Shipping>) => {
    await fetch(`/api/shipping/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    })
    fetchData()
  }

  const filteredProducts = products.filter(
    (product) =>
      product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.box_code.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredShipping = shipping.filter((record) => record.receiver.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-8 px-4">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground text-balance">Product Storage System</h1>
            <p className="text-muted-foreground mt-1">Manage products and shipping records efficiently</p>
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
        </div>

        {activeTab === "products" && (
          <>
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <input
                type="text"
                placeholder="Search by product name or box code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button onClick={() => setShowProductForm(!showProductForm)} className="gap-2 w-full md:w-auto">
                <Plus className="w-4 h-4" />
                {showProductForm ? "Cancel" : "Add Product"}
              </Button>
            </div>

            {showProductForm && (
              <div className="mb-8">
                <AddProductForm
                  onSuccess={() => {
                    setShowProductForm(false)
                    fetchData()
                  }}
                />
              </div>
            )}

            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-end">
                 <Button variant="outline" onClick={() => setShowUploadForm(!showUploadForm)} className="gap-2 w-full md:w-auto">
                    <Upload className="w-4 h-4" />
                    {showUploadForm ? "Cancel Upload" : "Upload Excel"}
                 </Button>
            </div>

            {showUploadForm && (
                <div className="mb-8">
                    <UploadExcelForm onSuccess={() => {
                        setShowUploadForm(false)
                        fetchData()
                    }} />
                </div>
            )}

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No products found. Start by adding your first product!</p>
              </div>
            ) : (
              <ProductTable products={filteredProducts} onDelete={handleDeleteProduct} onUpdate={handleUpdateProduct} />
            )}
          </>
        )}

        {activeTab === "shipping" && (
          <>
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <input
                type="text"
                placeholder="Search by receiver..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button onClick={() => setShowShippingForm(!showShippingForm)} className="gap-2 w-full md:w-auto">
                <Plus className="w-4 h-4" />
                {showShippingForm ? "Cancel" : "Add Shipping"}
              </Button>
            </div>

            {showShippingForm && (
              <div className="mb-8">
                <ShippingForm
                  onSuccess={() => {
                    setShowShippingForm(false)
                    fetchData()
                  }}
                />
              </div>
            )}

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredShipping.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  No shipping records found. Start by adding a shipping record!
                </p>
              </div>
            ) : (
              <ShippingTable
                shipping={filteredShipping}
                onDelete={handleDeleteShipping}
                onUpdate={handleUpdateShipping}
              />
            )}
          </>
        )}
      </main>
    </div>
  )
}
