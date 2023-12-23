import { create } from "zustand"
import type { Member, Profile, Server } from "../../../prisma/output"
import type { ServerWithMembersAndProfile } from "@/types/ServerMembersProfile"
import { MemberWithProfile } from "@/types/MemberProfile"

type ModalType = "CreateServer" | "EditServer" | "Invite" | "ManageMembers"

export type ModalData = {
  server?: ServerWithMembersAndProfile
  members?: Member[]
  member?: MemberWithProfile | Member
  profile?: Profile
  serverId?: string
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
