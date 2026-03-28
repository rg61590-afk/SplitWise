import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import { SessionProvider } from '@/components/providers/session-provider'
import './globals.css'

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: 'SplitEase - Group Expense Management',
  description: 'Split expenses easily with friends, family, and roommates. Track who owes whom and settle up effortlessly.',
  keywords: ['expense', 'split', 'group', 'money', 'friends', 'roommates'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <SessionProvider>
          {children}
          <Toaster position="top-right" richColors />
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  )
}
