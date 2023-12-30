import type { Server, Channel } from "../../prisma/output"
import type { MemberWithProfile } from "./MemberProfile"

export type ServerWithChannels = Server & {
  channels: Channel[]
}
