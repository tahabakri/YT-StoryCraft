import "./globals.css"
import { Inter } from "next/font/google"
import { Navigation } from "./components/navigation"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__ENV = ${JSON.stringify({
              NEXT_PUBLIC_YOUTUBE_API_KEY: process.env.NEXT_PUBLIC_YOUTUBE_API_KEY,
            })}`,
          }}
        />
      </head>
      <body className={inter.className}>
        <Navigation />
        <main className="min-h-screen bg-[#1a1625]">
          {children}
        </main>
      </body>
    </html>
  )
}
