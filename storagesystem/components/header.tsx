"use client"

import { useState } from "react"
import { Database, Settings } from "lucide-react"
import { useTranslation } from "react-i18next"
import { LanguageSwitcher } from "./language-switcher"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { StorageSettings } from "./storage-settings"
import "../i18n.client"

export function Header() {
  const { t } = useTranslation()
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Database className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold text-foreground">{t("Product Store")}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="w-4 h-4" />
                <span className="sr-only">{t("Settings")}</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>{t("Application Settings")}</DialogTitle>
              </DialogHeader>
              <StorageSettings />
            </DialogContent>
          </Dialog>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  )
}
