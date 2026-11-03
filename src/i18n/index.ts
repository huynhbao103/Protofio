import type { Dictionary, Locale } from './types'
import vi from './dictionaries/vi'
import en from './dictionaries/en'

export const locales: Locale[] = ['vi', 'en']
export const defaultLocale: Locale = 'vi'
export const LOCALE_STORAGE_KEY = 'portfolio-locale'

export const dictionaries: Record<Locale, Dictionary> = { vi, en }

export function isLocale(value: string | null | undefined): value is Locale {
  return value === 'vi' || value === 'en'
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries[defaultLocale]
}

export type { Dictionary, Locale }
