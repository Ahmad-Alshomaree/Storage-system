
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload, Loader2, X } from "lucide-react"

interface UploadExcelFormProps {
  onSuccess: () => void
}

export function UploadExcelForm({ onSuccess }: UploadExcelFormProps) {
  const [file, setFile] = useState<File | null>(null)
  const [receiver, setReceiver] = useState("")
  const [shippingDate, setShippingDate] = useState("")
  const [type, setType] = useState("input load")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !receiver || !shippingDate) {
      setError("Please fill all fields")
      return
    }

    setIsLoading(true)
    setError("")

    const formData = new FormData()
    formData.append("file", file)
    formData.append("receiver", receiver)
    formData.append("shipping_date", shippingDate)
    formData.append("type", type)

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        throw new Error("Upload failed")
      }

      setFile(null)
      setReceiver("")
      setShippingDate("")
      onSuccess()
    } catch (err) {
      console.error(err)
      setError("Failed to upload file")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card p-6 rounded-lg shadow-sm border border-border">
      <h3 className="text-lg font-semibold mb-4">Upload Excel File</h3>
      
      {error && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Receiver</label>
          <input
            type="text"
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md bg-background"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Shipping Date</label>
          <input
            type="date"
            value={shippingDate}
            onChange={(e) => setShippingDate(e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md bg-background"
            required
          />
        </div>

        <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
            >
                <option value="input load">Input Load</option>
                <option value="output load">Output Load</option>
            </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Excel File</label>
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
                  <Upload className="w-4 h-4" /> Choose file
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

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isLoading || !file}>
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            "Upload"
          )}
        </Button>
      </div>
    </form>
  )
}
