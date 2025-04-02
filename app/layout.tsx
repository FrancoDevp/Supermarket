import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Supermercado App',
  description: 'Created with v0',
  generator: 'frandevp',
  icons: {
    icon: 'logo supermercado-icon.jpg',
  },
}



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}