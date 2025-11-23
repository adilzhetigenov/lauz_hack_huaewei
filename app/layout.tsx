import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Barakcha - AI Document Intelligence',
  description: 'Transform any document into instant summaries, Q&A, and key insights using AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}

