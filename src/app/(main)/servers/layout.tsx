import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Servers",
  description: "Generated by create next app",
}

import NavigationSideBar from "@/components/NavigationSideBar/NavigationSideBar"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="flex h-full">
      <NavigationSideBar />
      {children}
    </main>
  )
}