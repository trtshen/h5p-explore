import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Exploration of H5P',
  description: 'POC for H5P',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ul className="divide-y divide-gray-200">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/h5p">H5P</Link>
          </li>
        </ul>
        {children}
      </body>
    </html>
  )
}
