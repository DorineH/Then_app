import { NextIntlClientProvider, useMessages } from 'next-intl'
import { notFound } from 'next/navigation'

export default function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const messages = useMessages()

  if (!messages) notFound()

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
