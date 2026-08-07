"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FolderOpen, Settings, Database, Download, CheckCircle, AlertCircle } from "lucide-react"
import { tauriApi } from "@/lib/tauri-api"
import { useTranslation } from "react-i18next"

export function StorageSettings() {
  const [storagePath, setStoragePath] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [backupLoading, setBackupLoading] = useState(false)
  const [backupMessage, setBackupMessage] = useState<{ type: "success" | "error", text: string } | null>(null)
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
      const placeholderPath = "/default/storage/path"
      setStoragePath(placeholderPath)
      localStorage.setItem("storagePath", placeholderPath)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateBackup = async () => {
    setBackupLoading(true)
    setBackupMessage(null)
    try {
      if (tauriApi.isTauri()) {
        const backupDir = await tauriApi.selectStorageDirectory()
        if (backupDir) {
          const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19)
          const targetPath = `${backupDir}/storagesystem_backup_${timestamp}.db`
          await tauriApi.backupDatabase(targetPath)
          setBackupMessage({ type: "success", text: `${t("Backup created successfully at")}: ${targetPath}` })
        }
      } else {
        setBackupMessage({ type: "success", text: t("Backup feature requires Tauri desktop execution.") })
      }
    } catch (err) {
      console.error("Backup failed:", err)
      setBackupMessage({ type: "error", text: err instanceof Error ? err.message : t("Failed to create database backup") })
    } finally {
      setBackupLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Settings className="w-5 h-5 text-primary" />
          {t("Storage & Backup Settings")}
        </CardTitle>
        <CardDescription>
          {t("Choose local storage path and manage database backups")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Storage Directory Section */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
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
            {t("Your application data will be stored in:")} <code className="bg-muted px-1.5 py-0.5 rounded text-foreground font-mono">{storagePath}</code>
          </div>
        )}

        {/* Database Backup Section */}
        <div className="pt-4 border-t border-border space-y-3">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-600" />
            {t("Database Backup")}
          </h4>
          <p className="text-xs text-muted-foreground">
            {t("Create a standalone backup copy of your database to protect against data loss.")}
          </p>

          <Button
            onClick={handleCreateBackup}
            disabled={backupLoading}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Download className="w-4 h-4" />
            {backupLoading ? t("Creating Backup...") : t("Create Database Backup")}
          </Button>

          {backupMessage && (
            <div className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
              backupMessage.type === "success" ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "bg-destructive/10 text-destructive"
            }`}>
              {backupMessage.type === "success" ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              <span>{backupMessage.text}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
