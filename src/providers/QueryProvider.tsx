"use client"
import { useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

type QueryProviderProps = {
  children: React.ReactNode
}

export default function QueryProvider({ children }: QueryProviderProps) {
  const [client, setClient] = useState(() => new QueryClient())
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}
