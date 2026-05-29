import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'STREAM/OS — Admin',
  description: 'IPTV activation & subscriber management dashboard',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
