import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/hooks/use-auth'
import { AddressProvider } from '@/hooks/use-address'
import { CartProvider } from '@/hooks/use-cart'
import { Toaster } from 'sonner'
import './globals.css'

export const metadata: Metadata = {
  title: 'Caffres',
  description: 'Tu tienda de confianza',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="font-sans antialiased selection:bg-primary/20">
        <AuthProvider>
          <AddressProvider>
            <CartProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="light"
                enableSystem={false}
                disableTransitionOnChange
              >
                {children}
                <Toaster position="top-right" richColors />
              </ThemeProvider>
            </CartProvider>
          </AddressProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
