"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FolderOpen, Database, ArrowRight } from "lucide-react"
import { tauriApi } from "@/lib/tauri-api"
import { useTranslation } from "react-i18next"

interface SetupPageProps {
  onComplete: () => void
}

export function SetupPage({ onComplete }: SetupPageProps) {
  const [storagePath, setStoragePath] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [isInitializing, setIsInitializing] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    // Component mounted
  }, [])

  const selectDirectory = async () => {
    setIsLoading(true)
    try {
      const selectedPath = await tauriApi.selectStorageDirectory()
      if (selectedPath) {
        setStoragePath(selectedPath)
      }
    } catch (error) {
      console.error("Failed to select directory:", error)
      // In web mode, just set a placeholder
      const placeholderPath = "/default/storage/path"
      setStoragePath(placeholderPath)
    } finally {
      setIsLoading(false)
    }
  }

  const completeSetup = async () => {
    if (!storagePath) return

    setIsInitializing(true)
    try {
      // Save the storage path
      localStorage.setItem("storagePath", storagePath)
      localStorage.setItem("setupCompleted", "true")

      // Try to initialize database with the new path
      await tauriApi.initializeDatabase()

      // Notify parent that setup is complete
      onComplete()
    } catch (error) {
      console.error("Failed to initialize database:", error)
      // Still mark as completed to avoid getting stuck
      localStorage.setItem("setupCompleted", "true")
      onComplete()
    } finally {
      setIsInitializing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        {/* Welcome Header */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Database className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground">{t("Welcome to Product Storage System")}</h1>
          <p className="text-xl text-muted-foreground">
            {t("Let's set up your workspace")}
          </p>
        </div>

        {/* Setup Card */}
        <Card className="shadow-xl border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              <FolderOpen className="w-6 h-6 text-primary" />
              {t("Choose Storage Location")}
            </CardTitle>
            <CardDescription className="text-base">
              {t("Select where you want to store your application data on your local device")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Storage Path Selection */}
            <div className="space-y-4">
              <label className="text-sm font-medium text-center block">
                {t("Storage Directory")}
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={storagePath}
                  readOnly
                  placeholder={t("No directory selected")}
                  className="flex-1 px-4 py-3 border border-input rounded-lg bg-muted text-muted-foreground text-center"
                />
                <Button
                  onClick={selectDirectory}
                  disabled={isLoading}
                  variant="outline"
                  className="px-6"
                >
                  <FolderOpen className="w-4 h-4 me-2" />
                  {isLoading ? t("Selecting...") : t("Browse")}
                </Button>
              </div>
            </div>

            {/* Continue Button */}
            <Button
              onClick={completeSetup}
              disabled={!storagePath || isInitializing}
              className="w-full py-3 text-lg"
              size="lg"
            >
              {isInitializing ? (
                <>{t("Setting up...")}</>
              ) : (
                <>
                  {t("Continue")}
                  <ArrowRight className="w-5 h-5 ms-2" />
                </>
              )}
            </Button>

            {/* Info Text */}
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                {t("You can change this setting later in the application settings")}
              </p>
              <p className="text-xs text-muted-foreground">
                {t("Your data will be stored securely on your local device")}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
