"use client"

import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import '../i18n.client'

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation()

  useEffect(() => {
    // Set initial document direction based on saved language or default
    const savedLanguage = typeof window !== 'undefined' ? localStorage.getItem('language') : null
    const currentLanguage = savedLanguage || 'en'

    if (typeof window !== 'undefined') {
      const htmlElement = document.documentElement
      htmlElement.lang = currentLanguage
      htmlElement.dir = currentLanguage === 'ar' ? 'rtl' : 'ltr'

      // Sync i18n with stored language
      if (savedLanguage && savedLanguage !== i18n.language) {
        i18n.changeLanguage(savedLanguage)
      }
    }
  }, [i18n])

  return <>{children}</>
}
