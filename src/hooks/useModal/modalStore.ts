import { create } from "zustand"
import type {
  CHANNEL_TYPE,
  Member,
  Profile,
  Channel,
  Message,
} from "../../../prisma/output"
import type { ServerWithMembersAndProfile } from "@/types/ServerMembersProfile"
import type { MemberWithProfile } from "@/types/MemberProfile"
import { MessageWithMemberProfile } from "@/types/MessageWithMemberProfile"

export type ModalType =
  | "CreateServer"
  | "EditServer"
  | "Invite"
  | "ManageMembers"
  | "CreateChannel"
  | "LeaveServer"
  | "DeleteServer"
  | "EditChannel"
  | "DeleteChannel"
  | "MessageFile"
  | "DeleteChannelMessage"

export type ModalData = {
  server?: ServerWithMembersAndProfile
  member?: MemberWithProfile | Member
  profile?: Profile
  serverId?: string
  channelType?: CHANNEL_TYPE
  channel?: Channel
  message?: MessageWithMemberProfile
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
