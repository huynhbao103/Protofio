import type { Locale } from '@/i18n'

/** Pick English text when locale is en and English value exists; otherwise Vietnamese/default. */
export function pickLocalized(
  locale: Locale,
  vi: string | undefined | null,
  en?: string | undefined | null
): string {
  const viText = (vi ?? '').trim()
  const enText = (en ?? '').trim()
  if (locale === 'en' && enText) return enText
  return viText || enText
}
