import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { QueryProvider } from "@/src/providers/query-provider"
import "./globals.css"

export const metadata: Metadata = {
  title: "Reuse - Marketplace Sustentável",
  description: "Compre, venda e troque produtos de forma sustentável",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-gray-900 focus:text-white focus:rounded-md focus:shadow-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
        >
          Pular para o conteúdo principal
        </a>
        <QueryProvider>
          <div id="main-content">
            <Suspense fallback={null}>{children}</Suspense>
          </div>
        </QueryProvider>
        <Analytics />
      </body>
    </html>
  )
}
