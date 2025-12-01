
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Upload, Loader2, X } from "lucide-react"
import { useTranslation } from "react-i18next"
import "../i18n.client"

interface UploadExcelFormProps {
  onSuccess: () => void
}

interface Client {
  id: number
  client_name: string
  phone_number?: string
}

export function UploadExcelForm({ onSuccess }: UploadExcelFormProps) {
  const [file, setFile] = useState<File | null>(null)
  const [receiverId, setReceiverId] = useState("")
  const [senderId, setSenderId] = useState("")
  const [shippingDate, setShippingDate] = useState("")
  const [type, setType] = useState("input load")
  const [cost, setCost] = useState("")
  const [paid, setPaid] = useState("")
  const [clients, setClients] = useState<Client[]>([])
  const [uploadProductsOnly, setUploadProductsOnly] = useState(false)
  const [isLoadingClients, setIsLoadingClients] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [previewData, setPreviewData] = useState<any[] | null>(null)
  const [isPreviewing, setIsPreviewing] = useState(false)
  const [rawFileData, setRawFileData] = useState<any[] | null>(null)
  const [isShowingPreview, setIsShowingPreview] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch("/api/clients")
        if (response.ok) {
          const clientsData = await response.json()
          setClients(clientsData)
        }
      } catch (error) {
        console.error("Failed to fetch clients:", error)
      } finally {
        setIsLoadingClients(false)
      }
    }

    fetchClients()
  }, [])

  // Auto preview when file is selected
  const loadFilePreview = async () => {
    if (!file) return

    setIsPreviewing(true)
    setError("")

    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/api/products/upload", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        throw new Error(t("Preview failed"))
      }

      const data = await res.json()
      if (data.success) {
        setPreviewData(data.previewRows.map((row: any) => ({ ...row })))
        setRawFileData(data.previewRows.map((row: any) => ({ ...row })))
        setIsShowingPreview(true)
      } else {
        throw new Error(data.error || "Failed to preview")
      }
    } catch (err: any) {
      console.error(err)
      setError(err.message || t("Failed to preview"))
    } finally {
      setIsPreviewing(false)
    }
  }

  useEffect(() => {
    if (file && !isShowingPreview) {
      loadFilePreview()
    }
  }, [file])

  const handlePreview = async () => {
    if (!file) {
      setError(t("Please choose a file"))
      return
    }

    setIsPreviewing(true)
    setError("")

    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/api/products/upload", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        throw new Error(t("Preview failed"))
      }

      const data = await res.json()
      if (data.success) {
        setPreviewData(data.previewRows.map((row: any) => ({ ...row })))
      } else {
        throw new Error(data.error || "Failed to preview")
      }
    } catch (err: any) {
      console.error(err)
      setError(err.message || t("Failed to preview"))
    } finally {
      setIsPreviewing(false)
    }
  }

  const handleSave = async () => {
    if (!previewData) return

    setIsLoading(true)
    setError("")

    try {
      const res = await fetch("/api/products/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productsData: previewData }),
      })

      if (!res.ok) {
        throw new Error(t("Save failed"))
      }

      setPreviewData(null)
      setFile(null)
      setUploadProductsOnly(false)
      onSuccess()
    } catch (err: any) {
      console.error(err)
      setError(err.message || t("Failed to save"))
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadProductsOnly) {
      if (!previewData || !senderId || !receiverId || !shippingDate || !cost || !paid) {
        setError(t("Please wait for preview to load and fill all fields"))
        return
      }

      setIsLoading(true)
      setError("")

      // Use JSON request with edited data if available
      const requestData = {
        editedProducts: previewData,
        sender_id: senderId,
        receiver_id: receiverId,
        shipping_date: shippingDate,
        type: type,
        cost: cost,
        paid: paid
      }

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        })

        if (!res.ok) {
          throw new Error(t("Upload failed"))
        }

        setPreviewData(null)
        setFile(null)
        setSenderId("")
        setReceiverId("")
        setShippingDate("")
        setCost("")
        setPaid("")
        onSuccess()
      } catch (err) {
        console.error(err)
        setError(t("Failed to upload file"))
      } finally {
        setIsLoading(false)
      }
    }
  }

  const updatePreviewData = (index: number, field: string, value: string) => {
    if (!previewData) return
    const newData = [...previewData]
    newData[index] = { ...newData[index], [field]: value }
    setPreviewData(newData)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card p-6 rounded-lg shadow-sm border border-border">
      <h3 className="text-lg font-semibold mb-4">{t("Upload Excel File")}</h3>

      <div className="mb-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={uploadProductsOnly}
            onChange={(e) => setUploadProductsOnly(e.target.checked)}
          />
          {t("Upload products only (no shipping record)")}
        </label>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {!uploadProductsOnly && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">{t("Sender")}</label>
              <select
                value={senderId}
                onChange={(e) => setSenderId(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
                required={!uploadProductsOnly}
                disabled={isLoadingClients}
              >
                <option value="">{isLoadingClients ? t("Loading...") : t("Select Sender")}</option>
                {!isLoadingClients && clients.map((client) => (
                  <option key={client.id} value={client.id.toString()}>
                    {client.client_name} {client.phone_number ? `(${client.phone_number})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">{t("Receiver")}</label>
              <select
                value={receiverId}
                onChange={(e) => setReceiverId(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
                required={!uploadProductsOnly}
                disabled={isLoadingClients}
              >
                <option value="">{isLoadingClients ? t("Loading...") : t("Select Receiver")}</option>
                {!isLoadingClients && clients.map((client) => (
                  <option key={client.id} value={client.id.toString()}>
                    {client.client_name} {client.phone_number ? `(${client.phone_number})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">{t("Shipping Date")}</label>
              <input
                type="date"
                value={shippingDate}
                onChange={(e) => setShippingDate(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
                required={!uploadProductsOnly}
              />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">{t("Type")}</label>
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    required={!uploadProductsOnly}
                >
                    <option value="input load">{t("Input Load")}</option>
                    <option value="output load">{t("Output Load")}</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">{t("Cost")}</label>
                <input
                    type="number"
                    step="0.01"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    required={!uploadProductsOnly}
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">{t("Paid")}</label>
                <input
                    type="number"
                    step="0.01"
                    value={paid}
                    onChange={(e) => setPaid(e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    required={!uploadProductsOnly}
                />
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">{t("Excel File")}</label>
          <div className="relative">
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="flex items-center justify-center w-full px-3 py-2 border border-input border-dashed rounded-md bg-background cursor-pointer hover:bg-accent/50 transition-colors"
            >
              {file ? (
                <span className="truncate">{file.name}</span>
              ) : (
                <span className="text-muted-foreground flex items-center gap-2">
                  <Upload className="w-4 h-4" /> {t("Choose file")}
                </span>
              )}
            </label>
            {file && (
                <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
          </div>
        </div>
      </div>

      {previewData && (
        <div className="mb-4">
          <h4 className="text-md font-semibold mb-2">{t("Preview and Edit Data")}
            <span className="text-sm text-muted-foreground ml-2">({previewData.length} rows)</span>
          </h4>
          <div className="overflow-x-auto max-h-96 border rounded-md">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-muted sticky top-0">
                <tr>
                  <th className="border border-border p-2">#</th>
                  <th className="border border-border p-2">{t("Item No")}</th>
                  <th className="border border-border p-2">{t("Product Name")}</th>
                  <th className="border border-border p-2">{t("Storage")}</th>
                  <th className="border border-border p-2">{t("Box Code / Name")}</th>
                  <th className="border border-border p-2">{t("Original Price")}</th>
                  <th className="border border-border p-2">{t("Selling Price")}</th>
                  <th className="border border-border p-2">{t("Quantity")}</th>
                  <th className="border border-border p-2">{t("Pieces per Box")}</th>
                  <th className="border border-border p-2">{t("Box Size")}</th>
                  <th className="border border-border p-2">{t("Total Box Size")}</th>
                  <th className="border border-border p-2">{t("Number of Boxes")}</th>
                  <th className="border border-border p-2">{t("Total Price")}</th>
                  <th className="border border-border p-2">{t("Grope Item Price")}</th>
                </tr>
              </thead>
              <tbody>
                {previewData.map((row, index) => (
                  <tr key={index} className="hover:bg-muted/50">
                    <td className="border border-border p-2 text-center font-mono">{index + 1}</td>
                    <td className="border border-border p-2">{row.itemNo}</td>
                    <td className={`border border-border p-2 ${!row.productName || row.productName === '' ? 'bg-orange-50' : 'bg-green-50'}`}>
                      <input
                        type="text"
                        value={row.productName}
                        onChange={(e) => updatePreviewData(index, 'productName', e.target.value)}
                        className={`w-full px-2 py-1 border rounded ${!row.productName || row.productName === '' ? 'border-orange-300 bg-orange-50' : 'border-green-300 bg-green-50'}`}
                        placeholder={!row.productName || row.productName === '' ? "Fill this field" : ""}
                      />
                    </td>
                    <td className={`border border-border p-2 ${!row.storage || row.storage === '' ? 'bg-orange-50' : 'bg-green-50'}`}>
                      <input
                        type="text"
                        value={row.storage}
                        onChange={(e) => updatePreviewData(index, 'storage', e.target.value)}
                        className={`w-full px-2 py-1 border rounded ${!row.storage || row.storage === '' ? 'border-orange-300 bg-orange-50' : 'border-green-300 bg-green-50'}`}
                        placeholder={!row.storage || row.storage === '' ? "Fill this field" : ""}
                      />
                    </td>
                    <td className={`border border-border p-2 ${!row.boxCode || row.boxCode === '' ? 'bg-orange-50' : 'bg-green-50'}`}>
                      <input
                        type="text"
                        value={row.boxCode}
                        onChange={(e) => updatePreviewData(index, 'boxCode', e.target.value)}
                        className={`w-full px-2 py-1 border rounded ${!row.boxCode || row.boxCode === '' ? 'border-orange-300 bg-orange-50' : 'border-green-300 bg-green-50'}`}
                        placeholder={!row.boxCode || row.boxCode === '' ? "Fill this field" : ""}
                      />
                    </td>
                    <td className={`border border-border p-2 ${!row.originalPrice || row.originalPrice === '' ? 'bg-orange-50' : 'bg-green-50'}`}>
                      <input
                        type="number"
                        step="0.01"
                        value={row.originalPrice}
                        onChange={(e) => updatePreviewData(index, 'originalPrice', e.target.value)}
                        className={`w-full px-2 py-1 border rounded ${!row.originalPrice || row.originalPrice === '' ? 'border-orange-300 bg-orange-50' : 'border-green-300 bg-green-50'}`}
                        placeholder={!row.originalPrice || row.originalPrice === '' ? "Fill this field" : ""}
                      />
                    </td>
                    <td className={`border border-border p-2 ${!row.sellingPrice || row.sellingPrice === '' ? 'bg-orange-50' : 'bg-green-50'}`}>
                      <input
                        type="number"
                        step="0.01"
                        value={row.sellingPrice}
                        onChange={(e) => updatePreviewData(index, 'sellingPrice', e.target.value)}
                        className={`w-full px-2 py-1 border rounded ${!row.sellingPrice || row.sellingPrice === '' ? 'border-orange-300 bg-orange-50' : 'border-green-300 bg-green-50'}`}
                        placeholder={!row.sellingPrice || row.sellingPrice === '' ? "Fill this field" : ""}
                      />
                    </td>
                    <td className={`border border-border p-2 ${!row.quantity || row.quantity === '' ? 'bg-orange-50' : 'bg-green-50'}`}>
                      <input
                        type="number"
                        value={row.quantity}
                        onChange={(e) => updatePreviewData(index, 'quantity', e.target.value)}
                        className={`w-full px-2 py-1 border rounded ${!row.quantity || row.quantity === '' ? 'border-orange-300 bg-orange-50' : 'border-green-300 bg-green-50'}`}
                        placeholder={!row.quantity || row.quantity === '' ? "Fill this field" : ""}
                      />
                    </td>
                    <td className={`border border-border p-2 ${!row.piecesPerBox || row.piecesPerBox === '' ? 'bg-orange-50' : 'bg-green-50'}`}>
                      <input
                        type="number"
                        value={row.piecesPerBox}
                        onChange={(e) => updatePreviewData(index, 'piecesPerBox', e.target.value)}
                        className={`w-full px-2 py-1 border rounded ${!row.piecesPerBox || row.piecesPerBox === '' ? 'border-orange-300 bg-orange-50' : 'border-green-300 bg-green-50'}`}
                        placeholder={!row.piecesPerBox || row.piecesPerBox === '' ? "Fill this field" : ""}
                      />
                    </td>
                    <td className={`border border-border p-2 ${!row.boxSize || row.boxSize === '' ? 'bg-orange-50' : 'bg-green-50'}`}>
                      <input
                        type="number"
                        step="0.01"
                        value={row.boxSize}
                        onChange={(e) => updatePreviewData(index, 'boxSize', e.target.value)}
                        className={`w-full px-2 py-1 border rounded ${!row.boxSize || row.boxSize === '' ? 'border-orange-300 bg-orange-50' : 'border-green-300 bg-green-50'}`}
                        placeholder={!row.boxSize || row.boxSize === '' ? "Fill this field" : ""}
                      />
                    </td>
                    <td className={`border border-border p-2 ${!row.totalBoxSize || row.totalBoxSize === '' ? 'bg-orange-50' : 'bg-green-50'}`}>
                      <input
                        type="number"
                        step="0.01"
                        value={row.totalBoxSize}
                        onChange={(e) => updatePreviewData(index, 'totalBoxSize', e.target.value)}
                        className={`w-full px-2 py-1 border rounded ${!row.totalBoxSize || row.totalBoxSize === '' ? 'border-orange-300 bg-orange-50' : 'border-green-300 bg-green-50'}`}
                        placeholder={!row.totalBoxSize || row.totalBoxSize === '' ? "Fill this field" : ""}
                      />
                    </td>
                    <td className={`border border-border p-2 ${!row.numberOfBoxes || row.numberOfBoxes === '' ? 'bg-orange-50' : 'bg-green-50'}`}>
                      <input
                        type="number"
                        value={row.numberOfBoxes}
                        onChange={(e) => updatePreviewData(index, 'numberOfBoxes', e.target.value)}
                        className={`w-full px-2 py-1 border rounded ${!row.numberOfBoxes || row.numberOfBoxes === '' ? 'border-orange-300 bg-orange-50' : 'border-green-300 bg-green-50'}`}
                        placeholder={!row.numberOfBoxes || row.numberOfBoxes === '' ? "Fill this field" : ""}
                      />
                    </td>
                    <td className={`border border-border p-2 ${!row.totalPrice || row.totalPrice === '' ? 'bg-orange-50' : 'bg-green-50'}`}>
                      <input
                        type="number"
                        step="0.01"
                        value={row.totalPrice}
                        onChange={(e) => updatePreviewData(index, 'totalPrice', e.target.value)}
                        className={`w-full px-2 py-1 border rounded ${!row.totalPrice || row.totalPrice === '' ? 'border-orange-300 bg-orange-50' : 'border-green-300 bg-green-50'}`}
                        placeholder={!row.totalPrice || row.totalPrice === '' ? "Fill this field" : ""}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            <span className="inline-block w-3 h-3 bg-orange-100 border border-orange-300 rounded mr-2"></span>
            Empty fields (needs to be filled)
            <span className="inline-block w-3 h-3 bg-green-100 border border-green-300 rounded ml-4 mr-2"></span>
            Filled fields
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2">
        {uploadProductsOnly ? (
          previewData ? (
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t("Saving...")}
                </>
              ) : (
                t("Save Products")
              )}
            </Button>
          ) : (
            <Button onClick={handlePreview} disabled={isPreviewing || !file}>
              {isPreviewing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t("Previewing...")}
                </>
              ) : (
                t("Preview")
              )}
            </Button>
          )
        ) : (
          <Button type="submit" disabled={isLoading || !previewData}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t("Uploading...")}
              </>
            ) : (
              t("Upload")
            )}
          </Button>
        )}
      </div>
    </form>
  )
}
