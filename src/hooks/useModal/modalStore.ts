import { create } from "zustand"

type ModalType = "CreateServer" | "EditServer"

type ModalStore = {
  isOpen: boolean
  type: ModalType | null
  open: (type: ModalType) => void
  close: () => void
}

const modalStore = create<ModalStore>((set) => ({
  isOpen: false,
  type: null,
  open(type) {
    set(() => ({ isOpen: true, type }))
  },
  close() {
    set(() => ({ isOpen: false, type: null }))
  },
}))


export default modalStore
