import { create } from "zustand"
import type { Server } from "../../../prisma/output"

type ModalType = "CreateServer" | "EditServer" | "Invite"

export type ModalData = {
  server?: Server
}

export type ModalStore = {
  isOpen: boolean
  data: ModalData
  type: ModalType | null
  open: (type: ModalType, data?: ModalData) => void
  close: () => void
}

const modalStore = create<ModalStore>((set) => ({
  isOpen: false,
  type: null,
  data: {},
  open(type, data = {}) {
    set(() => ({ isOpen: true, type, data }))
  },
  close() {
    set(() => ({ isOpen: false, type: null }))
  },
}))

export default modalStore
