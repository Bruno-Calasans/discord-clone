import { create } from "zustand"

export type HideStoreState = {
  serverMembers: boolean
}

export type HideStoreActions = {
  hide: (type: keyof HideStoreState) => void
  show: (type: keyof HideStoreState) => void
  toggle: (type: keyof HideStoreState) => void
}

export type HideStore = HideStoreState & HideStoreActions

const hideStore = create<HideStore>((set, get) => ({
  serverMembers: false,
  hide(type) {
    set(() => ({ [type]: false }))
  },
  show(type) {
    set(() => ({ [type]: true }))
  },
  toggle(type) {
    set(() => ({ [type]: !get()[type] }))
  },
}))

export default hideStore
