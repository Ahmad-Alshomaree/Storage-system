"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FolderOpen, Settings } from "lucide-react"
import { tauriApi } from "@/lib/tauri-api"
import { useTranslation } from "react-i18next"

export function StorageSettings() {
  const [storagePath, setStoragePath] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const { t } = useTranslation()

  // Load storage path from localStorage on mount
  useEffect(() => {
    const savedPath = localStorage.getItem("storagePath")
    if (savedPath) {
      setStoragePath(savedPath)
    }
  }, [])

  const selectDirectory = async () => {
    setIsLoading(true)
    try {
      const selectedPath = await tauriApi.selectStorageDirectory()
      if (selectedPath) {
        setStoragePath(selectedPath)
        localStorage.setItem("storagePath", selectedPath)
      }
    } catch (error) {
      console.error("Failed to select directory:", error)
      // In web mode, just set a placeholder
      const placeholderPath = "/default/storage/path"
      setStoragePath(placeholderPath)
      localStorage.setItem("storagePath", placeholderPath)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          {t("Storage Settings")}
        </CardTitle>
        <CardDescription>
          {t("Choose where to store your application data on your local device")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            {t("Storage Directory")}
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={storagePath}
              readOnly
              placeholder={t("No directory selected")}
              className="flex-1 px-3 py-2 border border-input rounded-md bg-muted text-muted-foreground"
            />
            <Button
              onClick={selectDirectory}
              disabled={isLoading}
              variant="outline"
              className="flex items-center gap-2"
            >
              <FolderOpen className="w-4 h-4" />
              {isLoading ? t("Selecting...") : t("Browse")}
            </Button>
          </div>
        </div>

        {storagePath && (
          <div className="text-sm text-muted-foreground">
            {t("Your application data will be stored in:")} <code className="bg-muted px-1 py-0.5 rounded">{storagePath}</code>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          {t("Note: You can change this setting at any time. The application will use this directory to store your data files.")}
        </div>

        {/* Development reset option */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 pt-4 border-t border-border">
            <Button
              onClick={() => {
                localStorage.removeItem('setupCompleted')
                localStorage.removeItem('storagePath')
                window.location.reload()
              }}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              Reset Setup (Development Only)
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
