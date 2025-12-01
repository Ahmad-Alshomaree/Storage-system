"use client"

import { useTranslation } from 'react-i18next'
import { Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import '../i18n.client'

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation()

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
    // Persist language choice
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lng)
      // Update document direction for RTL support
      const htmlElement = document.documentElement
      htmlElement.lang = lng
      htmlElement.dir = lng === 'ar' ? 'rtl' : 'ltr'
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4" />
      <div className="flex gap-1">
        <Button
          variant={i18n.language === 'en' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => changeLanguage('en')}
          className={`text-xs px-2 py-1 ${i18n.language === 'en' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
        >
          EN
        </Button>
        <Button
          variant={i18n.language === 'ar' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => changeLanguage('ar')}
          className={`text-xs px-2 py-1 ${i18n.language === 'ar' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
        >
          العربية
        </Button>
      </div>
    </div>
  )
}
