"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

export type HideStoreState = {
  showServerMembers: boolean
}

export type HideStoreActions = {
  setValue: (key: keyof HideStoreState, value: boolean) => void
  hide: (key: keyof HideStoreState) => void
  show: (key: keyof HideStoreState) => void
  toggle: (key: keyof HideStoreState) => void
}

export type HideStore = HideStoreState & HideStoreActions

const hideStore = create<HideStore>()(
  persist(
    (set, get) => ({
      showServerMembers: false,
      setValue(key, value) {
        set(() => ({ [key]: value }))
      },
      hide(key) {
        set(() => ({ [key]: false }))
      },
      show(key) {
        set(() => ({ [key]: true }))
      },
      toggle(key) {
        set(() => ({ [key]: !get()[key] }))
      },
    }),
    {
      name: "hide",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
)

export default hideStore
