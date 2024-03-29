import "./global.css"
import type { Metadata } from "next"
import { Open_Sans } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"

// upload thing
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin"
import { ourFileRouter } from "@/app/api/uploadthing/core"
import { extractRouterConfig } from "uploadthing/server"

// providers
import ThemeProvider from "@/providers/ThemeProvider"
import ModalProvider from "@/providers/ModalProvider"
import SocketProvider from "@/providers/SocketProvider"
import QueryProvider from "@/providers/QueryProvider"

const font = Open_Sans({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Home",
  description: "Generated by create next app",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="h-full" suppressHydrationWarning>
        <body className={`h-full ${font.className}`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            storageKey="theme"
            enableSystem={false}
            themes={["dark", "light"]}
          >
            <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
            <SocketProvider>
              <ModalProvider />
              <QueryProvider>{children}</QueryProvider>
            </SocketProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
