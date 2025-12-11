import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Diogo Gapski - Desenvolvedor Full Stack",
  description:
    "Portfólio de Diogo Gapski - Desenvolvedor Full Stack especializado em Node.js, React, Python e sistemas complexos.",
  generator: "v0.dev",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body>{children}</body>
    </html>
  )
}
