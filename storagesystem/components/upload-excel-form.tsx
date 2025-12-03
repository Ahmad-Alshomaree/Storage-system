
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

interface Room {
  id: number
  room_name: string
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
  const [rooms, setRooms] = useState<Room[]>([])
  const [uploadProductsOnly, setUploadProductsOnly] = useState(false)
  const [isLoadingClients, setIsLoadingClients] = useState(true)
  const [isLoadingRooms, setIsLoadingRooms] = useState(true)
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

    const fetchRooms = async () => {
      try {
        const response = await fetch("/api/rooms")
        if (response.ok) {
          const roomsData = await response.json()
          setRooms(roomsData)
        }
      } catch (error) {
        console.error("Failed to fetch rooms:", error)
      } finally {
        setIsLoadingRooms(false)
      }
    }

    fetchClients()
    fetchRooms()
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

  const handleImageUpload = async (index: number, file: File) => {
    try {
      const formData = new FormData()
      formData.append("image", file)

      const response = await fetch("/api/upload/image", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const result = await response.json()
      if (result.success) {
        updatePreviewData(index, 'image', result.imageUrl)
      } else {
        throw new Error(result.error || "Upload failed")
      }
    } catch (error) {
      console.error("Image upload error:", error)
      // Show error in some way, but for now just log it
    }
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
                <label className="block text-sm font-medium mb-1">Ship Cost</label>
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
            <table className="min-w-[1600px] border-collapse text-sm">
              <thead className="bg-muted sticky top-0">
                <tr>
                  <th className="border border-border p-3 min-w-[60px]">#</th>
                  <th className="border border-border p-3 min-w-[100px]">{t("Item No")}</th>
                  <th className="border border-border p-3 min-w-[150px]">{t("Product Name")}</th>
                  <th className="border border-border p-3 min-w-[120px]">{t("Storage")}</th>
                  <th className="border border-border p-3 min-w-[140px]">{t("Box Code ")}</th>
                  <th className="border border-border p-3 min-w-[130px]">{t("Selling Price")}</th>
                  <th className="border border-border p-3 min-w-[100px]">{t("Quantity")}</th>
                  <th className="border border-border p-3 min-w-[130px]">{t("Pieces per Box")}</th>
                  <th className="border border-border p-3 min-w-[100px]">{t("Box Size")}</th>
                  <th className="border border-border p-3 min-w-[130px]">{t("Total Box Size")}</th>
                  <th className="border border-border p-3 min-w-[130px]">{t("Number of Boxes")}</th>
                  <th className="border border-border p-3 min-w-[120px]">{t("Total Price")}</th>
                  <th className="border border-border p-3 min-w-[140px]">{t("Grope Item Price")}</th>
                  <th className="border border-border p-3 min-w-[100px]">{t("Weight")}</th>
                  <th className="border border-border p-3 min-w-[100px]">{t("Cost")}</th>
                  <th className="border border-border p-3 min-w-[120px]">{t("Total Cost")}</th>
                  <th className="border border-border p-3 min-w-[120px]">{t("Currency")}</th>
                  <th className="border border-border p-3 min-w-[150px]">{t("Image")}</th>
                </tr>
              </thead>
              <tbody>
                {previewData.map((row, index) => (
                  <tr key={index} className="hover:bg-muted/50">
                    <td className="border border-border p-3 text-center font-mono">{index + 1}</td>
                    <td className="border border-border p-3">{row.itemNo}</td>
                    <td className={`border border-border p-3 ${!row.productName || row.productName === '' ? 'bg-orange-50' : 'bg-green-50'}`}>
                      <input
                        type="text"
                        value={row.productName}
                        onChange={(e) => updatePreviewData(index, 'productName', e.target.value)}
                        className={`w-full px-3 py-2 border rounded ${!row.productName || row.productName === '' ? 'border-orange-300 bg-orange-50' : 'border-green-300 bg-green-50'}`}
                        placeholder={!row.productName || row.productName === '' ? "Fill this field" : ""}
                      />
                    </td>
                    <td className={`border border-border p-3 ${!row.storage || row.storage === '' ? 'bg-orange-50' : 'bg-green-50'}`}>
                      <select
                        value={row.storage || ""}
                        onChange={(e) => updatePreviewData(index, 'storage', e.target.value)}
                        className={`w-full px-3 py-2 border rounded ${!row.storage || row.storage === '' ? 'border-orange-300 bg-orange-50' : 'border-green-300 bg-green-50'}`}
                        disabled={isLoadingRooms}
                      >
                        <option value="">{isLoadingRooms ? "Loading..." : "Select Room"}</option>
                        {!isLoadingRooms && rooms.map((room) => (
                          <option key={room.id} value={room.room_name}>
                            {room.room_name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className={`border border-border p-3 ${!row.boxCode || row.boxCode === '' ? 'bg-orange-50' : 'bg-green-50'}`}>
                      <input
                        type="text"
                        value={row.boxCode}
                        onChange={(e) => updatePreviewData(index, 'boxCode', e.target.value)}
                        className={`w-full px-3 py-2 border rounded ${!row.boxCode || row.boxCode === '' ? 'border-orange-300 bg-orange-50' : 'border-green-300 bg-green-50'}`}
                        placeholder={!row.boxCode || row.boxCode === '' ? "Fill this field" : ""}
                      />
                    </td>
                    <td className={`border border-border p-3 ${!row.sellingPrice || row.sellingPrice === '' ? 'bg-orange-50' : 'bg-green-50'}`}>
                      <input
                        type="number"
                        step="0.01"
                        value={row.sellingPrice}
                        onChange={(e) => updatePreviewData(index, 'sellingPrice', e.target.value)}
                        className={`w-full px-3 py-2 border rounded ${!row.sellingPrice || row.sellingPrice === '' ? 'border-orange-300 bg-orange-50' : 'border-green-300 bg-green-50'}`}
                        placeholder={!row.sellingPrice || row.sellingPrice === '' ? "Fill this field" : ""}
                      />
                    </td>
                    <td className={`border border-border p-3 ${!row.quantity || row.quantity === '' ? 'bg-orange-50' : 'bg-green-50'}`}>
                      <input
                        type="number"
                        value={row.quantity}
                        onChange={(e) => updatePreviewData(index, 'quantity', e.target.value)}
                        className={`w-full px-3 py-2 border rounded ${!row.quantity || row.quantity === '' ? 'border-orange-300 bg-orange-50' : 'border-green-300 bg-green-50'}`}
                        placeholder={!row.quantity || row.quantity === '' ? "Fill this field" : ""}
                      />
                    </td>
                    <td className={`border border-border p-3 ${!row.piecesPerBox || row.piecesPerBox === '' ? 'bg-orange-50' : 'bg-green-50'}`}>
                      <input
                        type="number"
                        value={row.piecesPerBox}
                        onChange={(e) => updatePreviewData(index, 'piecesPerBox', e.target.value)}
                        className={`w-full px-3 py-2 border rounded ${!row.piecesPerBox || row.piecesPerBox === '' ? 'border-orange-300 bg-orange-50' : 'border-green-300 bg-green-50'}`}
                        placeholder={!row.piecesPerBox || row.piecesPerBox === '' ? "Fill this field" : ""}
                      />
                    </td>
                    <td className={`border border-border p-3 ${!row.boxSize || row.boxSize === '' ? 'bg-orange-50' : 'bg-green-50'}`}>
                      <input
                        type="number"
                        step="0.01"
                        value={row.boxSize}
                        onChange={(e) => updatePreviewData(index, 'boxSize', e.target.value)}
                        className={`w-full px-3 py-2 border rounded ${!row.boxSize || row.boxSize === '' ? 'border-orange-300 bg-orange-50' : 'border-green-300 bg-green-50'}`}
                        placeholder={!row.boxSize || row.boxSize === '' ? "Fill this field" : ""}
                      />
                    </td>
                    <td className={`border border-border p-3 ${!row.totalBoxSize || row.totalBoxSize === '' ? 'bg-orange-50' : 'bg-green-50'}`}>
                      <input
                        type="number"
                        step="0.01"
                        value={row.totalBoxSize}
                        onChange={(e) => updatePreviewData(index, 'totalBoxSize', e.target.value)}
                        className={`w-full px-3 py-2 border rounded ${!row.totalBoxSize || row.totalBoxSize === '' ? 'border-orange-300 bg-orange-50' : 'border-green-300 bg-green-50'}`}
                        placeholder={!row.totalBoxSize || row.totalBoxSize === '' ? "Fill this field" : ""}
                      />
                    </td>
                    <td className={`border border-border p-3 ${!row.numberOfBoxes || row.numberOfBoxes === '' ? 'bg-orange-50' : 'bg-green-50'}`}>
                      <input
                        type="number"
                        value={row.numberOfBoxes}
                        onChange={(e) => updatePreviewData(index, 'numberOfBoxes', e.target.value)}
                        className={`w-full px-3 py-2 border rounded ${!row.numberOfBoxes || row.numberOfBoxes === '' ? 'border-orange-300 bg-orange-50' : 'border-green-300 bg-green-50'}`}
                        placeholder={!row.numberOfBoxes || row.numberOfBoxes === '' ? "Fill this field" : ""}
                      />
                    </td>
                    <td className={`border border-border p-3 ${!row.totalPrice || row.totalPrice === '' ? 'bg-orange-50' : 'bg-green-50'}`}>
                      <input
                        type="number"
                        step="0.01"
                        value={row.totalPrice}
                        onChange={(e) => updatePreviewData(index, 'totalPrice', e.target.value)}
                        className={`w-full px-3 py-2 border rounded ${!row.totalPrice || row.totalPrice === '' ? 'border-orange-300 bg-orange-50' : 'border-green-300 bg-green-50'}`}
                        placeholder={!row.totalPrice || row.totalPrice === '' ? "Fill this field" : ""}
                      />
                    </td>
                    <td className={`border border-border p-3 ${!row.gropeItemPrice || row.gropeItemPrice === '' ? 'bg-orange-50' : 'bg-green-50'}`}>
                      <input
                        type="number"
                        step="0.01"
                        value={row.gropeItemPrice}
                        onChange={(e) => updatePreviewData(index, 'gropeItemPrice', e.target.value)}
                        className={`w-full px-3 py-2 border rounded ${!row.gropeItemPrice || row.gropeItemPrice === '' ? 'border-orange-300 bg-orange-50' : 'border-green-300 bg-green-50'}`}
                        placeholder={!row.gropeItemPrice || row.gropeItemPrice === '' ? "Fill this field" : ""}
                      />
                    </td>
                    <td className={`border border-border p-3 ${!row.weight || row.weight === '' ? 'bg-gray-50' : 'bg-white'}`}>
                      <input
                        type="number"
                        step="0.01"
                        value={row.weight}
                        onChange={(e) => updatePreviewData(index, 'weight', e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                        placeholder="Optional"
                      />
                    </td>
                    <td className={`border border-border p-3 ${!row.cost || row.cost === '' ? 'bg-orange-50' : 'bg-green-50'}`}>
                      <input
                        type="number"
                        step="0.01"
                        value={row.cost}
                        onChange={(e) => updatePreviewData(index, 'cost', e.target.value)}
                        className={`w-full px-3 py-2 border rounded ${!row.cost || row.cost === '' ? 'border-orange-300 bg-orange-50' : 'border-green-300 bg-green-50'}`}
                        placeholder={!row.cost || row.cost === '' ? "Fill this field" : ""}
                        required
                      />
                    </td>
                    <td className={`border border-border p-3 ${!row.totalCost || row.totalCost === '' ? 'bg-orange-50' : 'bg-green-50'}`}>
                      <input
                        type="number"
                        step="0.01"
                        value={row.totalCost}
                        onChange={(e) => updatePreviewData(index, 'totalCost', e.target.value)}
                        className={`w-full px-3 py-2 border rounded ${!row.totalCost || row.totalCost === '' ? 'border-orange-300 bg-orange-50' : 'border-green-300 bg-green-50'}`}
                        placeholder={!row.totalCost || row.totalCost === '' ? "Fill this field" : ""}
                        required
                      />
                    </td>
                    <td className={`border border-border p-3 ${!row.currency || row.currency === '' ? 'bg-gray-50' : 'bg-white'}`}>
                      <input
                        type="text"
                        value={row.currency}
                        onChange={(e) => updatePreviewData(index, 'currency', e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                        placeholder="Optional"
                      />
                    </td>
                    <td className={`border border-border p-3 ${!row.image || row.image === '' ? 'bg-gray-50' : 'bg-white'}`}>
                      <div className="flex items-center gap-2">
                        {row.image && row.image !== '' ? (
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <img
                              src={row.image.startsWith('/uploads/images/') ? row.image : undefined}
                              alt="Product image"
                              className="w-8 h-8 object-cover rounded border"
                              style={{ display: row.image.startsWith('/uploads/images/') ? 'block' : 'none' }}
                            />
                            <span className="text-xs truncate max-w-[80px]" title={row.image}>
                              {row.image.split('/').pop() || row.image}
                            </span>
                            <button
                              type="button"
                              onClick={() => updatePreviewData(index, 'image', '')}
                              className="text-red-500 hover:text-red-700 text-xs"
                              title="Remove image"
                            >
                              ×
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">No image</span>
                        )}
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                handleImageUpload(index, file)
                              }
                              // Reset the input
                              e.target.value = ''
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            title="Upload image"
                          />
                          <button
                            type="button"
                            className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                          >
                            <Upload className="w-3 h-3" />
                            Upload
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            <span className="inline-block w-3 h-3 bg-orange-100 border border-orange-300 rounded mr-2"></span>
            Required fields (must be filled)
            <span className="inline-block w-3 h-3 bg-green-100 border border-green-300 rounded ml-4 mr-2"></span>
            Filled fields
            <span className="inline-block w-3 h-3 bg-gray-100 border border-gray-300 rounded ml-4 mr-2"></span>
            Optional fields
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
