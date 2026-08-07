"use client"

import { useState } from "react"
import { Database, Settings, Search } from "lucide-react"
import { useTranslation } from "react-i18next"
import { LanguageSwitcher } from "./language-switcher"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { StorageSettings } from "./storage-settings"
import "../i18n.client"

interface HeaderProps {
  onOpenSearch?: () => void
}

export function Header({ onOpenSearch }: HeaderProps) {
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
          {onOpenSearch && (
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenSearch}
              className="flex items-center gap-2 text-muted-foreground me-1 border-border hover:text-foreground"
            >
              <Search className="w-4 h-4 text-primary" />
              <span className="hidden sm:inline-block text-xs font-medium">{t("Search...")}</span>
              <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] bg-muted border border-border rounded text-muted-foreground font-mono">
                Ctrl K
              </kbd>
            </Button>
          )}

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
