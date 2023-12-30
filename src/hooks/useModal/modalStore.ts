import { create } from "zustand"
import type {
  CHANNEL_TYPE,
  Member,
  Profile,
  Channel,
} from "../../../prisma/output"
import type { ServerWithMembersAndProfile } from "@/types/ServerMembersProfile"
import { MemberWithProfile } from "@/types/MemberProfile"

type ModalType =
  | "CreateServer"
  | "EditServer"
  | "Invite"
  | "ManageMembers"
  | "CreateChannel"
  | "LeaveServer"
  | "DeleteServer"
  | "EditChannel"
  | "DeleteChannel"

export type ModalData = {
  server?: ServerWithMembersAndProfile
  member?: MemberWithProfile | Member
  profile?: Profile
  serverId?: string
  channelType?: CHANNEL_TYPE
  channel?: Channel
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
