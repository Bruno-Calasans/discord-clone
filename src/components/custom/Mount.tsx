"use client"

import { useState, useEffect } from "react"

type MountProps = {
  children: React.ReactNode
}

function Mount({ children }: MountProps) {
  const [isMounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }
  return children
}

export default Mount
