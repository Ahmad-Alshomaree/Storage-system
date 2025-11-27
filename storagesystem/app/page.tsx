"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { ProductTable } from "@/components/product-table"
import { AddProductForm } from "@/components/add-product-form"
import { ShippingTable } from "@/components/shipping-table"
import { ShippingForm } from "@/components/shipping-form"
import { ClientTable } from "@/components/client-table"
import { AddClientForm } from "@/components/add-client-form"
import { DebitTable } from "@/components/debit-table"
import { AddDebitForm } from "@/components/add-debit-form"
import { UploadExcelForm } from "@/components/upload-excel-form"
import { Button } from "@/components/ui/button"
import { Plus, Loader2, Package, Truck, Upload, Users, CreditCard } from "lucide-react"

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
  extracted_pieces?: number | null
  status: string
  Grope_Item_price?: number | null
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

interface Debit {
  id: number
  client_id: number
  shipping_id?: number | null
  amount: number
  type: "debit" | "credit"
  description?: string | null
  transaction_date: string
  created_at: string
  client: {
    id: number
    client_name: string
    phone_number?: string | null
  }
  shipping?: {
    id: number
    type: string
    shipping_date: string
    receiver: string
    file_path?: string | null
    created_at: string
  }
}

interface Shipping {
  id: number
  type: string
  shipping_date: string
  receiving_date: string
  receiver: string
  created_at: string
  file_path?: string | null
}

interface Client {
  id: number
  client_name: string
  phone_number?: string | null
  shipping_id?: number | null
  history?: string | null
  debt: number
  total_debts: number
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [shipping, setShipping] = useState<Shipping[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showProductForm, setShowProductForm] = useState(false)
  const [showShippingForm, setShowShippingForm] = useState(false)
  const [showClientForm, setShowClientForm] = useState(false)
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [debits, setDebits] = useState<Debit[]>([])
  const [activeTab, setActiveTab] = useState<"products" | "shipping" | "clients" | "debits">("products")
  const [showDebitForm, setShowDebitForm] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [productsRes, shippingRes, clientsRes, debitsRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/shipping"),
        fetch("/api/clients"),
        fetch("/api/debits")
      ])
      if (productsRes.ok) {
        setProducts(await productsRes.json())
      }
      if (shippingRes.ok) {
        setShipping(await shippingRes.json())
      }
      if (clientsRes.ok) {
        setClients(await clientsRes.json())
      }
      if (debitsRes.ok) {
        setDebits(await debitsRes.json())
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

  const handleDeleteClient = async (id: number) => {
    await fetch(`/api/clients/${id}`, { method: "DELETE" })
    fetchData()
  }

  const handleUpdateClient = async (id: number, updates: Partial<Client>) => {
    await fetch(`/api/clients/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    })
    fetchData()
  }

  const handleDeleteDebit = async (id: number) => {
    await fetch(`/api/debits/${id}`, { method: "DELETE" })
    fetchData()
  }

  const handleUpdateDebit = async (id: number, updates: Partial<Debit>) => {
    await fetch(`/api/debits/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    })
    fetchData()
  }

  const filteredProducts = products.filter(
    (product) =>
      product.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.box_code.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredShipping = shipping.filter((record) => record.receiver.toLowerCase().includes(searchTerm.toLowerCase()))

  const filteredClients = clients.filter((client) => client.client_name.toLowerCase().includes(searchTerm.toLowerCase()))

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

        {activeTab === "clients" && (
          <>
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <input
                type="text"
                placeholder="Search by client name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button onClick={() => setShowClientForm(!showClientForm)} className="gap-2 w-full md:w-auto">
                <Plus className="w-4 h-4" />
                {showClientForm ? "Cancel" : "Add Client"}
              </Button>
            </div>

            {showClientForm && (
              <div className="mb-8">
                <AddClientForm
                  onSuccess={() => {
                    setShowClientForm(false)
                    fetchData()
                  }}
                />
              </div>
            )}

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredClients.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  No clients found. Start by adding a client record!
                </p>
              </div>
            ) : (
              <ClientTable
                clients={filteredClients}
                onDelete={handleDeleteClient}
                onUpdate={handleUpdateClient}
              />
            )}
          </>
        )}

        {activeTab === "debits" && (
          <>
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-end">
              <Button onClick={() => setShowDebitForm(!showDebitForm)} className="gap-2 w-full md:w-auto">
                <Plus className="w-4 h-4" />
                {showDebitForm ? "Cancel" : "Add Transaction"}
              </Button>
            </div>

            {showDebitForm && (
              <div className="mb-8">
                <AddDebitForm
                  onSuccess={() => {
                    setShowDebitForm(false)
                    fetchData()
                  }}
                />
              </div>
            )}

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : debits.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  No financial transactions found. Start by adding a transaction!
                </p>
              </div>
            ) : (
              <DebitTable
                debits={debits}
                onDelete={handleDeleteDebit}
                onUpdate={handleUpdateDebit}
              />
            )}
          </>
        )}
      </main>
    </div>
  )
}
