"use client"

import { useEffect, useState } from "react"
import hideStore from "./hideStore"
import { useStore } from "zustand"

export default function useHide() {
  const store = useStore(hideStore)
  const [hasHydrated, setHasHydrated] = useState(false)

  // Rehydrate the store on page load
  useEffect(() => {
    hideStore.persist.rehydrate()
    setHasHydrated(true)
  }, [])

  if (!hasHydrated) return null

  return store
}
