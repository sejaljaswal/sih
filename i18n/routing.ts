import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'hi', 'pa'],
  defaultLocale: 'hi',
})

export type Locale = (typeof routing.locales)[number]
