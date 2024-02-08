"use client"

import { useStore } from "zustand"
import hideStore from "./hideStore"

export default function useHide() {
  return useStore(hideStore)
}
