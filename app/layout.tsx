import type React from "react"
import type { Metadata } from "next"
import "@fontsource-variable/fraunces"
import "@fontsource-variable/figtree"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"


export const metadata: Metadata = {
  title: "Weather Forecast · Current conditions, hourly and 5-day outlook",
  description: "Get accurate weather forecasts, current conditions, and temperature updates for any location",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="bg-[#2a63a8] font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
