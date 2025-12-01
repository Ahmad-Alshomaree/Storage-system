"use client"

import { Database } from "lucide-react"
import { useTranslation } from "react-i18next"
import { LanguageSwitcher } from "./language-switcher"
import "../i18n.client"

export function Header() {
  const { t } = useTranslation()

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Database className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold text-foreground">{t("Product Store")}</h1>
        </div>
        <LanguageSwitcher />
      </div>
    </header>
  )
}
